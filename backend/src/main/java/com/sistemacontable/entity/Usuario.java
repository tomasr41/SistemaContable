package com.sistemacontable.entity;

import jakarta.persistence.*;

/**
 * Entidad que representa la tabla 'usuarios' en la base de datos
 * Mapea exactamente la estructura existente
 */
@Entity
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "nombre_usuario", unique = true, nullable = false)
    private String nombreUsuario;
    
    @Column(name = "contrasena", nullable = false)
    private String contrasena;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id")
    private Role rol;
    
    // Constructor vacío requerido por JPA
    public Usuario() {}
    
    public Usuario(String nombreUsuario, String contrasena, Role rol) {
        this.nombreUsuario = nombreUsuario;
        this.contrasena = contrasena;
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
    
    public String getContrasena() {
        return contrasena;
    }
    
    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }
    
    public Role getRol() {
        return rol;
    }
    
    public void setRol(Role rol) {
        this.rol = rol;
    }
}