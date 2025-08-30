package com.sistemacontable.repository;

import com.sistemacontable.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para gestionar operaciones de la entidad Usuario
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    /**
     * Busca un usuario por nombre de usuario
     * @param nombreUsuario nombre único del usuario
     * @return Optional con el usuario si existe
     */
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);
    
    /**
     * Verifica si existe un usuario con el nombre de usuario dado
     * @param nombreUsuario nombre a verificar
     * @return true si existe, false si no
     */
    boolean existsByNombreUsuario(String nombreUsuario);
    
    /**
     * Busca usuario con su rol y permisos cargados
     * @param nombreUsuario nombre del usuario
     * @return Optional con usuario y relaciones cargadas
     */
    @Query("SELECT u FROM Usuario u JOIN FETCH u.rol r LEFT JOIN FETCH r.permisos WHERE u.nombreUsuario = :nombreUsuario")
    Optional<Usuario> findByNombreUsuarioWithRoleAndPermisos(String nombreUsuario);
}