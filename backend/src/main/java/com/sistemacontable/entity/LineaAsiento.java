package com.sistemacontable.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Entidad que representa la tabla 'linea_asiento' en la base de datos
 */
@Entity
@Table(name = "linea_asiento")
public class LineaAsiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "asiento_id", nullable = false)
    private Asiento asiento;

    @ManyToOne
    @JoinColumn(name = "cuenta_id", nullable = false)
    private Cuenta cuenta;

    @Column(name = "debe", precision = 15, scale = 2)
    private BigDecimal debe = BigDecimal.ZERO;

    @Column(name = "haber", precision = 15, scale = 2)
    private BigDecimal haber = BigDecimal.ZERO;

    @Column(name = "saldo_parcial", precision = 15, scale = 2)
    private BigDecimal saldoParcial;

    // Getters y setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Asiento getAsiento() { return asiento; }
    public void setAsiento(Asiento asiento) { this.asiento = asiento; }

    public Cuenta getCuenta() { return cuenta; }
    public void setCuenta(Cuenta cuenta) { this.cuenta = cuenta; }

    public BigDecimal getDebe() { return debe; }
    public void setDebe(BigDecimal debe) { this.debe = debe; }

    public BigDecimal getHaber() { return haber; }
    public void setHaber(BigDecimal haber) { this.haber = haber; }

    public BigDecimal getSaldoParcial() { return saldoParcial; }
    public void setSaldoParcial(BigDecimal saldoParcial) { this.saldoParcial = saldoParcial; }
}
