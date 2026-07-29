
package com.dbtraining.reconx.observability;

import com.dbtraining.reconx.repository.ReconBreakRepository;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class TradeMetrics {

    private final Counter tradeCreated;

    public TradeMetrics(MeterRegistry registry, ReconBreakRepository breakRepo) {
        this.tradeCreated = Counter.builder("trade_created_total")
                .description("Total trades created")
                .register(registry);
    }

    public void incrementTradeCreated() { tradeCreated.increment(); }
}