package com.example.demo.controller;

import com.example.demo.Inertia;
import com.example.demo.model.Role;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.PermissionRepository;
import com.example.demo.repository.ModuloRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/roles")
public class RolesController {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final ModuloRepository moduloRepository;

    public RolesController(RoleRepository roleRepository, PermissionRepository permissionRepository,
            ModuloRepository moduloRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.moduloRepository = moduloRepository;
    }

    @GetMapping
    public Object index() {
        Map<String, Object> props = new HashMap<>();
        props.put("roles", roleRepository.findAll());
        return Inertia.render("Roles/Index", props);
    }

    @GetMapping("/{id}/edit")
    public Object edit(@PathVariable Long id) {
        Map<String, Object> props = new HashMap<>();
        Role role = roleRepository.findById(id).orElseThrow();
        props.put("role", role);
        props.put("permissions", permissionRepository.findAll());
        return Inertia.render("Roles/Edit", props);
    }

    @GetMapping("/create")
    public Object create() {
        return Inertia.render("Roles/Create", new HashMap<>());
    }

    @PostMapping
    public ResponseEntity<?> store(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        @SuppressWarnings("unchecked")
        List<Integer> permisosIds = (List<Integer>) payload.get("permisos");

        List<Long> permisosLongIds = permisosIds.stream()
                .map(Integer::longValue)
                .toList();

        Role role = new Role();
        role.setName(name);
        role.setPermissions(permissionRepository.findAllById(permisosLongIds));
        roleRepository.save(role);

        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/roles"))
                .build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        @SuppressWarnings("unchecked")
        List<Integer> permisosIds = (List<Integer>) payload.get("permisos");

        List<Long> permisosLongIds = permisosIds.stream()
                .map(Integer::longValue)
                .toList();

        Role role = roleRepository.findById(id).orElseThrow();
        role.setName(name);
        role.setPermissions(permissionRepository.findAllById(permisosLongIds));
        roleRepository.save(role);

        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/roles"))
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable Long id) {
        roleRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .location(URI.create("/roles"))
                .build();
    }

    @GetMapping("/getPermisos")
    @ResponseBody
    public Map<String, Object> getPermisos() {
        return Map.of(
                "success", true,
                "message", "Permisos encontrados.",
                "data", permissionRepository.findAllWithModuloInfo());
    }

    @GetMapping("/getModulos")
    @ResponseBody
    public Map<String, Object> getModulos() {
        return Map.of(
                "success", true,
                "message", "Módulos encontrados.",
                "data", moduloRepository.findAll());
    }

    @GetMapping("/getRoles")
    @ResponseBody
    public Map<String, Object> getRoles() {
        return Map.of(
                "success", true,
                "message", "Roles encontrados.",
                "data", roleRepository.findAll());
    }
}
