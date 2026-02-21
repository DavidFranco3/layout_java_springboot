package com.example.demo.controller;

import com.example.demo.Inertia;
import com.example.demo.model.Empresa;
import com.example.demo.repository.EmpresaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/empresas")
public class EmpresaController {

    private final EmpresaRepository empresaRepository;

    public EmpresaController(EmpresaRepository empresaRepository) {
        this.empresaRepository = empresaRepository;
    }

    @GetMapping
    public Object index() {
        Map<String, Object> props = new HashMap<>();
        props.put("empresas", empresaRepository.findAll());
        return Inertia.render("Empresas/Index", props);
    }

    @GetMapping("/create")
    public Object create() {
        Map<String, Object> props = new HashMap<>();
        props.put("mode", "create");
        props.put("routeBase", "empresas");
        return Inertia.render("Empresas/Form", props);
    }

    @PostMapping
    public ResponseEntity<?> store(@RequestBody Empresa empresa) {
        empresaRepository.save(empresa);
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/empresas"))
                .build();
    }

    @GetMapping("/{id}/edit")
    public Object edit(@PathVariable Long id) {
        Map<String, Object> props = new HashMap<>();
        props.put("empresa", empresaRepository.findById(id).orElseThrow());
        props.put("mode", "update");
        props.put("routeBase", "empresas");
        return Inertia.render("Empresas/Form", props);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Empresa empresa) {
        empresa.setId(id);
        empresaRepository.save(empresa);
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/empresas"))
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable Long id) {
        empresaRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/empresas"))
                .build();
    }
}
