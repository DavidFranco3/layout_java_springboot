package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "auditoria_logs")
@Data
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class AuditoriaLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String model;

    @Column(name = "model_id")
    private Long modelId;

    @Column(nullable = false)
    private String accion;

    @Column(columnDefinition = "TEXT")
    private String datos_anteriores;

    @Column(columnDefinition = "TEXT")
    private String datos_nuevos;

    private String ip;

    @Column(name = "user_agent")
    private String userAgent;

    private String url;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    @JsonProperty("model_id")
    public Long getModelId() {
        return modelId;
    }

    public void setModelId(Long modelId) {
        this.modelId = modelId;
    }

    public String getAccion() {
        return accion;
    }

    public void setAccion(String accion) {
        this.accion = accion;
    }

    public String getDatos_anteriores() {
        return datos_anteriores;
    }

    public void setDatos_anteriores(String datos_anteriores) {
        this.datos_anteriores = datos_anteriores;
    }

    public String getDatos_nuevos() {
        return datos_nuevos;
    }

    public void setDatos_nuevos(String datos_nuevos) {
        this.datos_nuevos = datos_nuevos;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    @JsonProperty("user_agent")
    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    @JsonProperty("created_at")
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @JsonProperty("user_name")
    public String getUserName() {
        return user != null ? user.getName() : null;
    }

    @JsonProperty("user_email")
    public String getUserEmail() {
        return user != null ? user.getEmail() : null;
    }
}
