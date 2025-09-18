package com.sistemacontable.dto;

import java.util.List;

public class AsientoRequest {
    private String fecha; // yyyy-MM-dd
    private String descripcion;
    private Integer usuarioId;
    private List<LineaAsientoRequest> lineas;

    // Getters y setters
    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }

    public List<LineaAsientoRequest> getLineas() { return lineas; }
    public void setLineas(List<LineaAsientoRequest> lineas) { this.lineas = lineas; }
}

