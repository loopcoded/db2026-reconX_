# TICKET-ADV003 — C4 Level 2 Container Diagram

```mermaid
C4Container
title ReconX - Container Diagram

Person(user, "User", "Trader / Recon Analyst / Ops Admin")
System_Ext(oms, "OMS", "Order Management System")
System_Ext(sso, "SSO Identity Provider", "Authentication Service")

System_Boundary(reconxBoundary, "ReconX") {

    Container(spa, "React SPA", "React", "Web application for users")

    Container(api, "API", "Spring Boot", "REST API and business services")

    Container(engine, "Reconciliation Engine", "Java", "Matches and reconciles trades")

    ContainerDb(postgres, "PostgreSQL", "PostgreSQL 16", "Stores application data")

    ContainerQueue(kafka, "Kafka", "Apache Kafka", "Trade event messaging")

    Container(prometheus, "Prometheus", "Prometheus", "Collects application metrics")

    Container(grafana, "Grafana", "Grafana", "Monitoring dashboards")
}

Rel(user, spa, "Uses application", "HTTPS")

Rel(spa, api, "Calls REST APIs", "HTTPS / JSON")

Rel(api, postgres, "Reads and writes data", "JDBC")

Rel(api, kafka, "Publishes trade events", "Kafka Protocol")

Rel(engine, kafka, "Consumes trade events", "Kafka Protocol")

Rel(engine, postgres, "Stores reconciliation results", "JDBC")

Rel(prometheus, api, "Scrapes metrics", "HTTP")

Rel(grafana, prometheus, "Reads metrics", "PromQL")

Rel(api, sso, "Authenticates users", "OIDC")

Rel(api, oms, "Retrieves trade data", "HTTPS / JSON")
```