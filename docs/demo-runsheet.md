# ReconX Demo Runsheet

**Total Time:** 20 Minutes

## Timeline

* **00:00 - 01:00** — Title slide & team intros (Lead speaks)
* **01:00 - 03:00** — Problem + Architecture (Lead walks Mermaid diagram)
* **03:00 - 04:00** — Tech stack grouped by layer
* **04:00 - 05:00** — *[Switch to Live Demo]* JWT Login. Show 200 OK in DevTools.
* **05:00 - 06:30** — Post a trade via UI. Highlight the request in Network tab.
* **06:30 - 08:00** — *[Switch to Kafdrop]* Show `trade-events` topic & message body.
* **08:00 - 09:30** — *[Switch to Grafana]* Show request-rate panel ticking up.
* **09:30 - 11:00** — *[Switch to Terminal/DB]* Show backend logs for auto-recon and query Postgres for the audit row.
* **11:00 - 12:00** — *[Switch back to slides]* Transition to code walkthrough.
* **12:00 - 13:30** — Code walkthrough: `TradeController.createTrade` (Engineer 1)
* **13:30 - 15:00** — Code walkthrough: `ReconConsumer.onTradeEvent` (Engineer 2)
* **15:00 - 16:30** — Code walkthrough: `useTradeStream` hook (Engineer 3)
* **16:30 - 18:00** — Learnings slide (Each member gives 1 sentence)
* **18:00 - 20:00** — Q&A with the audience. Lead routes questions to appropriate engineers.

## Rehearsal Log

* **Rehearsal 1 (Completed ~15:30):** Chaos-monkey drill. Handled a simulated network failure by smoothly falling back to local recordings.
* **Rehearsal 2 (Completed ~16:15):** Instructor mode. Handled aggressive Q&A focusing on Kafka consumer scaling and React render cycles.
