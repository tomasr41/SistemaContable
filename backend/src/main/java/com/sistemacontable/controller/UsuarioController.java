package com.sistemacontable.controller;

import com.sistemacontable.dto.RolDto;
import com.sistemacontable.dto.UsuarioRequest;
import com.sistemacontable.dto.UsuarioResponse;
import com.sistemacontable.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestión de usuarios
 * Solo accesible para administradores
 */
@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    /**
     * Obtiene todos los usuarios (solo admin)
     * @return lista de usuarios
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponse>> obtenerUsuarios() {
        try {
            List<UsuarioResponse> usuarios = usuarioService.obtenerTodosLosUsuarios();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Crea un nuevo usuario (solo admin)
     * @param usuarioRequest datos del usuario a crear
     * @return usuario creado
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> crearUsuario(@Valid @RequestBody UsuarioRequest usuarioRequest) {
        try {
            UsuarioResponse usuario = usuarioService.crearUsuario(usuarioRequest);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error interno del servidor");
        }
    }
    
    /**
     * Elimina un usuario (solo admin)
     * @param id ID del usuario a eliminar
     * @return respuesta sin contenido
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Integer id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error interno del servidor");
        }
    }
    
    /**
     * Obtiene todos los roles disponibles (solo admin)
     * @return lista de roles como DTOs
     */
    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RolDto>> obtenerRoles() {
        try {
            List<RolDto> roles = usuarioService.obtenerTodosLosRoles();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}