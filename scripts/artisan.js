import { spawnSync } from 'child_process';
import process from 'process';

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("=========================================");
    console.log("   Spring Boot Artisan Equivalence CLI   ");
    console.log("=========================================\n");
    console.log("Comandos disponibles:");
    console.log("  db:seed                     Puebla la base de datos con información por defecto (Usuarios, Empresa).");
    console.log("  modulos:scan                Escanea todos los Controladores para auto-generar Modulos y Permisos.");
    console.log("  admin:asignar <email>       Asigna el rol de Administrador a un usuario por su correo electrónico.");
    console.log("  migrate                     Ejecuta explícitamente las migraciones (esquema y Flyway).");
    process.exit(0);
}

const commandArgs = args.join(' ');
console.log(`⏳ Ejecutando proxy a Spring Boot: ${commandArgs}`);

try {
    const result = spawnSync('.\\mvnw.cmd', ['-q', 'spring-boot:run', `"-Dspring-boot.run.arguments=${commandArgs}"`], { stdio: 'inherit', shell: true });
    if (result.error) {
        throw result.error;
    }
    process.exit(result.status || 0);
} catch (error) {
    console.error("❌ Error al ejecutar el comando artisan.", error.message);
    process.exit(1);
}
