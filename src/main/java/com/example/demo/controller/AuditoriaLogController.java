package com.example.demo.controller;

import com.example.demo.Inertia;
import com.example.demo.model.AuditoriaLog;
import com.example.demo.service.AuditoriaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/auditoria")
public class AuditoriaLogController {

    private final AuditoriaService auditoriaService;

    public AuditoriaLogController(AuditoriaService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    @GetMapping
    public Object index() {
        Map<String, Object> props = new HashMap<>();
        props.put("auditorialogs", auditoriaService.findAll());
        return Inertia.render("AuditoriaLogs/Index", props);
    }

    @GetMapping("/create")
    public Object create() {
        return Inertia.render("AuditoriaLogs/Create", new HashMap<>());
    }

    @PostMapping
    public ResponseEntity<?> store(@RequestBody AuditoriaLog auditoriaLog) {
        auditoriaService.save(auditoriaLog);
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/auditoria"))
                .build();
    }

    @GetMapping("/{id}/edit")
    public Object edit(@PathVariable Long id) {
        Map<String, Object> props = new HashMap<>();
        props.put("log", auditoriaService.findById(id).orElseThrow());
        return Inertia.render("AuditoriaLogs/Edit", props);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody AuditoriaLog auditoriaLog) {
        auditoriaLog.setId(id);
        auditoriaService.save(auditoriaLog);
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/auditoria"))
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable Long id) {
        auditoriaService.deleteById(id);
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/auditoria"))
                .build();
    }
}
