package com.sistemacontable.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para recibir datos de creación de usuario desde el frontend
 */
public class UsuarioRequest {
    
    @NotBlank(message = "El nombre de usuario es requerido")
    private String nombreUsuario;
    
    @NotBlank(message = "La contraseña es requerida")
    private String contrasena;
    
    @NotNull(message = "El ID del rol es requerido")
    private Integer rolId;
    
    // Constructor vacío
    public UsuarioRequest() {}
    
    public UsuarioRequest(String nombreUsuario, String contrasena, Integer rolId) {
        this.nombreUsuario = nombreUsuario;
        this.contrasena = contrasena;
        this.rolId = rolId;
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
    
    public Integer getRolId() {
        return rolId;
    }
    
    public void setRolId(Integer rolId) {
        this.rolId = rolId;
    }
}