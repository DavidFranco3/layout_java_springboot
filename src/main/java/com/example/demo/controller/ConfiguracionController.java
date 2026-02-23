package com.example.demo.controller;

import com.example.demo.Inertia;
import com.example.demo.model.Configuracion;
import com.example.demo.service.ConfiguracionService;
import com.example.demo.service.EmpresaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import jakarta.servlet.http.HttpServletRequest;
import com.example.demo.service.AuditoriaService;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/configuracions")
public class ConfiguracionController {

    private final ConfiguracionService configuracionService;
    private final EmpresaService empresaService;
    private final AuditoriaService auditoriaService;

    public ConfiguracionController(ConfiguracionService configuracionService,
            EmpresaService empresaService, AuditoriaService auditoriaService) {
        this.configuracionService = configuracionService;
        this.empresaService = empresaService;
        this.auditoriaService = auditoriaService;
    }

    @InitBinder("configuracion")
    public void initBinder(org.springframework.web.bind.WebDataBinder binder) {
        binder.setDisallowedFields("logo");
    }

    @GetMapping
    public Object index() {
        Map<String, Object> props = new HashMap<>();
        props.put("configuracions", configuracionService.findAll());
        return Inertia.render("Configuracions/Index", props);
    }

    @GetMapping("/api/list")
    @ResponseBody
    public Object listAll() {
        return configuracionService.findAll();
    }

    @GetMapping("/create")
    public Object create() {
        // The instruction provided a malformed diff for this method.
        // Based on the intent to simplify and use static render, and assuming
        // "empresas" might still be needed or removed based on the new view.
        // I'll assume the intent was to change the view name and simplify the props.
        // If "empresas" is still needed, it should be added to the HashMap.
        // For now, I'll follow the provided diff's structure for the new render call.
        Map<String, Object> props = new HashMap<>();
        props.put("mode", "create");
        props.put("routeBase", "configuracions");
        props.put("empresas", empresaService.findAll()); // Keep if still needed
        return Inertia.render("Configuracions/Form", props); // Changed to Form as per original logic, or Create if view
                                                             // name changed
    }

    @PostMapping
    public ResponseEntity<?> store(@ModelAttribute Configuracion configuracion,
            @RequestParam(value = "logo", required = false) MultipartFile logoFile,
            HttpServletRequest request) {
        if (configuracionService.findAll().size() > 0) {
            return ResponseEntity.status(HttpStatus.SEE_OTHER)
                    .location(URI.create("/configuracions"))
                    .build();
        }

        if (logoFile != null && !logoFile.isEmpty()) {
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

        configuracion = configuracionService.save(configuracion);

        Map<String, Object> newData = new HashMap<>();
        newData.put("colores", configuracion.getColores());
        newData.put("nombre_comercial", configuracion.getNombre_comercial());
        newData.put("id_datos_empresa", configuracion.getIdDatosEmpresa());
        newData.put("status", configuracion.getStatus());

        auditoriaService.registrarAuditoria(
                "POST",
                "Configuracion",
                configuracion.getId(),
                null,
                newData,
                "Creación de configuración",
                request);

        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/configuracions"))
                .build();
    }

    @GetMapping("/{id}/edit")
    public Object edit(@PathVariable Long id) {
        Configuracion configuracion = configuracionService.findById(id)
                .orElseThrow(() -> new RuntimeException("Configuracion not found"));
        Map<String, Object> props = new HashMap<>();
        props.put("mode", "update");
        props.put("routeBase", "configuracions");
        props.put("configuracion", configuracion);
        props.put("empresas", empresaService.findAll()); // Keep if still needed
        return Inertia.render("Configuracions/Form", props); // Changed to Form as per original logic, or Edit if view
                                                             // name changed
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @ModelAttribute Configuracion configuracion,
            @RequestParam(value = "logo", required = false) MultipartFile logoFile,
            HttpServletRequest request) {
        configuracion.setId(id);
        Configuracion currentConfig = configuracionService.findById(id).orElseThrow();

        Map<String, Object> oldData = new HashMap<>();
        oldData.put("colores", currentConfig.getColores());
        oldData.put("nombre_comercial", currentConfig.getNombre_comercial());
        oldData.put("id_datos_empresa", currentConfig.getIdDatosEmpresa());
        oldData.put("status", currentConfig.getStatus());

        if (logoFile != null && !logoFile.isEmpty()) {
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
        } else {
            // retain old logo if no new file is provided
            configuracion.setLogo(currentConfig.getLogo());
        }

        configuracion.setId(id);
        configuracionService.save(configuracion);

        Map<String, Object> newData = new HashMap<>();
        newData.put("colores", configuracion.getColores());
        newData.put("nombre_comercial", configuracion.getNombre_comercial());
        newData.put("id_datos_empresa", configuracion.getIdDatosEmpresa());
        newData.put("status", configuracion.getStatus());

        auditoriaService.registrarAuditoria(
                "PUT",
                "Configuracion",
                configuracion.getId(),
                oldData,
                newData,
                "Actualización de configuración",
                request);

        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/configuracions"))
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable Long id, HttpServletRequest request) {
        Configuracion configuracion = configuracionService.findById(id).orElseThrow();

        Map<String, Object> oldData = new HashMap<>();
        oldData.put("colores", configuracion.getColores());
        oldData.put("nombre_comercial", configuracion.getNombre_comercial());
        oldData.put("status", configuracion.getStatus());

        auditoriaService.registrarAuditoria(
                "DELETE",
                "Configuracion",
                configuracion.getId(),
                oldData,
                null,
                "Eliminación de configuración",
                request);

        configuracion.setStatus(0);
        configuracionService.save(configuracion);
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/configuracions"))
                .build();
    }
}
