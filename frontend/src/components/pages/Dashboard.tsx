import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield } from 'lucide-react';

/**
 * Componente Dashboard principal
 * Muestra mensaje de bienvenida simple y limpio
 */
export const Dashboard: React.FC = () => {
  const { usuario } = useAuth();

  /**
   * Obtiene el saludo según la hora del día
   */
  const getSaludo = (): string => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 20) return 'Buenas tardes';
    else
    return 'Buenas noches';
  };

  return (
    <div className="p-8">
      {/* Header de bienvenida */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">
              {getSaludo()}, {usuario?.nombreUsuario}, 
            </h1>
            <p className="text-gray-400 capitalize">
              Rol: <span className="font-medium text-blue-400">{usuario?.rol}</span>
            </p>
          </div>
        </div>

        {/* Mensaje de bienvenida */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">
            Bienvenido al Sistema Contable
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Utiliza el menú lateral para navegar entre los diferentes módulos del sistema.
            Tienes acceso a las funcionalidades según tu rol asignado.
          </p>
        </div>

      </div>
    </div>
  );
};