package com.example.demo.aspect;

import com.example.demo.annotation.Loggable;
import com.example.demo.service.AuditoriaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Map;

@Aspect
@Component
public class AuditoriaAspect {

    private final AuditoriaService auditoriaService;
    private final ObjectMapper objectMapper;

    public AuditoriaAspect(AuditoriaService auditoriaService, ObjectMapper objectMapper) {
        this.auditoriaService = auditoriaService;
        this.objectMapper = objectMapper;
    }

    @AfterReturning(value = "@annotation(loggable)", returning = "result")
    public void logAction(JoinPoint joinPoint, Loggable loggable, Object result) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                .getRequest();

        String model = loggable.model();
        String action = loggable.accion();

        if (action.isEmpty()) {
            action = request.getMethod();
        }

        Map<String, Object> newData = null;
        Long modelId = null;

        if (result != null) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> converted = objectMapper.convertValue(result, Map.class);
                newData = converted;
                if (newData.containsKey("id")) {
                    Object idValue = newData.get("id");
                    if (idValue instanceof Number) {
                        modelId = ((Number) idValue).longValue();
                    }
                }
            } catch (Exception e) {
                // Ignore conversion errors for logging
            }
        }

        auditoriaService.registrarAuditoria(
                action,
                model,
                modelId,
                null,
                newData,
                "Registro automático vía AOP",
                request);
    }
}
