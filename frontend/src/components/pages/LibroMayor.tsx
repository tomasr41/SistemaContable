import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { LibroMayorDto, CuentaDto } from "../../types/auth";
import { LibroMayorService } from "../../services/libroMayorService";
import { CuentaService } from "../../services/cuentaService";
import { Library } from "lucide-react";

export const LibroMayor = () => {
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");
  const [cuentas, setCuentas] = useState<CuentaDto[]>([]);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<number | null>(null);
  const [libroMayor, setLibroMayor] = useState<LibroMayorDto | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarCuentas = async () => {
      try {
        const res = await CuentaService.obtenerCuentas();
        // Solo cuentas imputables
        const imputables = res.filter(c => c.recibeSaldo);
        setCuentas(imputables);
      } catch (err) {
        console.error(err);
      }
    };
    cargarCuentas();
  }, []);

  const buscarLibroMayor = async () => {
    if (!cuentaSeleccionada) {
      setError("Seleccione una cuenta.");
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const res = await LibroMayorService.obtenerLibroMayor(
        cuentaSeleccionada,
        fechaDesde,
        fechaHasta
      );
      setLibroMayor(res);
    } catch (err: any) {
      console.error(err);
      setError("Error al obtener el libro mayor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
  <Library className="w-6 h-6 text-white" />
</div>

        <div>
          <h1 className="text-2xl font-extrabold text-white">Libro Mayor</h1>
          <p className="text-gray-400">Consulta de asientos por cuenta y rango de fechas</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div>
          <label className="block text-sm mb-1">Cuenta:</label>
          <select
            value={cuentaSeleccionada || ""}
            onChange={(e) => setCuentaSeleccionada(Number(e.target.value))}
            className="p-2 rounded bg-gray-700 text-white"
          >
            <option value="">Seleccione...</option>
            {cuentas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombreCuenta}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Desde:</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Hasta:</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded self-end"
          onClick={buscarLibroMayor}
        >
          Buscar
        </button>
      </div>

      {cargando && <p className="text-gray-400">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Tabla de libro mayor */}
      {libroMayor && (
        <div className="overflow-x-auto">
          <h2 className="text-lg font-bold text-white mb-2">
            Cuenta: {libroMayor.cuenta.nombreCuenta} | Saldo actual: {libroMayor.saldoActual}
          </h2>
          <table className="min-w-full border border-gray-600 divide-y divide-gray-600 text-sm">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Descripción</th>
                <th className="px-4 py-2 text-left">Cuenta</th>
                <th className="px-4 py-2 text-right">Debe</th>
                <th className="px-4 py-2 text-right">Haber</th>
                <th className="px-4 py-2 text-right">Saldo Parcial</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600">
              {libroMayor.asientos.map((asiento) =>
                asiento.lineas.map((linea, idx) => (
                  <tr key={`${asiento.id}-${idx}`} className="hover:bg-gray-700">
                    <td className="px-4 py-2">{new Date(asiento.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{asiento.descripcion}</td>
                    <td className="px-4 py-2">{linea.nombreCuenta}</td>
                    <td className="px-4 py-2 text-right">{linea.debe || "-"}</td>
                    <td className="px-4 py-2 text-right">{linea.haber || "-"}</td>
                    <td className="px-4 py-2 text-right">{linea.saldoParcial}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

