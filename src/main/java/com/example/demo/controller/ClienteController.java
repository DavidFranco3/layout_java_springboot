package com.example.demo.controller;

import com.example.demo.model.Cliente;
import com.example.demo.repository.ClienteRepository;
import com.example.demo.Inertia;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

@Controller
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping
    public Object index() {
        return Inertia.render("Clientes/Index", Map.of(
                "clientes", clienteRepository.findAll()));
    }

    @GetMapping("/create")
    public Object create() {
        return Inertia.render("Clientes/Form", Map.of(
                "mode", "create",
                "routeBase", "clientes"));
    }

    @PostMapping
    public String store(@ModelAttribute Cliente cliente) {
        clienteRepository.save(cliente);
        return "redirect:/clientes";
    }

    @GetMapping("/{id}/edit")
    public Object edit(@PathVariable Long id) {
        return clienteRepository.findById(id)
                .map(cliente -> Inertia.render("Clientes/Form", Map.of(
                        "mode", "update",
                        "routeBase", "clientes",
                        "cliente", cliente)))
                .orElseGet(() -> new ModelAndView("redirect:/clientes"));
    }

    @PutMapping("/{id}")
    public String update(@PathVariable Long id, @ModelAttribute Cliente updateData) {
        return clienteRepository.findById(id).map(cliente -> {
            cliente.setCampoEjemplo(updateData.getCampoEjemplo());
            clienteRepository.save(cliente);
            return "redirect:/clientes";
        }).orElse("redirect:/clientes");
    }

    @DeleteMapping("/{id}")
    public String destroy(@PathVariable Long id) {
        clienteRepository.deleteById(id);
        return "redirect:/clientes";
    }
}
