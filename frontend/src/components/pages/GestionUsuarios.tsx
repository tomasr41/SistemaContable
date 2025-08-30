import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usuarioService } from '../../services/usuarioService';
import { UsuarioResponse, RolDto, UsuarioRequest } from '../../types/auth';
import { 
  Users, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  User,
  Lock,
  Shield
} from 'lucide-react';

/**
 * Componente para gestión de usuarios del sistema
 * Solo accesible para administradores
 */
export const GestionUsuarios: React.FC = () => {
  const { hasPermission } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [roles, setRoles] = useState<RolDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Estado para formulario de creación
  const [newUser, setNewUser] = useState<UsuarioRequest>({
    nombreUsuario: '',
    contrasena: '',
    rolId: 1
  });

  // Verificar permisos
  useEffect(() => {
    if (!hasPermission('usuarios', 'gestionar')) {
      setError('No tienes permisos para acceder a esta sección');
      setIsLoading(false);
      return;
    }
    
    cargarDatos();
  }, [hasPermission]);

  /**
   * Carga usuarios y roles desde el backend
   */
  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      const [usuariosData, rolesData] = await Promise.all([
        usuarioService.obtenerUsuarios(),
        usuarioService.obtenerRoles()
      ]);
      
      setUsuarios(usuariosData);
      setRoles(rolesData);
      setError('');
    } catch (error) {
      setError('Error al cargar datos. Verifica tu conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja la creación de un nuevo usuario
   */
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const usuarioCreado = await usuarioService.crearUsuario(newUser);
      setUsuarios([...usuarios, usuarioCreado]);
      setNewUser({ nombreUsuario: '', contrasena: '', rolId: 1 });
      setShowCreateForm(false);
      setSuccess('Usuario creado exitosamente');
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear usuario');
    }
  };

  /**
   * Maneja la eliminación de un usuario
   */
  const handleDeleteUser = async (usuarioId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      await usuarioService.eliminarUsuario(usuarioId);
      setUsuarios(usuarios.filter(u => u.id !== usuarioId));
      setSuccess('Usuario eliminado exitosamente');
      setError('');
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Error al eliminar usuario');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-pulse text-gray-300">
          Cargando gestión de usuarios...
        </div>
      </div>
    );
  }

  if (!hasPermission('usuarios', 'gestionar')) {
    return (
      <div className="p-8">
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-100 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-400">
            No tienes permisos para acceder a la gestión de usuarios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Gestión de Usuarios</h1>
            <p className="text-gray-400">Administra usuarios y roles del sistema</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Mensajes de éxito y error */}
      {success && (
        <div className="mb-6 flex items-center space-x-2 text-green-400 bg-green-900/20 border border-green-800 rounded-lg p-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center space-x-2 text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Formulario de creación */}
      {showCreateForm && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Crear Nuevo Usuario</h3>
          
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={newUser.nombreUsuario}
                  onChange={(e) => setNewUser({...newUser, nombreUsuario: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="usuario123"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={newUser.contrasena}
                  onChange={(e) => setNewUser({...newUser, contrasena: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rol
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={newUser.rolId}
                  onChange={(e) => setNewUser({...newUser, rolId: Number(e.target.value)})}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {roles.map(rol => (
                    <option key={rol.id} value={rol.id} className="bg-gray-700">
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-3 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-all duration-200"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Usuario</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100">
            Lista de Usuarios ({usuarios.length})
          </h3>
        </div>

        {usuarios.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No hay usuarios registrados en el sistema
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-700">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-750 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {usuario.id}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-100 font-medium">{usuario.nombreUsuario}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-400 border border-purple-800">
                        <Shield className="w-3 h-3" />
                        <span className="font-medium">{usuario.rol}</span>
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteUser(usuario.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-lg transition-all duration-200"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};