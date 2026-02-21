package com.example.demo.console;

import com.example.demo.config.DataSeeder;
import com.example.demo.model.Modulo;
import com.example.demo.model.Permission;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.ModuloRepository;
import com.example.demo.repository.PermissionRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Component
public class ArtisanCommands implements CommandLineRunner {

    @Autowired
    private ApplicationContext context;

    @Autowired
    private DataSeeder dataSeeder;

    @Autowired
    private ModuloRepository moduloRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (args.length == 0)
            return;

        String command = args[0];

        if ("db:seed".equals(command)) {
            System.out.println("Ejecutando db:seed...");
            dataSeeder.runSeeder();
            System.out.println("✅ Base de datos poblada exitosamente.");
            exitApp();
        } else if ("modulos:scan".equals(command)) {
            System.out.println("Ejecutando modulos:scan...");
            scanModulos();
            exitApp();
        } else if ("admin:asignar".equals(command)) {
            if (args.length < 2) {
                System.out.println("❌ Error: Falta el email del usuario. Uso: admin:asignar <email>");
            } else {
                asignarAdmin(args[1]);
            }
            exitApp();
        } else if ("migrate".equals(command)) {
            System.out.println("Ejecutando migraciones (migrate)...");
            // Flyway / Hibernate ya corrieron al iniciar el contexto de Spring Boot.
            // Por lo que al llegar a esta linea todo ya se proceso.
            System.out.println("✅ Migraciones procesadas correctamente.");
            exitApp();
        }
    }

    private void exitApp() {
        System.exit(SpringApplication.exit(context, () -> 0));
    }

    private void scanModulos() {
        Map<String, Object> controllers = new HashMap<>(context.getBeansWithAnnotation(Controller.class));
        controllers.putAll(context.getBeansWithAnnotation(RestController.class));

        for (Object controller : controllers.values()) {
            String className = controller.getClass().getSimpleName();

            // Si es un proxy manejado por Spring (ej. CGLIB), buscamos la clase original
            if (className.contains("$$")) {
                className = controller.getClass().getSuperclass().getSimpleName();
            }

            if (className.contains("Controller") && !className.equals("BasicErrorController")) {
                String modNombre = className.replace("Controller", "");
                if (modNombre.isEmpty() || modNombre.equals("Spa") || modNombre.equals("BasicError")) {
                    continue; // Skip defaults
                }

                Modulo modulo = moduloRepository.findAll().stream()
                        .filter(m -> modNombre.equals(m.getNombre()))
                        .findFirst()
                        .orElse(null);

                if (modulo == null) {
                    modulo = new Modulo();
                    modulo.setNombre(modNombre);
                    modulo.setSlug(modNombre.toLowerCase());
                    modulo = moduloRepository.save(modulo);
                    System.out.println("📦 Módulo registrado: " + modNombre);
                }

                String[] acciones = { "ver", "crear", "editar", "eliminar" };
                for (String accion : acciones) {
                    String permName = accion + " " + modNombre.toLowerCase();
                    final Modulo currentModulo = modulo;
                    Permission permission = permissionRepository.findAll().stream()
                            .filter(p -> permName.equals(p.getName()))
                            .findFirst()
                            .orElse(null);

                    if (permission == null) {
                        permission = new Permission();
                        permission.setName(permName);
                        permission.setGuardName("web");
                        permission.setModulo(currentModulo);
                        permissionRepository.save(permission);
                        System.out.println(" 🔑 Permiso creado: " + permName);
                    }
                }
            }
        }
        System.out.println("✅ Escaneo de módulos completado.");
    }

    private void asignarAdmin(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            System.out.println("❌ Error: No se encontró un usuario con el email: " + email);
            return;
        }

        Role adminRole = roleRepository.findAll().stream()
                .filter(r -> "admin".equals(r.getName()))
                .findFirst()
                .orElse(null);

        if (adminRole == null) {
            System.out.println("❌ Error: El rol 'admin' no existe. Por favor ejecuta db:seed primero.");
            return;
        }

        user.setRole(adminRole);
        userRepository.save(user);
        System.out.println("✅ El usuario " + email + " ahora tiene el rol de Administrador.");
    }
}
