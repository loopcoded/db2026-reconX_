# ADR-0003 — GIN index with `jsonb_path_ops` over B-tree for JSONB queries

- **Status:** Accepted
- **Date:** 2026-07-27
- **Deciders:** ReconX team

## Context

ADR-0002 introduced a JSONB `metadata` column on `instruments`. Analysts run
ad-hoc queries filtering on nested keys (e.g., `metadata @> '{"sector": "Technology"}'`).
Without an index, Postgres must sequentially scan all ~50 instruments (growing
to ~500+ as the platform scales). Two index strategies are available for JSONB:
GIN (Generalized Inverted Index) and B-tree (on extracted scalar expressions).

### Alternatives Considered

1. **B-tree index on expression** — e.g., `CREATE INDEX ON instruments ((metadata->>'sector'))`.
   Fast for exact-match on ONE key, but requires a separate index per queryable
   key. With 10+ metadata keys, this means 10+ indexes, each consuming storage
   and slowing writes.
2. **GIN with default ops** — `CREATE INDEX ... USING GIN (metadata)`. Supports
   `@>`, `?`, `?|`, `?&` operators. Slightly larger index than `jsonb_path_ops`
   because it indexes keys AND values.
3. **No index** — acceptable only for <100 rows. Not future-proof.

### Constraints

- Analysts query on arbitrary metadata keys — the set of filtered keys is not
  fixed at schema time.
- Write volume on `instruments` is low (~50 inserts/day, rare updates), so index
  maintenance overhead is negligible.
- The containment operator `@>` is the primary access pattern for metadata
  filtering.

## Decision

Create a GIN index with `jsonb_path_ops` operator class:

```sql
CREATE INDEX idx_instruments_metadata_gin
    ON instruments USING GIN (metadata jsonb_path_ops);
```

`jsonb_path_ops` produces a smaller index than the default GIN operator class by
only indexing values (not keys), and it natively supports the `@>` containment
operator.

## Consequences

**Positive**
- Single index covers arbitrary containment queries on any metadata key.
- ~30% smaller than default GIN; faster to build and scan.
- No schema change needed when new metadata keys are introduced.

**Negative**
- Does not support `?` (key existence) or `?|` / `?&` (multi-key existence)
  queries — only `@>` (containment) and `@?` (jsonpath).
- GIN indexes have higher write cost than B-tree (negligible here due to low
  write volume).
- Reindexing a GIN can be slow if the table grows large — `REINDEX CONCURRENTLY`
  recommended for maintenance.

---

*Prompt used:*

> Decision to record: Use a GIN index with `jsonb_path_ops` on
> `instruments.metadata` instead of B-tree expression indexes or default GIN.
> Alternatives: B-tree on extracted scalar, GIN with default ops, no index.
> Constraints: analysts query on arbitrary keys, write volume is low,
> containment (`@>`) is the primary operator.
