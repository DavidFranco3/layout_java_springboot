import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import DataTablecustom from "@/Components/Generales/DataTable";
import DropdownActions from "@/Components/Generales/DropdownActions";
import BasicModal from "@/Components/Modal/BasicModal";
import Acciones from "./Acciones";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

const Index = (props) => {
    const { auth, errors, configuracions } = props;

    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const abrirModal = (titulo, contenido) => {
        setTitulosModal(titulo);
        setContentModal(contenido);
        setShowModal(true);
    };

    // Columnas de DataTable
    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "80px",
        },
        {
            name: "Nombre Comercial",
            selector: (row) => row.nombre_comercial || "Sin nombre",
            sortable: true,
        },
        {
            name: "Color Principal",
            cell: (row) =>
                row.colores ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: row.colores,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                        ></div>
                        <span>{row.colores}</span>
                    </div>
                ) : (
                    "No asignado"
                ),
            width: "150px",
        },

        {
            name: "Logo",
            cell: (row) =>
                row.logo ? (
                    <img
                        src={`/storage/${row.logo}`}
                        alt="Logo"
                        style={{
                            width: "100px",
                            height: "28px",
                            objectFit: "contain",
                        }}
                    />
                ) : (
                    "No asignado"
                ),
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
            cell: (row) => (
                <DropdownActions
                    buttonColor="minimal"
                    icon="fas fa-ellipsis-v"
                    actions={[
                        {
                            label: "Editar",
                            icon: "fas fa-pen",
                            color: "text-amber-500",
                            href: route("configuracions.edit", row.id)
                        },
                        {
                            label: "Eliminar",
                            icon: "fas fa-trash",
                            color: "text-red-500",
                            onClick: () => abrirModal(
                                "Eliminar Configuración",
                                <Acciones
                                    setShow={setShowModal}
                                    data={row}
                                    accion="eliminar"
                                />
                            )
                        }
                    ]}
                />
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
                        titulo={"Configuracion del layout"}
                        icono={"fa-list"}
                    >
                        {/* Botón para crear */}
                        {configuracions.length === 0 && (
                            <div className="mb-3 text-end">
                                <Link
                                    href={route("configuracions.create")}
                                    className="btn btn-success"
                                >
                                    <i className="fa fa-plus me-2"></i> Crear
                                    Configuración
                                </Link>
                            </div>
                        )}

                        {/* Tabla */}
                        <DataTablecustom
                            datos={configuracions}
                            columnas={columns}
                        />

                        {/* Modal */}
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
