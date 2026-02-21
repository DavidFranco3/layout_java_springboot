/**
 * Componente Acciones - Formulario multipropósito para operaciones CRUD de roles
 * 
 * Este componente maneja las acciones de editar y eliminar roles del sistema.
 * Utiliza react-hook-form para el manejo del formulario y permite la asignación
 * de permisos mediante switches interactivos.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.setShow - Función para controlar la visibilidad del modal
 * @param {Object} props.data - Datos del rol a procesar (nombre, permisos, etc.)
 * @param {string} props.accion - Tipo de acción a realizar ("editar" | "eliminar")
 */

import React from "react";
import { useEffect, useState } from 'react';
import { Spinner, Button, Form, Row, Col, Nav, Tab } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { router } from '@inertiajs/react';
import Swal from "sweetalert2";

// Estilos CSS personalizados para el scroll de pestañas
const tabScrollStyles = `
.custom-tabs-scroll::-webkit-scrollbar {
    height: 8px;
}
.custom-tabs-scroll::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 4px;
}
.custom-tabs-scroll::-webkit-scrollbar-thumb {
    background: #6c757d;
    border-radius: 4px;
}
.custom-tabs-scroll::-webkit-scrollbar-thumb:hover {
    background: #495057;
}
.custom-tabs-scroll {
    scroll-behavior: smooth;
}
`;

