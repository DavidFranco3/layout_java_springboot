package com.example.demo.service;

import com.example.demo.annotation.Loggable;
import com.example.demo.model.Configuracion;
import com.example.demo.repository.ConfiguracionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConfiguracionService {

    private final ConfiguracionRepository configuracionRepository;

    @Autowired
    public ConfiguracionService(ConfiguracionRepository configuracionRepository) {
        this.configuracionRepository = configuracionRepository;
    }

    public List<Configuracion> findAll() {
        return configuracionRepository.findAll();
    }

    public Optional<Configuracion> findById(Long id) {
        return configuracionRepository.findById(id);
    }

    @Loggable(model = "Configuracion", accion = "GUARDAR")
    public Configuracion save(Configuracion configuracion) {
        return configuracionRepository.save(configuracion);
    }

    @Loggable(model = "Configuracion", accion = "ELIMINAR")
    public void deleteById(Long id) {
        configuracionRepository.deleteById(id);
    }
}
