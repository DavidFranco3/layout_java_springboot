import React, { useState, useEffect } from "react";
import ContainerApp from "@/Components/Generales/ContainerApp";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUserTie, faEdit, faTrash, faUsers } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

interface Cliente {
    id: number;
    nombre: string;
}

const Index = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const res = await axios.get("/api/clientes");
            setClientes(res.data);
        } catch (err) {
            console.error("Error al cargar clientes:", err);
            Swal.fire("Error", "No se pudieron cargar los clientes", "error");
        } finally {
            setLoading(false);
        }
    };

    const eliminarCliente = (id: number) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/clientes/${id}`);
                    Swal.fire("Eliminado", "El cliente ha sido eliminado", "success");
                    fetchClientes();
                } catch (err) {
                    Swal.fire("Error", "No se pudo eliminar el cliente", "error");
                }
            }
        });
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <Authenticated user={user}>
            <ContainerApp
                titulo="Gestión de Clientes"
                icono={faUsers}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-2">
                    <div className="lg:col-span-2 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-[var(--border-light)] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                            <FontAwesomeIcon icon={faUsers} className="text-xl" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Base de Datos de Clientes</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Administra el padrón de clientes registrados, sus perfiles comerciales y datos históricos.
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/clientes/create"
                        className="group relative overflow-hidden p-6 rounded-3xl border border-dashed border-primary/30 bg-transparent hover:bg-primary/5 transition-all duration-500 flex flex-col items-center justify-center gap-3 text-center cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/10 active:scale-95 text-decoration-none"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                            <FontAwesomeIcon icon={faPlus} className="text-xl" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-black uppercase tracking-widest text-primary">
                                Nuevo Cliente
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                                Registrar nuevo perfil
                            </p>
                        </div>
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-bold">Nombre</th>
                                <th className="px-6 py-4 font-bold text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {clientes.map((cliente) => (
                                <tr key={cliente.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <FontAwesomeIcon icon={faUserTie} className="text-xs" />
                                            </div>
                                            <span className="font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                                                {cliente.nombre}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <Link to={`/clientes/${cliente.id}/edit`}>
                                                <SecondaryButton className="!p-2 w-9 h-9 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faEdit} className="text-xs" />
                                                </SecondaryButton>
                                            </Link>
                                            <DangerButton
                                                onClick={() => eliminarCliente(cliente.id)}
                                                className="!p-2 w-9 h-9 flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                            </DangerButton>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {clientes.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-12 text-center text-slate-400">
                                        No se encontraron clientes registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </ContainerApp>
        </Authenticated>
    );
};

export default Index;
