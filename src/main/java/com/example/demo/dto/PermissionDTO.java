package com.example.demo.dto;

import lombok.Data;

@Data
public class PermissionDTO {
    private Long id;
    private String name;
    private String guardName = "web";
    private Integer status = 1;
    private Long modulo_id;
    private String modulo_nombre;
}
