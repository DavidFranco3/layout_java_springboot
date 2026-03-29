import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTimes, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";

interface ConfigAccionesProps {
    setShow: (show: boolean) => void;
    data: any; // The configuration object
    accion: 'editar' | 'eliminar';
    onRefresh?: () => void;
}

const Acciones = ({ setShow, data: config, accion, onRefresh }: ConfigAccionesProps) => {
    const isEliminar = accion === "eliminar";
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`/api/configuracion/${config.id}`);
            Swal.fire({
                icon: "success",
                title: "Eliminado",
                text: "Configuración eliminada correctamente",
                timer: 2000,
                showConfirmButton: false,
                background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
            });
            if (onRefresh) onRefresh();
            setShow(false);
        } catch (err: any) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "Ocurrió un problema al procesar la solicitud.",
                confirmButtonColor: "var(--app-primary)",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isEliminar) {
        return (
            <div className="p-1 space-y-6 animate-fade-in">
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 mb-3">
                        <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />
                    </div>
                    <h4 className="text-base font-bold text-amber-900 dark:text-amber-400 mb-1">Confirmar Eliminación</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-600/80 leading-relaxed">
                        ¿Estás seguro de eliminar la configuración de <span className="font-bold text-amber-900 dark:text-amber-300">"{config?.nombre_comercial}"</span>? Esta acción es definitiva.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <SecondaryButton onClick={() => setShow(false)} className="h-11 px-6">
                        <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
                    </SecondaryButton>
                    <DangerButton onClick={handleDelete} disabled={isLoading} className="h-11 px-8 shadow-lg shadow-red-500/20">
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Eliminando...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faTrash} />
                                <span>Eliminar Configuración</span>
                            </div>
                        )}
                    </DangerButton>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 text-center text-slate-500 dark:text-slate-400">
            Esta acción no está disponible en este modal.
        </div>
    );
};

export default Acciones;
