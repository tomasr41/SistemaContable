package com.sistemacontable.service;

import com.sistemacontable.dto.RolDto;
import com.sistemacontable.dto.UsuarioRequest;
import com.sistemacontable.dto.UsuarioResponse;
import com.sistemacontable.entity.Role;
import com.sistemacontable.entity.Usuario;
import com.sistemacontable.repository.RoleRepository;
import com.sistemacontable.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar operaciones de usuarios
 */
@Service
@Transactional
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    /**
     * Obtiene todos los usuarios del sistema
     * @return lista de usuarios como DTOs
     */
    public List<UsuarioResponse> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll().stream()
            .map(usuario -> new UsuarioResponse(
                usuario.getId(),
                usuario.getNombreUsuario(),
                usuario.getRol().getNombre()
            ))
            .collect(Collectors.toList());
    }
    
    /**
     * Crea un nuevo usuario en el sistema
     * @param usuarioRequest datos del usuario a crear
     * @return usuario creado como DTO
     * @throws RuntimeException si el username ya existe o el rol no existe
     */
    public UsuarioResponse crearUsuario(UsuarioRequest usuarioRequest) {
        // Verificar que el nombre de usuario no exista
        if (usuarioRepository.existsByNombreUsuario(usuarioRequest.getNombreUsuario())) {
            throw new RuntimeException("El nombre de usuario ya existe");
        }
        
        // Buscar el rol
        Role rol = roleRepository.findById(usuarioRequest.getRolId())
            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        
        // Crear usuario con contraseña hasheada
        Usuario usuario = new Usuario(
            usuarioRequest.getNombreUsuario(),
            usuarioRequest.getContrasena(), // Sin encriptar para simplicidad
            rol
        );
        
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        
        return new UsuarioResponse(
            usuarioGuardado.getId(),
            usuarioGuardado.getNombreUsuario(),
            usuarioGuardado.getRol().getNombre()
        );
    }
    
    /**
     * Elimina un usuario del sistema
     * @param usuarioId ID del usuario a eliminar
     * @throws RuntimeException si el usuario no existe
     */
    public void eliminarUsuario(Integer usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        usuarioRepository.deleteById(usuarioId);
    }
    
    /**
     * Obtiene todos los roles disponibles
     * @return lista de roles como DTOs
     */
    public List<RolDto> obtenerTodosLosRoles() {
        return roleRepository.findAll().stream()
            .map(rol -> new RolDto(rol.getId(), rol.getNombre()))
            .collect(Collectors.toList());
    }
}