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
        
        String email = payload != null ? payload.getEmail() : null;
        String password = payload != null ? payload.getPassword() : null;
        
        try {
            UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(email, password);
            Authentication authentication = authenticationManager.authenticate(authRequest);

            SecurityContextHolder.getContext().setAuthentication(authentication);

            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            logger.info("✅ Login successful for user: {}", email);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login exitoso");
            response.put("user", email);
            
            return ResponseEntity.ok(response);
            
        } catch (AuthenticationException e) {
            logger.error("！！！ AUTHENTICATION FAILED ！！！: {}", e.getMessage());

            Map<String, String> errors = new HashMap<>();
            errors.put("email", "Las credenciales no coinciden con nuestros registros.");
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errors);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok().build();
    }
}
