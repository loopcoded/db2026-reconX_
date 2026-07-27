# ADR-0001 — Partition the `trades` table by `trade_date`

- **Status:** Accepted
- **Date:** 2026-07-27
- **Deciders:** ReconX team

## Context

`trades` is our highest-volume table — ~50,000 inserts/day, 5-year retention =
~91 million rows at steady state. The vast majority of queries (dashboards,
recon runs, analyst lookups) filter by a date range (often single day or
single month). A single unpartitioned table forces full-table scans for
date-range deletes and complicates archival of older trade data for the
5-year-retention SLA.

### Alternatives Considered

1. **No partitioning** — rely on B-tree indexes on `trade_date`. At 91M rows,
   index-only scans still touch large portions of the heap; archival requires
   row-level `DELETE` that generates massive WAL.
2. **Hash partitioning on `id`** — evenly distributes rows but provides zero
   benefit for date-range queries (the dominant access pattern).
3. **List partitioning by `status`** — uneven cardinality (`MATCHED` dominates)
   and does not help with time-based archival.

### Constraints

- PostgreSQL requires the partition key in every unique constraint on the parent
  table — the PK becomes `(id, trade_date)`.
- Cross-partition unique constraints (e.g., `trade_ref`) need application-layer
  enforcement or a separate lookup table.
- Partition maintenance (pre-creating future months, detaching old ones) must be
  automated.

## Decision

Partition `trades` by `RANGE` on `trade_date`, with one partition per calendar
month. Child partitions are named `trades_YYYY_MM` and are pre-created for a
rolling 12-month window. A `trades_default` partition catches out-of-range
inserts so the table never rejects writes.

## Consequences

**Positive**
- Partition pruning eliminates 11/12 of data on a typical month-filtered query.
- Archival becomes a DDL operation (`DETACH PARTITION`), not a row-level delete.
- Per-partition indexes are smaller and faster to maintain.

**Negative**
- Composite PK `(id, trade_date)` complicates JPA `@Id` mapping.
- Pre-creating partitions is a recurring ops task — must be automated.
- Foreign keys referencing `trades(id)` alone are not possible on a partitioned parent.

---

*Prompt used:*

> Decision to record: Partition `trades` by RANGE on `trade_date` with monthly
> partitions. Alternatives: no partitioning (B-tree only), hash partitioning on
> id, list partitioning by status. Constraints: PK must include partition key,
> cross-partition unique constraints require workarounds, partition maintenance
> must be automated.
