import React, { useState } from "react";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import DataTablecustom from "@/Components/Generales/DataTable";
import DropdownActions from "@/Components/Generales/DropdownActions";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import ModalCustom from "@/Components/Generales/ModalCustom";
import Acciones from "./Acciones";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

const Index = (props) => {
    const { auth, errors, empresas } = props;

    const isAuditor = auth?.user?.id_rol === 5;

    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const abrirModal = (titulo, contenido) => {
        setTitulosModal(titulo);
        setContentModal(contenido);
        setShowModal(true);
    };

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "80px",
        },
        {
            name: "Nombre",
            selector: (row) => row.nombre,
            sortable: true,
        },
        {
            name: "Razón Social",
            selector: (row) => row.razon_social,
            sortable: true,
        },
        {
            name: "Tipo Persona",
            selector: (row) => row.tipo_persona || "No especificado",
            width: "120px",
        },
        {
            name: "RFC",
            selector: (row) => row.rfc || "Sin RFC",
            width: "140px",
        },
        {
            name: "Estado",
            selector: (row) => (row.status ? "Activo" : "Inactivo"),
            width: "100px",
        },
        {
            name: "Creado el",
            selector: (row) =>
                dayjs.utc(row.created_at).format("DD/MM/YYYY h:mm:ss A"),
            sortable: true,
        },
        {
            name: "Acciones",
            cell: (row) =>
                !isAuditor ? (
                    <DropdownActions
                        buttonColor="minimal"
                        icon="fas fa-ellipsis-v"
                        actions={[
                            {
                                label: "Editar",
                                icon: "fas fa-pen",
                                color: "text-amber-500",
                                href: route("empresas.edit", row.id)
                            },
                            {
                                label: "Eliminar",
                                icon: "fas fa-trash",
                                color: "text-red-500",
                                onClick: () => abrirModal(
                                    "Eliminar Empresa",
                                    <Acciones
                                        setShow={setShowModal}
                                        data={row}
                                        accion="eliminar"
                                    />
                                )
                            }
                        ]}
                    />
                ) : (
                    <>No disponibles</>
                ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "100px",
        },
    ];

    return (
        <Authenticated auth={auth} errors={errors}>
            <div className="col-lg-12 d-flex justify-content-center">
                <div className="col-lg-12 col-lg-offset-1 mt-2">
                    <ContainerLaravel
                        titulo={"Informacion de la Empresa"}
                        icono={"nav-icon bi bi-building"}
                    >
                        {/* DataTable */}
                        <DataTablecustom datos={empresas} columnas={columns} />

                        <ModalCustom show={showModal} onClose={() => setShowModal(false)} maxWidth="lg">
                            <ModalCustom.Header closeButton onClose={() => setShowModal(false)}>
                                {titulosModal}
                            </ModalCustom.Header>
                            <ModalCustom.Body>
                                {contentModal}
                            </ModalCustom.Body>
                        </ModalCustom>
                    </ContainerLaravel>
                </div>
            </div>
        </Authenticated>
    );
};

export default Index;
