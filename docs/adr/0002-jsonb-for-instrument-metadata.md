# ADR-0002 — Use JSONB for instrument metadata

- **Status:** Accepted
- **Date:** 2026-07-27
- **Deciders:** ReconX team

## Context

The `instruments` table covers multiple asset classes (equities, fixed income,
FX, derivatives). Each asset class carries its own metadata attributes —
equities need `dividend_yield` and `sector`, fixed income needs `coupon_rate`
and `maturity_date`, FX needs `settlement_convention`. A fully normalised
design would add 10–15 nullable columns (most NULL for any given row) or
require an EAV pattern that is hard to query.

### Alternatives Considered

1. **Wide table with nullable columns** — simple to query but wastes storage,
   pollutes the schema with columns that apply to < 25% of rows, and every new
   asset class requires a migration.
2. **Entity-Attribute-Value (EAV) table** — fully flexible but produces
   unpredictable query performance, loses type safety, and makes reporting
   queries painful.
3. **Separate per-asset-class tables** — clean normalisation but forces
   polymorphic JPA mappings and complicates cross-asset queries.

### Constraints

- All metadata attributes must be searchable for ad-hoc analyst queries.
- Schema changes for new asset classes must not require downtime.
- H2 (dev profile) does not support JSONB — the column is Postgres-only;
  dev profile skips it via a `<dbms>` precondition.

## Decision

Add a `metadata JSONB NOT NULL DEFAULT '{}'` column to `instruments`. Store
per-asset-class attributes as key-value pairs. Validate structure in the
application layer (Spring Boot `@JsonSchema` or manual checks).

## Consequences

**Positive**
- Zero-downtime schema evolution — new attributes are just new keys.
- Flexible querying via Postgres JSONB operators (`@>`, `->>`, `jsonb_path_query`).
- Single table covers all asset classes; no polymorphic JPA complexity.

**Negative**
- Type safety moves from the database to the application layer.
- GIN index required for performant containment queries (see ADR-0003).
- H2 dev profile cannot test JSONB queries — integration tests need Postgres (Testcontainers).

---

*Prompt used:*

> Decision to record: Use a JSONB column on `instruments` for per-asset-class
> metadata instead of nullable columns or EAV. Alternatives: wide table with
> nullable columns, EAV table, separate per-asset-class tables. Constraints:
> all attributes must be searchable, no downtime for schema changes, H2 dev
> profile cannot support JSONB.
