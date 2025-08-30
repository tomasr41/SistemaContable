package com.sistemacontable.security;

import com.sistemacontable.entity.Permiso;
import com.sistemacontable.entity.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Implementación de UserDetails para integrar con Spring Security
 */
public class UserPrincipal implements UserDetails {
    
    private Integer id;
    private String nombreUsuario;
    private String contrasena;
    private Collection<? extends GrantedAuthority> authorities;
    
    public UserPrincipal(Integer id, String nombreUsuario, String contrasena, 
                        Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.contrasena = contrasena;
        this.authorities = authorities;
    }
    
    /**
     * Crea un UserPrincipal desde una entidad Usuario
     * @param usuario entidad Usuario de la BD
     * @return UserPrincipal para Spring Security
     */
    public static UserPrincipal create(Usuario usuario) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        // Agregar rol como autoridad
        authorities.add(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().getNombre().toUpperCase()));
        
        // Agregar permisos como autoridades
        if (usuario.getRol().getPermisos() != null) {
            for (Permiso permiso : usuario.getRol().getPermisos()) {
                authorities.add(new SimpleGrantedAuthority(
                    permiso.getRecurso().toUpperCase() + "_" + permiso.getAccion().toUpperCase()));
            }
        }
        
        return new UserPrincipal(
            usuario.getId(),
            usuario.getNombreUsuario(),
            usuario.getContrasena(),
            authorities
        );
    }
    
    // Implementación de UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    
    @Override
    public String getPassword() {
        return contrasena;
    }
    
    @Override
    public String getUsername() {
        return nombreUsuario;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }
    
    // Getters adicionales
    public Integer getId() {
        return id;
    }
}