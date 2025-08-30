# Sistema Contable Fullstack

Sistema integral de contabilidad desarrollado con Spring Boot (backend) y React + Vite (frontend).

## Estructura del Proyecto

```
/
├── backend/                 # Spring Boot API
│   ├── src/main/java/...   # Código fuente Java
│   └── pom.xml             # Dependencias Maven
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── context/           # Context API (Auth)
│   ├── services/          # Servicios para API calls
│   └── types/             # Tipos TypeScript
└── package.json           # Dependencias Node.js
```

## Configuración Inicial

### 1. Base de Datos PostgreSQL

El sistema requiere una base de datos PostgreSQL llamada `SistemaContableDB` con estas tablas:

```sql
-- Tabla roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL
);

-- Tabla usuarios  
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(255) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol_id INTEGER REFERENCES roles(id)
);

-- Tabla permisos
CREATE TABLE permisos (
    id SERIAL PRIMARY KEY,
    rol_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    recurso VARCHAR(255) NOT NULL,
    accion VARCHAR(255) NOT NULL
);
```

### 2. Configuración Backend

1. Actualiza `backend/src/main/resources/application.properties` con tus credenciales de PostgreSQL
2. Ejecuta el backend:

```bash
cd backend
./mvnw spring-boot:run
```

### 3. Configuración Frontend

1. Instala dependencias:

```bash
npm install
```

2. Ejecuta el frontend:

```bash
npm run dev
```

## Funcionalidades

### Autenticación
- Login con usuario y contraseña
- Tokens JWT para sesiones
- Persistencia de sesión en localStorage

### Gestión de Usuarios (Solo Admin)
- Crear nuevos usuarios
- Eliminar usuarios existentes  
- Asignar roles a usuarios

### Dashboard
- Información de bienvenida personalizada
- Resumen de funcionalidades disponibles según rol
- Navegación intuitiva con sidebar

### Módulos Contables (Placeholders)
- Asientos Contables
- Plan de Cuentas
- Libro Diario
- Libro Mayor

## Arquitectura

### Backend (Spring Boot)
- **Entidades JPA**: Mapeo exacto de tablas existentes
- **Repositorios**: Queries optimizadas con Spring Data JPA
- **Servicios**: Lógica de negocio separada
- **Controladores REST**: Endpoints con validación
- **Seguridad JWT**: Autenticación y autorización

### Frontend (React + Vite)
- **Context API**: Estado global de autenticación
- **Servicios**: Capa de comunicación con API
- **Componentes modulares**: Arquitectura escalable
- **Tema oscuro**: Diseño moderno y elegante
- **TypeScript**: Tipado fuerte para mejor DX

## Próximos Pasos

1. Poblar la base de datos con roles y usuarios iniciales
2. Implementar módulos contables funcionales
3. Agregar validaciones adicionales
4. Implementar reportes y exportación