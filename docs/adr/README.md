# Architecture Decision Records — ReconX

This directory contains Architecture Decision Records (ADRs) for the ReconX platform,
following the [Michael Nygard format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

## Prompt Template

The following prompt template was used with Claude to draft each ADR:

> You are an enterprise software architect. Write an Architecture Decision Record
> (ADR) in the Michael Nygard format (Title, Status, Context, Decision,
> Consequences) for the following decision.
>
> System: ReconX, a near-prod trade reconciliation platform.
> Stack: PostgreSQL 16, Spring Boot 3, Kafka, React.
> Scale: ~50,000 trades/day, 5-year retention, 10 concurrent recon analysts.
>
> Decision to record: <ONE LINE DESCRIBING THE DECISION>
>
> Alternatives we considered: <LIST 2-3>
>
> Constraints / forces: <LIST 2-3>
>
> Format: Markdown, Nygard 5-section template, no fluff. Keep under 300 words.
> Include a "Status: Accepted | Date: <YYYY-MM-DD>" line.

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [0001](0001-partition-trades-by-date.md) | Partition `trades` by `trade_date` | Accepted | 2026-07-27 |
| [0002](0002-jsonb-for-instrument-metadata.md) | Use JSONB for instrument metadata | Accepted | 2026-07-27 |
| [0003](0003-gin-over-btree-for-jsonb.md) | GIN index with `jsonb_path_ops` over B-tree | Accepted | 2026-07-27 |
