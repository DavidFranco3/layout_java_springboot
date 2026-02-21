/**
 * Componente Index - Página principal de gestión de roles
 * 
 * Este componente representa la página principal del módulo de roles, donde se muestra
 * la lista de roles existentes y se proporciona la funcionalidad para crear nuevos roles.
 * Utiliza el patrón de layout autenticado de Laravel Inertia.js.
 * 
 * @param {Object} props - Propiedades pasadas desde el controlador Laravel
 * @param {Object} props.auth - Información del usuario autenticado
 * @param {Object} props.errors - Errores de validación del servidor
 * @param {Array} props.roles - Lista de roles obtenida desde el servidor
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
import TblRoles from "./TblRoles";

const Index = (props) => {
    // Desestructuración de props para acceder a los datos del servidor
    const { auth, errors, roles } = props;

    // Estados locales del componente
    const [modalOpen, setModalOpen] = useState(false); // Controla la visibilidad del modal de creación
    const [permisos, setPermisos] = useState([]);      // Lista de permisos disponibles para asignar
    const [modulos, setModulos] = useState([]);        // Lista de módulos disponibles para controlar las pestañas

    /**
     * Funciones para controlar el modal de creación de roles
     */
    const abrirModal = () => setModalOpen(true);   // Abre el modal
    const cerrarModal = () => setModalOpen(false); // Cierra el modal

    /**
     * Hook useEffect para inicialización del componente
     * Se ejecuta una sola vez al montar el componente
     */
    useEffect(() => {
        getPermisos(); // Carga los permisos disponibles al inicializar
        getModulos();  // Carga los módulos disponibles al inicializar
    }, []);

    /**
     * Obtiene la lista de permisos disponibles desde el servidor
     * Esta información se utiliza para mostrar los permisos que se pueden asignar a los roles
     */
    const getPermisos = async () => {
        try {
            const response = await axios.get(route('roles.getPermisos'));
            setPermisos(response.data.data); // Actualiza el estado con los permisos obtenidos
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    }

    /**
     * Obtiene la lista de módulos disponibles desde el servidor
     * Esta información se utiliza para organizar las pestañas de permisos
     */
    const getModulos = async () => {
        try {
            const response = await axios.get(route('roles.getModulos')); // Asume que existe esta ruta
            setModulos(response.data.data); // Actualiza el estado con los módulos obtenidos
        } catch (error) {
            console.error("Error fetching modules:", error);
            // Si no existe la ruta, usar un array vacío
            setModulos([]);
        }
    }

    return (
        // Layout autenticado que envuelve todo el contenido
        <Authenticated auth={props.auth} errors={props.errors}>
            <div className="col-lg-12 d-flex justify-content-center">
                <div className="col-lg-12 col-lg-offset-1 mt-2">
                    {/* Contenedor principal con título e icono */}
                    <ContainerLaravel titulo={"Listado de Roles"} icono={"fa-list"}>

                        {/* Sección de acciones - Botón para crear nuevo rol */}
                        <div className="mb-3 text-end">
                            <Button onClick={abrirModal}>
                                <FontAwesomeIcon icon={faPlus} /> Nuevo
                            </Button>
                        </div>

                        {/* Tabla que muestra la lista de roles */}
                        <div>
                            <TblRoles roles={roles} />
                        </div>

                        {/* Modal para crear nuevos roles */}
                        <ModalCustom
                            show={modalOpen}
                            onClose={() => setModalOpen(false)}
                            maxWidth="xl"
                        >
                            <ModalCustom.Header onClose={() => setModalOpen(false)} closeButton>
                                Registrar Rol
                            </ModalCustom.Header>
                            <ModalCustom.Body>
                                {/* Componente de creación de roles con permisos */}
                                <Create cerrarModal={cerrarModal} permisos={permisos} modulos={modulos} />
                            </ModalCustom.Body>
                        </ModalCustom>
                    </ContainerLaravel>
                </div>
            </div>
        </Authenticated>
    );
};

export default Index;