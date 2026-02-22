CREATE TABLE IF NOT EXISTS empresas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(255),
    email VARCHAR(255),
    giro VARCHAR(255),
    rfc VARCHAR(255),
    razon_social VARCHAR(255),
    tipo_persona VARCHAR(255),
    calle VARCHAR(255),
    numero_exterior VARCHAR(255),
    numero_interior VARCHAR(255),
    colonia VARCHAR(255),
    municipio VARCHAR(255),
    estado VARCHAR(255),
    cp VARCHAR(255),
    regimen_fiscal VARCHAR(255),
    uso_cfdi VARCHAR(255),
    status BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS configuracion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    colores VARCHAR(255),
    logo VARCHAR(255),
    id_datos_empresa BIGINT,
    id_persona_facturacion BIGINT,
    nombre_comercial VARCHAR(255) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_configuracion_empresa FOREIGN KEY (id_datos_empresa) REFERENCES empresas(id)
);
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    email_verified_at TIMESTAMP,
    password VARCHAR(255),
    remember_token VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
CREATE TABLE modulos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255)
);
CREATE TABLE permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    guard_name VARCHAR(255) NOT NULL DEFAULT 'web',
    modulo_id BIGINT,
    CONSTRAINT fk_permission_modulo FOREIGN KEY (modulo_id) REFERENCES modulos(id)
);
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    guard_name VARCHAR(255) NOT NULL DEFAULT 'web'
);
CREATE TABLE role_has_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rhp_role FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_rhp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id)
);
CREATE TABLE auditoria_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    model VARCHAR(255) NOT NULL,
    model_id BIGINT,
    accion VARCHAR(255) NOT NULL,
    datos_anteriores TEXT,
    datos_nuevos TEXT,
    ip VARCHAR(255),
    user_agent VARCHAR(255),
    url VARCHAR(255),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auditoria_users FOREIGN KEY (user_id) REFERENCES users(id)
);