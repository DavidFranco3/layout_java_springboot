package com.example.demo.dto;

import lombok.Data;

import java.util.List;

@Data
public class RoleDTO {
    private Long id;
    private String name;
    private String guardName;
    private Integer status;
    private List<Long> permisos;
}
