/**
 * Tipos TypeScript para autenticación y autorización
 */

export interface Usuario {
  id: number;
  nombreUsuario: string;
  rol: string;
  permisos: Permiso[];
}

export interface Permiso {
  recurso: string;
  accion: string;
}

export interface LoginRequest {
  nombreUsuario: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  nombreUsuario: string;
  rol: string;
  permisos: Permiso[];
}

export interface UsuarioRequest {
  nombreUsuario: string;
  contrasena: string;
  rolId: number;
}

export interface UsuarioResponse {
  id: number;
  nombreUsuario: string;
  rol: string;
}

export interface RolDto {
  id: number;
  nombre: string;
}