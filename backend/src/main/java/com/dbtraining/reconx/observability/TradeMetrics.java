
package com.dbtraining.reconx.observability;

import com.dbtraining.reconx.repository.ReconBreakRepository;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;
import io.micrometer.core.instrument.Timer;
@Component
public class TradeMetrics {

    private final Counter tradeCreated;
    private final Timer reconciliationTimer;
    public TradeMetrics(MeterRegistry registry) {

    this.tradeCreated = Counter.builder("trade_created_total")
            .description("Total number of trades created via the API")
            .register(registry);

    this.reconciliationTimer = Timer.builder("reconciliation_duration_seconds")
            .description("Time taken by reconciliation engine")
            .publishPercentileHistogram()
            .publishPercentiles(0.5, 0.95, 0.99)
            .register(registry);
}    


    public void incrementTradeCreated() { tradeCreated.increment(); }
    public Timer reconciliationTimer() {
    return reconciliationTimer;
}
}