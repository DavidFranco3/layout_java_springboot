/**
 * Componente TblUsers - Tabla de gestión de usuarios
 * 
 * Este componente renderiza una tabla interactiva que muestra la lista de usuarios
 * del sistema con opciones para editar y eliminar cada usuario. Utiliza un DataTable
 * personalizado y modales para las acciones CRUD.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.users - Lista de usuarios a mostrar en la tabla
 * @param {Array} props.roles - Lista de roles disponibles para asignar
 */

import { useState, useEffect } from "react";
import DataTablecustom from "@/Components/Generales/DataTable";
import DropdownActions from "@/Components/Generales/DropdownActions"; // Importar nuevo componente
import ModalCustom from "@/Components/Generales/ModalCustom";
import Acciones from "./Acciones";

const TblUsers = ({ users, roles, permisos }) => {
    // Estado para manejar los usuarios filtrados (útil para futuras funcionalidades de búsqueda)
    const [filteredUsers, setFilteredUsers] = useState(users);

    // Permisos por defecto si no se pasan
    const permisosDefault = {
        editar: false,
        eliminar: false,
        ...permisos
    };

    /**
     * Hook useEffect para actualizar los usuarios filtrados cuando cambia la prop users
     * Esto asegura que la tabla se actualice automáticamente cuando se modifiquen los datos
     */
    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    // Estados para el manejo del modal de acciones
    const [showModal, setShowModal] = useState(false);      // Controla la visibilidad del modal
    const [contentModal, setContentModal] = useState(null); // Contenido dinámico del modal
    const [titulosModal, setTitulosModal] = useState(null); // Título dinámico del modal

    /**
     * Configura y abre el modal para editar un usuario
     * @param {React.ReactElement} content - Componente que se renderizará en el modal
     */
    const editarUsuario = (content) => {
        setTitulosModal("Editar Usuario");
        setContentModal(content);
        setShowModal(true);
    };

    /**
     * Configura y abre el modal para eliminar un usuario
     * @param {React.ReactElement} content - Componente que se renderizará en el modal
     */
    const eliminarUsuario = (content) => {
        setTitulosModal("Eliminar Usuario");
        setContentModal(content);
        setShowModal(true);
    };

    /**
     * Configuración de las columnas para el DataTable
     * Define la estructura y comportamiento de cada columna en la tabla
     */
    const columns = [
        // Columna para mostrar el ID del usuario
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "80px"
        },
        // Columna para mostrar el nombre del usuario
        {
            name: "Nombre",
            selector: (row) => row.name,
            sortable: true
        },
        // Columna para mostrar el rol del usuario
        {
            name: "Rol",
            selector: (row) => row.rol_nombre || 'Sin rol',
            sortable: true
        },
        // Columna para mostrar el email del usuario
        {
            name: "Correo electrónico",
            selector: (row) => row.email,
            sortable: true
        },
        // Columna de acciones con dropdown de opciones
        {
            name: "Acciones",
            cell: (row) => {
                // Verificar si tiene al menos un permiso
                const tieneAlgunPermiso = permisosDefault.editar || permisosDefault.eliminar;

                return (
                    <>
                        {tieneAlgunPermiso ? (
                            <DropdownActions
                                buttonColor="minimal"
                                icon="fas fa-ellipsis-v"
                                actions={[
                                    ...(permisosDefault.editar ? [{
                                        label: 'Editar',
                                        icon: 'fas fa-pen',
                                        color: 'text-amber-500',
                                        onClick: () => editarUsuario(
                                            <Acciones
                                                setShow={setShowModal}
                                                data={row}
                                                accion={"editar"}
                                                roles={roles}
                                            />
                                        )
                                    }] : []),
                                    ...(permisosDefault.eliminar ? [{
                                        label: 'Eliminar',
                                        icon: 'fas fa-trash',
                                        color: 'text-red-500',
                                        onClick: () => eliminarUsuario(
                                            <Acciones
                                                setShow={setShowModal}
                                                data={row}
                                                accion={"eliminar"}
                                                roles={roles}
                                            />
                                        )
                                    }] : [])
                                ]}
                            />
                        ) : (
                            <span className="text-muted text-xs" title="Sin permisos de acción">
                                <i className="fas fa-lock mr-1"></i>
                            </span>
                        )}
                    </>
                )
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "120px"
        }
    ];

    return (
        <>
            {/* DataTable personalizado que renderiza la tabla de usuarios */}
            <DataTablecustom datos={users} columnas={columns} />

            {/* Modal reutilizable para mostrar formularios de edición/eliminación */}
            <ModalCustom show={showModal} onClose={() => setShowModal(false)} maxWidth="lg">
                <ModalCustom.Header closeButton onClose={() => setShowModal(false)}>
                    {titulosModal}
                </ModalCustom.Header>
                <ModalCustom.Body>
                    {contentModal}
                </ModalCustom.Body>
            </ModalCustom>
        </>
    );
};

export default TblUsers;
