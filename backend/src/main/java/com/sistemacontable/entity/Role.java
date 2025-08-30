package com.sistemacontable.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad que representa la tabla 'roles' en la base de datos
 * Mapea exactamente la estructura existente
 */
@Entity
@Table(name = "roles")
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "nombre", unique = true, nullable = false)
    private String nombre;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rol_permisos",
        joinColumns = @JoinColumn(name = "rol_id"),
        inverseJoinColumns = @JoinColumn(name = "permiso_id")
    )
    private Set<Permiso> permisos = new HashSet<>();
    
    @OneToMany(mappedBy = "rol", fetch = FetchType.LAZY)
    private Set<Usuario> usuarios = new HashSet<>();
    
    // Constructor vacío requerido por JPA
    public Role() {}
    
    public Role(String nombre) {
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
    
    public Set<Permiso> getPermisos() {
        return permisos;
    }
    
    public void setPermisos(Set<Permiso> permisos) {
        this.permisos = permisos;
    }
    
    public Set<Usuario> getUsuarios() {
        return usuarios;
    }
    
    public void setUsuarios(Set<Usuario> usuarios) {
        this.usuarios = usuarios;
    }
}