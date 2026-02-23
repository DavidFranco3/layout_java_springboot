package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String nombre;
    private String email;
    private Integer status;
    private Long rol_id;
    private String rol_nombre;
    private LocalDateTime email_verified_at;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
}
