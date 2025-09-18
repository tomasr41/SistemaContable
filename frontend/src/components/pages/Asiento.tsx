// src/pages/Asiento.tsx
import React, { useState, useEffect, useRef } from "react";
import { FileText, Zap } from "lucide-react";
import { AsientoService } from "../../services/asientoService";
import { CuentaDto, LineaAsientoRequest, AsientoRequest, AsientoDto } from "../../types/auth";

export const Asiento: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [mostrarLista, setMostrarLista] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  // Estados del formulario
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [descripcion, setDescripcion] = useState("");
  const [cuentas, setCuentas] = useState<CuentaDto[]>([]);
  const [cuentaFiltro, setCuentaFiltro] = useState("");
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaDto | null>(null);
  const [montoInput, setMontoInput] = useState<string>("");
  const [monto, setMonto] = useState<number>(0);
  const [tipoMovimiento, setTipoMovimiento] = useState<"debe" | "haber">("debe");
  const [lineas, setLineas] = useState<LineaAsientoRequest[]>([]);
  const [indiceEditando, setIndiceEditando] = useState<number | null>(null);
  const [errorMonto, setErrorMonto] = useState<string>("");
  const [errorAsiento, setErrorAsiento] = useState<string>("");
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  // Últimos asientos cargados
  const [ultimosAsientos, setUltimosAsientos] = useState<AsientoDto[]>([]);

  // Limite de descripción
  const limiteDescripcion = 255;

  // Filtrado de cuentas para dropdown
  const cuentasFiltradas = cuentas.filter(c =>
    c.nombreCuenta.toLowerCase().includes(cuentaFiltro.toLowerCase())
  );

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const manejarClickFuera = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setMostrarLista(false);
      }
    };
    document.addEventListener("click", manejarClickFuera);
    return () => document.removeEventListener("click", manejarClickFuera);
  }, []);

  // Cargar cuentas y últimos asientos al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cuentasBackend = await AsientoService.obtenerCuentas();
        setCuentas(cuentasBackend);

        const asientos = await AsientoService.obtenerUltimosAsientos(5);
        setUltimosAsientos(asientos);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Función para agregar o actualizar línea
  const agregarLinea = () => {
    if (!cuentaSeleccionada) {
      setErrorMonto("Selecciona una cuenta");
      return;
    }
    if (monto <= 0) {
      setErrorMonto("El monto debe ser mayor a cero");
      return;
    }

    const nuevaLinea: LineaAsientoRequest = {
      cuentaId: cuentaSeleccionada.id,
      debe: tipoMovimiento === "debe" ? monto : 0,
      haber: tipoMovimiento === "haber" ? monto : 0,
    };

    if (indiceEditando !== null) {
      const lineasActualizadas = [...lineas];
      lineasActualizadas[indiceEditando] = nuevaLinea;
      setLineas(lineasActualizadas);
      setIndiceEditando(null);
    } else {
      setLineas([...lineas, nuevaLinea]);
    }

    setCuentaSeleccionada(null);
    setCuentaFiltro("");
    setMonto(0);
    setMontoInput("");
    setErrorMonto("");
  };

  // Registrar asiento
  const registrar = async () => {
    if (!descripcion.trim()) {
      setErrorAsiento("La descripción es obligatoria");
      setMostrarMensaje(true);
      return;
    }

    const totalDebe = lineas.reduce((acc, l) => acc + (l.debe ?? 0), 0);
    const totalHaber = lineas.reduce((acc, l) => acc + (l.haber ?? 0), 0);

    if (totalDebe.toFixed(2) !== totalHaber.toFixed(2)) {
      setErrorAsiento(
        `El total del Debe (${totalDebe.toFixed(2)}) no coincide con el total del Haber (${totalHaber.toFixed(2)})`
      );
      setMostrarMensaje(true);
      setTimeout(() => {
        setMostrarMensaje(false);
        setTimeout(() => setErrorAsiento(""), 400);
      }, 4000);
      return;
    }

    try {
    // Recuperar usuarioId desde el objeto 'usuario' en localStorage
const usuarioStorage = localStorage.getItem("usuario");
if (!usuarioStorage) {
  setErrorAsiento("No se encontró el usuario logueado");
  setMostrarMensaje(true);
  return;
}

let usuarioId: number;
try {
  const usuarioObj = JSON.parse(usuarioStorage);
  usuarioId = usuarioObj.id;
} catch (error) {
  setErrorAsiento("Error al leer los datos del usuario logueado");
  setMostrarMensaje(true);
  return;
}

const payload: AsientoRequest = {
  fecha,
  descripcion,
  usuarioId,
  lineas,
};
      const creado = await AsientoService.crearAsiento(payload);

      // Limpiar formulario
      setDescripcion("");
      setLineas([]);
      setCuentaSeleccionada(null);
      setCuentaFiltro("");
      setMonto(0);
      setMontoInput("");
      setTipoMovimiento("debe");
      setErrorMonto("");
      setErrorAsiento("");
      setUltimosAsientos([creado, ...ultimosAsientos.slice(0, 4)]);
    } catch (err) {
      console.error(err);
      setErrorAsiento("Error al registrar asiento");
      setMostrarMensaje(true);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Asientos contables</h1>
          <p className="text-gray-400">Formulario de carga</p>
        </div>
      </div>

      {mostrarFormulario && (
        <div className="mt-6 border border-gray-600 rounded p-4 bg-gray-800">
          {/* Fecha */}
          <div className="mb-4">
            <label className="block text-sm">Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white w-full"
            />
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label className="block text-sm">Descripción:</label>
            <textarea
              value={descripcion}
              maxLength={limiteDescripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white w-full"
            />
            <p className="text-xs text-gray-400">
              {limiteDescripcion - descripcion.length} caracteres restantes
            </p>
          </div>

          {/* Dropdown cuentas */}
          <div className="mb-4 relative" ref={contenedorRef}>
            <label className="block text-sm">Cuenta:</label>
            <input
              type="text"
              value={cuentaFiltro}
              onChange={e => {
                setCuentaFiltro(e.target.value);
                setMostrarLista(true);
              }}
              onClick={() => setMostrarLista(prev => !prev)}
              className="p-2 rounded bg-gray-700 text-white w-full"
              placeholder="Escribe o selecciona una cuenta..."
            />
            {mostrarLista && (
              <ul className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded mt-1 max-h-40 overflow-y-auto">
                {cuentasFiltradas.map((c, index) => (
                  <li
                    key={c.id}
                    className="p-2 cursor-pointer hover:bg-gray-600"
                    onClick={() => {
                      setCuentaSeleccionada(c);
                      setCuentaFiltro(c.nombreCuenta);
                      setMostrarLista(false);
                    }}
                  >
                    {c.nombreCuenta}
                  </li>
                ))}
                {cuentasFiltradas.length === 0 && (
                  <li className="p-2 text-gray-400">No se encontraron cuentas</li>
                )}
              </ul>
            )}
          </div>

          {/* Monto y Debe/Haber */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <label className="block text-sm font-medium">Monto</label>
              <input
                type="text"
                inputMode="decimal"
                value={montoInput}
                onChange={e => {
                  let valor = e.target.value.replace(/[^0-9.]/g, "");
                  const partes = valor.split(".");
                  if (partes.length > 2) valor = partes[0] + "." + partes.slice(1).join("");
                  setMontoInput(valor);
                  const numero = parseFloat(valor);
                  setMonto(isNaN(numero) ? 0 : parseFloat(numero.toFixed(2)));
                }}
                onBlur={() => {
                  const numero = parseFloat(montoInput);
                  if (!isNaN(numero)) {
                    const redondeado = parseFloat(numero.toFixed(2));
                    setMonto(redondeado);
                    setMontoInput(redondeado.toFixed(2));
                  }
                }}
                className="w-full p-2 bg-gray-700 rounded"
              />
              {errorMonto && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-red-600 text-white text-sm px-2 py-1 rounded shadow-lg z-50">
                  {errorMonto}
                </div>
              )}
            </div>

            <div className="flex space-x-4 items-end">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setTipoMovimiento("debe")}
              >
                <div
                  tabIndex={0}
                  role="radio"
                  aria-checked={tipoMovimiento === "debe"}
                  className={`w-[2.5rem] h-[2.5rem] rounded flex items-center justify-center bg-gray-700 
                    ${tipoMovimiento === "debe" ? "ring-2 ring-gray-800" : ""} focus:ring`}
                >
                  {tipoMovimiento === "debe" && <span className="text-white">✓</span>}
                </div>
                <span>Debe</span>
              </div>

              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setTipoMovimiento("haber")}
              >
                <div
                  tabIndex={0}
                  role="radio"
                  aria-checked={tipoMovimiento === "haber"}
                  className={`w-[2.5rem] h-[2.5rem] rounded flex items-center justify-center bg-gray-700 
                    ${tipoMovimiento === "haber" ? "ring-2 ring-gray-800" : ""} focus:ring`}
                >
                  {tipoMovimiento === "haber" && <span className="text-white">✓</span>}
                </div>
                <span>Haber</span>
              </div>

              <button
                type="button"
                className={`px-4 py-2 rounded ${
                  indiceEditando !== null ? "bg-yellow-600" : "bg-blue-600"
                } text-white`}
                onClick={agregarLinea}
              >
                {indiceEditando !== null ? "Actualizar línea" : "Agregar línea"}
              </button>
            </div>
          </div>

          {/* Tabla de líneas */}
          <table className="w-full mt-6 border border-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-2 text-center">Cuenta</th>
                <th className="p-2 text-center">Debe</th>
                <th className="p-2 text-center">Haber</th>
                <th className="p-2 w-min text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lineas.map((l, idx) => {
                const cuentaNombre = cuentas.find(c => c.id === l.cuentaId)?.nombreCuenta ?? "";
                return (
                  <tr key={idx} className="border-t border-gray-600">
                    <td className="p-2">{cuentaNombre}</td>
                    <td className="p-2 w-[150px] text-right">{l.debe || ""}</td>
                    <td className="p-2 w-[150px] text-right">{l.haber || ""}</td>
                    <td className="p-2 w-[120px] text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          aria-label="Editar línea"
                          className="cursor-pointer hover:text-yellow-400 bg-transparent border-0 p-0"
                          onClick={() => {
                            const cuenta = cuentas.find(c => c.id === l.cuentaId) ?? null;
                            setCuentaSeleccionada(cuenta);
                            setCuentaFiltro(cuenta?.nombreCuenta ?? "");
                            const montoLinea = l.debe ?? l.haber ?? 0;
                            setMonto(montoLinea);
                            setMontoInput(montoLinea.toFixed(2));
                            setTipoMovimiento(l.debe && l.debe > 0 ? "debe" : "haber");
                            setIndiceEditando(idx);
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          aria-label="Eliminar línea"
                          className="cursor-pointer hover:text-yellow-400 bg-transparent border-0 p-0"
                          onClick={() => {
                            setLineas(lineas.filter((_, i) => i !== idx));
                            if (indiceEditando === idx) setIndiceEditando(null);
                          }}
                        >
                          ❌
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Botón Registrar */}
          <div className="flex justify-end items-center gap-4 mt-6 relative">
            {errorAsiento && (
              <div
                className={`absolute right-[10rem] -translate-x-2 mr-2 p-2 bg-red-600 text-white rounded text-sm shadow-lg transition-all duration-500
                  ${mostrarMensaje ? "opacity-100" : "opacity-0"} z-50`}
              >
                {errorAsiento}
              </div>
            )}
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={registrar}>
              Registrar asiento
            </button>
          </div>
        </div>
      )}

      {/* Últimos asientos */}
<div className="mt-10">
  <h2 className="text-2xl font-bold text-white mb-4">Últimos Asientos</h2>
  {ultimosAsientos.length === 0 ? (
    <p className="text-gray-500">No hay asientos cargados</p>
  ) : (
    <table className="min-w-full border border-gray-600 divide-y divide-gray-600">
      <thead className="bg-gray-700 text-white">
        <tr>
          <th className="px-4 py-2 text-left">Fecha</th>
          <th className="px-4 py-2 text-left">Descripción</th>
          <th className="px-4 py-2 text-center">Líneas</th>
        </tr>
      </thead>
      <tbody className="bg-gray-800 divide-y divide-gray-600">
        {ultimosAsientos.map(asiento => (
          <React.Fragment key={asiento.id}>
            <tr className="hover:bg-gray-700">
              <td className="px-4 py-2">{new Date(asiento.fecha).toLocaleDateString()}</td>
              <td className="px-4 py-2">{asiento.descripcion}</td>
              <td
                className="px-4 py-2 text-center text-blue-400 cursor-pointer hover:underline"
                onClick={() => {
                  const fila = document.getElementById(`lineas-${asiento.id}`);
                  if (fila) fila.classList.toggle("hidden");
                }}
              >
                {asiento.lineas.length} líneas
              </td>
            </tr>
            {/* Subtabla con líneas del asiento */}
            <tr id={`lineas-${asiento.id}`} className="hidden bg-gray-900">
              <td colSpan={3} className="p-0">
                <table className="w-full border-t border-gray-600 text-sm">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-3 py-1 text-left">Cuenta</th>
                      <th className="px-3 py-1 text-right">Debe</th>
                      <th className="px-3 py-1 text-right">Haber</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-600">
                    {asiento.lineas.map((linea, idx) => (
                      <tr key={idx} className="hover:bg-gray-700">
                        <td className="px-3 py-1">{linea.nombreCuenta}</td>
                        <td className="px-3 py-1 text-right">{linea.debe}</td>
                        <td className="px-3 py-1 text-right">{linea.haber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )}
</div>
    </div>
  );
}


