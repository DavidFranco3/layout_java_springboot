import React from "react";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUserTie, faEdit, faTrash, faUsers } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";

const Index = (props) => {
    const { auth, errors, clientes } = props;

    const eliminarCliente = (id) => {
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
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("clientes.destroy", id));
            }
        });
    };

    return (
        <Authenticated auth={auth} errors={errors}>
            <ContainerLaravel
                titulo="Gestión de Clientes"
                icono={faUsers}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-2">
                    {/* Bento Block: Info */}
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

                    {/* Bento Block: Action */}
                    <Link
                        href={route("clientes.create")}
                        className="group relative overflow-hidden p-6 rounded-3xl border border-primary/20 bg-white dark:bg-slate-900 transition-all duration-500 flex flex-col items-center justify-center gap-3 text-center cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/20 active:scale-95"
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
                                            <Link href={route("clientes.edit", cliente.id)}>
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
                                    <td colSpan="2" className="px-6 py-12 text-center text-slate-400">
                                        No se encontraron clientes registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </ContainerLaravel>
        </Authenticated>
    );
};

export default Index;
