package com.sistemacontable.controller;

import com.sistemacontable.dto.CuentaDto;
import com.sistemacontable.dto.CuentaRequest;
import com.sistemacontable.service.CuentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cuentas")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH})
public class CuentaController {

    @Autowired
    private CuentaService cuentaService;

    /** Obtener todas las cuentas (lista plana) */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('PLAN-CUENTAS_VER', 'PLAN-CUENTAS_GESTIONAR')")
    public ResponseEntity<List<CuentaDto>> obtenerCuentas() {
        try {
            return ResponseEntity.ok(cuentaService.obtenerTodasLasCuentas());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    /** Obtener cuentas activas */
    @GetMapping("/activas")
    @PreAuthorize("hasAnyAuthority('PLAN-CUENTAS_VER', 'PLAN-CUENTAS_GESTIONAR')")
    public ResponseEntity<List<CuentaDto>> obtenerCuentasActivas() {
        try {
            return ResponseEntity.ok(cuentaService.obtenerCuentasActivas());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /** Crear una nueva cuenta */
    @PostMapping
    @PreAuthorize("hasAuthority('PLAN-CUENTAS_GESTIONAR')")
    public ResponseEntity<CuentaDto> crearCuenta(@RequestBody CuentaRequest request) {
        try {
            CuentaDto creada = cuentaService.crearCuenta(request);
            return ResponseEntity.ok(creada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    /** Cambiar estado activo (ocultar/reactivar) */
    @PatchMapping("/{id}/activo")
    @PreAuthorize("hasAuthority('PLAN-CUENTAS_GESTIONAR')")
    public ResponseEntity<Void> actualizarActivo(@PathVariable Integer id, @RequestBody Map<String, Boolean> body) {
        try {
            Boolean activo = body.get("activo");
            if (activo == null) throw new IllegalArgumentException("Activo no enviado");
            cuentaService.actualizarActivo(id, activo);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}


