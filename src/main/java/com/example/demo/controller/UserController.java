package com.example.demo.controller;

import com.example.demo.Inertia;
import com.example.demo.dto.UserDTO;
import com.example.demo.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public Object index() {
        Map<String, Object> props = new HashMap<>();
        props.put("users", userService.findAll());
        return Inertia.render("Users/Index", props);
    }

    @PostMapping
    public ResponseEntity<?> store(@RequestBody Map<String, Object> payload) {
        UserDTO userDTO = new UserDTO();
        userDTO.setNombre((String) payload.get("nombre"));
        userDTO.setEmail((String) payload.get("email"));

        // Role handling
        Object roleIdObj = payload.get("rol_id");
        if (roleIdObj != null && !roleIdObj.toString().isEmpty()) {
            userDTO.setRol_id(Long.valueOf(roleIdObj.toString()));
        }

        // Password handling
        if (payload.containsKey("password")) {
            userDTO.setPassword((String) payload.get("password"));
        }

        userService.save(userDTO);

        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/users"))
                .build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<UserDTO> userOpt = userService.findById(id);
        if (userOpt.isPresent()) {
            UserDTO userDTO = userOpt.get();
            if (payload.containsKey("nombre")) {
                userDTO.setNombre((String) payload.get("nombre"));
            }
            if (payload.containsKey("email")) {
                userDTO.setEmail((String) payload.get("email"));
            }
            if (payload.containsKey("rol_id")) {
                Object roleIdObj = payload.get("rol_id");
                if (roleIdObj != null && !roleIdObj.toString().isEmpty()) {
                    userDTO.setRol_id(Long.valueOf(roleIdObj.toString()));
                } else {
                    userDTO.setRol_id(null);
                }
            }
            if (payload.containsKey("password")) {
                userDTO.setPassword((String) payload.get("password"));
            }
            userService.save(userDTO);
        }
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/users"))
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable Long id) {
        Optional<UserDTO> userOpt = userService.findById(id);
        if (userOpt.isPresent()) {
            UserDTO userDTO = userOpt.get();
            userDTO.setStatus(0);
            userService.save(userDTO);
            // Alternatively, use a real delete:
            // userService.deleteById(id);
        }
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/users"))
                .build();
    }
}
