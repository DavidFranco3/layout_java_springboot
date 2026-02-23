package com.example.demo.mapper;

import com.example.demo.dto.PermissionDTO;
import com.example.demo.model.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    @Mapping(target = "modulo_id", expression = "java(permission.getModulo() != null ? permission.getModulo().getId() : null)")
    @Mapping(target = "modulo_nombre", expression = "java(permission.getModulo() != null ? permission.getModulo().getNombre() : null)")
    PermissionDTO toDTO(Permission permission);

    Permission toEntity(PermissionDTO permissionDTO);

    List<PermissionDTO> toDTOs(List<Permission> permissions);
}
