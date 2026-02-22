/**
 * Componente TblRoles - Tabla de gestión de roles
 * 
 * Este componente renderiza una tabla interactiva que muestra la lista de roles
 * del sistema con opciones para editar y eliminar cada rol. Utiliza un DataTable
 * personalizado y modales para las acciones CRUD.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.roles - Lista de roles a mostrar en la tabla
 */

import { useState, useEffect } from "react";
import DataTablecustom from "@/Components/Generales/DataTable";
import DropdownActions from "@/Components/Generales/DropdownActions";
import BasicModal from "@/Components/Modal/BasicModal";
import Acciones from "./Acciones";

const TblRoles = ({ roles }) => {
    // Estado para manejar los roles filtrados (útil para futuras funcionalidades de búsqueda)
    const [filteredRoles, setFilteredRoles] = useState(roles);

    /**
     * Hook useEffect para actualizar los roles filtrados cuando cambia la prop roles
     * Esto asegura que la tabla se actualice automáticamente cuando se modifiquen los datos
     */
    useEffect(() => {
        setFilteredRoles(roles);
    }, [roles]);

    // Estados para el manejo del modal de acciones
    const [showModal, setShowModal] = useState(false);      // Controla la visibilidad del modal
    const [contentModal, setContentModal] = useState(null); // Contenido dinámico del modal
    const [titulosModal, setTitulosModal] = useState(null); // Título dinámico del modal

    /**
     * Configura y abre el modal para editar un rol
     * @param {React.ReactElement} content - Componente que se renderizará en el modal
     */
    const editarRol = (content) => {
        setTitulosModal("Editar Rol");
        setContentModal(content);
        setShowModal(true);
    };

    /**
     * Configura y abre el modal para eliminar un rol
     * @param {React.ReactElement} content - Componente que se renderizará en el modal
     */
    const eliminarRol = (content) => {
        setTitulosModal("Eliminar Rol");
        setContentModal(content);
        setShowModal(true);
    };

    /**
     * Configuración de las columnas para el DataTable
     * Define la estructura y comportamiento de cada columna en la tabla
     */
    const columns = [
        // Columna para mostrar el nombre del rol
        {
            name: "Nombre",
            selector: (row) => row.name,
            sortable: true
        },
        // Columna de acciones con dropdown de opciones
        {
            name: "Acciones",
            cell: (row) => {
                return (
                    <DropdownActions
                        buttonColor="minimal"
                        icon="fas fa-ellipsis-v"
                        actions={[
                            {
                                label: 'Editar',
                                icon: 'fas fa-pen',
                                color: 'text-amber-500',
                                onClick: () => editarRol(
                                    <Acciones
                                        setShow={setShowModal}
                                        data={row}
                                        accion={"editar"}
                                    />
                                )
                            },
                            {
                                label: 'Eliminar',
                                icon: 'fas fa-trash',
                                color: 'text-red-500',
                                onClick: () => eliminarRol(
                                    <Acciones
                                        setShow={setShowModal}
                                        data={row}
                                        accion={"eliminar"}
                                    />
                                )
                            }
                        ]}
                    />
                )
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    return (
        <>
            {/* DataTable personalizado que renderiza la tabla de roles */}
            <DataTablecustom datos={roles} columnas={columns} />

            {/* Modal reutilizable para mostrar formularios de edición/eliminación */}
            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
};

export default TblRoles;