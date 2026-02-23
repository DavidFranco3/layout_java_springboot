package com.example.demo.mapper;

import com.example.demo.dto.EmpresaDTO;
import com.example.demo.model.Empresa;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EmpresaMapper {
    EmpresaDTO toDTO(Empresa empresa);

    Empresa toEntity(EmpresaDTO empresaDTO);

    List<EmpresaDTO> toDTOs(List<Empresa> empresas);
}
