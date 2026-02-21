package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "configuracion")
@SQLRestriction("status = 1")
@Data
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Configuracion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String colores; // Stored as a string (JSON) to match the Laravel 'array' cast

    private String logo;

    @Column(name = "id_datos_empresa")
    private Long idDatosEmpresa;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_datos_empresa", insertable = false, updatable = false)
    private Empresa empresa;

    @Column(name = "id_persona_facturacion")
    private Long idPersonaFacturacion;

    @Column(nullable = false)
    private String nombre_comercial;

    @Column(columnDefinition = "Integer default 1")
    private Integer status = 1;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getColores() {
        return colores;
    }

    public void setColores(String colores) {
        this.colores = colores;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public Long getIdDatosEmpresa() {
        return idDatosEmpresa;
    }

    public void setIdDatosEmpresa(Long idDatosEmpresa) {
        this.idDatosEmpresa = idDatosEmpresa;
    }

    public Empresa getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public Long getIdPersonaFacturacion() {
        return idPersonaFacturacion;
    }

    public void setIdPersonaFacturacion(Long idPersonaFacturacion) {
        this.idPersonaFacturacion = idPersonaFacturacion;
    }

    public String getNombre_comercial() {
        return nombre_comercial;
    }

    public void setNombre_comercial(String nombre_comercial) {
        this.nombre_comercial = nombre_comercial;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    @JsonProperty("empresa_nombre")
    public String getEmpresaNombre() {
        return empresa != null ? empresa.getNombre() : null;
    }
}
