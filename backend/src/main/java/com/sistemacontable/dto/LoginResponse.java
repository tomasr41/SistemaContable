package com.sistemacontable.dto;

import java.util.List;

/**
 * DTO para enviar respuesta de login al frontend
 * Contiene token JWT y datos del usuario autenticado
 */
public class LoginResponse {
    
    private String token;
    private Integer userId;
    private String nombreUsuario;
    private String rol;
    private List<PermisoDto> permisos;
    
    // Constructor vacío
    public LoginResponse() {}
    
    public LoginResponse(String token, Integer userId, String nombreUsuario, String rol, List<PermisoDto> permisos) {
        this.token = token;
        this.userId = userId;
        this.nombreUsuario = nombreUsuario;
        this.rol = rol;
        this.permisos = permisos;
    }
    
    // Getters y Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
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
    
    public List<PermisoDto> getPermisos() {
        return permisos;
    }
    
    public void setPermisos(List<PermisoDto> permisos) {
        this.permisos = permisos;
    }
}