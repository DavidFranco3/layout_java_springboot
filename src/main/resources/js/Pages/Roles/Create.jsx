/**
 * Componente Create - Formulario para crear nuevos roles
 * 
 * Este componente renderiza un formulario modal para la creación de nuevos roles
 * del sistema, permitiendo asignar permisos específicos a cada rol organizados
 * por módulos mediante un sistema de pestañas con scroll horizontal.
 * 
 * CAMBIOS IMPLEMENTADOS:
 * - Sistema de pestañas por módulos para organizar permisos
 * - Scroll horizontal para manejar múltiples módulos
 * - Scrollbar personalizada con estilos modernos
 * - Indicadores visuales de navegación
 * - Contadores de permisos por módulo
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.cerrarModal - Función para cerrar el modal
 * @param {Array} props.permisos - Lista de permisos disponibles para asignar
 * @param {Array} props.modulos - Lista de módulos para organizar pestañas
 */

import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Form, Button, Spinner, Nav, Tab } from "react-bootstrap";
import Swal from "sweetalert2";

/**
 * Estilos CSS personalizados para el scroll horizontal de pestañas
 * 
 * Estos estilos proporcionan una experiencia de usuario mejorada cuando hay
 * muchos módulos que no caben en el ancho disponible de la pantalla.
 * 
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * - Scrollbar horizontal delgada y estilizada (8px de altura)
 * - Desplazamiento suave entre pestañas (scroll-behavior: smooth)
 * - Colores que coinciden con el tema Bootstrap
 * - Hover effects para mejor interactividad
 * - Compatibilidad con navegadores webkit (Chrome, Safari, Edge)
 */
const tabScrollStyles = `
.custom-tabs-scroll::-webkit-scrollbar {
    height: 8px;                    /* Altura reducida para scrollbar más moderna */
}
.custom-tabs-scroll::-webkit-scrollbar-track {
    background: #f8f9fa;           /* Color de fondo del track (Bootstrap light) */
    border-radius: 4px;            /* Esquinas redondeadas */
}
.custom-tabs-scroll::-webkit-scrollbar-thumb {
    background: #6c757d;           /* Color del thumb (Bootstrap secondary) */
    border-radius: 4px;            /* Esquinas redondeadas */
}
.custom-tabs-scroll::-webkit-scrollbar-thumb:hover {
    background: #495057;           /* Color más oscuro en hover para feedback visual */
}
.custom-tabs-scroll {
    scroll-behavior: smooth;       /* Desplazamiento suave al navegar */
}
`;

