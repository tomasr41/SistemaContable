package com.sistemacontable.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para recibir datos de login desde el frontend
 */
public class LoginRequest {
    
    @NotBlank(message = "El nombre de usuario es requerido")
    private String nombreUsuario;
    
    @NotBlank(message = "La contraseña es requerida")
    private String contrasena;
    
    // Constructor vacío
    public LoginRequest() {}
    
    public LoginRequest(String nombreUsuario, String contrasena) {
        this.nombreUsuario = nombreUsuario;
        this.contrasena = contrasena;
    }
    
    // Getters y Setters
    public String getNombreUsuario() {
        return nombreUsuario;
    }
    
    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }
    
    public String getContrasena() {
        return contrasena;
    }
    
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
}