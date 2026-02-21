package com.example.demo;

import com.example.demo.model.Permission;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import org.springframework.web.servlet.ModelAndView;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class Inertia {

    private static ObjectMapper objectMapper;
    private static UserRepository userRepository;

    @Autowired
    public void setObjectMapper(ObjectMapper objectMapper) {
        Inertia.objectMapper = objectMapper;
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        Inertia.userRepository = userRepository;
    }

    public static Object render(String component, Map<String, Object> props) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                .getRequest();
        boolean isInertiaRequest = "true".equals(request.getHeader("X-Inertia"));

        Map<String, Object> propsWithAuth = new HashMap<>(props);

        // Handle Global Auth
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> authMap = new HashMap<>();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())
                && userRepository != null) {
            String email = auth.getName();
            Optional<User> optUser = userRepository.findByEmail(email);
            if (optUser.isPresent()) {
                User user = optUser.get();
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("name", user.getName());
                userMap.put("email", user.getEmail());

                if (user.getRole() != null) {
                    userMap.put("rol_id", user.getRole().getId());
                    userMap.put("rol_nombre", user.getRole().getName());

                    List<Map<String, Object>> permisos = new ArrayList<>();
                    if (user.getRole().getPermissions() != null) {
                        for (Permission p : user.getRole().getPermissions()) {
                            Map<String, Object> perm = new HashMap<>();
                            perm.put("nombre", p.getName());
                            perm.put("modulo_nombre", p.getModulo() != null ? p.getModulo().getNombre() : null);
                            permisos.add(perm);
                        }
                    }
                    userMap.put("permisos", permisos);
                }

                authMap.put("user", userMap);
            } else {
                authMap.put("user", null);
            }
        } else {
            authMap.put("user", null);
        }

        propsWithAuth.put("auth", authMap);

        // Handle Global Errors
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("errors") != null) {
            propsWithAuth.put("errors", session.getAttribute("errors"));
            session.removeAttribute("errors");
        } else if (!propsWithAuth.containsKey("errors")) {
            propsWithAuth.put("errors", new HashMap<>());
        }

        Map<String, Object> page = new HashMap<>();
        page.put("component", component);
        page.put("props", propsWithAuth);
        page.put("url", request.getRequestURI());
        page.put("version", "");

        if (isInertiaRequest) {
            try {
                String jsonBody = objectMapper.writeValueAsString(page);
                byte[] jsonBytes = jsonBody.getBytes(java.nio.charset.StandardCharsets.UTF_8);

                org.springframework.http.HttpHeaders h = new org.springframework.http.HttpHeaders();
                h.set("X-Inertia", "true");
                h.set("Vary", "Accept");
                h.set("Content-Type", "application/json");
                h.setContentLength(jsonBytes.length);
                h.setCacheControl("no-store, no-cache, must-revalidate");

                return org.springframework.http.ResponseEntity.ok()
                        .headers(h)
                        .body(jsonBody);
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Inertia serialization error", e);
            }
        }

        try {
            String json = objectMapper.writeValueAsString(page);
            request.setAttribute("inertiaPage", json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException("Inertia serialization error", e);
        }

        return new ModelAndView("index");
    }
}
