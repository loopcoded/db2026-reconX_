package com.dbtraining.reconx.observability;

import com.dbtraining.reconx.repository.ReconBreakRepository;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.DistributionSummary;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

@Component
public class TradeMetrics {

    private final Counter tradeCreated;
    private final DistributionSummary tradeValue;
    private final Timer reconciliationTimer;


    public TradeMetrics(MeterRegistry registry,
                        ReconBreakRepository breakRepo) {


        // TICKET-ADV083 — Counter: trade_created_total
        this.tradeCreated = Counter.builder("trade_created_total")
                .description("Total number of trades created via the API")
                .register(registry);



        // TICKET-ADV086 — DistributionSummary: trade_value_total
        this.tradeValue = DistributionSummary.builder("trade_value_total")
                .description("Distribution of trade notional values")
                .baseUnit("USD")
                .publishPercentileHistogram()
                .register(registry);



        // TICKET-ADV084 — Timer: reconciliation_duration_seconds
        this.reconciliationTimer = Timer.builder("reconciliation_duration_seconds")
                .description("Time taken by reconciliation engine")
                .publishPercentileHistogram()
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(registry);



        // TICKET-ADV085 — Gauge: recon_break_count
        Gauge.builder("recon_break_count",
                breakRepo,
                r -> r.countByStatus("OPEN"))
                .description("Open recon breaks")
                .register(registry);
    }



    // TICKET-ADV083
    public void incrementTradeCreated() {
        tradeCreated.increment();
    }



    // TICKET-ADV086
    public void recordTradeValue(double value) {
        tradeValue.record(value);
    }



    // TICKET-ADV084
    public Timer reconciliationTimer() {
        return reconciliationTimer;
    }
}