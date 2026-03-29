package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClienteDTO {
    private Long id;
    private String nombre;
    private Integer status = 1;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
