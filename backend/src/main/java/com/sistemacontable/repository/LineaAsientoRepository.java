package com.sistemacontable.repository;

import com.sistemacontable.entity.LineaAsiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LineaAsientoRepository extends JpaRepository<LineaAsiento, Integer> {
    // No hace falta agregar nada más por ahora
}
