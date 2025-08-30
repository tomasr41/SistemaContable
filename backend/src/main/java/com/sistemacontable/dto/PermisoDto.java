package com.sistemacontable.dto;

/**
 * DTO para representar permisos en las respuestas del API
 */
public class PermisoDto {
    
    private String recurso;
    private String accion;
    
    // Constructor vacío
    public PermisoDto() {}
    
    public PermisoDto(String recurso, String accion) {
        this.recurso = recurso;
        this.accion = accion;
    }
    
    // Getters y Setters
    public String getRecurso() {
        return recurso;
    }
    
    public void setRecurso(String recurso) {
        this.recurso = recurso;
    }
    
    public String getAccion() {
        return accion;
    }
    
    public void setAccion(String accion) {
        this.accion = accion;
    }
}