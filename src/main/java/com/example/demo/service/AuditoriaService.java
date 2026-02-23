package com.example.demo.service;

import com.example.demo.model.AuditoriaLog;
import com.example.demo.model.User;
import com.example.demo.repository.AuditoriaLogRepository;
import com.example.demo.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuditoriaService {

    private final AuditoriaLogRepository auditoriaLogRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public AuditoriaService(AuditoriaLogRepository auditoriaLogRepository, UserRepository userRepository,
            ObjectMapper objectMapper) {
        this.auditoriaLogRepository = auditoriaLogRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    public void registrarAuditoria(
            String requestMethod,
            String modelName,
            Long modelId,
            Map<String, Object> oldData,
            Map<String, Object> newData,
            String observaciones,
            HttpServletRequest request) {

        AuditoriaLog log = new AuditoriaLog();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !authentication.getPrincipal().equals("anonymousUser")) {
            String email = authentication.getName(); // Asumiendo que el username es el email
            Optional<User> userOpt = userRepository.findByEmail(email);
            userOpt.ifPresent(log::setUser);
        }

        log.setModel(modelName);
        log.setModelId(modelId);
        log.setAccion(requestMethod);

        try {
            if (oldData != null && !oldData.isEmpty()) {
                log.setDatos_anteriores(objectMapper.writeValueAsString(oldData));
            }
            if (newData != null && !newData.isEmpty()) {
                log.setDatos_nuevos(objectMapper.writeValueAsString(newData));
            }
        } catch (JsonProcessingException e) {
            System.err.println("Error al serializar datos de la auditoria: " + e.getMessage());
        }

        if (request != null) {
            // Manejar proxy inverso si existe
            String ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null) {
                ipAddress = request.getRemoteAddr();
            }
            log.setIp(ipAddress);
            log.setUserAgent(request.getHeader("User-Agent"));
            log.setUrl(request.getRequestURL().toString());
        }

        log.setObservaciones(observaciones);

        try {
            auditoriaLogRepository.save(log);
        } catch (Exception ex) {
            System.err.println("Falla al guardar log de auditoria: " + ex.getMessage());
        }
    }

    public List<AuditoriaLog> findAll() {
        return auditoriaLogRepository.findAll();
    }

    public Optional<AuditoriaLog> findById(Long id) {
        return auditoriaLogRepository.findById(id);
    }

    public void deleteById(Long id) {
        auditoriaLogRepository.deleteById(id);
    }

    public AuditoriaLog save(AuditoriaLog log) {
        return auditoriaLogRepository.save(log);
    }
}
