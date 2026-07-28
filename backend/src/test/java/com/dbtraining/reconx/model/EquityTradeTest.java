package com.dbtraining.reconx.model;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class EquityTradeTest {

    @Test
    void builder_buildsWhenAllRequiredPresent() {
        EquityTrade trade = EquityTrade.builder()
                .tradeRef(TradeRef.of("EQ-001"))
                .instrumentSymbol("SAP.DE")
                .quantity(new BigDecimal("100"))
                .price(new BigDecimal("50"))
                .currency("EUR")
                .side(Side.BUY)
                .tradeDate(LocalDate.of(2026, 6, 3))
                .counterpartyId(1L)
                .build();
    
        assertThat(trade.tradeRef()).isEqualTo(TradeRef.of("EQ-001"));
        assertThat(trade.notional())
                .isEqualTo(new Money(new BigDecimal("5000"), java.util.Currency.getInstance("EUR")));
        assertThat(trade.assetClass()).isEqualTo(AssetClass.EQUITY);
    }
    
    @Test
    void builder_missingPrice_throws() {
        assertThatThrownBy(() ->
                EquityTrade.builder()
                        .tradeRef(TradeRef.of("EQ-001"))
                        .instrumentSymbol("SAP.DE")
                        .quantity(new BigDecimal("100"))
                        // .price(...) intentionally omitted
                        .currency("EUR")
                        .side(Side.BUY)
                        .tradeDate(LocalDate.of(2026, 6, 3))
                        .counterpartyId(1L)
                        .build()
        )
                .isInstanceOf(NullPointerException.class)
                .hasMessageContaining("price");
    }
    
    @Test
    void equality_byTradeRef() {
        EquityTrade t1 = sampleEquity("EQ-001");
        EquityTrade t2 = sampleEquity("EQ-001");
        EquityTrade t3 = sampleEquity("EQ-002");
    
        assertThat(t1)
                .isEqualTo(t2)
                .hasSameHashCodeAs(t2);
    
        assertThat(t1)
                .isNotEqualTo(t3);
    }
    
    private EquityTrade sampleEquity(String ref) {
        return EquityTrade.builder()
                .tradeRef(TradeRef.of(ref))
                .instrumentSymbol("SAP.DE")
                .quantity(new BigDecimal("100"))
                .price(new BigDecimal("100"))
                .currency("EUR").side(Side.BUY)
                .tradeDate(LocalDate.of(2026, 6, 3))
                .counterpartyId(1L).build();
    }
}
