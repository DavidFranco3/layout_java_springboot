package com.example.demo.repository;

import com.example.demo.model.AuditoriaLog;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditoriaLogRepository extends JpaRepository<AuditoriaLog, Long> {
    @Override
    @EntityGraph(attributePaths = { "user" })
    List<AuditoriaLog> findAll();
}
