package com.sistemacontable.controller;

import com.sistemacontable.dto.LoginRequest;
import com.sistemacontable.dto.LoginResponse;
import com.sistemacontable.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para manejo de autenticación
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    /**
     * Endpoint para login de usuarios
     * @param loginRequest datos de login (usuario y contraseña)
     * @return respuesta con token JWT y datos del usuario
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse loginResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(loginResponse);
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest()
                .body("Error: Credenciales inválidas");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error: " + e.getMessage());
        }
    }
}