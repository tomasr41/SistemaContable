package com.sistemacontable.service;

import com.sistemacontable.dto.AsientoDto;
import com.sistemacontable.dto.AsientoRequest;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

    @Transactional
    public Asiento crearAsiento(AsientoRequest request) {
        Asiento asiento = new Asiento();
        asiento.setFecha(LocalDate.parse(request.getFecha(), formatter));
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

    @Transactional(readOnly = true)
    public List<AsientoDto> obtenerUltimosAsientos(int n) {
        List<Asiento> asientos = asientoRepository.findAllByOrderByFechaDescIdDesc(PageRequest.of(0, n));

        return asientos.stream().map(a -> {
            AsientoDto dto = new AsientoDto();
            dto.setId(a.getId());
            dto.setFecha(a.getFecha());
            dto.setDescripcion(a.getDescripcion());
            dto.setNombreUsuario(a.getUsuario().getNombreUsuario());

            List<LineaAsientoDto> lineasDto = a.getLineas().stream().map(l ->
                    new LineaAsientoDto(
                            l.getCuenta().getId(),
                            l.getCuenta().getNombreCuenta(),
                            l.getDebe(),
                            l.getHaber(),
                            l.getSaldoParcial()
                    )
            ).collect(Collectors.toList());

            dto.setLineas(lineasDto);
            return dto;
        }).collect(Collectors.toList());
    }
}


