import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import DataTablecustom from "@/Components/Generales/DataTable";
import DropdownActions from "@/Components/Generales/DropdownActions";
import ModalCustom from "@/Components/Generales/ModalCustom";
import Acciones from "./Acciones";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import PrimaryButton from "@/Components/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCog, faWrench, faPalette, faImage, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

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
            name: "Empresa",
            selector: (row) => row.empresa_nombre || "No asignada",
            sortable: true,
        },
        {
            name: "Branding",
            cell: (row) => (
                <div className="flex items-center gap-4 py-2">
                    {row.logo && (
                        <div className="w-16 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                            <img src={`/storage/${row.logo}`} alt="Logo" className="max-h-full max-w-full object-contain" />
                        </div>
                    )}
                    {row.colores && (
                        <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                            <div className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: row.colores }}></div>
                            <span className="text-[10px] font-mono text-slate-500">{row.colores}</span>
                        </div>
                    )}
                </div>
            ),
            width: "220px",
        },
        {
            name: "Estado",
            cell: (row) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.status
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-500"
                    }`}>
                    {row.status ? "Activo" : "Inactivo"}
                </span>
            ),
            width: "100px",
        },
        {
            name: "Última Modificación",
            selector: (row) => dayjs.utc(row.updated_at || row.created_at).format("DD/MM/YYYY"),
            sortable: true,
            width: "150px"
        },
        {
            name: "Acciones",
            cell: (row) => (
                <DropdownActions
                    buttonColor="minimal"
                    icon="fas fa-ellipsis-v"
                    actions={[
                        {
                            label: "Configurar",
                            icon: "fas fa-pen",
                            color: "text-amber-500",
                            href: route("configuracions.edit", row.id)
                        },
                        {
                            label: "Eliminar",
                            icon: "fas fa-trash",
                            color: "text-red-500",
                            onClick: () => abrirModal(
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faWrench} className="text-red-500" />
                                    <span>Eliminar Configuración</span>
                                </div>,
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
            <ContainerLaravel
                titulo="Configuración del Sistema"
                icono={faCog}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="space-y-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Personaliza la identidad visual y los parámetros generales de la plataforma.
                        </p>
                    </div>
                    {configuracions.length === 0 && (
                        <Link href={route("configuracions.create")}>
                            <PrimaryButton className="gap-2">
                                <FontAwesomeIcon icon={faPlus} />
                                Nueva Configuración
                            </PrimaryButton>
                        </Link>
                    )}
                </div>

                <div className="mt-4">
                    <DataTablecustom
                        datos={configuracions}
                        columnas={columns}
                    />
                </div>

                <ModalCustom show={showModal} onClose={() => setShowModal(false)} maxWidth="lg">
                    <ModalCustom.Header closeButton onClose={() => setShowModal(false)}>
                        <div className="font-bold text-slate-900 dark:text-white">{titulosModal}</div>
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
