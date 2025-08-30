import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, LoginRequest, LoginResponse } from '../types/auth';
import { authService } from '../services/authService';

/**
 * Contexto para manejo de autenticación y autorización
 * Proporciona estado global del usuario y funciones de auth
 */

interface AuthContextType {                     //definicion del tipo de objeto para el contexto de autenticacion (esto es para Typescript)
  usuario: Usuario | null;       //usuario logeado o null
  isLoading: boolean;            //true si esta cargando la autentificacion
  isAuthenticated: boolean;      //true si el usuario esta autenticado
  login: (credentials: LoginRequest) => Promise<void>; //funcion para login de usuario
  logout: () => void;                                  //funcion logout
  hasPermission: (recurso: string, accion: string) => boolean; //funcion para verificar permisos
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);      //

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al cargar la app, verificar si hay sesión guardada y retomar la sesion correspondiente. Si no hay sesion o es invalida, limpiar todo.
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('usuario');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setUsuario(user);
        } catch (error) {
          console.error('Error al recuperar sesión:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Función para realizar login
   * @param credentials datos de login (usuario y contraseña)
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response: LoginResponse = await authService.login(credentials);
      
      // Crear objeto usuario a partir de la respuesta
      const userData: Usuario = {
        id: response.userId,
        nombreUsuario: response.nombreUsuario,
        rol: response.rol,
        permisos: response.permisos
      };
      
      // Guardar en localStorage y estado
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(userData));
      setUsuario(userData);
      
    } catch (error) {
      throw error; // Re-lanzar para que el componente pueda manejarlo
    }
  };

  /**
   * Función para cerrar sesión
   */
  const logout = (): void => {
    localStorage.removeItem('token');   //simplemente limpiamos los datos de sesion 
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param recurso nombre del recurso (ej: "usuarios,plan_cuentas,libro_diario,etc")
   * @param accion acción requerida (ej: "gestionar")
   * @returns true si tiene el permiso, false si no
   */
  const hasPermission = (recurso: string, accion: string): boolean => {
    if (!usuario || !usuario.permisos) return false;  //si no hay usuario o permisos, no tiene permiso \
    
    
    return usuario.permisos.some(permiso => 
      permiso.recurso === recurso && permiso.accion === accion //
    );
  };

  const value: AuthContextType = {
    usuario,
    isLoading,
    isAuthenticated: !!usuario,
    login,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns AuthContextType con todas las funciones y estado de auth
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};