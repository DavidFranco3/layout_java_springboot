package com.example.demo.controller;

import com.example.demo.model.Configuracion;
import com.example.demo.service.ConfiguracionService;
import com.example.demo.service.AuditoriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/configuracion")
public class ConfiguracionController {

    private final ConfiguracionService configuracionService;
    private final AuditoriaService auditoriaService;

    public ConfiguracionController(ConfiguracionService configuracionService,
            AuditoriaService auditoriaService) {
        this.configuracionService = configuracionService;
        this.auditoriaService = auditoriaService;
    }

    @GetMapping
    public List<Configuracion> index() {
        return configuracionService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Configuracion> show(@PathVariable Long id) {
        return configuracionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> store(@ModelAttribute Configuracion configuracion,
            @RequestParam(value = "logo", required = false) MultipartFile logoFile,
            HttpServletRequest request) {
        if (configuracionService.findAll().size() > 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Ya existe una configuración"));
        }

        if (logoFile != null && !logoFile.isEmpty()) {
            handleLogoUpload(configuracion, logoFile);
        }

        configuracion = configuracionService.save(configuracion);
        registrarAuditoria("POST", configuracion, null, request, "Creación de configuración");

        return ResponseEntity.ok(configuracion);
    }

    @PostMapping("/{id}") // Usamos POST para soportar Multipart con @ModelAttribute en algunos clientes
    public ResponseEntity<?> update(@PathVariable Long id, @ModelAttribute Configuracion configuracion,
            @RequestParam(value = "logo", required = false) MultipartFile logoFile,
            HttpServletRequest request) {
        
        Configuracion currentConfig = configuracionService.findById(id)
                .orElseThrow(() -> new RuntimeException("Configuracion not found"));

        Map<String, Object> oldData = extractAuditoriaData(currentConfig);

        if (logoFile != null && !logoFile.isEmpty()) {
            handleLogoUpload(configuracion, logoFile);
        } else {
            configuracion.setLogo(currentConfig.getLogo());
        }

        configuracion.setId(id);
        configuracion = configuracionService.save(configuracion);
        registrarAuditoria("PUT", configuracion, oldData, request, "Actualización de configuración");

        return ResponseEntity.ok(configuracion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable Long id, HttpServletRequest request) {
        return configuracionService.findById(id).map(configuracion -> {
            Map<String, Object> oldData = extractAuditoriaData(configuracion);
            registrarAuditoria("DELETE", configuracion, oldData, request, "Eliminación de configuración");
            
            configuracion.setStatus(0);
            configuracionService.save(configuracion);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    private void handleLogoUpload(Configuracion configuracion, MultipartFile logoFile) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + logoFile.getOriginalFilename();
            Path uploadPath = Paths.get("src/main/resources/static/storage/");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Files.copy(logoFile.getInputStream(), uploadPath.resolve(fileName));
            configuracion.setLogo(fileName);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Map<String, Object> extractAuditoriaData(Configuracion config) {
        Map<String, Object> data = new HashMap<>();
        data.put("colores", config.getColores());
        data.put("nombre_comercial", config.getNombre_comercial());
        data.put("id_datos_empresa", config.getIdDatosEmpresa());
        data.put("status", config.getStatus());
        return data;
    }

    private void registrarAuditoria(String method, Configuracion config, Map<String, Object> oldData, 
                                   HttpServletRequest request, String description) {
        Map<String, Object> newData = extractAuditoriaData(config);
        auditoriaService.registrarAuditoria(
                method, "Configuracion", config.getId(), oldData, newData, description, request);
    }
}
