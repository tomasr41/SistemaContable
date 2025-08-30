package com.sistemacontable.dto;

/**
 * DTO para representar roles en las respuestas del API
 */
public class RolDto {
    
    private Integer id;
    private String nombre;
    
    // Constructor vacío
    public RolDto() {}
    
    public RolDto(Integer id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
    
    // Getters y Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}