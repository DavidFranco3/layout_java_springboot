@echo off
if "%~1"=="" (
    echo Error: Debes especificar el nombre de la Entidad. (Ej. npm run make:crud-react Cliente^)
    exit /b 1
)

echo Generando CRUD para la Entidad: %~1

call .\mvnw -q compile exec:java -Dexec.mainClass="com.example.demo.generator.CrudGenerator" -Dexec.args="%~1" -Dexec.classpathScope=runtime

if %ERRORLEVEL% neq 0 (
    echo ❌ Hubo un error al generar el CRUD. Revisa la salida de Maven.
    exit /b %ERRORLEVEL%
)

echo ✅ Script completado con exito.
