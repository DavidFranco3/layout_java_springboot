package com.example.demo.mapper;

import com.example.demo.dto.ClienteDTO;
import com.example.demo.model.Cliente;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClienteMapper {

    ClienteDTO toDTO(Cliente cliente);

    Cliente toEntity(ClienteDTO clienteDTO);

    List<ClienteDTO> toDTOs(List<Cliente> clientes);
}
