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
            name: "Teléfono",
            selector: (row) => row.telefono || "N/A",
            width: "130px",
        },
        {
            name: "Correo Electrónico",
            selector: (row) => row.email || "N/A",
            width: "200px",
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
            <ContainerLaravel
                titulo={"Información de la Empresa"}
                icono={"nav-icon bi bi-building"}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-2">
                    {/* Bento Block: Info */}
                    <div className="lg:col-span-2 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-[var(--border-light)] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                            <i className="fas fa-building text-xl" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Gestión Corporativa</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Administra la identidad legal, domicilios fiscales y datos de contacto de las unidades de negocio.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    {/* DataTable */}
                    <DataTablecustom datos={empresas} columnas={columns} />
                </div>

                <ModalCustom show={showModal} onClose={() => setShowModal(false)} maxWidth="lg">
                    <ModalCustom.Header closeButton onClose={() => setShowModal(false)}>
                        {titulosModal}
                    </ModalCustom.Header>
                    <ModalCustom.Body>
                        {contentModal}
                    </ModalCustom.Body>
                </ModalCustom>
            </ContainerLaravel>
        </Authenticated>
    );
};

export default Index;
