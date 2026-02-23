package com.example.demo.controller;

import com.example.demo.dto.ClienteDTO;
import com.example.demo.service.ClienteService;
import com.example.demo.Inertia;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

@Controller
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    @Autowired
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public Object index() {
        return Inertia.render("Clientes/Index", Map.of(
                "clientes", clienteService.findAll()));
    }

    @GetMapping("/create")
    public Object create() {
        return Inertia.render("Clientes/Form", Map.of(
                "mode", "create",
                "routeBase", "clientes"));
    }

    @PostMapping
    public String store(@ModelAttribute ClienteDTO clienteDTO) {
        clienteService.save(clienteDTO);
        return "redirect:/clientes";
    }

    @GetMapping("/{id}/edit")
    public Object edit(@PathVariable Long id) {
        return clienteService.findById(id)
                .map(cliente -> Inertia.render("Clientes/Form", Map.of(
                        "mode", "update",
                        "routeBase", "clientes",
                        "cliente", cliente)))
                .orElseGet(() -> new ModelAndView("redirect:/clientes"));
    }

    @PutMapping("/{id}")
    public String update(@PathVariable Long id, @ModelAttribute ClienteDTO updateData) {
        return clienteService.findById(id).map(cliente -> {
            cliente.setCampoEjemplo(updateData.getCampoEjemplo());
            clienteService.save(cliente);
            return "redirect:/clientes";
        }).orElse("redirect:/clientes");
    }

    @DeleteMapping("/{id}")
    public String destroy(@PathVariable Long id) {
        clienteService.deleteById(id);
        return "redirect:/clientes";
    }
}
