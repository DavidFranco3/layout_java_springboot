package com.example.demo.config;

import com.example.demo.model.Configuracion;
import com.example.demo.model.Empresa;
import com.example.demo.model.User;
import com.example.demo.model.Role;
import com.example.demo.model.Modulo;
import com.example.demo.model.Permission;
import com.example.demo.repository.ConfiguracionRepository;
import com.example.demo.repository.EmpresaRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.repository.ModuloRepository;
import com.example.demo.repository.PermissionRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

@Component
public class DataSeeder {

    @Autowired
    private EmpresaRepository empresaRepository;
    @Autowired
    private ConfiguracionRepository configuracionRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private ModuloRepository moduloRepository;
    @Autowired
    private PermissionRepository permissionRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private jakarta.persistence.EntityManager entityManager;

    @jakarta.transaction.Transactional
    public void runSeeder() {
        System.out.println("Iniciando reparación de integridad de datos...");
        // Reparación manual: Insertar rol admin con ID 1 si no existe para evitar
        // EntityNotFoundException
        try {
            entityManager
                    .createNativeQuery("INSERT IGNORE INTO roles (id, name, guard_name) VALUES (1, 'admin', 'web')")
                    .executeUpdate();
            System.out.println("✅ Reparación de rol ID 1 completada (INSERT IGNORE).");
        } catch (Exception e) {
            System.err.println("⚠️ Error durante la reparación manual: " + e.getMessage());
        }

        // 1. Seed Empresa
        Empresa empresa;
        Optional<Empresa> empresaOptional = empresaRepository.findAll().stream()
                .filter(e -> "tsf".equals(e.getRazon_social()))
                .findFirst();

        if (empresaOptional.isPresent()) {
            empresa = empresaOptional.get();
            System.out.println("Empresa ya existe: " + empresa.getNombre());
        } else {
            empresa = new Empresa();
            empresa.setNombre("tsf");
            empresa.setRazon_social("tsf");
            empresa.setTipoPersona("Moral");
            empresa.setStatus(true);
            empresa = empresaRepository.save(empresa);
            System.out.println("Empresa creada: " + empresa.getNombre());
        }

        // 2. Seed Configuracion
        final Long finalEmpresaId = empresa.getId();
        Optional<Configuracion> configOptional = configuracionRepository.findAll().stream()
                .filter(c -> c.getIdDatosEmpresa() != null && c.getIdDatosEmpresa().equals(finalEmpresaId))
                .findFirst();

        if (configOptional.isPresent()) {
            System.out.println("Configuracion ya existe para la empresa: " + empresa.getNombre());
        } else {
            Configuracion configuracion = new Configuracion();
            configuracion.setIdDatosEmpresa(empresa.getId());
            configuracion.setColores("#1c0cf7ff");
            configuracion.setNombre_comercial("tsf");
            configuracion.setStatus(true);
            configuracionRepository.save(configuracion);
            System.out.println("Configuración creada para la empresa: " + empresa.getNombre());
        }

        // 3. Seed Modulos y Permisos
        String[] moduloNombres = { "Users", "Roles", "Configuracion", "Empresas", "Auditoria" };
        List<Permission> allPermissions = new ArrayList<>();

        for (String modNombre : moduloNombres) {
            Modulo modulo = moduloRepository.findAll().stream()
                    .filter(m -> modNombre.equals(m.getNombre()))
                    .findFirst()
                    .orElse(null);

            if (modulo == null) {
                modulo = new Modulo();
                modulo.setNombre(modNombre);
                modulo.setSlug(modNombre.toLowerCase());
                modulo = moduloRepository.save(modulo);
                System.out.println("Módulo creado: " + modulo.getNombre());
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
                    permission = permissionRepository.save(permission);
                    System.out.println("Permiso creado: " + permName);
                }
                allPermissions.add(permission);
            }
        }

        // 4. Seed Role (Optional, ensuring Admin role exists if needed)
        Optional<Role> roleOptional = roleRepository.findAll().stream()
                .filter(r -> "admin".equals(r.getName()))
                .findFirst();
        Role adminRole;
        if (roleOptional.isPresent()) {
            adminRole = roleOptional.get();
        } else {
            adminRole = new Role();
            adminRole.setName("admin");
            adminRole.setGuardName("web");
        }

        // Assign all permissions to Admin
        adminRole.setPermissions(allPermissions);
        adminRole = roleRepository.save(adminRole);
        System.out.println("Rol admin actualizado con permisos.");

        // 5. Seed User
        Optional<User> userOptional = userRepository.findByEmail("admin@tsf.com");
        if (userOptional.isPresent()) {
            User existingAdmin = userOptional.get();
            existingAdmin.setPassword(passwordEncoder.encode("12345678"));
            userRepository.save(existingAdmin);
            System.out.println("Usuario administrador ya existe. Su hash de contraseña fue actualizado a BCrypt.");
        } else {
            User user = new User();
            user.setName("Administrador");
            user.setEmail("admin@tsf.com");
            // Encode the password properly using BCryptPasswordEncoder
            user.setPassword(passwordEncoder.encode("12345678"));

            user.setRole(adminRole); // Assign the Role

            userRepository.save(user);
            System.out.println("Usuario administrador creado: admin@tsf.com");
        }
    }
}
