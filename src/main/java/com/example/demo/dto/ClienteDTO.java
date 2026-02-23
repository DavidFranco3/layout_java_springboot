package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClienteDTO {
    private Long id;
    private String campoEjemplo;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
