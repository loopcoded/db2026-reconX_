package com.dbtraining.reconx.service;

import com.dbtraining.reconx.dto.TradeEvent;
import com.dbtraining.reconx.dto.TradeMapper;
import com.dbtraining.reconx.repository.TradeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class TradeStreamService {
    private static final Logger log = LoggerFactory.getLogger(TradeStreamService.class);
    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();
    private final TradeRepository tradeRepo;
    private final TradeMapper mapper;

    public TradeStreamService(TradeRepository tradeRepo, TradeMapper mapper) {
        this.tradeRepo = tradeRepo;
        this.mapper = mapper;
    }

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(60 * 1000L * 30); // 30 min timeout
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));
        
        log.info("New SSE client subscribed. Total clients: {}", emitters.size());
        
        try {
            // Send an initial event to establish the connection through proxies (like Vite)
            emitter.send(SseEmitter.event().name("connected").data("connection established"));
        } catch (Exception e) {
            emitters.remove(emitter);
        }
        
        return emitter;
    }

    @KafkaListener(topics = "trade-events", groupId = "trade-stream-sse")
    public void onTradeEvent(TradeEvent event) {
        tradeRepo.findByTradeRef(event.tradeRef()).ifPresent(trade -> {
            var response = mapper.toResponse(trade);
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(response);
                } catch (Exception e) {
                    emitters.remove(emitter);
                }
            }
        });
    }
}
