package com.dbtraining.reconx.service;

import com.dbtraining.reconx.dto.ReconResult;
import com.dbtraining.reconx.model.BondTrade;
import com.dbtraining.reconx.model.DerivativeTrade;
import com.dbtraining.reconx.model.EquityTrade;
import com.dbtraining.reconx.model.FXTrade;
import com.dbtraining.reconx.model.ReconciliationRule;
import com.dbtraining.reconx.model.TradeType;
import com.dbtraining.reconx.observability.ReconMetrics;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;
import java.util.stream.Collectors;


/**
 * ============================================================================
 * TICKET-ADV084 — Reconciliation duration histogram
 *
 * Exposes:
 * reconciliation_duration_seconds_count
 * reconciliation_duration_seconds_sum
 * reconciliation_duration_seconds_bucket
 *
 * ============================================================================
 */
@Service
public class ReconciliationEngine {

    private final ReconMetrics reconMetrics;


    public ReconciliationEngine(ReconMetrics reconMetrics) {
        this.reconMetrics = reconMetrics;
    }


    public List<ReconResult> reconcile(List<TradeType> internal,
                                       List<TradeType> external,
                                       ReconciliationRule rule) {

        return reconMetrics.reconciliationTimer().record(() -> {

            if (internal == null || internal.isEmpty()) {
                return List.of();
            }

            List<TradeType> ext =
                    external == null ? List.of() : external;


            Map<String, TradeType> externalByRef =
                    ext.stream()
                            .collect(Collectors.toMap(
                                    t -> t.tradeRef().value(),
                                    Function.identity(),
                                    (a, b) -> a
                            ));


            return internal.parallelStream()
                    .map(in ->
                            matchOne(
                                    in,
                                    externalByRef.get(
                                            in.tradeRef().value()
                                    ),
                                    rule
                            )
                    )
                    .toList();

        });
    }



    /**
     * TICKET-ADV037
     * Parallel reconciliation by counterparty
     */
    public CompletableFuture<List<ReconResult>> reconcileByCounterparty(
            Map<Long, List<TradeType>> internalByCp,
            Map<Long, List<TradeType>> externalByCp,
            ReconciliationRule rule) {


        if (internalByCp == null || internalByCp.isEmpty()) {
            return CompletableFuture.completedFuture(List.of());
        }


        Map<Long, List<TradeType>> ext =
                externalByCp == null
                        ? Map.of()
                        : externalByCp;


        List<CompletableFuture<List<ReconResult>>> futures =
                internalByCp.entrySet()
                        .stream()
                        .map(entry ->
                                CompletableFuture.supplyAsync(
                                        () ->
                                                reconcile(
                                                        entry.getValue(),
                                                        ext.getOrDefault(
                                                                entry.getKey(),
                                                                List.of()
                                                        ),
                                                        rule
                                                )
                                )
                        )
                        .toList();


        return CompletableFuture.allOf(
                        futures.toArray(new CompletableFuture[0])
                )
                .thenApply(v ->
                        futures.stream()
                                .flatMap(f ->
                                        f.join().stream()
                                )
                                .collect(Collectors.toCollection(ArrayList::new))
                );
    }



    private ReconResult matchOne(
            TradeType internal,
            TradeType external,
            ReconciliationRule rule) {


        String ref = internal.tradeRef().value();


        if (external == null) {

            return ReconResult.breakResult(
                    ref,
                    "MISSING_EXTERNAL",
                    "no external trade found for " + ref
            );
        }


        BigDecimal[] in =
                priceQty(internal);

        BigDecimal[] out =
                priceQty(external);


        if (rule.matches(
                in[0],
                in[1],
                out[0],
                out[1]
        )) {

            return ReconResult.matched(ref);

        }


        return ReconResult.breakResult(
                ref,
                "VALUE_MISMATCH",
                "internal price=%s qty=%s vs external price=%s qty=%s"
                        .formatted(
                                in[0],
                                in[1],
                                out[0],
                                out[1]
                        )
        );
    }



    private BigDecimal[] priceQty(TradeType t) {

        return switch (t) {

            case EquityTrade e ->
                    new BigDecimal[]{
                            e.price(),
                            e.quantity()
                    };


            case FXTrade fx ->
                    new BigDecimal[]{
                            fx.fxRate(),
                            fx.notionalCcy1()
                    };


            case BondTrade b ->
                    new BigDecimal[]{
                            b.couponRate(),
                            b.faceValue()
                    };


            case DerivativeTrade d ->
                    new BigDecimal[]{
                            d.strike(),
                            d.quantity()
                    };
        };
    }
}