package com.example.demo.controller;

import com.example.demo.dto.EmpresaDTO;
import com.example.demo.service.EmpresaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    @GetMapping
    public List<EmpresaDTO> index() {
        return empresaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaDTO> show(@PathVariable Long id) {
        return empresaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<EmpresaDTO> store(@RequestBody EmpresaDTO empresaDTO) {
        return ResponseEntity.ok(empresaService.save(empresaDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpresaDTO> update(@PathVariable Long id, @RequestBody EmpresaDTO empresaDTO) {
        empresaDTO.setId(id);
        return ResponseEntity.ok(empresaService.save(empresaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> destroy(@PathVariable Long id) {
        return empresaService.findById(id).map(empresa -> {
            empresa.setStatus(0);
            empresaService.save(empresa);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
