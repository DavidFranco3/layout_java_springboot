import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

const GuiaConfiguracionSistema = ({
    validaciones = [],
    setValidacionCompleta,
}) => {
    const [problemas, setProblemas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ejecutarValidaciones = async () => {
            setLoading(true);
            const pendientes = [];

            for (const v of validaciones) {
                try {
                    const resultado = await v.validar();
                    if (!resultado) {
                        pendientes.push(v);
                    }
                } catch {
                    pendientes.push({
                        mensaje: `Error al validar: ${v.mensaje}`,
                    });
                }
            }

            setProblemas(pendientes);
            setValidacionCompleta(pendientes.length === 0);
            setLoading(false);
        };

        ejecutarValidaciones();
    }, []);

    if (loading) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" variant="secondary" />
                <p className="mt-2 text-muted" style={{ fontSize: "0.9rem" }}>
                    Verificando configuración del sistema...
                </p>
            </div>
        );
    }

    if (problemas.length === 0) return null;

    return (
        <div className="p-3">
            <div
                style={{
                    background: "#fdf6e3",
                    border: "1px solid #f0e6c8",
                    borderRadius: "8px",
                    padding: "20px",
                    color: "#6c4e09",
                    fontSize: "0.95rem",
                }}
            >
                <h6 style={{ fontWeight: "600", marginBottom: "12px" }}>
                    ⚠️ Se requieren configuraciones antes de continuar
                </h6>
                <ul
                    style={{
                        listStyle: "none",
                        paddingLeft: 0,
                        marginBottom: 0,
                    }}
                >
                    {problemas.map((p, i) => (
                        <li
                            key={i}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "10px",
                                borderBottom: "1px solid #eee",
                                paddingBottom: "8px",
                            }}
                        >
                            <span style={{ flex: 1 }}>{p.mensaje}</span>
                            {(p.href || p.accion) && (
                                <>
                                    {p.href ? (
                                        <a
                                            href={p.href}
                                            className="minimal-button"
                                            style={{
                                                padding: "4px 12px",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                                fontSize: "0.85rem",
                                                background: "#fff",
                                                textDecoration: "none",
                                                color: "#333",
                                            }}
                                        >
                                            {p.textoBoton || "Ir"}
                                        </a>
                                    ) : (
                                        <button
                                            onClick={p.accion}
                                            className="minimal-button"
                                            style={{
                                                padding: "4px 12px",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                                fontSize: "0.85rem",
                                                background: "#fff",
                                                color: "#333",
                                            }}
                                        >
                                            {p.textoBoton || "Ir"}
                                        </button>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GuiaConfiguracionSistema;

/**
 * Componente: GuiaConfiguracionSistema
 * ------------------------------------
 * Este componente presenta una alerta visual al usuario si existen configuraciones
 * del sistema que aún no se han completado. Evalúa una serie de validaciones asincrónicas
 * y muestra una lista de pendientes con acciones sugeridas (botón o enlace).
 *
 * Props esperadas:
 * - validaciones: Array de objetos con la siguiente estructura:
 *   {
 *     mensaje: "Texto a mostrar si la validación falla",
 *     validar: async () => boolean, // función que retorna true si pasa, false si falla
 *     textoBoton: "Texto del botón", // opcional
 *     href: "/ruta",                 // opcional, si se quiere redirigir
 *     accion: () => {}              // opcional, función alternativa al href
 *   }
 *
 * - setValidacionCompleta: Función booleana para indicar si todas las validaciones pasaron.
 *
 * Ejemplo de uso:
 * useState
 * const [todoValido, setTodoValido] = useState(false);
 * En la parte superiro antes del return 
 * const validaciones = [
         
         {
             mensaje: "No hay productos registrados.",
             validar: async () => {
                 const { data } = await axios.get(route("productos.validarExistencia"));
                 return data.existen;
                 
             },
             href: route("productos.index"),
             textoBoton: "Registrar productos",
             
         },
     ];
 */

/**
 * font
 *   <GuiaConfiguracionSistema
        validaciones={validaciones}
        setValidacionCompleta={setTodoValido}
     />
    {todoValido && ( <componente contenedor> </> )}
 */
