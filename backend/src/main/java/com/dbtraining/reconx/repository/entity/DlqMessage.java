package com.dbtraining.reconx.repository.entity;

import com.dbtraining.reconx.dto.TradeEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "dlq_messages")
public class DlqMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID eventId;

    private String tradeRef;

    private String originalTopic;

    private Integer partition;

    private Long offset;

    @Column(columnDefinition = "TEXT")
    private String payload;

    @Column(columnDefinition = "TEXT")
    private String reason;

    private Instant firstSeen;

    public DlqMessage() {
    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getId() {
        return id;
    }

    public UUID getEventId() {
        return eventId;
    }

    public String getTradeRef() {
        return tradeRef;
    }

    public String getOriginalTopic() {
        return originalTopic;
    }

    public Integer getPartition() {
        return partition;
    }

    public Long getOffset() {
        return offset;
    }

    public String getPayload() {
        return payload;
    }

    public String getReason() {
        return reason;
    }

    public Instant getFirstSeen() {
        return firstSeen;
    }

    public static class Builder {

        private final DlqMessage msg = new DlqMessage();
        private static final ObjectMapper mapper = new ObjectMapper();

        public Builder eventId(UUID id) {
            msg.eventId = id;
            return this;
        }

        public Builder tradeRef(String ref) {
            msg.tradeRef = ref;
            return this;
        }

        public Builder originalTopic(String topic) {
            msg.originalTopic = topic;
            return this;
        }

        public Builder partition(Integer partition) {
            msg.partition = partition;
            return this;
        }

        public Builder offset(Long offset) {
            msg.offset = offset;
            return this;
        }

        public Builder payload(TradeEvent event) {
            try {
                msg.payload = mapper.writeValueAsString(event);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            return this;
        }

        public Builder reason(String reason) {
            msg.reason = reason;
            return this;
        }

        public Builder firstSeen(Instant firstSeen) {
            msg.firstSeen = firstSeen;
            return this;
        }

        public DlqMessage build() {
            return msg;
        }
    }
}