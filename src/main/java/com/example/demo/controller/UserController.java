package com.example.demo.controller;

import com.example.demo.Inertia;
import com.example.demo.model.User;
import com.example.demo.model.Role;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public Object index() {
        Map<String, Object> props = new HashMap<>();
        props.put("users", userRepository.findAll());
        return Inertia.render("Users/Index", props);
    }

    @PostMapping
    public ResponseEntity<?> store(@RequestBody Map<String, Object> payload) {
        User user = new User();
        user.setName((String) payload.get("nombre"));
        user.setEmail((String) payload.get("email"));

        String rawPassword = (String) payload.get("password");
        if (rawPassword != null && !rawPassword.isEmpty()) {
            user.setPassword(passwordEncoder.encode(rawPassword));
        }

        Object roleIdObj = payload.get("rol_id");
        if (roleIdObj != null && !roleIdObj.toString().isEmpty()) {
            Long roleId;
            if (roleIdObj instanceof Integer) {
                roleId = ((Integer) roleIdObj).longValue();
            } else {
                roleId = Long.valueOf(roleIdObj.toString());
            }
            Optional<Role> roleOpt = roleRepository.findById(roleId);
            roleOpt.ifPresent(user::setRole);
        }

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/users"))
                .build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (payload.containsKey("nombre")) {
                user.setName((String) payload.get("nombre"));
            }
            if (payload.containsKey("email")) {
                user.setEmail((String) payload.get("email"));
            }
            if (payload.containsKey("password")) {
                String rawPassword = (String) payload.get("password");
                if (rawPassword != null && !rawPassword.isEmpty()) {
                    user.setPassword(passwordEncoder.encode(rawPassword));
                }
            }
            if (payload.containsKey("rol_id")) {
                Object roleIdObj = payload.get("rol_id");
                if (roleIdObj != null && !roleIdObj.toString().isEmpty()) {
                    Long roleId;
                    if (roleIdObj instanceof Integer) {
                        roleId = ((Integer) roleIdObj).longValue();
                    } else {
                        roleId = Long.valueOf(roleIdObj.toString());
                    }
                    Optional<Role> roleOpt = roleRepository.findById(roleId);
                    roleOpt.ifPresent(user::setRole);
                } else {
                    user.setRole(null);
                }
            }
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/users"))
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/users"))
                .build();
    }
}
