package com.example.demo.controller;

import com.example.demo.Inertia;
import com.example.demo.model.Configuracion;
import com.example.demo.repository.ConfiguracionRepository;
import com.example.demo.repository.EmpresaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/configuracions")
public class ConfiguracionController {

    private final ConfiguracionRepository configuracionRepository;
    private final EmpresaRepository empresaRepository; // Keep EmpresaRepository if still used

    public ConfiguracionController(ConfiguracionRepository configuracionRepository,
            EmpresaRepository empresaRepository) {
        this.configuracionRepository = configuracionRepository;
        this.empresaRepository = empresaRepository; // Inject EmpresaRepository
    }

    @GetMapping
    public Object index() {
        Map<String, Object> props = new HashMap<>();
        props.put("configuracions", configuracionRepository.findAll());
        return Inertia.render("Configuracions/Index", props);
    }

    @GetMapping("/api/list")
    @ResponseBody
    public Object listAll() {
        return configuracionRepository.findAll();
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
        props.put("empresas", empresaRepository.findAll()); // Keep if still needed
        return Inertia.render("Configuracions/Form", props); // Changed to Form as per original logic, or Create if view
                                                             // name changed
    }

    @PostMapping
    public ResponseEntity<?> store(@RequestBody Configuracion configuracion) {
        if (configuracionRepository.count() > 0) {
            return ResponseEntity.status(HttpStatus.SEE_OTHER)
                    .location(URI.create("/configuracions"))
                    .build();
        }
        configuracionRepository.save(configuracion);
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/configuracions"))
                .build();
    }

    @GetMapping("/{id}/edit")
    public Object edit(@PathVariable Long id) {
        Configuracion configuracion = configuracionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Configuracion not found"));
        Map<String, Object> props = new HashMap<>();
        props.put("mode", "update");
        props.put("routeBase", "configuracions");
        props.put("configuracion", configuracion);
        props.put("empresas", empresaRepository.findAll()); // Keep if still needed
        return Inertia.render("Configuracions/Form", props); // Changed to Form as per original logic, or Edit if view
                                                             // name changed
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Configuracion configuracion) {
        configuracion.setId(id);
        configuracionRepository.save(configuracion);
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/configuracions"))
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable Long id) {
        configuracionRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/configuracions"))
                .build();
    }
}
