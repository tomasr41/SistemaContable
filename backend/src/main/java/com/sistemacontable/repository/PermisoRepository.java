package com.sistemacontable.repository;

import com.sistemacontable.entity.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para gestionar operaciones de la entidad Permiso
 */
@Repository
public interface PermisoRepository extends JpaRepository<Permiso, Integer> {
    
    /**
     * Busca permisos por recurso y acción
     * @param recurso nombre del recurso
     * @param accion acción permitida
     * @return Lista de permisos que coinciden
     */
    List<Permiso> findByRecursoAndAccion(String recurso, String accion);
}