# C4 Component — recon-service API

```mermaid
C4Component

title C4 Component — recon-service API

Container_Ext(ui, "Web UI", "React")
ContainerDb_Ext(db, "PostgreSQL", "Database")
ContainerQueue_Ext(kafka, "Kafka", "Message Broker")

Container_Boundary(api, "recon-service API") {

    Component(authController, "AuthController", "REST Controller")
    Component(tradeController, "TradeController", "REST Controller")
    Component(reconController, "ReconController", "REST Controller")
    Component(auditController, "AuditController", "REST Controller")

    Component(jwtFilter, "JwtAuthFilter", "Security Filter")
    Component(methodSecurity, "MethodSecurity", "Spring Security")

    Component(authService, "AuthService", "@Service")
    Component(tradeService, "TradeService", "@Service")
    Component(reconService, "ReconService", "@Service")

    Component(userRepo, "UserRepository", "@Repository")
    Component(tradeRepo, "TradeRepository", "@Repository")
    Component(reconRepo, "ReconRepository", "@Repository")

    Component(eventProducer, "KafkaProducer", "Kafka Producer")
    Component(eventConsumer, "KafkaConsumer", "Kafka Listener")
}

Rel(ui, jwtFilter, "HTTP Request")
Rel(jwtFilter, methodSecurity, "Validates JWT")
Rel(methodSecurity, authController, "Authorizes")
Rel(methodSecurity, tradeController, "Authorizes")
Rel(methodSecurity, reconController, "Authorizes")
Rel(methodSecurity, auditController, "Authorizes")

Rel(authController, authService, "Uses")
Rel(tradeController, tradeService, "Uses")
Rel(reconController, reconService, "Uses")
Rel(auditController, reconService, "Reads audit")

Rel(authService, userRepo, "Reads/Writes")
Rel(tradeService, tradeRepo, "Reads/Writes")
Rel(reconService, reconRepo, "Reads/Writes")

Rel(authService, eventProducer, "Publishes")
Rel(tradeService, eventProducer, "Publishes")
Rel(reconService, eventProducer, "Publishes")

Rel(userRepo, db, "JPA")
Rel(tradeRepo, db, "JPA")
Rel(reconRepo, db, "JPA")

Rel(eventProducer, kafka, "Publishes")
Rel(kafka, eventConsumer, "Consumes")
Rel(eventConsumer, reconService, "Processes")
```