package com.sistemacontable.repository;

import com.sistemacontable.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para gestionar operaciones de la entidad Role
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    
    /**
     * Busca un rol por nombre
     * @param nombre nombre del rol
     * @return Optional con el rol si existe
     */
    Optional<Role> findByNombre(String nombre);
    
    /**
     * Verifica si existe un rol con el nombre dado
     * @param nombre nombre a verificar
     * @return true si existe, false si no
     */
    boolean existsByNombre(String nombre);
}