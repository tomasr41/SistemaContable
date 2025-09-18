package com.sistemacontable.controller;


import com.sistemacontable.dto.AsientoDto;
import com.sistemacontable.dto.AsientoRequest;
import com.sistemacontable.dto.LineaAsientoDto;
import com.sistemacontable.entity.Asiento;
import com.sistemacontable.service.AsientoService;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/asientos")
public class AsientoController {

    @Autowired
    private AsientoService asientoService;

  @PostMapping("/crear")
public ResponseEntity<?> crearAsiento(@RequestBody AsientoRequest request) {
    try {
        // Guardar asiento en la BDD
        Asiento asientoCreado = asientoService.crearAsiento(request);

        // Convertir entidad a DTO
        AsientoDto dto = new AsientoDto();
        dto.setId(asientoCreado.getId());
        dto.setFecha(asientoCreado.getFecha());
        dto.setDescripcion(asientoCreado.getDescripcion());
        dto.setNombreUsuario(asientoCreado.getUsuario().getNombreUsuario());

        List<LineaAsientoDto> lineasDto = asientoCreado.getLineas().stream()
            .map(linea -> {
                LineaAsientoDto ldto = new LineaAsientoDto();
                ldto.setCuentaId(linea.getCuenta().getId());
                ldto.setDebe(linea.getDebe());
                ldto.setHaber(linea.getHaber());
                ldto.setSaldoParcial(linea.getSaldoParcial());
                return ldto;
            })
            .collect(Collectors.toList()); // <- usar Collectors.toList() para compatibilidad
        dto.setLineas(lineasDto);

        return ResponseEntity.ok(dto);

    } catch (Exception e) {
        e.printStackTrace(); // Para debug en consola
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
}
