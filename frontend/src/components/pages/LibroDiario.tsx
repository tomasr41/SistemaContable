import React, { useState } from "react";
import { FileText } from "lucide-react";
import { AsientoDto } from "../../types/auth";
import { LibroDiarioService } from "../../services/libroDiarioService";
import { Calendar } from "lucide-react";


export const LibroDiario = () => {
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");
  const [asientos, setAsientos] = useState<AsientoDto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscarAsientos = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await LibroDiarioService.obtenerPorRangoFechas(
        fechaDesde,
        fechaHasta
      );
      setAsientos(res);
    } catch (err: any) {
      console.error(err);
      setError("Error al obtener los asientos.");
    } finally {
      setCargando(false);
    }
  };

  const formatLocalDate = (isoDate?: string) => {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
};

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
         <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
      <Calendar className="w-6 h-6 text-white" />
    </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Libro Diario</h1>
          <p className="text-gray-400">Consulta de asientos por rango de fechas</p>
        </div>
      </div>

      {/* Filtros de fechas */}
      <div className="flex gap-4 mb-6 flex-wrap">
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
          onClick={buscarAsientos}
        >
          Buscar
        </button>
      </div>

      {cargando && <p className="text-gray-400">Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Tabla de libro diario */}
      {asientos.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-600 divide-y divide-gray-600 text-sm table-fixed">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Descripción</th>
                <th className="px-4 py-2 text-left">Cuenta</th>
                <th className="px-4 py-2 text-right">Debe</th>
                <th className="px-4 py-2 text-right">Haber</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600">
              {asientos.map((asiento) => (
                <React.Fragment key={asiento.id}>
                  {/* Fila con fecha y descripción */}
                  <tr className="bg-gray-700">
                    <td className="px-4 py-2 font-bold border border-gray-600">
                      {formatLocalDate(asiento.fecha)}
                    </td>
                    <td
                      className="px-4 py-2 font-bold border border-gray-600"
                      colSpan={4}
                    >
                      {asiento.descripcion}
                    </td>
                  </tr>

                  {/* Líneas del asiento */}
                  {asiento.lineas
                    .sort((a, b) => b.debe - a.debe) // Debe primero
                    .map((linea, idx) => (
                      <tr key={idx} className="hover:bg-gray-600">
                        <td className="border border-gray-600"></td>
                        <td className="border border-gray-600"></td>
                        <td
                          className={`px-4 py-2 border border-gray-600 ${
                            linea.haber && linea.haber > 0
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {linea.nombreCuenta}
                        </td>
                        <td className="px-4 py-2 border border-gray-600 text-right">
                          {linea.debe || "-"}
                        </td>
                        <td className="px-4 py-2 border border-gray-600 text-right">
                          {linea.haber || "-"}
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};



