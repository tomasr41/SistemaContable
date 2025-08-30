import { UsuarioRequest, UsuarioResponse, RolDto } from '../types/auth';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Servicio para manejar operaciones de gestión de usuarios
 */
class UsuarioService {

  /**
   * Obtiene headers con token de autorización
   * @returns headers con Authorization bearer token
   */
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Obtiene todos los usuarios del sistema
   * @returns promesa con lista de usuarios
   */
  async obtenerUsuarios(): Promise<UsuarioResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario
   * @param usuarioData datos del usuario a crear
   * @returns promesa con usuario creado
   */
  async crearUsuario(usuarioData: UsuarioRequest): Promise<UsuarioResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(usuarioData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al crear usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  /**
   * Elimina un usuario del sistema
   * @param usuarioId ID del usuario a eliminar
   * @returns promesa void
   */
  async eliminarUsuario(usuarioId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los roles disponibles
   * @returns promesa con lista de roles como DTOs
   */
  async obtenerRoles(): Promise<RolDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/roles`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener roles');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener roles:', error);
      throw error;
    }
  }
}

export const usuarioService = new UsuarioService();