package com.example.demo.repository;

import com.example.demo.model.AuditoriaLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditoriaLogRepository extends JpaRepository<AuditoriaLog, Long> {
}
