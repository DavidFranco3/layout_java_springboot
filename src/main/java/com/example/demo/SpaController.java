package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.HashMap;

@Controller
public class SpaController {

    @GetMapping("/")
    public Object index() {
        return Inertia.render("Welcome", new HashMap<>());
    }

    @GetMapping("/dashboard")
    public Object dashboard() {
        return Inertia.render("Dashboard", new HashMap<>());
    }

    @GetMapping("/users/create")
    public Object userCreate() {
        return Inertia.render("Users/Create", new HashMap<>());
    }

    @GetMapping("/login")
    public Object login() {
        System.out.println("Executing /login endpoint...");
        return Inertia.render("Auth/Login", new HashMap<>());
    }

    @GetMapping("/register")
    public Object register() {
        return Inertia.render("Auth/Register", new HashMap<>());
    }
}
