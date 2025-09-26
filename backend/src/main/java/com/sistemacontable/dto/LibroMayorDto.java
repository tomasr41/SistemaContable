package com.sistemacontable.dto;

import java.math.BigDecimal;
import java.util.List;

public class LibroMayorDto {
    private CuentaDto cuenta;
    private List<AsientoDto> asientos;
    private BigDecimal saldoActual;

    // Getters y setters
    public CuentaDto getCuenta() { return cuenta; }
    public void setCuenta(CuentaDto cuenta) { this.cuenta = cuenta; }

    public List<AsientoDto> getAsientos() { return asientos; }
    public void setAsientos(List<AsientoDto> asientos) { this.asientos = asientos; }

    public BigDecimal getSaldoActual() { return saldoActual; }
    public void setSaldoActual(BigDecimal saldoActual) { this.saldoActual = saldoActual; }
}
