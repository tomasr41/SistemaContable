package com.sistemacontable.service;

import com.sistemacontable.dto.AsientoDto;
import com.sistemacontable.dto.AsientoRequest;
import com.sistemacontable.dto.CuentaDto;
import com.sistemacontable.dto.LibroMayorDto;
import com.sistemacontable.dto.LineaAsientoDto;
import com.sistemacontable.dto.LineaAsientoRequest;
import com.sistemacontable.entity.Asiento;
import com.sistemacontable.entity.Cuenta;
import com.sistemacontable.entity.LineaAsiento;
import com.sistemacontable.entity.Usuario;
import com.sistemacontable.repository.AsientoRepository;
import com.sistemacontable.repository.CuentaRepository;
import com.sistemacontable.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AsientoService {

    @Autowired
    private AsientoRepository asientoRepository;

    @Autowired
    private CuentaRepository cuentaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // Crear asiento
@Transactional
public Asiento crearAsiento(AsientoRequest request) {
    Asiento asiento = new Asiento();
    LocalDate fecha = LocalDate.parse(request.getFecha(), formatter);

    // Validación de fecha: no futura y máximo 7 días atrás
    LocalDate hoy = LocalDate.now();
    LocalDate hace7Dias = hoy.minusDays(7);
    if (fecha.isAfter(hoy) || fecha.isBefore(hace7Dias)) {
        throw new IllegalArgumentException(
            "La fecha del asiento debe estar dentro de los últimos 7 días y no puede ser futura"
        );
    }

    asiento.setFecha(fecha);
    asiento.setDescripcion(request.getDescripcion());

    Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    asiento.setUsuario(usuario);

    Set<LineaAsiento> lineas = new HashSet<>();

    for (LineaAsientoRequest lineaRequest : request.getLineas()) {
        Cuenta cuenta = cuentaRepository.findById(lineaRequest.getCuentaId())
                .orElseThrow(() -> new IllegalArgumentException("Cuenta no encontrada: " + lineaRequest.getCuentaId()));

        BigDecimal debe = lineaRequest.getDebe() != null ? lineaRequest.getDebe() : BigDecimal.ZERO;
        BigDecimal haber = lineaRequest.getHaber() != null ? lineaRequest.getHaber() : BigDecimal.ZERO;

        // Calcular saldo parcial según tipo de cuenta
        BigDecimal saldoParcial;
        switch (cuenta.getTipoCuenta()) {
            case "Activo":
            case "R-":      // egresos/gastos
                saldoParcial = cuenta.getSaldoActual().add(debe).subtract(haber);
                break;
            case "Pasivo":
            case "Patrimonio":
            case "R+":      // ingresos
                saldoParcial = cuenta.getSaldoActual().add(haber).subtract(debe);
                break;
            default:
                throw new IllegalArgumentException("Tipo de cuenta desconocido: " + cuenta.getTipoCuenta());
        }

        LineaAsiento linea = new LineaAsiento();
        linea.setAsiento(asiento);
        linea.setCuenta(cuenta);
        linea.setDebe(debe);
        linea.setHaber(haber);
        linea.setSaldoParcial(saldoParcial);

        cuenta.setSaldoActual(saldoParcial);
        cuentaRepository.save(cuenta);

        lineas.add(linea);
    }

    asiento.setLineas(lineas);
    return asientoRepository.save(asiento);
}


    // Obtener últimos n asientos
    @Transactional(readOnly = true)
    public List<AsientoDto> obtenerUltimosAsientos(int n) {
        List<Asiento> asientos = asientoRepository.findAllByOrderByFechaDescIdDesc(PageRequest.of(0, n));
        return asientos.stream().map(this::convertirADto).collect(Collectors.toList());
    }

    // Obtener asientos por rango de fechas
    @Transactional(readOnly = true)
    public List<AsientoDto> obtenerAsientosPorRangoFechas(LocalDate desde, LocalDate hasta) {
        List<Asiento> asientos = asientoRepository.findByFechaBetweenOrderByFechaAscIdAsc(desde, hasta);
        return asientos.stream().map(this::convertirADto).collect(Collectors.toList());
    }

    // Método auxiliar null-safe para convertir Asiento a DTO
    private AsientoDto convertirADto(Asiento a) {
    AsientoDto dto = new AsientoDto();
    dto.setId(a.getId());
    dto.setFecha(a.getFecha());
    dto.setDescripcion(a.getDescripcion());
    dto.setNombreUsuario(a.getUsuario().getNombreUsuario());

    // Convertir lineas correctamente tipadas
    List<LineaAsientoDto> lineasDto = a.getLineas().stream()
            .map(linea -> new LineaAsientoDto(
                    linea.getCuenta().getId(),
                    linea.getCuenta().getNombreCuenta(),
                    linea.getDebe(),
                    linea.getHaber(),
                    linea.getSaldoParcial()
            ))
            .collect(Collectors.toList());

    dto.setLineas(lineasDto);

    return dto;
}

// Obtener libro mayor para una cuenta en un rango de fechas
@Transactional(readOnly = true)
public LibroMayorDto obtenerLibroMayor(Integer cuentaId, LocalDate desde, LocalDate hasta) {
    // 1. Traer la cuenta
    Cuenta cuenta = cuentaRepository.findById(cuentaId)
            .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

    // 2. Calcular saldo inicial (antes de 'desde')
    BigDecimal saldoInicial = calcularSaldoInicial(cuenta, desde, hasta);

    // 3. Traer los asientos con líneas de esa cuenta en el rango de fechas
    List<Asiento> asientos = asientoRepository.findAsientosByCuentaAndFechas(cuentaId, desde, hasta);

    // 4. Mapear a DTOs
    List<AsientoDto> asientoDtos = asientos.stream().map(asiento -> {
        AsientoDto dto = new AsientoDto();
        dto.setId(asiento.getId());
        dto.setFecha(asiento.getFecha());
        dto.setDescripcion(asiento.getDescripcion());
        dto.setNombreUsuario(asiento.getUsuario().getNombreUsuario());

        List<LineaAsientoDto> lineasDto = asiento.getLineas().stream()
                .filter(l -> l.getCuenta().getId().equals(cuentaId))
                .map(l -> new LineaAsientoDto(
                        l.getCuenta().getId(),
                        l.getCuenta().getNombreCuenta(),
                        l.getDebe(),
                        l.getHaber(),
                        l.getSaldoParcial() // ya calculado al crear el asiento
                )).collect(Collectors.toList());

        dto.setLineas(lineasDto);
        return dto;
    }).collect(Collectors.toList());

    // 5. Construir el LibroMayorDto
    LibroMayorDto libroMayor = new LibroMayorDto();
    libroMayor.setCuenta(new CuentaDto(
            cuenta.getId(),
            cuenta.getNombreCuenta(),
            cuenta.getRecibeSaldo(),
            cuenta.getTipoCuenta(),
            cuenta.getPadre() != null ? cuenta.getPadre().getId() : null,  
            cuenta.getSaldoActual(),
            cuenta.getActivo()
    ));
    libroMayor.setAsientos(asientoDtos);
    libroMayor.setSaldoActual(cuenta.getSaldoActual());
    libroMayor.setSaldoInicial(saldoInicial);  // <-- saldo inicial corregido

    return libroMayor;
}

// Método auxiliar para calcular saldo inicial
private BigDecimal calcularSaldoInicial(Cuenta cuenta, LocalDate desde, LocalDate hasta) {
    // Traer todos los asientos dentro del rango consultado
    List<Asiento> posteriores = asientoRepository.findAsientosByCuentaAndFechas(
            cuenta.getId(),
            desde,
            hasta
    );

    BigDecimal movimientosDesde = BigDecimal.ZERO;

    for (Asiento a : posteriores) {
        for (LineaAsiento l : a.getLineas()) {
            if (l.getCuenta().getId().equals(cuenta.getId())) {
                switch (cuenta.getTipoCuenta()) {
                    case "Activo":
                    case "R-":
                        movimientosDesde = movimientosDesde.add(l.getDebe()).subtract(l.getHaber());
                        break;
                    case "Pasivo":
                    case "Patrimonio":
                    case "R+":
                        movimientosDesde = movimientosDesde.add(l.getHaber()).subtract(l.getDebe());
                        break;
                }
            }
        }
    }

    // Saldo inicial = saldo actual - movimientos dentro del rango
    return cuenta.getSaldoActual().subtract(movimientosDesde);
}


}



