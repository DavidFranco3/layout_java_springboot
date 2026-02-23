package com.example.demo.mapper;

import com.example.demo.dto.UserDTO;
import com.example.demo.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "nombre", source = "name")
    @Mapping(target = "rol_id", source = "role.id")
    @Mapping(target = "rol_nombre", source = "role.name")
    @Mapping(target = "email_verified_at", source = "emailVerifiedAt")
    @Mapping(target = "created_at", source = "createdAt")
    @Mapping(target = "updated_at", source = "updatedAt")
    UserDTO toDTO(User user);

    @Mapping(target = "name", source = "nombre")
    @Mapping(target = "role.id", source = "rol_id")
    @Mapping(target = "emailVerifiedAt", source = "email_verified_at")
    @Mapping(target = "createdAt", source = "created_at")
    @Mapping(target = "updatedAt", source = "updated_at")
    User toEntity(UserDTO userDTO);

    List<UserDTO> toDTOs(List<User> users);
}
