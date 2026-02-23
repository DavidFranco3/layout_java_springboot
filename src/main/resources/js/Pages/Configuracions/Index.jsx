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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-2">
                    {/* Bento Block: Info */}
                    <div className="lg:col-span-2 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-[var(--border-light)] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                            <FontAwesomeIcon icon={faWrench} className="text-xl" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Personalización de Plataforma</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Ajusta la identidad visual, logotipos y parámetros generales para cada instancia del sistema.
                            </p>
                        </div>
                    </div>

                    {/* Bento Block: Action */}
                    {configuracions.length === 0 ? (
                        <Link
                            href={route("configuracions.create")}
                            className="group relative overflow-hidden p-6 rounded-3xl border border-dashed border-primary/30 bg-transparent hover:bg-primary/5 transition-all duration-500 flex flex-col items-center justify-center gap-3 text-center cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/10 active:scale-95"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                <FontAwesomeIcon icon={faPlus} className="text-xl" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black uppercase tracking-widest text-primary">
                                    Nueva Configuración
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                                    Definir parámetros visuales
                                </p>
                            </div>
                        </Link>
                    ) : (
                        <div className="bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-[var(--border-light)] flex flex-col items-center justify-center gap-2 opacity-60">
                            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Límite Alcanzado</p>
                        </div>
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
