package com.sistemacontable.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad que representa la tabla 'cuentas' en la base de datos
 * Mapea exactamente la estructura existente
 */
@Entity
@Table(name = "cuentas")
public class Cuenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre_cuenta", nullable = false)
    private String nombreCuenta;

    @Column(name = "recibe_saldo", nullable = false)
    private Boolean recibeSaldo;

    @Column(name = "tipo_cuenta", nullable = false)
    private String tipoCuenta;  

    @ManyToOne
    @JoinColumn(name = "padre_id")
    private Cuenta padre;

    @Column(name = "saldo_actual", nullable = false)
    private BigDecimal saldoActual = BigDecimal.ZERO;

    @OneToMany(mappedBy = "padre", fetch = FetchType.LAZY)
    private Set<Cuenta> subCuentas = new HashSet<>();

    @Column(nullable = false)
    private Boolean activo = true;

    // Getters y setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombreCuenta() { return nombreCuenta; }
    public void setNombreCuenta(String nombreCuenta) { this.nombreCuenta = nombreCuenta; }

    public Boolean getRecibeSaldo() { return recibeSaldo; }
    public void setRecibeSaldo(Boolean recibeSaldo) { this.recibeSaldo = recibeSaldo; }

    public String getTipoCuenta() { return tipoCuenta; }
    public void setTipoCuenta(String tipoCuenta) { this.tipoCuenta = tipoCuenta; }

    public Cuenta getPadre() { return padre; }
    public void setPadre(Cuenta padre) { this.padre = padre; }

    public BigDecimal getSaldoActual() { return saldoActual; }
    public void setSaldoActual(BigDecimal saldoActual) { this.saldoActual = saldoActual; }

    public Set<Cuenta> getSubCuentas() { return subCuentas; }
    public void setSubCuentas(Set<Cuenta> subCuentas) { this.subCuentas = subCuentas; }

    public Boolean getActivo() { return activo; }  public void setActivo(Boolean activo) { this.activo = activo; }
}

