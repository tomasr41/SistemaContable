package com.sistemacontable.dto;

import java.math.BigDecimal;

public class LineaAsientoDto {

    private Integer cuentaId;       // ID de la cuenta
    private String nombreCuenta;    // Nombre de la cuenta
    private BigDecimal debe;
    private BigDecimal haber;
    private BigDecimal saldoParcial;

    public LineaAsientoDto() {}

    public LineaAsientoDto(Integer cuentaId, String nombreCuenta, BigDecimal debe, BigDecimal haber, BigDecimal saldoParcial) {
        this.cuentaId = cuentaId;
        this.nombreCuenta = nombreCuenta;
        this.debe = debe;
        this.haber = haber;
        this.saldoParcial = saldoParcial;
    }

    public Integer getCuentaId() {
        return cuentaId;
    }

    public void setCuentaId(Integer cuentaId) {
        this.cuentaId = cuentaId;
    }

    public String getNombreCuenta() {
        return nombreCuenta;
    }

    public void setNombreCuenta(String nombreCuenta) {
        this.nombreCuenta = nombreCuenta;
    }

    public BigDecimal getDebe() {
        return debe;
    }

    public void setDebe(BigDecimal debe) {
        this.debe = debe;
    }

    public BigDecimal getHaber() {
        return haber;
    }

    public void setHaber(BigDecimal haber) {
        this.haber = haber;
    }

    public BigDecimal getSaldoParcial() {
        return saldoParcial;
    }

    public void setSaldoParcial(BigDecimal saldoParcial) {
        this.saldoParcial = saldoParcial;
    }
}
