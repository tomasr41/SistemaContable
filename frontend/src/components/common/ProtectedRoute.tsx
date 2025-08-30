import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

/**
 * Componente para proteger rutas según permisos del usuario
 * --- ACTUALMENTE NO SE USA ---
 * Solo queda como referencia histórica cuando trabajabas con MOCK data
 */

interface ProtectedRouteProps {
  children: React.ReactNode;       // Lo que se mostraría si el usuario tiene permisos
  requiredResource?: string;       // Nombre del permiso.recurso requerido
  requiredAction?: string;         // Nombre del permiso.accion requerido
  fallback?: React.ReactNode;      // Qué mostrar si no tiene permisos
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredResource,
  requiredAction,
  fallback
}) => {
  const { usuario, hasPermission, isLoading } = useAuth();

  // === LOADING ===
  // Esto muestra un mensaje de verificación de permisos mientras se carga el estado de auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-300">
          Verificando permisos...
        </div>
      </div>
    );
  }

  // === NO HAY USUARIO LOGEADO ===
  // Si no hay usuario en el contexto, mostrar mensaje de sesión no válida
  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>Sesión no válida. Por favor, inicia sesión nuevamente.</p>
        </div>
      </div>
    );
  }

  // === VERIFICACIÓN DE PERMISOS ===
  // Si se definieron recursos y acciones requeridas, verificarlos
  if (requiredResource && requiredAction) {
    if (!hasPermission(requiredResource, requiredAction)) {
      // Si no tiene permiso, mostrar fallback o mensaje por defecto
      return fallback || (
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acceso Denegado</h3>
            <p>No tienes permisos para acceder a esta funcionalidad.</p>
          </div>
        </div>
      );
    }
  }

  // === SI TODO ESTA BIEN ===
  // Devolver el contenido envuelto (aunque actualmente no se usa)
  return <>{children}</>;
};
