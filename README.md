# 🚀 Spring Boot + React + Inertia.js Layout

Este proyecto es una estructura base (layout) fullstack profesional diseñada para acelerar el desarrollo de aplicaciones web de alto rendimiento. Utiliza **Spring Boot** en el backend, **React** con **Vite** en el frontend, y **Inertia.js** como el puente que elimina la necesidad de crear una API REST tradicional.

Inspirado en el ecosistema de Laravel, este proyecto incluye herramientas avanzadas como un generador de CRUD y una CLI tipo Artisan para Spring Boot.

## ✨ Características Principales

- **🔄 Integración de Inertia.js**: Disfruta de la experiencia de usuario de una Single Page App (SPA) utilizando controladores y rutas de servidor clásicas.
- **🏗 Generador de CRUD**: Comando automático para crear Modelo, Repositorio, Servicio, Controlador, Vistas React (Índice y Formulario) y Migración SQL en segundos.
- **🛠 Spring Boot Artisan CLI**: Comandos personalizados para gestionar semillas, escaneo de módulos, permisos y migraciones desde la terminal.
- **🔐 Seguridad Integrada**: Configuración robusta de Spring Security.
- **📊 Gestión de Base de Datos**: Flyway para migraciones controladas de versiones de base de datos.
- **🎨 Diseño Moderno**: Frontend con Tailwind CSS 4, Framer Motion para animaciones, y SweetAlert2 para notificaciones.

## 🛠 Stack Tecnológico

### Backend
- **Java**: 21
- **Framework**: Spring Boot 3.4.3
- **ORM**: Spring Data JPA (Hibernate)
- **Seguridad**: Spring Security
- **Documentación**: SpringDoc OpenAPI (Swagger UI)
- **Utilidades**: Lombok, MapStruct, AOP
- **Migraciones**: Flyway

### Frontend
- **Framework**: React 19
- **Bundler**: Vite 7
- **Routing/State**: Inertia.js
- **Estilos**: Tailwind CSS 4, Bootstrap 5 (Soporte mixto)
- **Animaciones**: Framer Motion
- **Iconos**: React Icons, FontAwesome
- **Gráficos**: Chart.js
- **Utilidades**: Axios, React Hook Form, DayJS, XLSX, PDF Generation

## ⚙️ Requisitos Previos

- **JDK**: Versión 21 o superior.
- **Node.js**: Versión 18 o superior.
- **Base de Datos**: MySQL (Configurada por defecto).
- **Maven**: (Incluido mediante `mvnw`).

## 📦 Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd layout_java_springboot
   ```

2. **Configurar el entorno**: 
   Edita el archivo `src/main/resources/application.properties` con tus credenciales de base de Datos:
   ```properties
   db.host=127.0.0.1
   db.port=3306
   db.name=nombre_de_tu_bd
   spring.datasource.username=tu_usuario
   spring.datasource.password=tu_contraseña
   ```

3. **Instalar dependencias del Frontend**:
   ```bash
   npm install
   ```

## 💻 Uso en Desarrollo

Para iniciar el proyecto en modo desarrollo (Backend + Frontend con HMR):

```bash
npm run dev
```

Esto ejecutará simultáneamente:
- Spring Boot en `http://localhost:8080`
- Vite Dev Server en `http://localhost:5173`

## 🏗 Generador de CRUD

Puedes generar un módulo completo (Backend y Frontend) ejecutando el siguiente comando:

```bash
npm run make:crud-react <NombreDeEntidad>
```

**Ejemplo:**
```bash
npm run make:crud-react Producto
```

Esto generará automáticamente:
- `Producto.java` (Entidad JPA)
- `ProductoRepository.java`
- `ProductoService.java`
- `ProductoController.java` (Con endpoints de Inertia)
- `src/main/resources/js/Pages/Productos/Index.jsx` (Listado)
- `src/main/resources/js/Pages/Productos/Form.jsx` (Creación/Edición)
- `V<N>__create_productos_table.sql` (Migración Flyway)

## 🛠 Comandos Artisan (CLI)

Hemos implementado una interfaz similar a Laravel Artisan para tareas comunes:

- **Listar comandos**: `npm run artisan`
- **Poblar Base de Datos**: `npm run artisan db:seed`
- **Escanear Módulos/Permisos**: `npm run artisan modulos:scan`
- **Asignar Admin**: `npm run artisan admin:asignar <email>`
- **Ejecutar Migraciones**: `npm run artisan migrate`

---

## 📁 Estructura del Proyecto

- `src/main/java`: Código fuente Java (Spring Boot).
- `src/main/resources/js`: Código fuente React e Inertia.
- `src/main/resources/js/Pages`: Componentes de página (Vistas).
- `src/main/resources/db/migration`: Archivos de migración de Flyway (SQL).
- `scripts/`: Scripts de utilidad para la CLI y generación de código.
- `vite.config.js`: Configuración de compilación del frontend.
- `pom.xml`: Dependencias y plugins de Maven.
