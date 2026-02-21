package com.example.demo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.demo.dto.LoginRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody(required = false) LoginRequest payload,
            HttpServletRequest request) {
        logger.info("====== LOGIN ATTEMPT ======");
        logger.info("Content-Type: {}", request.getContentType());
        logger.info("Payload received: {}", payload);

        String email = payload != null ? payload.getEmail() : null;
        String password = payload != null ? payload.getPassword() : null;
        try {
            logger.info("Extracted email: {}", email);
            // Don't log passwords in real apps, but for debugging this prototype:
            logger.info("Extracted password: {}", password != null ? "[HAS_VALUE]" : "[NULL]");

            UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(email, password);
            Authentication authentication = authenticationManager.authenticate(authRequest);

            SecurityContextHolder.getContext().setAuthentication(authentication);

            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            logger.info("✅ Login successful for user: {}", email);

            // Inertia properly handles 303 See Other
            return ResponseEntity.status(HttpStatus.SEE_OTHER)
                    .location(URI.create("/dashboard"))
                    .build();
        } catch (AuthenticationException e) {
            logger.error("！！！ AUTHENTICATION FAILED ！！！");
            logger.error("Email attempted: [{}]", email);
            logger.error("Failure reason: {}", e.getMessage());
            logger.error("Exception type: {}", e.getClass().getName());
            // e.printStackTrace();

            // Error handling, redirect back to login
            HttpSession session = request.getSession(true);
            Map<String, String> errors = new HashMap<>();
            errors.put("email", "Las credenciales no coinciden con nuestros registros.");
            session.setAttribute("errors", errors);

            return ResponseEntity.status(HttpStatus.SEE_OTHER)
                    .location(URI.create("/login"))
                    .build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/login"))
                .build();
    }
}
