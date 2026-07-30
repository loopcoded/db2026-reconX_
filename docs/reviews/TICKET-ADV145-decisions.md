# TICKET-ADV145 Kafka Consumer Config Review

| Finding | Severity | Decision | Rationale |
|---------|----------|----------|-----------|
| **auto-offset-reset is 'earliest'** | High | Accept | In production, starting a new consumer group could replay the entire history of trades, overwhelming the system. We will change this to `latest`. |
| **Missing concurrency configuration** | Medium | Accept | By default, Spring Kafka uses 1 consumer thread per application. We will set `spring.kafka.listener.concurrency` to 3 to match the expected partition count and increase throughput. |
| **Missing max.poll.interval.ms** | Medium | Accept | Reconciliation is a CPU-heavy process. We should configure `max.poll.interval.ms` explicitly (e.g. 300000ms = 5 minutes) to ensure that the consumer does not get kicked out of the group while processing a heavy batch. |
| **Incorrect Backoff method used** | High | Accept | `KafkaErrorHandlerConfig` attempts to call `setMaxAttempts(3)` on `ExponentialBackOff`. This is invalid for Spring's implementation. We will fix it to `setMaxElapsedTime(8000L)` instead, as dictated by standard Spring Boot DLQ patterns. |
