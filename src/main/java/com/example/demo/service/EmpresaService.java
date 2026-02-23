package com.example.demo.service;

import com.example.demo.annotation.Loggable;
import com.example.demo.dto.EmpresaDTO;
import com.example.demo.mapper.EmpresaMapper;
import com.example.demo.model.Empresa;
import com.example.demo.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final EmpresaMapper empresaMapper;

    @Autowired
    public EmpresaService(EmpresaRepository empresaRepository, EmpresaMapper empresaMapper) {
        this.empresaRepository = empresaRepository;
        this.empresaMapper = empresaMapper;
    }

    public List<EmpresaDTO> findAll() {
        return empresaMapper.toDTOs(empresaRepository.findAll());
    }

    public Optional<EmpresaDTO> findById(Long id) {
        return empresaRepository.findById(id).map(empresaMapper::toDTO);
    }

    @Loggable(model = "Empresa", accion = "GUARDAR")
    public EmpresaDTO save(EmpresaDTO empresaDTO) {
        Empresa empresa = empresaMapper.toEntity(empresaDTO);
        return empresaMapper.toDTO(empresaRepository.save(empresa));
    }

    @Loggable(model = "Empresa", accion = "ELIMINAR")
    public void deleteById(Long id) {
        empresaRepository.deleteById(id);
    }
}
