import React, { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import ModalCustom from "@/Components/Generales/ModalCustom";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

interface HeaderProps {
    configuracion: any;
    toggleSidebar: () => void;
    sidebarOpen: boolean;
    darkMode: boolean;
    toggleDarkMode: () => void;
    [key: string]: any;
}

export default function Header(props: HeaderProps) {
    const {
        configuracion,
        toggleSidebar,
        sidebarOpen,
        darkMode,
        toggleDarkMode
    } = props;

    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "¿Cerrar sesión?",
            text: "Tu sesión se finalizará",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--app-primary)",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "Cancelar",
            background: darkMode ? "#0x0f172a" : "#fff",
            color: darkMode ? "#f8fafc" : "#0f172a",
            customClass: {
                popup: 'rounded-[32px] border-white/5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl shadow-2xl',
                confirmButton: 'rounded-2xl px-8 py-3 font-black text-xs uppercase tracking-widest',
                cancelButton: 'rounded-2xl px-8 py-3 font-black text-xs uppercase tracking-widest'
            }
        });

        if (result.isConfirmed) {
            try {
                await axios.post("/logout");
                window.location.href = "/login";
            } catch (err) {
                console.error("Logout failed", err);
                window.location.href = "/login";
            }
        }
    };

    const handleProfile = () => {
        setTitulosModal(
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[20px] bg-primary/10 text-primary flex items-center justify-center">
                    <i className="fas fa-fingerprint text-3xl" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none">Mi Perfil</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 opacity-60">Seguridad & Identidad</p>
                </div>
            </div>
        );
        setContentModal(
            <div className="p-4 sm:p-10 animate-soft text-center">
                <div className="relative inline-block mb-10 group">
                    <div className="absolute inset-0 bg-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
                    <div className="relative w-32 h-32 rounded-[40px] bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center font-black text-5xl shadow-2xl shadow-primary/30 ring-8 ring-white dark:ring-slate-900/50">
                        {user?.nombre?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white dark:border-slate-800 flex items-center justify-center text-white text-xs shadow-xl">
                        <i className="fas fa-check" />
                    </div>
                </div>

                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    {user?.nombre || user?.name}
                </h2>
                <div className="inline-flex px-5 py-2 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-black text-[10px] rounded-full uppercase tracking-[0.2em] mb-10 border border-slate-200 dark:border-white/5 shadow-sm">
                    {user?.rolNombre || 'Usuario'}
                </div>

                <div className="space-y-4 max-w-sm mx-auto">
                    <div className="p-6 rounded-[28px] bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center gap-6 transition-transform hover:scale-[1.02]">
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 text-primary/70 flex items-center justify-center shadow-sm border border-slate-100 dark:border-white/10">
                            <i className="fas fa-envelope text-xl" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-60">Email corporativo</p>
                            <p className="text-base font-bold text-slate-800 dark:text-slate-200">{user?.email || '---'}</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-12">
                    <button 
                        onClick={() => setShowModal(false)}
                        className="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:translate-y-[-2px] active:translate-y-0 transition-all shadow-2xl shadow-slate-900/20 dark:shadow-white/10"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        );
        setShowModal(true);
    };

    return (
        <header
            className="sticky top-0 z-30 h-[var(--header-height)] w-full bg-[var(--brand-surface)]/90 backdrop-blur-2xl border-b border-white/5 transition-all duration-700 px-6 md:px-12 text-white"
        >
            <div className="flex items-center justify-between h-full">
                <div className="flex items-center gap-10">
                    <button
                        onClick={toggleSidebar}
                        className="w-12 h-12 flex items-center justify-center rounded-[18px] bg-white/10 text-white hover:bg-white/20 transition-all group active:scale-95"
                    >
                        <i className={`fas ${sidebarOpen ? 'fa-align-left' : 'fa-bars'} text-xl transition-transform group-hover:scale-110`} />
                    </button>

                    <div className="hidden lg:flex flex-col">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-1.5 leading-none">
                            {configuracion?.nombre_comercial || "Panel de Gestión"}
                        </p>
                        <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
                            <span className="text-sm font-bold text-white">Servicio Activo</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <button
                        onClick={toggleDarkMode}
                        className="w-12 h-12 flex items-center justify-center rounded-[18px] bg-white/10 text-white hover:bg-white/20 transition-all group hvr-pulse-shrink"
                    >
                        <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-xl transition-transform group-hover:rotate-12`} />
                    </button>

                    <div className="h-8 w-px bg-slate-200/50 dark:bg-white/5 mx-2 hidden sm:block" />

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-5 group py-1 px-1 rounded-[22px] hover:bg-white/10 transition-all">
                                <div className="w-12 h-12 rounded-[18px] bg-white text-primary flex items-center justify-center font-black shadow-xl shadow-black/10 group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
                                    {user?.nombre?.charAt(0) || user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="hidden sm:flex flex-col items-start pr-2">
                                    <span className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                                        {user?.nombre?.split(' ')[0] || user?.name?.split(' ')[0]}
                                    </span>
                                    <span className="text-[9px] font-black text-white/50 uppercase tracking-widest mt-0.5">
                                        Nivel: {user?.rolNombre || 'Staff'}
                                    </span>
                                </div>
                                <i className="fas fa-chevron-down text-[10px] text-white/30 transition-transform group-hover:translate-y-0.5" />
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content align="right" width="w-72" contentClasses="p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-slate-200/50 dark:border-white/10 shadow-3xl rounded-[40px] mt-5">
                            <div className="px-6 py-8 bg-slate-50/50 dark:bg-white/5 rounded-[32px] mb-3 text-center border border-slate-100 dark:border-white/5">
                                <div className="w-20 h-20 rounded-[28px] bg-primary text-white flex items-center justify-center font-black text-3xl mx-auto mb-4 shadow-2xl shadow-primary/30">
                                    {user?.nombre?.charAt(0)}
                                </div>
                                <p className="text-base font-black text-slate-900 dark:text-white truncate px-2">{user?.nombre}</p>
                                <p className="text-[11px] font-bold text-slate-400 truncate mt-1 opacity-70">{user?.email}</p>
                            </div>

                            <Dropdown.Link
                                as="button"
                                onClick={handleProfile}
                                className="flex items-center gap-5 w-full px-6 py-5 rounded-[24px] text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all mb-1"
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                    <i className="fas fa-fingerprint text-lg" />
                                </div>
                                Perfil Usuario
                            </Dropdown.Link>

                            <Dropdown.Link
                                as="button"
                                onClick={handleLogout}
                                className="flex items-center gap-5 w-full px-6 py-5 rounded-[24px] text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                            >
                                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-400">
                                    <i className="fas fa-power-off text-lg" />
                                </div>
                                Cerrar Sesión
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            <ModalCustom show={showModal} onClose={() => setShowModal(false)} maxWidth="lg">
                <ModalCustom.Header closeButton onClose={() => setShowModal(false)}>
                    {titulosModal}
                </ModalCustom.Header>
                <ModalCustom.Body>
                    {contentModal}
                </ModalCustom.Body>
            </ModalCustom>
        </header>
    );
}
