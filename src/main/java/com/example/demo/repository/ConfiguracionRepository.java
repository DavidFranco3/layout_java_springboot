package com.example.demo.repository;

import com.example.demo.model.Configuracion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConfiguracionRepository extends JpaRepository<Configuracion, Long> {
    @Override
    @EntityGraph(attributePaths = { "empresa" })
    List<Configuracion> findAll();
}
