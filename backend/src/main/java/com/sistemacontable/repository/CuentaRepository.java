package com.sistemacontable.repository;

import com.sistemacontable.entity.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CuentaRepository extends JpaRepository<Cuenta, Integer> {

    // Obtener todas las cuentas que no reciben saldo (válidas como padre)
    List<Cuenta> findByRecibeSaldoFalse();

    // Filtrar por tipo de cuenta
     List<Cuenta> findByTipoCuenta(String tipoCuenta);
    // Filtrar por estado activo
     List<Cuenta> findByActivoTrue();
}


