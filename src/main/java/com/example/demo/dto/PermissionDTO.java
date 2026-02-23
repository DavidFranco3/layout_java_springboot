package com.example.demo.dto;

import lombok.Data;

@Data
public class PermissionDTO {
    private Long id;
    private String name;
    private String guardName;
    private Integer status;
    private Long modulo_id;
    private String modulo_nombre;
}
