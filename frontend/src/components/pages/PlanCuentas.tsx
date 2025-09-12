import React, { useEffect, useState } from "react";
import { CuentaService } from "../../services/cuentaService";
import { CuentaDto, CuentaRequest } from "../../types/auth";
import { useAuth } from "../../context/AuthContext";
import {
  Layers,
  Plus,
  Filter,
  X,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Slash,
} from "lucide-react";

interface PlanCuentasProps {}

const PlanCuentas: React.FC<PlanCuentasProps> = () => {
  const { usuario } = useAuth();
  const [cuentas, setCuentas] = useState<CuentaDto[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<string>("");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<CuentaDto>>({
    nombreCuenta: "",
    tipoCuenta: "",
    recibeSaldo: true,
    padreId: null,
  });

  // Traer cuentas desde el backend
  const fetchCuentas = async () => {
    try {
      const data = await CuentaService.obtenerCuentas();
      setCuentas(data);
    } catch (error) {
      console.error("❌ Error al cargar cuentas:", error);
    }
  };

  useEffect(() => {
    fetchCuentas();
  }, []);

  // Cambiar estado activo/inactivo
  const toggleActivo = async (id: number, activo: boolean) => {
    try {
      await CuentaService.actualizarActivo(id, activo);
      fetchCuentas();
    } catch (error) {
      console.error("❌ Error al cambiar estado de cuenta:", error);
    }
  };

  // Construir árbol padre-hijos
  const construirArbol = (cuentas: CuentaDto[]): any[] => {
    const mapa: Record<number, any> = {};
    const raiz: any[] = [];

    cuentas.forEach((c) => (mapa[c.id!] = { ...c, hijos: [] }));
    cuentas.forEach((c) => {
      if (c.padreId) {
        mapa[c.padreId]?.hijos.push(mapa[c.id!]);
      } else {
        raiz.push(mapa[c.id!]);
      }
    });

    return raiz;
  };

  // Filtrar cuentas por tipo
  const filteredCuentas = tipoFiltro
    ? cuentas.filter((c) => c.tipoCuenta === tipoFiltro)
    : cuentas;

  const arbol = construirArbol(filteredCuentas);

  // Crear nueva cuenta
  const handleCrearCuenta = async () => {
    if (!formData.nombreCuenta || !formData.tipoCuenta) {
      alert("⚠️ Nombre y tipo de cuenta son obligatorios");
      return;
    }

    try {
      await CuentaService.crearCuenta(formData as CuentaRequest);
      setShowModal(false);
      setFormData({
        nombreCuenta: "",
        tipoCuenta: "",
        recibeSaldo: false,
        padreId: null,
      });
      fetchCuentas();
    } catch (error) {
      console.error("❌ Error al crear cuenta:", error);
      alert("Error al crear cuenta");
    }
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Plan de Cuentas
            </h1>
            <p className="text-gray-400">Estructura jerárquica de tus cuentas contables</p>
          </div>
        </div>

        {usuario?.rol === "ADMIN" && (
          <button
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-5 py-2 rounded-xl shadow-lg transition-transform transform hover:scale-105"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Nueva Cuenta</span>
          </button>
        )}
      </div>

      {/* Filtro */}
      <div className="flex items-center space-x-3 mb-6">
        <Filter className="w-5 h-5 text-gray-400" />
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          className="bg-gray-800 border border-gray-600 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          <option value="">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Pasivo">Pasivo</option>
          <option value="Patrimonio">Patrimonio</option>
          <option value="R+">R+</option>
          <option value="R-">R-</option>
        </select>
      </div>

      {/* Árbol de cuentas */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-inner p-6 space-y-2">
        {arbol.length === 0 ? (
          <div className="text-center text-gray-400 py-6">
            No hay cuentas registradas
          </div>
        ) : (
          arbol.map((cuenta, i) => (
            <CuentaNodo
              key={cuenta.id}
              cuenta={{ ...cuenta, indice: i + 1 }}
              nivel={0}
              toggleActivo={toggleActivo}
              usuario={usuario}
            />
          ))
        )}
      </div>

      {/* Modal Crear Cuenta */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5 transition-all duration-300">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <h2 className="text-2xl font-bold">Nueva Cuenta</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-200 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Formulario */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre de la cuenta"
                value={formData.nombreCuenta}
                onChange={(e) =>
                  setFormData({ ...formData, nombreCuenta: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <select
                value={formData.tipoCuenta}
                onChange={(e) =>
                  setFormData({ ...formData, tipoCuenta: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="">Selecciona tipo de cuenta</option>
                <option value="Activo">Activo</option>
                <option value="Pasivo">Pasivo</option>
                <option value="Patrimonio">Patrimonio</option>
                <option value="R+">R+</option>
                <option value="R-">R-</option>
              </select>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.recibeSaldo || false}
                  onChange={(e) =>
                    setFormData({ ...formData, recibeSaldo: e.target.checked })
                  }
                  className="form-checkbox h-5 w-5 text-indigo-500"
                />
                <span>Recibe saldo</span>
              </label>

              <select
                value={formData.padreId ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    padreId: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="">Sin padre</option>
                {cuentas.filter((c) => !c.recibeSaldo).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombreCuenta}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearCuenta}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold transition"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente recursivo para cada nodo de cuenta
const CuentaNodo: React.FC<{
  cuenta: any;
  nivel: number;
  codigo?: string;
  toggleActivo: (id: number, activo: boolean) => void;
  usuario: any;
}> = ({ cuenta, nivel, codigo = "", toggleActivo, usuario }) => {
  const [expandido, setExpandido] = useState(false);

  const codigoActual = codigo ? `${codigo}.${cuenta.indice}` : `${cuenta.indice}`;

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
          cuenta.activo
            ? "hover:bg-gray-700"
            : "bg-gray-700/50 hover:bg-gray-700 line-through italic text-gray-400"
        }`}
        style={{ marginLeft: `${nivel * 20}px` }}
        onClick={() => {
          if (!cuenta.recibeSaldo) setExpandido(!expandido);
        }}
      >
        {/* Icono expandir/colapsar */}
        {!cuenta.recibeSaldo && cuenta.hijos?.length > 0 && (
          <span className="mr-2 text-gray-400 transition-transform">
            {expandido ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}

        <span className="flex-1">{codigoActual} {cuenta.nombreCuenta}</span>

        {/* Botón activar/desactivar */}
        {usuario?.rol === "ADMIN" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleActivo(cuenta.id, !cuenta.activo);
            }}
            className={`ml-2 px-2 py-1 rounded-md text-xs flex items-center space-x-1 transition-all duration-200 ${
              cuenta.activo
                ? "bg-red-600 hover:bg-red-700 text-white opacity-90 hover:opacity-100"
                : "bg-green-600 hover:bg-green-700 text-white opacity-90 hover:opacity-100"
            }`}
            title={cuenta.activo ? "Desactivar cuenta" : "Reactivar cuenta"}
          >
            {cuenta.activo ? <Slash className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
            <span>{cuenta.activo ? "Desactivar" : "Reactivar"}</span>
          </button>
        )}
      </div>

      {/* Render recursivo de hijos con animación */}
      {expandido &&
        cuenta.hijos?.map((hijo: any, i: number) => (
          <CuentaNodo
            key={hijo.id}
            cuenta={{ ...hijo, indice: i + 1 }}
            nivel={nivel + 1}
            codigo={codigoActual}
            toggleActivo={toggleActivo}
            usuario={usuario}
          />
        ))}
    </div>
  );
};

export default PlanCuentas;










