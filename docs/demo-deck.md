# Demo Deck — ReconX Platform (10 Slides)

## Slide 1: Title
* **ReconX — Enterprise Trade Reconciliation**
* Built by TDI 2026 Graduate Training Group
* Team: Aarsh, Mona, Priyansh, Pranshul

## Slide 2: Problem Statement
* **The Reality:** Ops teams reconcile thousands of trades daily across disjointed systems.
* **The Cost:** Mismatches and delays cost millions in unmanaged risk and manual overhead.
* **The Solution:** ReconX offers real-time, event-driven reconciliation with immediate visibility.

## Slide 3: Architecture
* *(Embed Mermaid runtime diagram here)*
* Event-driven core using Apache Kafka
* Fully containerized 7-service stack

## Slide 4: Tech Stack
* **UI:** React 19, Vite, TailwindCSS
* **App Layer:** Java 25, Spring Boot 3
* **Data & Messaging:** PostgreSQL 16, Apache Kafka
* **Observability:** Prometheus, Grafana, Micrometer

## Slide 5: Live Demo — Introduction
* We will simulate a live trading scenario.
* JWT role-based authentication secures all actions.
* Watch trades flow from creation to validation and persistence.

## Slide 6: Kafka & Reconciliation
* *(Show Kafdrop screenshot or live view)*
* Real-time trade events hit the `trade-events` topic.
* Reconciliation engine automatically processes mismatches.
* Results instantly published to `recon-results` for the UI.

## Slide 7: CI/CD Pipeline
* *(Show Mermaid CI/CD diagram + green Actions screenshot)*
* 85% JaCoCo coverage gate ensures quality.
* Liquibase validation protects schema integrity.
* Automated multi-stage Docker builds pushed to GHCR.

## Slide 8: Monitoring & Load Testing
* *(Show Grafana screenshots: baseline, under load, recovery)*
* **Baseline:** Idle stack with ~5 RPS and minimal p95 latency.
* **Under Load:** 200 VUs driving 200-400 RPS with visible Kafka lag.
* **Recovery:** Lag rapidly draining to zero within 30 seconds.

## Slide 9: Learnings
* **Hardest Bug:** Debugging Kafka networking inside Docker Compose.
* **Biggest Win:** The real-time reactivity of the React + SSE UI.
* **Retrospective:** We'd lock the schema down earlier next time.

## Slide 10: Q&A
* **Questions?** We're happy to discuss any layer of the stack.
* **Repo:** [GitHub - loopcoded/db2026-reconX_]
