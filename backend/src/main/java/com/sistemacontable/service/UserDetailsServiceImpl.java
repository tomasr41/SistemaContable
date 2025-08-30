package com.sistemacontable.service;

import com.sistemacontable.entity.Usuario;
import com.sistemacontable.repository.UsuarioRepository;
import com.sistemacontable.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio para cargar detalles del usuario para Spring Security
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String nombreUsuario) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByNombreUsuarioWithRoleAndPermisos(nombreUsuario)
                .orElseThrow(() -> new UsernameNotFoundException(
                    "Usuario no encontrado: " + nombreUsuario));
        
        return UserPrincipal.create(usuario);
    }
}