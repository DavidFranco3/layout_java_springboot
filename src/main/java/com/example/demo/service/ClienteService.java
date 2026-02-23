package com.example.demo.service;

import com.example.demo.annotation.Loggable;
import com.example.demo.dto.ClienteDTO;
import com.example.demo.mapper.ClienteMapper;
import com.example.demo.model.Cliente;
import com.example.demo.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;

    @Autowired
    public ClienteService(ClienteRepository clienteRepository, ClienteMapper clienteMapper) {
        this.clienteRepository = clienteRepository;
        this.clienteMapper = clienteMapper;
    }

    public List<ClienteDTO> findAll() {
        return clienteMapper.toDTOs(clienteRepository.findAll());
    }

    public Optional<ClienteDTO> findById(Long id) {
        return clienteRepository.findById(id).map(clienteMapper::toDTO);
    }

    @Loggable(model = "Cliente", accion = "GUARDAR")
    public ClienteDTO save(ClienteDTO clienteDTO) {
        Cliente cliente = clienteMapper.toEntity(clienteDTO);
        Cliente saved = clienteRepository.save(cliente);
        return clienteMapper.toDTO(saved);
    }

    @Loggable(model = "Cliente", accion = "ELIMINAR")
    public void deleteById(Long id) {
        clienteRepository.deleteById(id);
    }
}
