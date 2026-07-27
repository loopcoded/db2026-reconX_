# TICKET-ADV002 — C4 Level 1 Context Diagram

```mermaid
C4Context
title ReconX - System Context Diagram

Person(trader, "Trader", "Books and monitors trades")
Person(reconAnalyst, "Recon Analyst", "Investigates reconciliation breaks")
Person(opsAdmin, "Ops Admin", "Manages operations and system configuration")
Person(compliance, "Compliance Officer", "Reviews audit reports and compliance status")

System(reconx, "ReconX", "Financial trade reconciliation platform")

System_Ext(oms, "OMS", "Order Management System")
System_Ext(sftp, "SFTP Server", "Counterparty file exchange")
System_Ext(bloomberg, "Bloomberg", "Market data provider")
System_Ext(email, "Email Gateway", "Email notifications")
System_Ext(sso, "SSO Identity Provider", "Authentication service")
System_Ext(grafana, "Grafana", "Monitoring dashboards")

Rel(trader, reconx, "Books and monitors trades", "HTTPS")
Rel(reconAnalyst, reconx, "Reviews reconciliation results", "HTTPS")
Rel(opsAdmin, reconx, "Administers system", "HTTPS")
Rel(compliance, reconx, "Views audit reports", "HTTPS")

Rel(reconx, oms, "Consumes trade events", "HTTPS")
Rel(reconx, sftp, "Imports counterparty files", "SFTP")
Rel(reconx, bloomberg, "Retrieves market prices", "HTTPS")
Rel(reconx, email, "Sends reconciliation alerts", "SMTP")
Rel(reconx, sso, "Authenticates users", "OIDC")
Rel(reconx, grafana, "Publishes operational metrics", "HTTPS")
```