# ReconX — Team TDI 2026 — Retrospective

## What worked?
- Implementing a robust `maven-checkstyle-plugin` with `suppressions.xml` allowed us to enforce linting on new code without failing the build for legacy code.
- Extensive use of GitHub-native Mermaid diagrams in our documentation ensured that architecture and CI/CD pipelines were clearly communicated without needing external drawing tools.
- The GitFlow branching strategy (one branch per ticket) kept our work completely isolated and simplified code reviews.

## What didn't?
- We underestimated the time required to configure the JaCoCo coverage gate (TICKET-ADV156), as we initially forgot to exclude DTOs and configuration classes, which artificially lowered our coverage percentage.
- The local `develop` branch occasionally failed to compile due to missing entities (`DlqMessageRepository`, `Trade`) deleted or moved by concurrent PR merges, which caused unexpected delays.

## What would you change?
- We would lock the database schema and entity structure much earlier in the project. Changing JPA entities late in the game (Day 10) causes rippling breakages across the backend.
- We would write our load test scripts (k6) sooner in the development cycle to catch performance regressions early, rather than waiting until the end.

## What surprised you?
- How incredibly useful the Grafana observability stack was when debugging load tests. Being able to see Kafka consumer lag spike and drain in real-time made understanding system bottlenecks much easier.
- How strictly the JaCoCo plugin enforces coverage rules; it caught several untested edge cases in our service layer that we had completely overlooked.

## Technical notes for the next cohort
- **Docker Compose Networking:** Remember that inside `docker-compose`, services communicate via their container names (e.g., `kafka:9092`), not `localhost`.
- **Checkstyle Pitfall:** If you use `maven-checkstyle-plugin`, remember that modules like `LineLength` or `SuppressionFilter` must be children of `Checker`, not `TreeWalker`. We wasted time debugging failed XML parses.
- **Annotated Tags:** When cutting a release, make sure to use `git tag -a v1.0.0` (annotated tag). Lightweight tags do not trigger all GitHub Actions workflows properly!

## Team
- **Lead:** Aarsh
- **Backend:** Mona
- **Frontend:** Priyansh
- **DevOps/CI:** Pranshul
