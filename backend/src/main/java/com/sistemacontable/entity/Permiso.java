package com.sistemacontable.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad que representa la tabla 'permisos' en la base de datos
 */
@Entity
@Table(name = "permisos")
public class Permiso {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "recurso", nullable = false)
    private String recurso;
    
    @Column(name = "accion", nullable = false)
    private String accion;
    
    @ManyToMany(mappedBy = "permisos", fetch = FetchType.LAZY)
    private Set<Role> roles = new HashSet<>();
    
    // Constructor vacío requerido por JPA
    public Permiso() {}
    
    public Permiso(String recurso, String accion) {
        this.recurso = recurso;
        this.accion = accion;
    }
    
    // Getters y Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
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
    
    public Set<Role> getRoles() {
        return roles;
    }
    
    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
}