package com.example.demo.controller;

import com.example.demo.dto.RoleDTO;
import com.example.demo.service.RoleService;
import com.example.demo.service.PermissionService;
import com.example.demo.service.ModuloService;
import com.example.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/roles")
public class RolesController {

        private final RoleService roleService;
        private final PermissionService permissionService;
        private final ModuloService moduloService;
        private final UserService userService;

        public RolesController(RoleService roleService, PermissionService permissionService,
                        ModuloService moduloService, UserService userService) {
                this.roleService = roleService;
                this.permissionService = permissionService;
                this.moduloService = moduloService;
                this.userService = userService;
        }

        @GetMapping
        public List<RoleDTO> index() {
                return roleService.findAll();
        }

        @GetMapping("/{id}")
        public ResponseEntity<RoleDTO> show(@PathVariable Long id) {
                return roleService.findById(id)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        @PostMapping
        public ResponseEntity<RoleDTO> store(@RequestBody RoleDTO roleDTO) {
                return ResponseEntity.ok(roleService.save(roleDTO));
        }

        @PutMapping("/{id}")
        public ResponseEntity<RoleDTO> update(@PathVariable Long id, @RequestBody RoleDTO roleDTO) {
                roleDTO.setId(id);
                return ResponseEntity.ok(roleService.save(roleDTO));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<?> destroy(@PathVariable Long id) {
                if (userService.countByRoleId(id) > 0) {
                        Map<String, String> errors = new HashMap<>();
                        errors.put("general", "No se puede eliminar el rol porque tiene usuarios asignados.");
                        return ResponseEntity.badRequest().body(errors);
                }

                return roleService.findById(id).map(roleDTO -> {
                        roleDTO.setStatus(0);
                        roleService.save(roleDTO);
                        return ResponseEntity.ok().build();
                }).orElse(ResponseEntity.notFound().build());
        }

        @GetMapping("/getPermisos")
        public Map<String, Object> getPermisos() {
                return Map.of(
                                "success", true,
                                "message", "Permisos encontrados.",
                                "data", permissionService.findAllWithModuloInfo());
        }

        @GetMapping("/getModulos")
        public Map<String, Object> getModulos() {
                return Map.of(
                                "success", true,
                                "message", "Módulos encontrados.",
                                "data", moduloService.findAll());
        }

        @GetMapping("/getRoles")
        public Map<String, Object> getRoles() {
                return Map.of(
                                "success", true,
                                "message", "Roles encontrados.",
                                "data", roleService.findAll());
        }
}
