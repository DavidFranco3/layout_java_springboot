package com.example.demo.controller;

import com.example.demo.dto.UserDTO;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<UserDTO> show() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userService.findByEmail(auth.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PatchMapping
    public ResponseEntity<UserDTO> update(@RequestBody Map<String, Object> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<UserDTO> userOpt = userService.findByEmail(auth.getName());

        if (userOpt.isPresent()) {
            UserDTO userDTO = userOpt.get();
            if (payload.containsKey("name")) {
                userDTO.setNombre((String) payload.get("name"));
            }
            if (payload.containsKey("email")) {
                userDTO.setEmail((String) payload.get("email"));
            }
            return ResponseEntity.ok(userService.save(userDTO));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, Object> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userOpt = userService.findEntityByEmail(auth.getName());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String currentPassword = (String) payload.get("current_password");
            String newPassword = (String) payload.get("password");

            if (passwordEncoder.matches(currentPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                // Assuming we have a way to save entity or via DTO
                UserDTO dto = userService.findByEmail(auth.getName()).get();
                dto.setPassword(user.getPassword());
                userService.save(dto);
                return ResponseEntity.ok(Map.of("message", "Contraseña actualizada exitosamente"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("current_password", "La contraseña actual es incorrecta."));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @DeleteMapping
    public ResponseEntity<?> destroy(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> userEntityOpt = userService.findEntityByEmail(auth.getName());

        if (userEntityOpt.isPresent()) {
            User user = userEntityOpt.get();
            String password = (String) payload.get("password");

            if (passwordEncoder.matches(password, user.getPassword())) {
                UserDTO userDTO = userService.findByEmail(auth.getName()).get();
                userDTO.setStatus(0);
                userService.save(userDTO);

                HttpSession session = request.getSession(false);
                if (session != null) {
                    session.invalidate();
                }
                SecurityContextHolder.clearContext();

                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.badRequest().body(Map.of("password", "La contraseña es incorrecta."));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
