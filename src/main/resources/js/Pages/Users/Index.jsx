/**
 * Componente Index - Página principal de gestión de usuarios
 * 
 * Este componente representa la página principal del módulo de usuarios, donde se muestra
 * la lista de usuarios existentes y se proporciona la funcionalidad para crear nuevos usuarios.
 * Utiliza el patrón de layout autenticado de Laravel Inertia.js.
 * 
 * @param {Object} props - Propiedades pasadas desde el controlador Laravel
 * @param {Object} props.auth - Información del usuario autenticado
 * @param {Object} props.errors - Errores de validación del servidor
 * @param {Array} props.users - Lista de usuarios obtenida desde el servidor
 */

import React, { useEffect, useState } from "react";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import Create from "./Create";
import ModalCustom from "@/Components/Generales/ModalCustom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TblUsers from "./TblUsers";
import useAuth from "@/hooks/useAuth";

const Index = (props) => {
    // Desestructuración de props para acceder a los datos del servidor
    const { auth, errors, users } = props;

    // Hook para verificación de permisos
    const { user, rolNombre, hasModuleAccess, hasPermission } = useAuth();

    // Estados locales del componente
    const [modalOpen, setModalOpen] = useState(false); // Controla la visibilidad del modal de creación
    const [roles, setRoles] = useState([]);           // Lista de roles disponibles para asignar

    // Verificar acceso al módulo completo
    if (!hasModuleAccess('Users')) {
        return (
            <Authenticated auth={props.auth} errors={props.errors}>
                <div className="col-lg-12 d-flex justify-content-center">
                    <div className="col-lg-12 col-lg-offset-1 mt-2">
                        <div className="alert alert-danger">
                            <h4><i className="fas fa-exclamation-triangle"></i> Acceso Denegado</h4>
                            <p>No tienes permisos para acceder al módulo de Usuarios.</p>
                            <p><strong>Tu rol:</strong> {rolNombre || 'Sin asignar'}</p>
                        </div>
                    </div>
                </div>
            </Authenticated>
        );
    }

    // Verificar permiso básico de ver usuarios
    if (!hasPermission('ver users')) {
        return (
            <Authenticated auth={props.auth} errors={props.errors}>
                <div className="col-lg-12 d-flex justify-content-center">
                    <div className="col-lg-12 col-lg-offset-1 mt-2">
                        <div className="alert alert-warning">
                            <h4><i className="fas fa-eye-slash"></i> Sin Permisos de Visualización</h4>
                            <p>No tienes permisos para ver la lista de usuarios.</p>
                            <p><strong>Tu rol:</strong> {rolNombre || 'Sin asignar'}</p>
                        </div>
                    </div>
                </div>
            </Authenticated>
        );
    }

    /**
     * Funciones para controlar el modal de creación de usuarios
     */
    const abrirModal = () => setModalOpen(true);   // Abre el modal
    const cerrarModal = () => setModalOpen(false); // Cierra el modal

    /**
     * Obtiene la lista de roles disponibles desde el servidor
     * Esta información se utiliza para mostrar los roles que se pueden asignar a los usuarios
     */
    const getRoles = async () => {
        try {
            const response = await axios.get(route('roles.getRoles'));
            console.log("Roles:", response.data);
            setRoles(response.data.data); // Actualiza el estado con los roles obtenidos
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }

    /**
     * Hook useEffect para inicialización del componente
     * Se ejecuta una sola vez al montar el componente
     */
    useEffect(() => {
        getRoles(); // Carga los roles disponibles al inicializar
    }, []);

    console.log("users", users);
    return (
        // Layout autenticado que envuelve todo el contenido
        <Authenticated auth={props.auth} errors={props.errors}>
            <div className="col-lg-12 d-flex justify-content-center">
                <div className="col-lg-12 col-lg-offset-1 mt-2">
                    {/* Contenedor principal con título e icono */}
                    <ContainerLaravel titulo={"Listado de Usuarios"} icono={"fa-users"}>

                        {/* Sección de acciones - Botón para crear nuevo usuario */}
                        <div className="mb-3 d-flex justify-content-between align-items-center">
                            {/* Debug info - Solo en desarrollo*/}
                            {process.env.NODE_ENV === 'development' && user && (
                                <div>
                                    <small className="text-muted">
                                        <i className="fas fa-user-shield"></i>
                                        <strong> Rol:</strong> {rolNombre || 'Sin asignar'}
                                    </small>
                                </div>
                            )}
                            <div>
                                {hasPermission('crear users') ? (
                                    <Button onClick={abrirModal} className="btn-success">
                                        <FontAwesomeIcon icon={faPlus} /> Nuevo Usuario
                                    </Button>
                                ) : (
                                    <Button disabled className="btn-secondary" title="Sin permisos para crear usuarios">
                                        <FontAwesomeIcon icon={faPlus} /> Nuevo Usuario
                                        <i className="fas fa-lock ms-2"></i>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Tabla que muestra la lista de usuarios */}
                        <div>
                            <TblUsers
                                users={users}
                                roles={roles}
                                permisos={{
                                    editar: hasPermission('editar users'),
                                    eliminar: hasPermission('eliminar users')
                                }}
                            />
                        </div>

                        {/* Modal para crear nuevos usuarios - Solo si tiene permisos */}
                        {hasPermission('crear users') && (
                            <ModalCustom
                                show={modalOpen}
                                onClose={() => setModalOpen(false)}
                                maxWidth="md"
                            >
                                <ModalCustom.Header onClose={() => setModalOpen(false)} closeButton>
                                    Registrar Usuario
                                </ModalCustom.Header>
                                <ModalCustom.Body>
                                    {/* Componente de creación de usuarios con roles */}
                                    <Create cerrarModal={cerrarModal} roles={roles} />
                                </ModalCustom.Body>
                            </ModalCustom>
                        )}
                    </ContainerLaravel>
                </div>
            </div>
        </Authenticated>
    );
};

export default Index;
