package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({
        "/", 
        "/dashboard", 
        "/login", 
        "/register", 
        "/clientes/**", 
        "/roles/**", 
        "/users/**", 
        "/profile/**",
        "/configuracion/**"
    })
    public String index() {
        return "index";
    }
}
