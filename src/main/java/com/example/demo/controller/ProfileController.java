package com.example.demo.controller;

import com.example.demo.Inertia;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Controller
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/profile/edit")
    public Object edit() {
        Map<String, Object> props = new HashMap<>();
        props.put("mustVerifyEmail", false);
        props.put("status", null);
        return Inertia.render("Profile/Edit", props);
    }

    @PatchMapping("/profile")
    public ResponseEntity<?> update(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (payload.containsKey("name")) {
                user.setName((String) payload.get("name"));
            }
            if (payload.containsKey("email")) {
                user.setEmail((String) payload.get("email"));
            }
            userRepository.save(user);
        }

        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/profile/edit"))
                .build();
    }

    @PutMapping("/password/update")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String currentPassword = (String) payload.get("current_password");
            String newPassword = (String) payload.get("password");

            if (passwordEncoder.matches(currentPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
            } else {
                HttpSession session = request.getSession();
                Map<String, String> errors = new HashMap<>();
                errors.put("current_password", "La contraseña actual es incorrecta.");
                session.setAttribute("errors", errors);
            }
        }

        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/profile/edit"))
                .build();
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> destroy(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String password = (String) payload.get("password");

            if (passwordEncoder.matches(password, user.getPassword())) {
                user.setStatus(0); // Soft delete or deactivate
                userRepository.save(user);

                HttpSession session = request.getSession(false);
                if (session != null) {
                    session.invalidate();
                }
                SecurityContextHolder.clearContext();

                return ResponseEntity.status(HttpStatus.SEE_OTHER)
                        .location(URI.create("/"))
                        .build();
            } else {
                HttpSession session = request.getSession();
                Map<String, String> errors = new HashMap<>();
                errors.put("password", "La contraseña es incorrecta.");
                session.setAttribute("errors", errors);
            }
        }

        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/profile/edit"))
                .build();
    }
}
