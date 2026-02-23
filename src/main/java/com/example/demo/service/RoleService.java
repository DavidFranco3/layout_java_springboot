package com.example.demo.service;

import com.example.demo.annotation.Loggable;
import com.example.demo.dto.RoleDTO;
import com.example.demo.mapper.RoleMapper;
import com.example.demo.model.Role;
import com.example.demo.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;
    private final PermissionService permissionService;

    @Autowired
    public RoleService(RoleRepository roleRepository, RoleMapper roleMapper, PermissionService permissionService) {
        this.roleRepository = roleRepository;
        this.roleMapper = roleMapper;
        this.permissionService = permissionService;
    }

    public List<RoleDTO> findAll() {
        return roleMapper.toDTOs(roleRepository.findAll());
    }

    public Optional<RoleDTO> findById(Long id) {
        return roleRepository.findById(id).map(roleMapper::toDTO);
    }

    @Loggable(model = "Rol", accion = "GUARDAR")
    public RoleDTO save(RoleDTO roleDTO) {
        Role role = roleMapper.toEntity(roleDTO);
        if (roleDTO.getPermisos() != null) {
            role.setPermissions(permissionService.findAllById(roleDTO.getPermisos()));
        }
        return roleMapper.toDTO(roleRepository.save(role));
    }

    @Loggable(model = "Rol", accion = "ELIMINAR")
    public void deleteById(Long id) {
        roleRepository.deleteById(id);
    }
}
