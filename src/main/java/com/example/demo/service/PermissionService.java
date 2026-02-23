package com.example.demo.service;

import com.example.demo.annotation.Loggable;
import com.example.demo.dto.PermissionDTO;
import com.example.demo.mapper.PermissionMapper;
import com.example.demo.model.Permission;
import com.example.demo.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    @Autowired
    public PermissionService(PermissionRepository permissionRepository, PermissionMapper permissionMapper) {
        this.permissionRepository = permissionRepository;
        this.permissionMapper = permissionMapper;
    }

    public List<PermissionDTO> findAll() {
        return permissionMapper.toDTOs(permissionRepository.findAll());
    }

    public Optional<PermissionDTO> findById(Long id) {
        return permissionRepository.findById(id).map(permissionMapper::toDTO);
    }

    @Loggable(model = "Permiso", accion = "GUARDAR")
    public PermissionDTO save(PermissionDTO permissionDTO) {
        Permission permission = permissionMapper.toEntity(permissionDTO);
        return permissionMapper.toDTO(permissionRepository.save(permission));
    }

    @Loggable(model = "Permiso", accion = "ELIMINAR")
    public void deleteById(Long id) {
        permissionRepository.deleteById(id);
    }

    public List<Permission> findAllById(List<Long> ids) {
        return permissionRepository.findAllById(ids);
    }

    public List<Map<String, Object>> findAllWithModuloInfo() {
        return permissionRepository.findAllWithModuloInfo();
    }
}
