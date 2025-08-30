import { LoginRequest, LoginResponse } from '../types/auth';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Servicio para manejar operaciones de autenticación con el backend
 */
class AuthService {
  
  /**
   * Realiza login contra el backend
   * @param credentials datos de login
   * @returns promesa con datos del usuario autenticado
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error en el login');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * Obtiene el token JWT guardado en localStorage
   * @returns token JWT o null si no existe
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si hay token válido, false si no
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Limpia datos de autenticación del localStorage
   */
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
}

export const authService = new AuthService();