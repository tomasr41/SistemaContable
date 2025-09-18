package com.sistemacontable.dto;

import java.time.LocalDate;
import java.util.List;

public class AsientoDto {
    private Integer id;
    private LocalDate fecha;
    private String descripcion;
    private String nombreUsuario;
    private List<LineaAsientoDto> lineas; 

    // Getters y setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }

    public List<LineaAsientoDto> getLineas() { return lineas; }
    public void setLineas(List<LineaAsientoDto> lineas) { this.lineas = lineas; }
}
