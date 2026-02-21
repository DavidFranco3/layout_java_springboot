import React from "react";
import { Link } from "@inertiajs/react";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import DataTablecustom from "@/Components/Generales/DataTable";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

const Index = (props) => {
    const { auth, errors, configuracions } = props;

    // Eliminar configuración con SweetAlert
    const handleDelete = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará la configuración y no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                Inertia.delete(route("configuracions.destroy", id), {
                    onSuccess: () => {
                        Swal.fire({
                            icon: "success",
                            title: "Eliminado",
                            text: "La configuración ha sido eliminada correctamente",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "No se pudo eliminar la configuración. Intenta nuevamente.",
                        });
                    },
                });
            }
        });
    };

    // Columnas de DataTable
    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: "Nombre Comercial",
            selector: (row) => row.nombre_comercial || "Sin nombre",
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
                        {/* Cuadro de color */}
                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: row.colores,
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                        ></div>
                        {/* Código hexadecimal */}
                        <span>{row.colores}</span>
                    </div>
                ) : (
                    "No asignado"
                ),
        },

        {
            name: "Logo",
            cell: (row) =>
                row.logo ? (
                    <img
                        src={`/storage/${row.logo}`} // Aquí usamos la ruta general /storage/{path}
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
        },
        {
            name: "Creado el",
            selector: (row) =>
                dayjs.utc(row.created_at).format("DD/MM/YYYY h:mm:ss A"),
        },
        {
            name: "Acciones",
            cell: (row) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    {/* Botón Editar */}
                    <Link
                        href={route("configuracions.edit", row.id)}
                        className="btn btn-warning btn-sm"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                        }}
                    >
                        <i className="fa fa-pen"></i> Editar
                    </Link>

                    {/* Botón Eliminar */}
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="btn btn-danger btn-sm"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                        }}
                    >
                        <i className="fa fa-trash"></i> Eliminar
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Authenticated auth={props.auth} errors={props.errors}>
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
                    </ContainerLaravel>
                </div>
            </div>
        </Authenticated>
    );
};

export default Index;
