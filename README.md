# 🚀 Spring Boot + React (REST API) Layout

Este proyecto es una estructura base (layout) fullstack profesional diseñada para acelerar el desarrollo de aplicaciones web de alto rendimiento. Utiliza **Spring Boot** en el backend como una API RESTful robusta, y una Single Page Application (SPA) integrada construida con **React**, **Vite** y **React Router DOM** en el frontend.

Inspirado en ecosistemas ágiles modernos, este proyecto incluye herramientas avanzadas como un generador automático de código (CRUD) y una CLI tipo Artisan para gestionar recursos directamente desde la consola.

## ✨ Características Principales

- **🔄 Arquitectura RESTful SPA**: Separación limpia entre el backend (JSON API) y frontend (navegación del lado del cliente vía React Router), servidos y coordinados eficientemente bajo un único empaquetado.
- **🏗 Generador de CRUD REST**: Comando automático para crear la Entidad, el Repositorio, Servicio, Controlador API, DTO, Mapeador (MapStruct), Vistas en React (Tabla y Formularios adaptados a `react-hook-form`) y su respectiva Migración de base de datos SQL. ¡Todo en segundos!
- **📋 Formularios Dinámicos**: Integración completa con `react-hook-form` para validación fluida en el cliente y sincronización estricta de validaciones del servidor.
- **🛠 Spring Boot Artisan CLI**: Comandos de consola personalizados implementados como scripts Node para inicializar semillas (seeders), escanear permisos y rutas, o despachar migraciones fácilmente.
- **🔐 Seguridad y Roles**: Gestión dinámica de usuarios, roles y permisos usando un enfoque desacoplado, auditado vía AOP y protegido por Spring Security.
- **📊 Gestión de Base de Datos**: Migraciones controladas por versiones utilizando **Flyway**.
- **🎨 Diseño Moderno y UI Premium**: Frontend impulsado nativamente por **Tailwind CSS 4**, con animaciones fluidas (Framer Motion) y librerías de alerta (SweetAlert2).

## 🛠 Stack Tecnológico

### Backend
- **Java**: 21
- **Framework**: Spring Boot 3.4.x
- **Arquitectura**: RESTful JSON API
- **ORM**: Spring Data JPA (Hibernate)
- **Seguridad**: Spring Security
- **Documentación API**: SpringDoc OpenAPI (Swagger UI)
- **Autogeneración y Utilidades**: Lombok, MapStruct, AspectJ (AOP)
- **Control de Esquemas**: FlywayDb

### Frontend
- **Librería Core**: React 19
- **Bundler y Servidor**: Vite 7
- **Enrutamiento**: React Router DOM (v6/v7)
- **Gestión de Formularios**: React Hook Form
- **Peticiones HTTP**: Axios
- **Estilos**: Tailwind CSS 4 + Componentes modulares
- **Animaciones e Interfaz**: Framer Motion, FontAwesome Elementos
- **Utilidades Extra**: SweetAlert2, DayJS, herramientas de exportación PDF/XLSX.

## ⚙️ Requisitos Previos

- **JDK**: Versión 21 o superior.
- **Node.js**: Versión 18 o superior.
- **Base de Datos**: MySQL (La estructura soporta portabilidad mediante dialectos JPA).
- **Maven**: Se incluye su Wrapper (`mvnw`).

## 📦 Instalación y Configuración

1. **Clonar el repositorio y entrar al proyecto**:
   ```bash
   git clone <url-del-repositorio>
   cd layout_java_springboot
   ```

2. **Configurar el entorno**: 
   Edita el archivo `src/main/resources/application.properties` con tus credenciales de base de Datos para tu entorno local:
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

Para iniciar el proyecto en modo desarrollo completo (Backend con auto-recarga y Frontend con Hot Module Replacement HMR):

```bash
npm run dev
```

Esto ejecutará simultáneamente mediante `concurrently`:
1. El compilador de Spring Boot (`mvnw spring-boot:run`) sirviendo la API REST en `http://localhost:8080`.
2. Vite Dev Server escuchando los cambios de UI en `http://localhost:5173`.

> **Nota**: Vite expone los asests para la SPA y redirige peticiones de la API de `/api/*` hacia el servidor backend, permitiendo evitar problemas de CORS durante desarrollo.

## 🏗 Generador de CRUD

Puedes generar un módulo completo fullstack (Backend REST y UI Frontend) ejecutando:

```bash
npm run make:crud-react <NombreDeEntidad>
```

**Ejemplo:**
```bash
npm run make:crud-react Empresa
```

Esto andamiará las siguientes capas de arquitectura automáticamente:
- `Empresa.java` (Entidad JPA) y `EmpresaDTO.java`
- `EmpresaMapper.java` (MapStruct)
- `EmpresaRepository.java` y `EmpresaService.java`
- `EmpresaController.java` (Endpoints REST: GET, POST, PUT, DELETE)
- `src/main/resources/js/Pages/Empresas/Index.jsx` (Listado y Data Table asíncrono)
- `src/main/resources/js/Pages/Empresas/Form.jsx` (Formulario conectado con `react-hook-form` y validación de errores del backend).
- `V<NN>__create_empresas_table.sql` (Migración automática detectada en Flyway)

## 🛠 Comandos CLI Tipo Artisan

Disponemos de utilidades estilo Laravel Artisan portadas a Node en la carpeta `scripts/` para simplificar operaciones repetitivas de desarrollo:

- **Listar comandos disponibles**: `npm run artisan`
- **Poblar Base de Datos (Seeder)**: `npm run artisan db:seed`
- **Escanear y Autoregistrar Módulos/Permisos**: `npm run artisan modulos:scan`
- **Crear/Asignar Super Admin**: `npm run artisan admin:asignar <email>`
- **Despachar Migraciones Manuales**: `npm run artisan migrate`

---

## 📁 Estructura General del Proyecto

- `src/main/java`: Backend código Java Spring Boot estructurado en paquetes MVC y servicios.
- `src/main/resources/js`: Código fuente Frontend (React + Router + Componentes).
- `src/main/resources/js/Pages`: Views / Páginas SPA del Frontend.
- `src/main/resources/db/migration`: Archivos de control de versión de estructura SQL (Flyway).
- `scripts/`: Herramientas custom de Node JS implementadas para automatizaciones (CLI Crud y Artisan).
- `vite.config.js`: Configuración del HMR de UI y Webpack moderno.
- `pom.xml`: Administrador de dependencias (Maven).
