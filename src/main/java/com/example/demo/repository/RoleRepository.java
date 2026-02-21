package com.example.demo.repository;

import com.example.demo.model.Role;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    @Override
    @EntityGraph(attributePaths = { "permissions" })
    List<Role> findAll();

    @Override
    @EntityGraph(attributePaths = { "permissions" })
    Optional<Role> findById(Long id);
}
