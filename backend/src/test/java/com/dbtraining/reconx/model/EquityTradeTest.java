package com.dbtraining.reconx.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Currency;

import static org.junit.jupiter.api.Assertions.*;

class EquityTradeTest {

    private EquityTrade createTrade() {
        return EquityTrade.builder()
                .tradeRef(TradeRef.of("EQU-20260602-0001"))
                .instrumentSymbol("AAPL")
                .quantity(new BigDecimal("10"))
                .price(new BigDecimal("100"))
                .currency(Currency.getInstance("USD"))
                .side(Side.BUY)
                .tradeDate(LocalDate.of(2026, 6, 2))
                .counterpartyId(1L)
                .build();
    }


    @Test
    void builder_buildsWhenAllRequiredPresent() {

        EquityTrade trade = createTrade();

        assertNotNull(trade);
        assertEquals("AAPL", trade.instrumentSymbol());
        assertEquals(new BigDecimal("10"), trade.quantity());
        assertEquals(new BigDecimal("100"), trade.price());
    }


    @Test
    void builder_missingPrice_throws() {

        assertThrows(NullPointerException.class, () ->
                EquityTrade.builder()
                        .tradeRef(TradeRef.of("EQU-20260602-0001"))
                        .instrumentSymbol("AAPL")
                        .quantity(new BigDecimal("10"))
                        .currency("USD")
                        .side(Side.BUY)
                        .tradeDate(LocalDate.of(2026, 6, 2))
                        .counterpartyId(1L)
                        .build()
        );
    }


    @Test
    void equality_byTradeRef() {

        EquityTrade trade1 = createTrade();

        EquityTrade trade2 = EquityTrade.builder()
                .tradeRef(TradeRef.of("EQU-20260602-0001"))
                .instrumentSymbol("MSFT")
                .quantity(new BigDecimal("20"))
                .price(new BigDecimal("200"))
                .currency("USD")
                .side(Side.SELL)
                .tradeDate(LocalDate.of(2026, 6, 2))
                .counterpartyId(2L)
                .build();


        assertEquals(trade1, trade2);
        assertEquals(trade1.hashCode(), trade2.hashCode());
    }
}