export default function Create({ cerrarModal, permisos, modulos }) {
    /**
     * Hook useEffect para inyección de estilos CSS personalizados
     * 
     * FUNCIONALIDAD:
     * - Se ejecuta una sola vez al montar el componente
     * - Inyecta los estilos CSS necesarios para el scroll horizontal
     * - Incluye cleanup para remover los estilos al desmontar el componente
     * - Previene memory leaks mediante verificación de existencia del elemento
     */
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = tabScrollStyles;
        document.head.appendChild(style);
        
        // Cleanup: remueve los estilos al desmontar el componente
        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    // Estados del componente para manejo de pestañas y agrupación de permisos
    const [activeTab, setActiveTab] = useState('');              // Pestaña activa actual
    const [permisosPorModulo, setPermisosPorModulo] = useState({}); // Permisos agrupados por módulo

    /**
     * Hook de Inertia.js para manejar formularios
     * 
     * PROPIEDADES:
     * - data: contiene los valores actuales del formulario
     * - setData: función para actualizar valores del formulario
     * - post: función para enviar datos via POST
     * - processing: estado booleano que indica si hay una petición en curso
     * - reset: función para limpiar el formulario
     * - errors: objeto con errores de validación del servidor
     */
    const { data, setData, post, processing, reset, errors } = useForm({
        nombre: "",        // Nombre del rol
        permisos: [],      // Array de IDs de permisos asignados al rol
    });

    /**
     * Hook useEffect para agrupar permisos por módulos al cargar el componente
     * 
     * PROCESO DE AGRUPACIÓN:
     * 1. Itera sobre todos los permisos disponibles
     * 2. Agrupa por 'modulo_nombre' o 'Sin Módulo' si no existe
     * 3. Establece la primera pestaña como activa automáticamente
     * 4. Actualiza el estado con los grupos creados
     */
    useEffect(() => {
        if (permisos && permisos.length > 0) {
            // Agrupa los permisos por modulo_nombre
            const grupos = permisos.reduce((acc, permiso) => {
                const moduloNombre = permiso.modulo_nombre || 'Sin Módulo';
                if (!acc[moduloNombre]) {
                    acc[moduloNombre] = [];
                }
                acc[moduloNombre].push(permiso);
                return acc;
            }, {});
            
            setPermisosPorModulo(grupos);
            
            // Establece la primera pestaña como activa
            const primerModulo = Object.keys(grupos)[0];
            if (primerModulo) {
                setActiveTab(primerModulo);
            }
        }
    }, [permisos]);

    /**
     * Maneja el envío del formulario
     * 
     * PROCESO:
     * 1. Previene el comportamiento por defecto del formulario
     * 2. Envía los datos al endpoint de creación de roles
     * 3. Maneja respuestas de éxito y error con notificaciones SweetAlert
     * 4. Cierra el modal y limpia el formulario en caso de éxito
     * 
     * @param {Event} e - Evento del formulario
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        // Envía los datos al endpoint de creación de roles
        post(route("roles.store"), {
            // Callback ejecutado cuando la petición es exitosa
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "Rol registrado correctamente",
                    showConfirmButton: false,
                    timer: 2000,
                });
                cerrarModal();  // Cierra el modal
                reset();        // Limpia el formulario
            },
            // Callback ejecutado cuando hay errores
            onError: () => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al registrar el rol",
                    confirmButtonColor: "#d33",
                });
            },
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            {/* Campo de entrada para el nombre del rol */}
            <Form.Group className="mb-3" controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Ingrese nombre"
                    value={data.nombre}
                    isInvalid={!!errors.nombre}  // Muestra estado de error si existe
                    onChange={(e) => setData("nombre", e.target.value)}
                />
                {/* Muestra mensaje de error de validación */}
                <Form.Control.Feedback type="invalid">
                    {errors.nombre}
                </Form.Control.Feedback>
            </Form.Group>

            {/* 
             * SECCIÓN DE SELECCIÓN DE PERMISOS CON PESTAÑAS
             * 
             * IMPLEMENTACIÓN DE SCROLL HORIZONTAL:
             * Esta sección implementa un sistema de pestañas con scroll horizontal
             * para manejar múltiples módulos sin amontonar la interfaz.
             */}
            <Form.Group className="mb-3">
                <Form.Label>Permisos por Módulo</Form.Label>
                
                {/* Sistema de pestañas para mostrar permisos por módulos */}
                <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
                    {/* 
                     * CONTENEDOR DE NAVEGACIÓN CON SCROLL HORIZONTAL
                     * 
                     * PROPIEDADES CLAVE:
                     * - overflowX: "auto" - Activa scroll horizontal cuando es necesario
                     * - overflowY: "hidden" - Evita scroll vertical no deseado
                     * - whiteSpace: "nowrap" - Mantiene las pestañas en una sola línea
                     * - scrollbarWidth/scrollbarColor - Estilos para Firefox
                     * - className "custom-tabs-scroll" - Aplica estilos webkit personalizados
                     */}
                    <div style={{ 
                        overflowX: "auto",              // Scroll horizontal automático
                        overflowY: "hidden",            // Sin scroll vertical
                        whiteSpace: "nowrap",           // Pestañas en una línea
                        marginBottom: "1rem",           // Espaciado inferior
                        paddingBottom: "2px",           // Espacio para la scrollbar
                        scrollbarWidth: "thin",         // Scrollbar delgada (Firefox)
                        scrollbarColor: "#6c757d #f8f9fa" // Colores scrollbar (Firefox)
                    }}
                    className="custom-tabs-scroll"      // Clase para estilos webkit
                    >
                        {/* Navegación de pestañas optimizada para scroll horizontal */}
                        <Nav 
                            variant="tabs" 
                            className="flex-nowrap"         // Evita wrap de pestañas
                            style={{ 
                                minWidth: "max-content",    // Ancho mínimo necesario
                                borderBottom: "1px solid #dee2e6" // Borde consistente
                            }}
                        >
                            {Object.keys(permisosPorModulo).map((moduloNombre) => (
                                <Nav.Item key={moduloNombre} style={{ flexShrink: 0 }}>
                                    {/* 
                                     * PESTAÑA INDIVIDUAL OPTIMIZADA
                                     * 
                                     * ESTILOS APLICADOS:
                                     * - whiteSpace: "nowrap" - Texto en una línea
                                     * - minWidth: "fit-content" - Ancho ajustado al contenido
                                     * - padding optimizado - 12px horizontal para mejor uso del espacio
                                     * - fontSize reducido - 0.9rem para ahorrar espacio
                                     */}
                                    <Nav.Link 
                                        eventKey={moduloNombre}
                                        style={{ 
                                            whiteSpace: "nowrap",       // Texto en una línea
                                            minWidth: "fit-content",    // Ancho ajustado al contenido
                                            paddingLeft: "12px",        // Padding optimizado
                                            paddingRight: "12px",       // Padding optimizado
                                            fontSize: "0.9rem"          // Tamaño de fuente reducido
                                        }}
                                    >
                                        {moduloNombre}
                                        {/* Badge con contador de permisos por módulo */}
                                        <span 
                                            className="badge bg-secondary ms-2" 
                                            style={{ fontSize: "0.7rem" }} // Badge más pequeño
                                        >
                                            {permisosPorModulo[moduloNombre].length}
                                        </span>
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                        
                        {/* 
                         * INDICADOR VISUAL DE SCROLL HORIZONTAL
                         * 
                         * FUNCIONALIDAD:
                         * - Solo se muestra cuando hay más de 5 módulos
                         * - Proporciona feedback visual al usuario sobre la navegación
                         * - Incluye icono FontAwesome para mejor UX
                         */}
                        {Object.keys(permisosPorModulo).length > 5 && (
                            <div className="text-center mt-1">
                                <small className="text-muted">
                                    <i className="fas fa-arrows-alt-h me-1"></i>
                                    Desliza horizontalmente para ver más módulos
                                </small>
                            </div>
                        )}
                    </div>

                    {/* Contenido de cada pestaña con la tabla de permisos */}
                    <Tab.Content>
                        {Object.entries(permisosPorModulo).map(([moduloNombre, permisosDelModulo]) => (
                            <Tab.Pane key={moduloNombre} eventKey={moduloNombre}>
                                {/* Contenedor con scroll para la tabla de permisos del módulo activo */}
                                <div style={{ maxHeight: 250, overflowY: "auto", border: "1px solid #eee", borderRadius: 6 }}>
                                    <table className="table table-sm mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Permiso</th>
                                                <th width="80">Seleccionar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Renderiza cada permiso del módulo seleccionado */}
                                            {permisosDelModulo.map((permiso) => (
                                                <tr key={permiso.id}>
                                                    <td>
                                                        <strong>{permiso.name}</strong>
                                                    </td>
                                                    <td className="text-center">
                                                        {/* Switch para seleccionar/deseleccionar permisos */}
                                                        <Form.Check
                                                            type="switch"
                                                            id={`permiso-switch-${permiso.id}`}
                                                            checked={data.permisos.includes(permiso.id)}
                                                            onChange={(e) => {
                                                                const checked = e.target.checked;
                                                                const permisoId = permiso.id;

                                                                // Actualiza la lista de permisos según el estado del switch
                                                                if (checked) {
                                                                    // Agrega el permiso a la lista
                                                                    setData("permisos", [...data.permisos, permisoId]);
                                                                } else {
                                                                    // Remueve el permiso de la lista
                                                                    setData("permisos", data.permisos.filter((id) => id !== permisoId));
                                                                }
                                                            }}
                                                            label=""
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                            
                                            {/* Mensaje cuando no hay permisos en el módulo */}
                                            {permisosDelModulo.length === 0 && (
                                                <tr>
                                                    <td colSpan="2" className="text-center text-muted py-3">
                                                        No hay permisos disponibles para este módulo
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Información adicional del módulo */}
                                <div className="mt-2">
                                    <small className="text-muted">
                                        Módulo: <strong>{moduloNombre}</strong> | 
                                        Permisos disponibles: <strong>{permisosDelModulo.length}</strong> | 
                                        Seleccionados en este módulo: <strong>
                                            {permisosDelModulo.filter(p => data.permisos.includes(p.id)).length}
                                        </strong>
                                    </small>
                                </div>
                            </Tab.Pane>
                        ))}
                    </Tab.Content>
                </Tab.Container>

                {/* Resumen de permisos seleccionados */}
                {data.permisos.length > 0 && (
                    <div className="mt-3 p-2 bg-light rounded">
                        <small className="text-success">
                            <strong>Total de permisos seleccionados: {data.permisos.length}</strong>
                        </small>
                    </div>
                )}

                {/* Muestra errores de validación para permisos */}
                {errors.permisos && (
                    <div className="invalid-feedback d-block">{errors.permisos}</div>
                )}
            </Form.Group>

            {/* Botón de envío del formulario */}
            <div className="text-center mt-4">
                <Button
                    type="submit"
                    disabled={processing}  // Se deshabilita durante el procesamiento
                    style={{
                        backgroundColor: "#2C3E50",
                        border: "none",
                        padding: "0.5rem 1.5rem",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: "#fff",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {/* Cambia el contenido del botón según el estado de procesamiento */}
                    {processing ? (
                        <>
                            <Spinner
                                animation="border"
                                size="sm"
                                role="status"
                                style={{
                                    marginRight: "8px",
                                    verticalAlign: "text-bottom",
                                }}
                            />
                            Guardando...
                        </>
                    ) : (
                        "Guardar"
                    )}
                </Button>
            </div>
        </Form>
    );
}
