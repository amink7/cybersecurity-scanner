package com.cybersecurity.auth_service.service;

import com.cybersecurity.auth_service.model.Usuario;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UsuarioService {
    private final List<Usuario> usuarios = new ArrayList<>();

    public void registrarUsuario(Usuario usuario) {
        usuarios.add(usuario);
    }

    public Usuario buscarUsuario(String username, String password) {
        return usuarios.stream()
                .filter(u -> u.getUsername().equals(username) && u.getPassword().equals(password))
                .findFirst().orElse(null);
    }

    public List<Usuario> obtenerUsuarios() {
        return usuarios;
    }
}
