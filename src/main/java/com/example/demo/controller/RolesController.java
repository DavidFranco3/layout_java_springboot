package com.example.demo.controller;

import com.example.demo.Inertia;
import com.example.demo.dto.RoleDTO;
import com.example.demo.service.RoleService;
import com.example.demo.service.PermissionService;
import com.example.demo.service.ModuloService;
import com.example.demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/roles")
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
        public Object index() {
                Map<String, Object> props = new HashMap<>();
                props.put("roles", roleService.findAll());
                return Inertia.render("Roles/Index", props);
        }

        @GetMapping("/{id}/edit")
        public Object edit(@PathVariable Long id) {
                Map<String, Object> props = new HashMap<>();
                RoleDTO role = roleService.findById(id).orElseThrow();
                props.put("role", role);
                props.put("permissions", permissionService.findAll());
                return Inertia.render("Roles/Edit", props);
        }

        @GetMapping("/create")
        public Object create() {
                return Inertia.render("Roles/Create", new HashMap<>());
        }

        @PostMapping
        public ResponseEntity<?> store(@RequestBody RoleDTO roleDTO) {
                roleService.save(roleDTO);

                return ResponseEntity.status(HttpStatus.SEE_OTHER)
                                .location(URI.create("/roles"))
                                .build();
        }

        @PutMapping("/{id}")
        public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RoleDTO roleDTO) {
                roleDTO.setId(id);
                roleService.save(roleDTO);

                return ResponseEntity.status(HttpStatus.SEE_OTHER)
                                .location(URI.create("/roles"))
                                .build();
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<?> destroy(@PathVariable Long id, HttpServletRequest request) {
                if (userService.countByRoleId(id) > 0) {
                        Map<String, String> errors = new HashMap<>();
                        errors.put("general", "No se puede eliminar el rol porque tiene usuarios asignados.");
                        request.getSession().setAttribute("errors", errors);
                        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                                        .location(URI.create("/roles"))
                                        .build();
                }

                RoleDTO roleDTO = roleService.findById(id).orElseThrow();
                roleDTO.setStatus(0);
                roleService.save(roleDTO);

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
                                "data", permissionService.findAllWithModuloInfo());
        }

        @GetMapping("/getModulos")
        @ResponseBody
        public Map<String, Object> getModulos() {
                return Map.of(
                                "success", true,
                                "message", "Módulos encontrados.",
                                "data", moduloService.findAll());
        }

        @GetMapping("/getRoles")
        @ResponseBody
        public Map<String, Object> getRoles() {
                return Map.of(
                                "success", true,
                                "message", "Roles encontrados.",
                                "data", roleService.findAll());
        }
}
