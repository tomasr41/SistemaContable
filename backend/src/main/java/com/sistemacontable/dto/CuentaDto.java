package com.sistemacontable.dto;

import java.math.BigDecimal;

public class CuentaDto {

    private Integer id;
    private String nombreCuenta;
    private Boolean recibeSaldo;
    private String tipoCuenta; 
    private Integer padreId;
    private BigDecimal saldoActual;
    private Boolean activo; 

    public CuentaDto() {}

    public CuentaDto(Integer id, String nombreCuenta, Boolean recibeSaldo, String tipoCuenta, Integer padreId, BigDecimal saldoActual, Boolean activo) {
        this.id = id;
        this.nombreCuenta = nombreCuenta;
        this.recibeSaldo = recibeSaldo;
        this.tipoCuenta = tipoCuenta;
        this.padreId = padreId;
        this.saldoActual = saldoActual;
        this.activo = activo;
    }

    public CuentaDto(String nombreCuenta, String tipoCuenta) {
        this.nombreCuenta = nombreCuenta;
        this.tipoCuenta = tipoCuenta;
    }

    // Getters y setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombreCuenta() { return nombreCuenta; }
    public void setNombreCuenta(String nombreCuenta) { this.nombreCuenta = nombreCuenta; }

    public Boolean getRecibeSaldo() { return recibeSaldo; }
    public void setRecibeSaldo(Boolean recibeSaldo) { this.recibeSaldo = recibeSaldo; }

    public String getTipoCuenta() { return tipoCuenta; }
    public void setTipoCuenta(String tipoCuenta) { this.tipoCuenta = tipoCuenta; }

    public Integer getPadreId() { return padreId; }
    public void setPadreId(Integer padreId) { this.padreId = padreId; }

    public BigDecimal getSaldoActual() { return saldoActual; }
    public void setSaldoActual(BigDecimal saldoActual) { this.saldoActual = saldoActual; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}





