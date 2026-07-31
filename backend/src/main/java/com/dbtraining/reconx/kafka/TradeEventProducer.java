package com.dbtraining.reconx.kafka;

import com.dbtraining.reconx.dto.TradeEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

/**
 * ============================================================================
 * TradeEventProducer
 *
 * WHAT:    Publishes TradeEvent to the trade-events topic.
 * HOW:     Key = tradeRef (so all events for a single trade go to the same
 *          partition and preserve ordering).
 * WHY:     Out-of-order events for the same trade would make event sourcing
 *          impossible.
 * OBSERVE: Kafdrop → trade-events topic shows one message per published event,
 *          partitioned by tradeRef.
 * ============================================================================
 */
@Component
public class TradeEventProducer {

    private static final Logger log = LoggerFactory.getLogger(TradeEventProducer.class);
    private static final String TOPIC = "trade-events";

    private final KafkaTemplate<String, TradeEvent> template;

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private com.dbtraining.reconx.service.TradeStreamService streamService;

    public TradeEventProducer(KafkaTemplate<String, TradeEvent> template) {
        this.template = template;
    }

    public void publish(TradeEvent event) {
        log.debug("Publishing TradeEvent eventId={} ref={} type={}",
                event.eventId(), event.tradeRef(), event.eventType());
        try {
            template.send(TOPIC, event.tradeRef(), event);
        } catch (Exception e) {
            log.warn("Failed to publish TradeEvent to Kafka, falling back to local stream. Error: {}", e.getMessage());
            if (streamService != null) {
                streamService.onTradeEvent(event);
            }
        }
    }
}
