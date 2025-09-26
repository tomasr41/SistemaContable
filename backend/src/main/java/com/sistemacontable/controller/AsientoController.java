package com.sistemacontable.controller;

import com.sistemacontable.dto.AsientoDto;
import com.sistemacontable.dto.AsientoRequest;
import com.sistemacontable.dto.LineaAsientoDto;
import com.sistemacontable.entity.Asiento;
import com.sistemacontable.service.AsientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/asientos")
public class AsientoController {

    @Autowired
    private AsientoService asientoService;

    /** POST /api/asientos/crear */
    @PostMapping("/crear")
    public ResponseEntity<?> crearAsiento(@RequestBody AsientoRequest request) {
        try {
            Asiento asientoCreado = asientoService.crearAsiento(request);

            AsientoDto dto = new AsientoDto();
            dto.setId(asientoCreado.getId());
            dto.setFecha(asientoCreado.getFecha());
            dto.setDescripcion(asientoCreado.getDescripcion());
            dto.setNombreUsuario(asientoCreado.getUsuario().getNombreUsuario());

            List<LineaAsientoDto> lineasDto = asientoCreado.getLineas().stream()
                    .map(linea -> {
                        LineaAsientoDto ldto = new LineaAsientoDto();
                        ldto.setCuentaId(linea.getCuenta().getId());
                        ldto.setNombreCuenta(linea.getCuenta().getNombreCuenta());
                        ldto.setDebe(linea.getDebe());
                        ldto.setHaber(linea.getHaber());
                        ldto.setSaldoParcial(linea.getSaldoParcial());
                        return ldto;
                    }).collect(Collectors.toList());

            dto.setLineas(lineasDto);
            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** GET /api/asientos/ultimos?n=5 */
    @GetMapping("/ultimos")
    public ResponseEntity<?> obtenerUltimosAsientos(@RequestParam(name = "n", defaultValue = "5") int n) {
        try {
            return ResponseEntity.ok(asientoService.obtenerUltimosAsientos(n));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // GET /api/asientos/libro-diario?desde=yyyy-MM-dd&hasta=yyyy-MM-dd 
@GetMapping("/libro-diario")
public ResponseEntity<?> obtenerAsientosPorRango(
        @RequestParam("desde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
        @RequestParam("hasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
    try {
        List<AsientoDto> asientos = asientoService.obtenerAsientosPorRangoFechas(desde, hasta);
        return ResponseEntity.ok(asientos);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body(e.getMessage());
    }
}
// GET /api/asientos/libro-mayor/{cuentaId}?desde=yyyy-MM-dd&hasta=yyyy-MM-dd
@GetMapping("/libro-mayor/{cuentaId}")
public ResponseEntity<?> obtenerLibroMayor(
        @PathVariable Integer cuentaId,
        @RequestParam("desde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
        @RequestParam("hasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
    try {
        return ResponseEntity.ok(asientoService.obtenerLibroMayor(cuentaId, desde, hasta));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body(e.getMessage());
    }
}

}