const Acciones = ({ setShow, data, accion }) => {
    // Inyecta los estilos CSS
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = tabScrollStyles;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);
    /**
     * Hook de react-hook-form para manejar el formulario
     * - register: registra campos en el formulario
     * - handleSubmit: maneja el envío del formulario
     * - formState.errors: errores de validación
     * - setValue: establece valores programáticamente
     * - watch: observa cambios en campos específicos
     */
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            name: data?.name || '',        // Nombre del rol (valor inicial)
            permisos: data?.permisos || [] // Permisos del rol (array de IDs)
        }
    });

    // Estados locales del componente
    const [permisos, setPermisos] = useState([]);      // Lista de todos los permisos disponibles
    const [isLoading, setIsLoading] = useState(false); // Estado de carga durante peticiones
    const [activeTab, setActiveTab] = useState('');    // Pestaña activa para módulos
    const [permisosPorModulo, setPermisosPorModulo] = useState({}); // Permisos agrupados por módulo

    /**
     * Observadores para detectar cambios en tiempo real en los campos del formulario
     * Esto permite que la UI se actualice automáticamente cuando cambian los valores
     */
    const watchedName = watch('name');         // Observa cambios en el nombre
    const watchedPermisos = watch('permisos'); // Observa cambios en los permisos

    /**
     * Define la etiqueta del botón según la acción a realizar
     */
    const buttonLabel = accion === 'registrar'
        ? 'Guardar'
        : accion === 'editar'
            ? 'Actualizar'
            : 'Eliminar';

    /**
     * Hook useEffect para inicialización del componente
     * Se ejecuta cuando cambian las dependencias: data o accion
     */
    useEffect(() => {
        getPermisos(); // Carga la lista de permisos disponibles

        // Establece valores iniciales cuando se está editando un rol existente
        if (data && accion === 'editar') {
            setValue('name', data.name || '');        // Establece el nombre del rol
            setValue('permisos', data.permisos || []); // Establece los permisos asignados
        }
    }, [data, accion]);

    /**
     * Hook useEffect para agrupar permisos por módulos cuando se cargan
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

            // Establece la primera pestaña como activa si no hay una seleccionada
            if (!activeTab && Object.keys(grupos).length > 0) {
                setActiveTab(Object.keys(grupos)[0]);
            }
        }
    }, [permisos]);

    /**
     * Maneja el envío del formulario según la acción especificada
     * Utiliza Inertia.js router para las peticiones HTTP
     * 
     * @param {Object} formData - Datos del formulario validados
     */
    const onFormSubmit = async (formData) => {
        setIsLoading(true); // Activa el estado de carga

        try {
            if (accion === "editar") {
                // Actualiza el rol existente usando PUT request
                router.put(route('roles.update', data.id), {
                    name: formData.name,
                    permisos: formData.permisos
                }, {
                    // Callback ejecutado en caso de éxito
                    onSuccess: () => {
                        Swal.fire({
                            icon: "success",
                            title: "Éxito",
                            text: "Rol actualizado correctamente",
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        setShow(false); // Cierra el modal
                    },
                    // Callback ejecutado en caso de error
                    onError: (errors) => {
                        console.error("Error:", errors);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Hubo un problema al actualizar el rol",
                            confirmButtonColor: "#d33",
                        });
                    },
                    // Callback ejecutado al finalizar (éxito o error)
                    onFinish: () => {
                        setIsLoading(false); // Desactiva el estado de carga
                    }
                });
            } else if (accion === "eliminar") {
                // Elimina el rol usando DELETE request
                router.delete(route('roles.destroy', data.id), {
                    onSuccess: () => {
                        Swal.fire({
                            icon: "success",
                            title: "Éxito",
                            text: "Rol eliminado correctamente",
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        setShow(false); // Cierra el modal
                    },
                    onError: (errors) => {
                        console.error("Error:", errors);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Hubo un problema al eliminar el rol",
                            confirmButtonColor: "#d33",
                        });
                    },
                    onFinish: () => {
                        setIsLoading(false); // Desactiva el estado de carga
                    }
                });
            } else {
                // Acción no reconocida - la creación se maneja en otro componente
                Swal.fire({
                    icon: "info",
                    title: "Acción no reconocida",
                    text: "La creación de roles se gestiona en otro componente.",
                    confirmButtonColor: "#3085d6",
                });
                setIsLoading(false);
            }

        } catch (error) {
            console.error("Error:", error);
            setIsLoading(false);
        }
    };

    /**
     * Obtiene la lista de permisos disponibles desde el servidor
     * Utiliza axios para hacer una petición GET al endpoint de permisos
     */
    const getPermisos = async () => {
        try {
            const response = await axios.get(route('roles.getPermisos'));
            setPermisos(response.data.data); // Actualiza el estado con los permisos obtenidos
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    }

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Row>
                <Col>
                    {/* Campo de entrada para el nombre del rol */}
                    <Form.Group className="mb-3" controlId="formNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese nombre"
                            {...register('name', { required: 'El nombre es requerido' })}
                            isInvalid={!!errors.name}
                        />
                        {/* Mensaje de error de validación */}
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Sección de gestión de permisos organizados por módulos */}
                    <Form.Group className="mb-3">
                        <Form.Label>Permisos por Módulo</Form.Label>

                        {/* Sistema de pestañas para mostrar permisos por módulos */}
                        <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
                            {/* Navegación de pestañas con nombres de módulos - Con scroll horizontal */}
                            <div style={{
                                overflowX: "auto",
                                overflowY: "hidden",
                                whiteSpace: "nowrap",
                                marginBottom: "1rem",
                                paddingBottom: "2px",
                                // Estilos de scrollbar personalizados
                                scrollbarWidth: "thin",
                                scrollbarColor: "#6c757d #f8f9fa"
                            }}
                                className="custom-tabs-scroll"
                            >
                                <Nav
                                    variant="tabs"
                                    className="flex-nowrap"
                                    style={{
                                        minWidth: "max-content",
                                        borderBottom: "1px solid #dee2e6"
                                    }}
                                >
                                    {Object.keys(permisosPorModulo).map((moduloNombre) => (
                                        <Nav.Item key={moduloNombre} style={{ flexShrink: 0 }}>
                                            <Nav.Link
                                                eventKey={moduloNombre}
                                                style={{
                                                    whiteSpace: "nowrap",
                                                    minWidth: "fit-content",
                                                    paddingLeft: "12px",
                                                    paddingRight: "12px",
                                                    fontSize: "0.9rem"
                                                }}
                                            >
                                                {moduloNombre}
                                                <span className="badge bg-secondary ms-2" style={{ fontSize: "0.7rem" }}>
                                                    {permisosPorModulo[moduloNombre].length}
                                                </span>
                                            </Nav.Link>
                                        </Nav.Item>
                                    ))}
                                </Nav>

                                {/* Indicador visual de scroll */}
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
                                                        {/* <th>Descripción</th> */}
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
                                                            {/* <td>
                                                                <small className="text-muted">
                                                                    {permiso.description || 'Sin descripción'}
                                                                </small>
                                                            </td> */}
                                                            <td className="text-center">
                                                                {/* Switch para seleccionar/deseleccionar permisos */}
                                                                <Form.Check
                                                                    type="switch"
                                                                    id={`permiso-switch-${permiso.id}`}
                                                                    checked={watchedPermisos.includes(permiso.id)}
                                                                    onChange={(e) => {
                                                                        const checked = e.target.checked;
                                                                        const permisoId = permiso.id;
                                                                        const currentPermisos = watchedPermisos || [];

                                                                        // Actualiza la lista de permisos según el estado del switch
                                                                        if (checked) {
                                                                            // Agrega el permiso a la lista
                                                                            setValue("permisos", [...currentPermisos, permisoId]);
                                                                        } else {
                                                                            // Remueve el permiso de la lista
                                                                            setValue("permisos", currentPermisos.filter((id) => id !== permisoId));
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
                                                            <td colSpan="3" className="text-center text-muted py-3">
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
                                                    {permisosDelModulo.filter(p => watchedPermisos.includes(p.id)).length}
                                                </strong>
                                            </small>
                                        </div>
                                    </Tab.Pane>
                                ))}
                            </Tab.Content>
                        </Tab.Container>

                        {/* Resumen de permisos seleccionados */}
                        {watchedPermisos && watchedPermisos.length > 0 && (
                            <div className="mt-3 p-2 bg-light rounded">
                                <small className="text-success">
                                    <strong>Total de permisos seleccionados: {watchedPermisos.length}</strong>
                                </small>
                            </div>
                        )}

                        {/* Mensaje de error para validación de permisos */}
                        {errors.permisos && (
                            <div className="invalid-feedback d-block">{errors.permisos?.message}</div>
                        )}
                    </Form.Group>
                </Col>
            </Row>

            {/* Botón de acción dinámico según el tipo de operación */}
            <Button
                variant={accion === "eliminar" ? "danger" : "primary"}
                type="submit"
                disabled={isLoading}
            >
                {/* Muestra spinner durante la carga o el texto del botón */}
                {isLoading ? <Spinner size="sm" animation="border" /> : buttonLabel}
            </Button>
        </Form>
    );
};

export default Acciones;