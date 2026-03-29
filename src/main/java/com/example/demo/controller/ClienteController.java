package com.example.demo.controller;

import com.example.demo.dto.ClienteDTO;
import com.example.demo.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    @Autowired
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public List<ClienteDTO> index() {
        return clienteService.findAll();
    }

    @PostMapping
    public ResponseEntity<ClienteDTO> store(@RequestBody ClienteDTO clienteDTO) {
        return ResponseEntity.ok(clienteService.save(clienteDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO> show(@PathVariable Long id) {
        return clienteService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDTO> update(@PathVariable Long id, @RequestBody ClienteDTO updateData) {
        return clienteService.findById(id).map(cliente -> {
            cliente.setNombre(updateData.getNombre());
            return ResponseEntity.ok(clienteService.save(cliente));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> destroy(@PathVariable Long id) {
        clienteService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
