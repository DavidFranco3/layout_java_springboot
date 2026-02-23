package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EmpresaDTO {
    private Long id;
    private String nombre;
    private String telefono;
    private String email;
    private String giro;
    private String rfc;
    private String razon_social;
    private String tipoPersona;
    private String calle;
    private String numero_exterior;
    private String numero_interior;
    private String colonia;
    private String municipio;
    private String estado;
    private String cp;
    private String regimen_fiscal;
    private String uso_cfdi;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
