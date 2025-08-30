# Sistema Contable - Backend

Backend desarrollado en Spring Boot para el Sistema Contable.

## Configuración

### Base de Datos

El sistema está configurado para conectarse a PostgreSQL con las siguientes tablas:

- **usuarios**: id, nombre_usuario, contrasena, rol_id
- **roles**: id, nombre  
- **permisos**: id, rol_id, recurso, accion

### Variables de Configuración

Actualiza `src/main/resources/application.properties` con tus credenciales:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/SistemaContableDB
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
```

### Ejecución

```bash
# Compilar y ejecutar
./mvnw spring-boot:run

# O con Maven instalado
mvn spring-boot:run
```

El servidor estará disponible en `http://localhost:8080`

## Endpoints

### Autenticación
- `POST /api/auth/login` - Login de usuario

### Gestión de Usuarios (Solo Admin)
- `GET /api/usuarios` - Obtener todos los usuarios
- `POST /api/usuarios` - Crear nuevo usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario
- `GET /api/usuarios/roles` - Obtener todos los roles

## Seguridad

- Autenticación JWT
- Contraseñas hasheadas con BCrypt
- Autorización basada en roles y permisos
- CORS configurado para frontend en localhost:5173