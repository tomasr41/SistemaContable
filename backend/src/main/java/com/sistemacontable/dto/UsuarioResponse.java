package com.sistemacontable.dto;

/**
 * DTO para enviar datos básicos de usuario en las respuestas
 */
public class UsuarioResponse {
    
    private Integer id;
    private String nombreUsuario;
    private String rol;
    
    // Constructor vacío
    public UsuarioResponse() {}
    
    public UsuarioResponse(Integer id, String nombreUsuario, String rol) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.rol = rol;
    }
    
    // Getters y Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getNombreUsuario() {
        return nombreUsuario;
    }
    
    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }
    
    public String getRol() {
        return rol;
    }
    
    public void setRol(String rol) {
        this.rol = rol;
    }
}