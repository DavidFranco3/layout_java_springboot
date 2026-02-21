/**
 * Componente Acciones - Formulario multipropósito para operaciones CRUD de usuarios
 * 
 * Este componente maneja las acciones de editar y eliminar usuarios del sistema.
 * Solo permite editar el nombre y el rol del usuario, manteniendo la simplicidad
 * y evitando modificaciones complejas de datos sensibles.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.setShow - Función para controlar la visibilidad del modal
 * @param {Object} props.data - Datos del usuario a procesar (nombre, rol, etc.)
 * @param {string} props.accion - Tipo de acción a realizar ("editar" | "eliminar")
 * @param {Array} props.roles - Lista de roles disponibles para asignar
 */

import React from "react";
import { useEffect, useState } from 'react';
import { Spinner, Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { router } from '@inertiajs/react';
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";

const Acciones = ({ setShow, data, accion, roles }) => {
    // Hook para verificación de permisos
    const { user, rolNombre, hasPermission } = useAuth();

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
            name: data?.name || '',        // Nombre del usuario (valor inicial)
            rol_id: data?.rol_id || ''     // ID del rol asignado al usuario
        }
    });

    // Estados locales del componente
    const [isLoading, setIsLoading] = useState(false); // Estado de carga durante peticiones

    /**
     * Verificación de permisos según la acción
     */
    const permisoRequerido = accion === 'editar' ? 'editar users' : 'eliminar users';
    const tienePermiso = hasPermission(permisoRequerido);

    // Si no tiene el permiso necesario, mostrar mensaje de error
    if (!tienePermiso) {
        return (
            <div className="text-center p-4">
                <div className="alert alert-danger">
                    <h5><i className="fas fa-exclamation-triangle"></i> Acceso Denegado</h5>
                    <p>No tienes permisos para {accion} usuarios.</p>
                    <p><strong>Tu rol:</strong> {rolNombre || 'Sin asignar'}</p>
                    <p><strong>Permiso requerido:</strong> {permisoRequerido}</p>
                </div>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Cerrar
                </Button>
            </div>
        );
    }

    /**
     * Observadores para detectar cambios en tiempo real en los campos del formulario
     * Esto permite que la UI se actualice automáticamente cuando cambian los valores
     */
    const watchedName = watch('name');     // Observa cambios en el nombre
    const watchedRolId = watch('rol_id');  // Observa cambios en el rol

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
        // Establece valores iniciales cuando se está editando un usuario existente
        if (data && accion === 'editar') {
            setValue('name', data.name || '');        // Establece el nombre del usuario
            setValue('rol_id', data.rol_id || '');    // Establece el rol asignado
        }
    }, [data, accion]);

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
                // Actualiza el usuario existente usando PUT request
                router.put(route('users.update', data.id), {
                    rol_id: formData.rol_id
                }, {
                    // Callback ejecutado en caso de éxito
                    onSuccess: () => {
                        Swal.fire({
                            icon: "success",
                            title: "Éxito",
                            text: "Usuario actualizado correctamente",
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
                            text: "Hubo un problema al actualizar el usuario",
                            confirmButtonColor: "#d33",
                        });
                    },
                    // Callback ejecutado al finalizar (éxito o error)
                    onFinish: () => {
                        setIsLoading(false); // Desactiva el estado de carga
                    }
                });
            } else if (accion === "eliminar") {
                // Elimina el usuario usando DELETE request
                router.delete(route('users.destroy', data.id), {
                    onSuccess: () => {
                        Swal.fire({
                            icon: "success",
                            title: "Éxito",
                            text: "Usuario eliminado correctamente",
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
                            text: "Hubo un problema al eliminar el usuario",
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
                    text: "La creación de usuarios se gestiona en otro componente.",
                    confirmButtonColor: "#3085d6",
                });
                setIsLoading(false);
            }

        } catch (error) {
            console.error("Error:", error);
            setIsLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Row>
                <Col>
                    {/* Campo de entrada para el nombre del usuario */}
                    {/* <Form.Group className="mb-3" controlId="formNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese nombre"
                            {...register('name', { required: 'El nombre es requerido' })}
                            isInvalid={!!errors.name}
                            disabled={accion === 'eliminar'} // Deshabilita si es eliminación
                        /> */}
                        {/* Mensaje de error de validación */}
                        {/* <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                    </Form.Group> */}

                    {/* Campo de selección de rol */}
                    <Form.Group className="mb-3" controlId="formRol">
                        <Form.Label>Rol</Form.Label>
                        <Form.Select
                            {...register('rol_id', { required: 'El rol es requerido' })}
                            isInvalid={!!errors.rol_id}
                            disabled={accion === 'eliminar'} // Deshabilita si es eliminación
                        >
                            <option value="">Seleccione un rol</option>
                            {roles && roles.map((rol) => (
                                <option key={rol.id} value={rol.id}>
                                    {rol.name}
                                </option>
                            ))}
                        </Form.Select>
                        {/* Mensaje de error de validación */}
                        <Form.Control.Feedback type="invalid">
                            {errors.rol_id?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Información adicional para eliminación */}
                    {accion === 'eliminar' && (
                        <div className="alert alert-warning">
                            <strong>¡Atención!</strong> Esta acción eliminará permanentemente el usuario "{data?.name}". 
                            Esta operación no se puede deshacer.
                        </div>
                    )}

                    {/* Información del usuario actual */}
                    {data && (
                        <div className="mt-3 p-2 bg-light rounded">
                            <small className="text-muted">
                                <strong>Usuario:</strong> {data.name}<br/>
                                <strong>Email:</strong> {data.email}<br/>
                                <strong>Rol actual:</strong> {data.rol_nombre || 'Sin rol asignado'}
                            </small>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Botón de acción dinámico según el tipo de operación */}
            <div className="text-center mt-4">
                <Button
                    variant={accion === "eliminar" ? "danger" : "primary"}
                    type="submit"
                    disabled={isLoading}
                    style={{
                        backgroundColor: accion === "eliminar" ? "#dc3545" : "#2C3E50",
                        border: "none",
                        padding: "0.5rem 1.5rem",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: "#fff",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {/* Muestra spinner durante la carga o el texto del botón */}
                    {isLoading ? (
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
                            {accion === "eliminar" ? "Eliminando..." : "Actualizando..."}
                        </>
                    ) : (
                        buttonLabel
                    )}
                </Button>
            </div>
        </Form>
    );
};

export default Acciones;
