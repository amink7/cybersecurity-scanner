package com.cybersecurity.auth_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Usuario {
    @Id
    private String username;
    private String password;

    // Constructor vacío, getters y setters...
}
