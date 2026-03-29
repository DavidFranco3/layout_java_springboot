package com.example.demo.controller;

import com.example.demo.model.AuditoriaLog;
import com.example.demo.service.AuditoriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
public class AuditoriaLogController {

    private final AuditoriaService auditoriaService;

    public AuditoriaLogController(AuditoriaService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    @GetMapping
    public List<AuditoriaLog> index() {
        return auditoriaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuditoriaLog> show(@PathVariable Long id) {
        return auditoriaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AuditoriaLog> store(@RequestBody AuditoriaLog auditoriaLog) {
        return ResponseEntity.ok(auditoriaService.save(auditoriaLog));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuditoriaLog> update(@PathVariable Long id, @RequestBody AuditoriaLog auditoriaLog) {
        auditoriaLog.setId(id);
        return ResponseEntity.ok(auditoriaService.save(auditoriaLog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> destroy(@PathVariable Long id) {
        auditoriaService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
