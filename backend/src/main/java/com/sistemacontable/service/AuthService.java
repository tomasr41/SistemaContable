package com.sistemacontable.service;

import com.sistemacontable.dto.LoginRequest;
import com.sistemacontable.dto.LoginResponse;
import com.sistemacontable.dto.PermisoDto;
import com.sistemacontable.entity.Permiso;
import com.sistemacontable.entity.Usuario;
import com.sistemacontable.repository.UsuarioRepository;
import com.sistemacontable.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para manejar autenticación y autorización
 */
@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    /**
     * Autentica usuario y genera token JWT
     * @param loginRequest datos de login
     * @return respuesta con token y datos del usuario
     * @throws AuthenticationException si las credenciales son inválidas
     */
    public LoginResponse authenticateUser(LoginRequest loginRequest) throws AuthenticationException {
        // Autenticar usuario
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getNombreUsuario(),
                loginRequest.getContrasena()
            )
        );
        
        // Generar token JWT
        String jwt = jwtUtils.generateJwtToken(loginRequest.getNombreUsuario());
        
        // Obtener usuario completo con rol y permisos
        Usuario usuario = usuarioRepository.findByNombreUsuarioWithRoleAndPermisos(
            loginRequest.getNombreUsuario())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Convertir permisos a DTOs
        List<PermisoDto> permisosDto = usuario.getRol().getPermisos().stream()
            .map(permiso -> new PermisoDto(permiso.getRecurso(), permiso.getAccion()))
            .collect(Collectors.toList());
        
        // Crear respuesta
        return new LoginResponse(
            jwt,
            usuario.getId(),
            usuario.getNombreUsuario(),
            usuario.getRol().getNombre(),
            permisosDto
        );
    }
}