package com.dbtraining.reconx.repository;

import com.dbtraining.reconx.repository.entity.DlqMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DlqMessageRepository 
        extends JpaRepository<DlqMessage, Long> {
}