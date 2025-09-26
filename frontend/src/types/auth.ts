//Tipos TypeScript 
 

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


export interface CuentaDto {
  id: number;                 
  nombreCuenta: string;
  recibeSaldo: boolean;       
  tipoCuenta: string;     
  padreId: number | null;     
  saldoActual: number;      
}

export interface CuentaRequest {
  nombreCuenta: string;
  tipoCuenta: string;
  recibeSaldo: boolean;
  padreId: number | null;
}

// Representa una línea del asiento enviada al backend
export interface LineaAsientoRequest {
  cuentaId: number;
  debe?: number;
  haber?: number;
}

// Representa un asiento que se envía al backend
export interface AsientoRequest {
  fecha: string;                     // formato YYYY-MM-DD
  descripcion: string;
  usuarioId: number;
  lineas: LineaAsientoRequest[];
}

// Representa un asiento completo recibido del backend
export interface AsientoDto {
  id: number;
  fecha: string;
  descripcion: string;
  usuarioId: number;
  lineas: {
    nombreCuenta: string;        // nombre de la cuenta asociada a la línea
    id: number;
    cuentaId: number;
    debe: number;
    haber: number;
    cuentaNombre?: string;           // opcional, si el backend lo devuelve
  }[];
}


////// Libro mayor

// Línea de asiento para libro mayor
export interface LineaLibroMayorDto {
  cuentaId: number;
  nombreCuenta: string;
  debe: number;
  haber: number;
  saldoParcial: number; // <--- agregamos este campo
}

// Asiento con líneas de libro mayor
export interface AsientoLibroMayorDto {
  id: number;
  fecha: string;
  descripcion: string;
  nombreUsuario: string;
  lineas: LineaLibroMayorDto[];
}

// DTO completo de libro mayor
export interface LibroMayorDto {
  cuenta: CuentaDto;
  asientos: AsientoLibroMayorDto[];
  saldoActual: number;
}
