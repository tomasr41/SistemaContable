package com.sistemacontable.repository;

import com.sistemacontable.entity.Asiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface AsientoRepository extends JpaRepository<Asiento, Integer> {

    // Método para traer los últimos 'n' asientos, ordenados por fecha descendente y luego por id descendente
    List<Asiento> findAllByOrderByFechaDescIdDesc(Pageable pageable);
}