package com.sistemacontable.dto;

public class CuentaRequest {
    private String nombreCuenta;
    private String tipoCuenta;
    private Boolean recibeSaldo;
    private Integer padreId;

    // Getters y setters
    public String getNombreCuenta() { return nombreCuenta; }
    public void setNombreCuenta(String nombreCuenta) { this.nombreCuenta = nombreCuenta; }

    public String getTipoCuenta() { return tipoCuenta; }
    public void setTipoCuenta(String tipoCuenta) { this.tipoCuenta = tipoCuenta; }

    public Boolean getRecibeSaldo() { return recibeSaldo; }
    public void setRecibeSaldo(Boolean recibeSaldo) { this.recibeSaldo = recibeSaldo; }

    public Integer getPadreId() { return padreId; }
    public void setPadreId(Integer padreId) { this.padreId = padreId; }
}
