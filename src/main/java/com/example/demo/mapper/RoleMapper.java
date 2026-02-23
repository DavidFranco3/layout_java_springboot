package com.example.demo.mapper;

import com.example.demo.dto.RoleDTO;
import com.example.demo.model.Role;
import com.example.demo.model.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", imports = { Permission.class, java.util.stream.Collectors.class })
public interface RoleMapper {
    @Mapping(target = "permisos", expression = "java(role.getPermissions() != null ? role.getPermissions().stream().map(Permission::getId).collect(Collectors.toList()) : null)")
    RoleDTO toDTO(Role role);

    @Mapping(target = "permissions", ignore = true)
    Role toEntity(RoleDTO roleDTO);

    List<RoleDTO> toDTOs(List<Role> roles);
}
