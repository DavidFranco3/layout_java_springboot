package com.example.demo.service;

import com.example.demo.annotation.Loggable;
import com.example.demo.model.Modulo;
import com.example.demo.repository.ModuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ModuloService {

    private final ModuloRepository moduloRepository;

    @Autowired
    public ModuloService(ModuloRepository moduloRepository) {
        this.moduloRepository = moduloRepository;
    }

    public List<Modulo> findAll() {
        return moduloRepository.findAll();
    }

    public Optional<Modulo> findById(Long id) {
        return moduloRepository.findById(id);
    }

    @Loggable(model = "Modulo", accion = "GUARDAR")
    public Modulo save(Modulo modulo) {
        return moduloRepository.save(modulo);
    }

    @Loggable(model = "Modulo", accion = "ELIMINAR")
    public void deleteById(Long id) {
        moduloRepository.deleteById(id);
    }
}
