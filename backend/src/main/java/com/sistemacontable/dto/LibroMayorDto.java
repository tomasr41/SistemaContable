package com.sistemacontable.dto;

import java.math.BigDecimal;
import java.util.List;

public class LibroMayorDto {

    private CuentaDto cuenta;
    private List<AsientoDto> asientos;

    // Saldo acumulado hasta la fecha "desde - 1"
    private BigDecimal saldoInicial;

    // Saldo actual de la cuenta (hasta hoy)
    private BigDecimal saldoActual;

    // Getters y setters
    public CuentaDto getCuenta() {
        return cuenta;
    }

    public void setCuenta(CuentaDto cuenta) {
        this.cuenta = cuenta;
    }

    public List<AsientoDto> getAsientos() {
        return asientos;
    }

    public void setAsientos(List<AsientoDto> asientos) {
        this.asientos = asientos;
    }

    public BigDecimal getSaldoInicial() {
        return saldoInicial;
    }

    public void setSaldoInicial(BigDecimal saldoInicial) {
        this.saldoInicial = saldoInicial;
    }

    public BigDecimal getSaldoActual() {
        return saldoActual;
    }

    public void setSaldoActual(BigDecimal saldoActual) {
        this.saldoActual = saldoActual;
    }
}

