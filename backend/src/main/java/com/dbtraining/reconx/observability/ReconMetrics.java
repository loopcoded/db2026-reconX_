package com.dbtraining.reconx.observability;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

@Component
public class ReconMetrics {

    private final Timer reconciliationTimer;

    public ReconMetrics(MeterRegistry registry) {
        this.reconciliationTimer = Timer.builder(
                "reconciliation_duration_seconds"
        )
        .description("Time taken for reconciliation processing")
        .register(registry);
    }

    public Timer reconciliationTimer() {
        return reconciliationTimer;
    }
}