package com.cybersecurity.auth_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController // Define esta clase como controlador REST
public class HelloController {

    @GetMapping("/hello") // La URL para acceder a esta API será localhost:8080/hello
    public String sayHello() {
        return "¡Hola desde Spring Boot!";
    }

    @PostMapping("/saludo")
    public String saludar(@RequestBody String nombre) {
        return "¡Hola, " + nombre + "!";
    }

}

