package com.example.demo.repository;

import com.example.demo.model.Permission;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {

    @Override
    @EntityGraph(attributePaths = { "modulo" })
    List<Permission> findAll();

    @Query("SELECT p.id as id, p.name as name, m.id as modulo_id, m.nombre as modulo_nombre " +
            "FROM Permission p JOIN p.modulo m")
    List<Map<String, Object>> findAllWithModuloInfo();
}
