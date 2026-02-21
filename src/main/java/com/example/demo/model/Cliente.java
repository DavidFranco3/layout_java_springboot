package com.example.demo.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "clientes")
@SQLRestriction("status = 1")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String campoEjemplo;

    @Column(columnDefinition = "Integer default 1")
    private Integer status = 1;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCampoEjemplo() {
        return campoEjemplo;
    }

    public void setCampoEjemplo(String campoEjemplo) {
        this.campoEjemplo = campoEjemplo;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
