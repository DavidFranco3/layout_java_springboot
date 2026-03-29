package com.example.demo.dto;

import lombok.Data;

import java.util.List;

@Data
public class RoleDTO {
    private Long id;
    private String name;
    private String guardName = "web";
    private Integer status = 1;
    private List<Long> permisos;
}
