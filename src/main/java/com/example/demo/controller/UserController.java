package com.example.demo.controller;

import com.example.demo.dto.UserDTO;
import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDTO> index() {
        return userService.findAll();
    }

    @PostMapping
    public ResponseEntity<UserDTO> store(@RequestBody Map<String, Object> payload) {
        UserDTO userDTO = new UserDTO();
        userDTO.setNombre((String) payload.get("nombre"));
        userDTO.setEmail((String) payload.get("email"));

        Object roleIdObj = payload.get("rol_id");
        if (roleIdObj != null && !roleIdObj.toString().isEmpty()) {
            userDTO.setRol_id(Long.valueOf(roleIdObj.toString()));
        }

        if (payload.containsKey("password")) {
            userDTO.setPassword((String) payload.get("password"));
        }

        return ResponseEntity.ok(userService.save(userDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
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
            return ResponseEntity.ok(userService.save(userDTO));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> destroy(@PathVariable Long id) {
        Optional<UserDTO> userOpt = userService.findById(id);
        if (userOpt.isPresent()) {
            UserDTO userDTO = userOpt.get();
            userDTO.setStatus(0);
            userService.save(userDTO);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
