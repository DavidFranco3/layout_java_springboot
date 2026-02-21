import React, { useState } from "react";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import DataTablecustom from "@/Components/Generales/DataTable";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "@/Components/Modal/BasicModal";


dayjs.extend(utc);
dayjs.extend(localizedFormat);

const Index = (props) => {
    const { auth, errors, empresas } = props;

    const isAuditor = auth?.user?.id_rol === 5;

    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const editarEmpresa = (content) => {
        setTitulosModal("Editar Empresa");
        setContentModal(content);
        setShowModal(true);
    };

    // Si planeas manejar eliminación en el futuro
    const eliminarEmpresa = (content) => {
        setTitulosModal("Eliminar Empresa");
        setContentModal(content);
        setShowModal(true);
    };

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: "Nombre",
            selector: (row) => row.nombre,
            sortable: true,
        },
        {
            name: "Razón Social",
            selector: (row) => row.razon_social,
        },
        {
            name: "Tipo Persona",
            selector: (row) => row.tipo_persona || "No especificado",
        },
        {
            name: "RFC",
            selector: (row) => row.rfc || "Sin RFC",
        },
        {
            name: "Estado",
            selector: (row) => (row.status ? "Activo" : "Inactivo"),
        },
        {
            name: "Creado el",
            selector: (row) =>
                dayjs.utc(row.created_at).format("DD/MM/YYYY h:mm:ss A"),
        },
        {
            name: "Actualizado el",
            selector: (row) =>
                dayjs.utc(row.updated_at).format("DD/MM/YYYY h:mm:ss A"),
        },
        {
            name: "Acciones",
            cell: (row) =>
                !isAuditor ? (
                    <a
                        href={`/empresas/${row.id}/edit`}
                        className="btn btn-warning btn-sm"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                        }}
                    >
                        <FontAwesomeIcon icon={faPen} />
                        Editar
                    </a>
                ) : (
                    <>No disponibles</>
                ),
        },
    ];

    return (
        <Authenticated auth={props.auth} errors={props.errors}>
            <div className="col-lg-12 d-flex justify-content-center">
                <div className="col-lg-12 col-lg-offset-1 mt-2">
                    <ContainerLaravel
                        titulo={"Informacion de la Empresa"}
                        icono={"nav-icon bi bi-building"}
                    >
                        {/* Botón para crear */}
                        {/* <div className="mb-3 text-end">
                            <a
                                href={`/empresas/create`}
                                className="btn btn-success"
                            >
                                <i className="fa fa-plus me-2"></i> Crear
                                Empresa
                            </a>
                        </div> */}

                        {/* DataTable */}
                        <DataTablecustom datos={empresas} columnas={columns} />

                        <BasicModal
                            show={showModal}
                            setShow={setShowModal}
                            title={titulosModal}
                        >
                            {contentModal}
                        </BasicModal>
                    </ContainerLaravel>
                </div>
            </div>
        </Authenticated>
    );
};

export default Index;
