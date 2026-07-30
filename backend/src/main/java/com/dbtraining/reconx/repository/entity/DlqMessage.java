package com.dbtraining.reconx.repository.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "dlq_messages")
public class DlqMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;

    @Column(columnDefinition = "TEXT")
    private String payload;

    @Column(columnDefinition = "TEXT")
    private String error;

    private Instant createdAt = Instant.now();

    public DlqMessage() {}

    public DlqMessage(String topic, String payload, String error) {
        this.topic = topic;
        this.payload = payload;
        this.error = error;
    }

    public Long getId() {
        return id;
    }

    public String getTopic() {
        return topic;
    }

    public String getPayload() {
        return payload;
    }

    public String getError() {
        return error;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}