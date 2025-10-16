package com.sistemacontable.repository;

import com.sistemacontable.entity.Asiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.repository.query.Param;

@Repository
public interface AsientoRepository extends JpaRepository<Asiento, Integer> {

    // últimos 'n' asientos
    List<Asiento> findAllByOrderByFechaDescIdDesc(Pageable pageable);

    // asientos entre dos fechas (libro diario)
    List<Asiento> findByFechaBetweenOrderByFechaAscIdAsc(LocalDate desde, LocalDate hasta);

   
    // trae asientos que tengan línea para una cuenta específica entre dos fechas
    @Query("SELECT DISTINCT a FROM Asiento a " +
           "JOIN a.lineas l " +
           "WHERE l.cuenta.id = :cuentaId " +
           "AND a.fecha BETWEEN :desde AND :hasta " +
           "ORDER BY a.fecha ASC, a.id ASC")
    List<Asiento> findAsientosByCuentaAndFechas(
            @Param("cuentaId") Integer cuentaId,
            @Param("desde") LocalDate desde,
            @Param("hasta") LocalDate hasta);

       // devuelve la fecha del último asiento registrado
       @Query("SELECT MAX(a.fecha) FROM Asiento a")
       LocalDate findUltimaFechaAsiento();
}