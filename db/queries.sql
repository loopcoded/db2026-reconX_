-- ============================================================================
-- TICKET-ADV010 — VWAP per instrument per day (window function)
-- ============================================================================
EXPLAIN ANALYZE
SELECT
    t.trade_ref,
    t.instrument_id,
    t.trade_date,
    i.symbol,
    t.quantity,
    t.price,
    (t.quantity * t.price) AS notional,

    SUM(t.price * t.quantity) OVER (
        PARTITION BY t.instrument_id, t.trade_date
    )
    /
    NULLIF(
        SUM(t.quantity) OVER (
            PARTITION BY t.instrument_id, t.trade_date
        ),
        0
    ) AS vwap

FROM trades t
JOIN instruments i
    ON i.id = t.instrument_id

WHERE t.deleted_at IS NULL
  AND t.asset_class = 'EQUITY';


-- ============================================================================
-- TICKET-ADV011 — Recursive CTE: Trade Lifecycle Rollup
-- ============================================================================

WITH RECURSIVE trade_lifecycle AS (

    -- Anchor: every trade begins in EXECUTION
    SELECT
        t.id AS trade_id,
        t.trade_ref,
        1 AS stage,
        'EXECUTION' AS stage_name,
        t.created_at AS event_at,
        'SUCCESS'::text AS event_status

    FROM trades t
    WHERE t.deleted_at IS NULL

    UNION ALL

    -- Recursive step
    SELECT
        tl.trade_id,
        tl.trade_ref,
        tl.stage + 1,

        CASE tl.stage
            WHEN 1 THEN 'CONFIRMATION'
            WHEN 2 THEN 'SETTLEMENT'
            WHEN 3 THEN 'RECON_BREAK'
            WHEN 4 THEN 'RESOLUTION'
        END AS stage_name,

        CASE tl.stage
            WHEN 1 THEN t.created_at
            WHEN 2 THEN s.settlement_date::timestamp
            WHEN 3 THEN rb.created_at
            WHEN 4 THEN rb.resolved_at
        END AS event_at,

        CASE tl.stage
            WHEN 1 THEN 'CONFIRMED'
            WHEN 2 THEN s.status
            WHEN 3 THEN rb.status
            WHEN 4 THEN 'RESOLVED'
        END AS event_status

    FROM trade_lifecycle tl

    JOIN trades t
        ON t.id = tl.trade_id

    LEFT JOIN settlements s
        ON s.trade_id = tl.trade_id

    LEFT JOIN recon_breaks rb
        ON rb.trade_id = tl.trade_id

    WHERE tl.stage < 5
)

SELECT
    trade_id,
    trade_ref,
    stage,
    stage_name,
    event_at,
    event_status

FROM trade_lifecycle
ORDER BY trade_id, stage;


-- ============================================================================
-- ADV008 — REFRESH the daily-summary materialised view (concurrent so it can
--         run while the dashboard is reading it)
-- ============================================================================
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_recon_summary;


-- ============================================================================
-- ADV009 — JSONB lookup: which instruments have sector = 'Banking'?
-- ============================================================================
SELECT id, symbol, metadata
FROM instruments
WHERE metadata @> '{"sector":"Banking"}'::jsonb;
