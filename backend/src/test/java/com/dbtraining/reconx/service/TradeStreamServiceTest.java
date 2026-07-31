package com.dbtraining.reconx.service;

import com.dbtraining.reconx.dto.TradeEvent;
import com.dbtraining.reconx.dto.TradeMapper;
import com.dbtraining.reconx.repository.TradeRepository;
import com.dbtraining.reconx.repository.entity.Trade;
import com.dbtraining.reconx.dto.TradeResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Optional;
import java.util.UUID;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class TradeStreamServiceTest {

    @Mock
    private TradeRepository tradeRepo;

    @Mock
    private TradeMapper mapper;

    @InjectMocks
    private TradeStreamService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSubscribe() {
        SseEmitter emitter = service.subscribe();
        assertNotNull(emitter);
    }

    @Test
    void testOnTradeEvent() {
        SseEmitter emitter = service.subscribe();
        
        Trade trade = new Trade();
        when(tradeRepo.findByTradeRef(any())).thenReturn(Optional.of(trade));
        
        TradeResponse resp = new TradeResponse(1L, "TRD-123", 1L, "SAP.DE", 1L, "DB", "EQUITY", "BUY", 
            new java.math.BigDecimal("100"), new java.math.BigDecimal("100"), 
            java.time.LocalDate.now(), "UNMATCHED", Instant.now(), Instant.now());
        when(mapper.toResponse(any())).thenReturn(resp);

        TradeEvent event = new TradeEvent(UUID.randomUUID(), "TRD-123", TradeEvent.EventType.TRADE_CREATED, Instant.now(), "system", null, "{}");
        
        assertDoesNotThrow(() -> service.onTradeEvent(event));
    }
}
