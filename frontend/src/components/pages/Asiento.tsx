// src/pages/LibroDiario.tsx
import React, { useState, useEffect, useRef } from "react";
import { FileText, Zap } from 'lucide-react';
//import { useCuentas } from "../../context/CuentasContext";

// ejemplo de listado de cuentas (en la realidad vendrían del backend)

const cuentas = [
  { id: 1, nombre: "Caja" },
  { id: 2, nombre: "Banco Nación" },
  { id: 3, nombre: "Clientes" },
  { id: 4, nombre: "Proveedores" },
  { id: 5, nombre: "Alquileres" },
  { id: 6, nombre: "Sueldos a pagar" },
  { id: 7, nombre: "Ventas" },
];

export const Asiento: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [mostrarLista, setMostrarLista] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [indiceActivo, setIndiceActivo] = useState(-1);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [descripcion, setDescripcion] = useState("");
  const [cuentaFiltro, setCuentaFiltro] = useState("");
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<string>("");
  const [monto, setMonto] = useState<number>(0);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [errorAsiento, setErrorAsiento] = useState<string>("");
  const [montoInput, setMontoInput] = useState<string>("");
  const [errorMonto, setErrorMonto] = useState(""); 
  const [indiceEditando, setIndiceEditando] = useState<number | null>(null);
  const [tipoMovimiento, setTipoMovimiento] = useState<"debe" | "haber">("debe");
  const [lineas, setLineas] = useState<
    { id: string; cuenta: string; debe: number; haber: number }[]
  >([]);


  const limiteDescripcion = 255;

  const cuentasFiltradas = cuentas.filter((c) =>
    c.nombre.toLowerCase().includes(cuentaFiltro.toLowerCase())
  );

  // Ordenamos solo para mostrar: Debe arriba, Haber abajo
  const lineasOrdenadas = [...lineas].sort((a, b) => {
    if (a.debe > 0 && b.debe === 0) return -1;
    if (a.debe === 0 && b.debe > 0) return 1;
    return 0;
  });


  // useEffect para cerrar menú de Cuentas al hacer clic afuera
  useEffect(() => {
    const manejarClickFuera = (e: MouseEvent) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target as Node)) {
        setMostrarLista(false);
      }
    };
    document.addEventListener("click", manejarClickFuera);
    return () => document.removeEventListener("click", manejarClickFuera);
  }, []);

  const agregarLinea = () => {
  if (!cuentaSeleccionada || monto <= 0) {
    if (monto < 0) setErrorMonto("No se permiten valores negativos");
    return;
  }

  const montoRedondeado = parseFloat(monto.toFixed(2)); // acá redondeamos

  const nuevaLinea = {
    id: indiceEditando !== null ? lineas[indiceEditando].id : Date.now().toString(),
    cuenta: cuentaSeleccionada,
    debe: tipoMovimiento === "debe" ? montoRedondeado : 0,
    haber: tipoMovimiento === "haber" ? montoRedondeado : 0,
  };

  if (indiceEditando !== null) {
    // Reemplazamos la fila existente
    const lineasActualizadas = [...lineas];
    lineasActualizadas[indiceEditando] = nuevaLinea;
    setLineas(lineasActualizadas);
    setIndiceEditando(null); // salimos de modo edición
  } else {
    // Agregamos una nueva fila
    setLineas([...lineas, nuevaLinea]);
  }

  // limpiar campos
  setCuentaSeleccionada("");
  setCuentaFiltro("");
  setMonto(0);
  setMontoInput("");
  setErrorMonto("");
  };

  

  const registrar = () => {
    const totalDebe = lineas.reduce((acc, l) => acc + l.debe, 0);
    const totalHaber = lineas.reduce((acc, l) => acc + l.haber, 0);

    if (totalDebe.toFixed(2) !== totalHaber.toFixed(2)) {
      setErrorAsiento(
        `El total del Debe (${totalDebe.toFixed(2)}) no coincide con el total del Haber (${totalHaber.toFixed(2)})`
      );
      setMostrarMensaje(true); // muestra el mensaje

      // Limpiamos el mensaje automáticamente después de 5 segundos
      setTimeout(() => {
        setMostrarMensaje(false); // inicia la transición de salida
        setTimeout(() => setErrorAsiento(""), 400); // luego lo removemos del DOM
      }, 4000);

      return; // no se registra. tenemos que corregir
    }



    console.log("Registrar asiento:", { fecha, descripcion, lineas });
    // Limpiamos campos pero dejamos el formulario visible
    setDescripcion("");
    setLineas([]);
    setCuentaFiltro("");
    setCuentaSeleccionada("");
    setMonto(0);
    setMontoInput("");
    setErrorMonto("");
    setErrorAsiento(""); // borramos errores anteriores
  };










  


  return (
    <div className="p-8">
      <div className="flex items-center space-x-4">
        {/* Ícono con gradiente */}
        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
          <FileText className="w-6 h-6 text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-white">
            Asientos contables
          </h1>
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
              onChange={(e) => setFecha(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white w-full"
            />
          </div>












          {/* Descripción */}
          <div className="mb-4">
            <label className="block text-sm">Descripción:</label>
            <textarea
              value={descripcion}
              maxLength={limiteDescripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="p-2 rounded bg-gray-700 text-white w-full"
            />
            <p className="text-xs text-gray-400">
              {limiteDescripcion - descripcion.length} caracteres restantes
            </p>
          </div>












          {/* Campo de cuentas con búsqueda y dropdown + navegación con teclado */}
          <div className="mb-4 relative" ref={contenedorRef}>
            <label className="block text-sm">Cuenta:</label>
            <input
              type="text"
              value={cuentaFiltro}
              onChange={(e) => {
                setCuentaFiltro(e.target.value);
                setMostrarLista(true);
                setIndiceActivo(0); // resalta la primera coincidencia al escribir
              }}
              onClick={() => setMostrarLista((prev) => !prev)}
              onKeyDown={(e) => {
                if (!cuentasFiltradas.length) return;

                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (!mostrarLista) {
                    setMostrarLista(true);
                    setIndiceActivo(0);
                  } else {
                    setIndiceActivo((prev) =>
                      prev < cuentasFiltradas.length - 1 ? prev + 1 : 0
                    );
                  }
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (!mostrarLista) {
                    setMostrarLista(true);
                    setIndiceActivo(cuentasFiltradas.length - 1);
                  } else {
                    setIndiceActivo((prev) =>
                      prev > 0 ? prev - 1 : cuentasFiltradas.length - 1
                    );
                  }
                } else if (e.key === "Enter") {
                  e.preventDefault(); // evitamos submit del form
                  if (indiceActivo >= 0 && indiceActivo < cuentasFiltradas.length) {
                    const cuenta = cuentasFiltradas[indiceActivo];
                    setCuentaSeleccionada(cuenta.nombre);
                    setCuentaFiltro(cuenta.nombre);
                    setMostrarLista(false);
                  }
                } else if (e.key === "Escape") {
                  setMostrarLista(false);  // Cierra el desplegable               
                } else if (e.key === "Tab") {
                  if (indiceActivo >= 0 && indiceActivo < cuentasFiltradas.length) {
                    // cerramos la lista primero
                    setMostrarLista(false);

                    // usamos timeout para que React procese el cierre antes de actualizar la cuenta
                    setTimeout(() => {
                      const cuenta = cuentasFiltradas[indiceActivo];
                      setCuentaSeleccionada(cuenta.nombre);
                      setCuentaFiltro(cuenta.nombre);
                    }, 0);
                  }
                  // NO preventDefault() para que TAB pase al siguiente input
                }
              }}
              className="p-2 rounded bg-gray-700 text-white w-full"
              placeholder="Escribe o selecciona una cuenta..."
            />

            {mostrarLista && (
              <ul className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded mt-1 max-h-40 overflow-y-auto">
                {cuentasFiltradas.map((c, index) => (
                  <li
                    key={c.id}
                      ref={index === indiceActivo ? (el) => el?.scrollIntoView({ block: "nearest" }) : null}
                      className={`p-2 cursor-pointer ${
                        index === indiceActivo ? "bg-blue-600 text-white" : "hover:bg-gray-600"
                      }`}
                    onMouseEnter={() => setIndiceActivo(index)} // resalta con mouse
                    onClick={() => {
                      setCuentaSeleccionada(c.nombre);
                      setCuentaFiltro(c.nombre);
                      setMostrarLista(false);
                    }}
                  >
                    {c.nombre}
                  </li>
                ))}
                {cuentasFiltradas.length === 0 && (
                  <li className="p-2 text-gray-400">No se encontraron cuentas</li>
                )}
              </ul>
            )}
          </div>




















          {/* Monto + Debe/Haber + botón agregar línea */}
          <div className="flex space-x-4">
            {/* Campo monto que se estira */}
            <div className="flex-1 relative">
              <label className="block text-sm font-medium">Monto</label>
                <input
                  type="text" // 👈 lo cambiamos a text para tener control total
                  inputMode="decimal" // 👈 sugiere teclado numérico en móviles
                  value={montoInput}
                  onChange={(e) => {
                    let valor = e.target.value;

                    // Permitimos solo 2 dígitos y un solo punto
                    valor = valor.replace(/[^0-9.]/g, ""); // borra letras y símbolos
                    const partes = valor.split(".");
                    if (partes.length > 2) {
                      // si hay más de un ".", unimos de vuelta y dejamos solo el primero
                      valor = partes[0] + "." + partes.slice(1).join("");
                    }

                    setMontoInput(valor);

                    if (valor === "") {
                      setMonto(0);
                      return;
                    }

                    const numero = parseFloat(valor);
                    if (!isNaN(numero)) {
                      setMonto(parseFloat(numero.toFixed(2))); // guardamos redondeado
                    }
                  }}
                  onBlur={() => {
                    if (montoInput !== "" && !isNaN(Number(montoInput))) {
                      const numero = parseFloat(montoInput);
                      const redondeado = parseFloat(numero.toFixed(2));
                      setMonto(numero);
                      setMontoInput(redondeado.toFixed(2));
                    }
                  }}
                  className="w-full p-2 bg-gray-700 rounded"
                />




              {/* Mensaje emergente */}
              {errorMonto && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-red-600 text-white text-sm px-2 py-1 rounded shadow-lg z-50">
                  {errorMonto}
                </div>
              )}
            </div>




            {/* Checkboxs Debe/Haber como cuadros accesibles */}
            <div className="flex space-x-4 items-end">
              {/* Debe */}
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => setTipoMovimiento("debe")}
              >
                {/* Cuadro focusable */}
                <div
                  tabIndex={0}
                  role="radio"
                  aria-checked={tipoMovimiento === "debe"}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setTipoMovimiento("debe");
                    }
                  }}
                  className={`w-[2.5rem] h-[2.5rem] rounded flex items-center justify-center bg-gray-700 
                    ${tipoMovimiento === "debe" ? "ring-2 ring-gray-800" : ""} focus:ring`}
                >
                  {tipoMovimiento === "debe" && <span className="text-white">✓</span>}
                </div>
                <span>Debe</span>
              </div>

              {/* Haber */}
              <div className="flex items-center space-x-2 cursor-pointer">
                <div
                  tabIndex={0}
                  role="radio"
                  aria-checked={tipoMovimiento === "haber"}
                  onClick={() => setTipoMovimiento("haber")}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      setTipoMovimiento("haber");
                    }
                  }}
                  className={`w-[2.5rem] h-[2.5rem] rounded flex items-center justify-center bg-gray-700 
                    ${tipoMovimiento === "haber" ? "ring-2 ring-gray-800" : ""} focus:ring`}
                >
                  {tipoMovimiento === "haber" && <span className="text-white">✓</span>}
                </div>
                <span>Haber</span>
              </div>
            </div>

            {/* Botón agregar línea */}
            <div className="flex items-end">
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
 
        












          {/* ----- Aquí va la tabla de líneas ----- */}
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
                {lineasOrdenadas.map((l) => {
                  const indiceOriginal = lineas.findIndex(linea => linea.id === l.id);

                  return (
                    <tr
                      key={l.id}
                      className={`border-t border-gray-600 ${indiceEditando === indiceOriginal ? "bg-yellow-600 animate-parpadeando" : ""}`}
                    >
                      <td className={`${l.haber > 0 ? "pl-[100px]" : ""} p-2`}>{l.cuenta}</td>
                      <td className="p-2 w-[150px] text-right">{l.debe || ""}</td>
                      <td className="p-2 w-[150px] text-right">{l.haber || ""}</td>
                      <td className="p-2 w-[120px] text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            className="cursor-pointer hover:text-yellow-400 bg-transparent border-0 p-0"
                            onClick={() => {
                              setCuentaSeleccionada(l.cuenta);
                              setCuentaFiltro(l.cuenta);
                              const montoLinea = l.debe > 0 ? l.debe : l.haber;
                              setMonto(montoLinea);
                              setMontoInput(montoLinea.toFixed(2));
                              setTipoMovimiento(l.debe > 0 ? "debe" : "haber");
                              setIndiceEditando(indiceOriginal);
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            className="cursor-pointer hover:text-yellow-400 bg-transparent border-0 p-0"
                            onClick={() => {
                              setLineas(lineas.filter((_, i) => i !== indiceOriginal));
                              if (indiceEditando === indiceOriginal) setIndiceEditando(null);
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









          

          <div className="flex justify-end items-center gap-4 mt-6 relative">
            {/* Mensaje de error flotante */}
            {errorAsiento && (
              <div
                className={`absolute right-[10rem] -translate-x-2 mr-2 p-2 bg-red-600 text-white rounded text-sm shadow-lg transition-all duration-500
                  ${mostrarMensaje ? "opacity-100" : "opacity-0"} z-50`}
              >
                {errorAsiento}
              </div>
            )}

            {/* Botón Registrar */}
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={registrar}
            >
              Registrar asiento
            </button>
           </div>








        </div>
      )}
















        <div className="flex items-center space-x-4 mt-4">
          {/* Ícono con gradiente */}
          <div className="relative w-14 h-14 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
            {/* Icono principal */}
            <FileText className="w-6 h-6 text-white" />

            {/* Icono secundario (reloj) */}
            <Zap className="absolute top-7 right-1 w-5 h-5 text-red-600" />
          </div>


          <div>
            <h1 className="text-2xl font-extrabold text-white">
              Últimos asientos cargados
            </h1>
          </div>
        </div>








    </div>
        
  );
  
};

