/**
 * Componente Create - Formulario para crear nuevos usuarios
 * 
 * Este componente renderiza un formulario modal para la creación de nuevos usuarios
 * del sistema, permitiendo asignar nombre, email, contraseña y rol específico.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.cerrarModal - Función para cerrar el modal
 * @param {Array} props.roles - Lista de roles disponibles para asignar
 */

import React from "react";
import { useForm } from "@inertiajs/react";
import { Form, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";

export default function Create({ cerrarModal, roles }) {
    // Hook para verificación de permisos
    const { user, rolNombre, hasPermission } = useAuth();

    // Verificar permiso para crear usuarios
    if (!hasPermission('crear users')) {
        return (
            <div className="text-center p-4">
                <div className="alert alert-danger">
                    <h5><i className="fas fa-exclamation-triangle"></i> Acceso Denegado</h5>
                    <p>No tienes permisos para crear usuarios.</p>
                    <p><strong>Tu rol:</strong> {rolNombre || 'Sin asignar'}</p>
                    <p><strong>Permiso requerido:</strong> crear_users</p>
                </div>
                <Button variant="secondary" onClick={cerrarModal}>
                    Cerrar
                </Button>
            </div>
        );
    }

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
        nombre: "",      // Nombre del usuario
        email: "",       // Email del usuario
        password: "",    // Contraseña del usuario
        rol_id: "",      // ID del rol asignado al usuario
    });

    /**
     * Maneja el envío del formulario
     * 
     * PROCESO:
     * 1. Previene el comportamiento por defecto del formulario
     * 2. Envía los datos al endpoint de creación de usuarios
     * 3. Maneja respuestas de éxito y error con notificaciones SweetAlert
     * 4. Cierra el modal y limpia el formulario en caso de éxito
     * 
     * @param {Event} e - Evento del formulario
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        // Envía los datos al endpoint de creación de usuarios
        post(route("users.store"), {
            // Callback ejecutado cuando la petición es exitosa
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "Usuario registrado correctamente",
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
                    text: "Hubo un problema al registrar el usuario",
                    confirmButtonColor: "#d33",
                });
            },
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            {/* Campo de entrada para el nombre del usuario */}
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

            {/* Campo de selección de rol */}
            <Form.Group className="mb-3" controlId="formRol">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                    value={data.rol_id}
                    isInvalid={!!errors.rol_id}  // Muestra estado de error si existe
                    onChange={(e) => setData("rol_id", e.target.value)}
                >
                    <option value="">Seleccione un Rol</option>
                    {/* Mapea los roles disponibles para crear las opciones */}
                    {roles.map((rol) => (
                        <option key={rol.id} value={rol.id}>
                            {rol.name}
                        </option>
                    ))}
                </Form.Select>
                {/* Muestra mensaje de error de validación */}
                <Form.Control.Feedback type="invalid">
                    {errors.rol_id}
                </Form.Control.Feedback>
            </Form.Group>

            {/* Campo de entrada para el email del usuario */}
            <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Ingrese correo"
                    value={data.email}
                    isInvalid={!!errors.email}  // Muestra estado de error si existe
                    onChange={(e) => setData("email", e.target.value)}
                />
                {/* Muestra mensaje de error de validación */}
                <Form.Control.Feedback type="invalid">
                    {errors.email}
                </Form.Control.Feedback>
            </Form.Group>

            {/* Campo de entrada para la contraseña del usuario */}
            <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Ingrese contraseña"
                    value={data.password}
                    isInvalid={!!errors.password}  // Muestra estado de error si existe
                    onChange={(e) => setData("password", e.target.value)}
                />
                {/* Muestra mensaje de error de validación */}
                <Form.Control.Feedback type="invalid">
                    {errors.password}
                </Form.Control.Feedback>
            </Form.Group>

            {/* Información de permisos actual del usuario debug info - Solo en desarrollo*/}
            {process.env.NODE_ENV === 'development' && user && (
                <div className="mt-3 p-2 bg-light rounded">
                    <small className="text-muted">
                        <strong>Creando como:</strong> {user?.name} ({rolNombre})<br />
                        <strong>Permiso:</strong> crear users ✅
                    </small>
                </div>
            )}


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
