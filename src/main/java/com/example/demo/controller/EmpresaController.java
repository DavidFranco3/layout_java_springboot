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
import jakarta.servlet.http.HttpServletRequest;
import com.example.demo.service.AuditoriaService;

@Controller
@RequestMapping("/empresas")
public class EmpresaController {

    private final EmpresaRepository empresaRepository;
    private final AuditoriaService auditoriaService;

    public EmpresaController(EmpresaRepository empresaRepository, AuditoriaService auditoriaService) {
        this.empresaRepository = empresaRepository;
        this.auditoriaService = auditoriaService;
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
    public ResponseEntity<?> store(@RequestBody Empresa empresa, HttpServletRequest request) {
        empresa = empresaRepository.save(empresa);

        Map<String, Object> newData = new HashMap<>();
        newData.put("nombre", empresa.getNombre());
        newData.put("razon_social", empresa.getRazon_social());
        newData.put("tipoPersona", empresa.getTipoPersona());
        newData.put("status", empresa.getStatus());

        auditoriaService.registrarAuditoria(
                "POST",
                "Empresa",
                empresa.getId(),
                null,
                newData,
                "Creación de empresa",
                request);

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
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Empresa empresa, HttpServletRequest request) {
        Empresa currentEmpresa = empresaRepository.findById(id).orElseThrow();

        Map<String, Object> oldData = new HashMap<>();
        oldData.put("nombre", currentEmpresa.getNombre());
        oldData.put("razon_social", currentEmpresa.getRazon_social());
        oldData.put("tipoPersona", currentEmpresa.getTipoPersona());
        oldData.put("status", currentEmpresa.getStatus());

        empresa.setId(id);
        empresaRepository.save(empresa);

        Map<String, Object> newData = new HashMap<>();
        newData.put("nombre", empresa.getNombre());
        newData.put("razon_social", empresa.getRazon_social());
        newData.put("tipoPersona", empresa.getTipoPersona());
        newData.put("status", empresa.getStatus());

        auditoriaService.registrarAuditoria(
                "PUT",
                "Empresa",
                empresa.getId(),
                oldData,
                newData,
                "Actualización de empresa",
                request);

        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/empresas"))
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable Long id, HttpServletRequest request) {
        Empresa empresa = empresaRepository.findById(id).orElseThrow();

        Map<String, Object> oldData = new HashMap<>();
        oldData.put("nombre", empresa.getNombre());
        oldData.put("razon_social", empresa.getRazon_social());
        oldData.put("tipoPersona", empresa.getTipoPersona());
        oldData.put("status", empresa.getStatus());

        auditoriaService.registrarAuditoria(
                "DELETE",
                "Empresa",
                empresa.getId(),
                oldData,
                null,
                "Eliminación de empresa",
                request);

        empresa.setStatus(0);
        empresaRepository.save(empresa);
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/empresas"))
                .build();
    }
}
