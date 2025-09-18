package com.sistemacontable.dto;

import java.math.BigDecimal;

public class LineaAsientoRequest {
    private Integer cuentaId;
    private BigDecimal debe = BigDecimal.ZERO;
    private BigDecimal haber = BigDecimal.ZERO;

    // Getters y setters
    public Integer getCuentaId() { return cuentaId; }
    public void setCuentaId(Integer cuentaId) { this.cuentaId = cuentaId; }

    public BigDecimal getDebe() { return debe; }
    public void setDebe(BigDecimal debe) { this.debe = debe; }

    public BigDecimal getHaber() { return haber; }
    public void setHaber(BigDecimal haber) { this.haber = haber; }
}
