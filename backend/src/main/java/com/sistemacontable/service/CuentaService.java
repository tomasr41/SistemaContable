package com.sistemacontable.service;

import com.sistemacontable.dto.CuentaDto;
import com.sistemacontable.dto.CuentaRequest;
import com.sistemacontable.entity.Cuenta;
import com.sistemacontable.repository.CuentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CuentaService {

    @Autowired
    private CuentaRepository cuentaRepository;

    /** Obtener todas las cuentas (incluso inactivas) */
    public List<CuentaDto> obtenerTodasLasCuentas() {
        return cuentaRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    

    /** Obtener solo cuentas activas */
    public List<CuentaDto> obtenerCuentasActivas() {
        return cuentaRepository.findByActivoTrue()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /** Crear cuenta */
    public CuentaDto crearCuenta(CuentaRequest request) {
        Cuenta cuenta = new Cuenta();
        cuenta.setNombreCuenta(request.getNombreCuenta());
        cuenta.setRecibeSaldo(request.getRecibeSaldo());
        cuenta.setTipoCuenta(request.getTipoCuenta());
        cuenta.setActivo(true); // siempre activa al crear
        if (request.getPadreId() != null) {
            Cuenta padre = cuentaRepository.findById(request.getPadreId())
                    .orElseThrow(() -> new IllegalArgumentException("Padre no encontrado"));
            cuenta.setPadre(padre);
        }
        cuenta.setSaldoActual(BigDecimal.ZERO);
        Cuenta creada = cuentaRepository.save(cuenta);
        return mapToDto(creada);
    }

    /** Actualizar campo activo (ocultar/reactivar) */
    public void actualizarActivo(Integer id, boolean activo) {
        Cuenta cuenta = cuentaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cuenta no encontrada"));
        cuenta.setActivo(activo);
        cuentaRepository.save(cuenta);
    }

    /** Obtener cuentas válidas como padre (recibeSaldo = false) */
    public List<CuentaDto> obtenerCuentasPadreValidas() {
        return cuentaRepository.findAll()
                .stream()
                .filter(c -> !c.getRecibeSaldo() && Boolean.TRUE.equals(c.getActivo()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /** Mapper entity -> DTO */
    /** Mapper entity -> DTO */
private CuentaDto mapToDto(Cuenta c) {
    return new CuentaDto(
            c.getId(),
            c.getNombreCuenta(),
            c.getRecibeSaldo(),
            c.getTipoCuenta(),
            c.getPadre() != null ? c.getPadre().getId() : null,
            c.getSaldoActual(),
            c.getActivo() 
    );
}

}


