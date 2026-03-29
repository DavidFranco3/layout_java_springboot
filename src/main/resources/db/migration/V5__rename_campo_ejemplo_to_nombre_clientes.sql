CREATE TABLE IF NOT EXISTS clientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

-- Si la tabla ya existe y tiene campo_ejemplo, hay que renombrarlo
SET @clientTableExists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'clientes');
SET @campoEjemploExists = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'clientes' AND column_name = 'campo_ejemplo');

-- Prepared statement for dynamic alter table
SET @sql = IF(@clientTableExists > 0 AND @campoEjemploExists > 0,
    'ALTER TABLE clientes CHANGE campo_ejemplo nombre VARCHAR(255) NOT NULL',
    'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
