import React, { useState } from "react";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import DataTablecustom from "@/Components/Generales/DataTable";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import ModalCustom from "@/Components/Generales/ModalCustom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faEye, faTerminal, faUserCircle, faHashtag, faExchangeAlt, faGlobe } from "@fortawesome/free-solid-svg-icons";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

const Index = (props) => {
    const { auth, errors, auditorialogs } = props;

    const [modalData, setModalData] = useState({ show: false, content: null, title: "" });

    const openViewModal = (title, content) => {
        setModalData({ show: true, content, title });
    };

    const closeViewModal = () => {
        setModalData({ ...modalData, show: false });
    };

    const getActionBadge = (action) => {
        const lowerAction = action.toLowerCase();
        if (lowerAction.includes('crear') || lowerAction.includes('create') || lowerAction.includes('store')) {
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500 border-emerald-200 dark:border-emerald-800";
        }
        if (lowerAction.includes('eliminar') || lowerAction.includes('delete') || lowerAction.includes('destroy')) {
            return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-500 border-rose-200 dark:border-rose-800";
        }
        if (lowerAction.includes('actualizar') || lowerAction.includes('update') || lowerAction.includes('edit')) {
            return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 border-amber-200 dark:border-amber-800";
        }
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    };

    const columns = [
        {
            name: "Evento",
            cell: (row) => (
                <div className="flex flex-col py-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">ID #{row.id}</span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase w-max tracking-tighter ${getActionBadge(row.accion)}`}>
                        {row.accion}
                    </span>
                </div>
            ),
            width: "120px",
        },
        {
            name: "Usuario",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <FontAwesomeIcon icon={faUserCircle} className="text-xs" />
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{row.user_name || "Sistema"}</span>
                </div>
            ),
            sortable: true,
        },
        {
            name: "Entidad",
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{row.model}</span>
                    <span className="text-[10px] text-slate-400">Ref: {row.model_id}</span>
                </div>
            ),
            sortable: true,
        },
        {
            name: "Conexión",
            cell: (row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                        <FontAwesomeIcon icon={faGlobe} className="text-[8px] opacity-50" />
                        <span>{row.ip}</span>
                    </div>
                    <a href={row.url} target="_blank" className="text-[9px] text-primary hover:underline truncate max-w-[120px]">
                        {row.url}
                    </a>
                </div>
            ),
            width: "160px",
        },
        {
            name: "Datos",
            cell: (row) => (
                <div className="flex items-center gap-2">
                    {row.datos_anteriores && (
                        <button
                            onClick={() => openViewModal(`Valores Anteriores - ${row.model} #${row.model_id}`, row.datos_anteriores)}
                            className="w-8 h-8 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors border border-slate-200 dark:border-slate-700"
                            title="Ver datos anteriores"
                        >
                            <FontAwesomeIcon icon={faHistory} className="text-[10px]" />
                        </button>
                    )}
                    {row.datos_nuevos && (
                        <button
                            onClick={() => openViewModal(`Valores Nuevos - ${row.model} #${row.model_id}`, row.datos_nuevos)}
                            className="w-8 h-8 rounded flex items-center justify-center bg-primary/5 text-primary hover:bg-primary/20 transition-colors border border-primary/20 shadow-sm"
                            title="Ver nuevos datos"
                        >
                            <FontAwesomeIcon icon={faEye} className="text-[10px]" />
                        </button>
                    )}
                </div>
            ),
            width: "100px",
        },
        {
            name: "Fecha",
            selector: (row) => dayjs.utc(row.created_at).format("DD/MM/YYYY HH:mm"),
            sortable: true,
            width: "140px",
        },
    ];

    return (
        <Authenticated auth={auth} errors={errors}>
            <ContainerLaravel
                titulo="Historial de Auditoría"
                icono={faTerminal}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-2">
                    {/* Bento Block: Info */}
                    <div className="lg:col-span-3 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-[var(--border-light)] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                            <FontAwesomeIcon icon={faHistory} className="text-xl" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Trazabilidad de Operaciones</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Registro cronológico y detallado de cada acción realizada en la plataforma, permitiendo auditar cambios en datos sensibles e identidad de los usuarios.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <DataTablecustom datos={auditorialogs} columnas={columns} />
                </div>

                {/* Modal para ver JSON */}
                <ModalCustom show={modalData.show} onClose={closeViewModal} maxWidth="2xl">
                    <ModalCustom.Header closeButton onClose={closeViewModal}>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                <FontAwesomeIcon icon={faHistory} className="text-sm" />
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-tight text-sm">
                                {modalData.title}
                            </span>
                        </div>
                    </ModalCustom.Header>
                    <ModalCustom.Body>
                        <div className="rounded-xl bg-slate-900 p-4 border border-slate-700/50 shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">JSON View</span>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                </div>
                            </div>
                            <pre className="text-[11px] font-mono text-emerald-500/90 overflow-x-auto custom-scrollbar leading-relaxed">
                                {JSON.stringify(modalData.content, null, 4)}
                            </pre>
                        </div>
                    </ModalCustom.Body>
                </ModalCustom>

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        height: 6px;
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                `}</style>
            </ContainerLaravel>
        </Authenticated>
    );
};

export default Index;
