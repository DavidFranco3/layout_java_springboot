import React, { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import ModalCustom from "@/Components/Generales/ModalCustom";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import { isColorDark, shadeColor } from "@/utils/Color";

export default function Header(props) {
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

    const corporateColor = configuracion?.colores || "#0f172a";

    const headerBaseColor = darkMode
        ? shadeColor(corporateColor, -0.7)
        : corporateColor;

    const isHeaderDark = isColorDark(headerBaseColor);

    const dynamicBorderStyle = isHeaderDark ? "border-white/10" : "border-black/5";
    const textColor = isHeaderDark ? "text-slate-100" : "text-slate-800";
    const iconBase = "transition-all duration-200 flex items-center justify-center rounded-xl";
    const iconClasses = isHeaderDark
        ? `${iconBase} text-slate-200 hover:text-white hover:bg-white/10`
        : `${iconBase} text-slate-600 hover:text-slate-900 hover:bg-black/5`;

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
            background: darkMode ? "#0f172a" : "#fff",
            color: darkMode ? "#f8fafc" : "#0f172a",
        });

        if (result.isConfirmed) {
            try {
                // In a spring boot monolith, logout is usually a POST to /logout
                await axios.post("/logout");
                window.location.href = "/login";
            } catch (err) {
                console.error("Logout failed", err);
                // Even if it fails, we usually want to clear session and redirect
                window.location.href = "/login";
            }
        }
    };

    const handleProfile = () => {
        setTitulosModal(
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <i className="fas fa-id-badge text-xl" />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Mi Perfil</h3>
            </div>
        );
        setContentModal(
            <div className="p-2 sm:p-6 animate-fade-in">
                <div className="flex flex-col items-center mb-8 relative">
                    <div className="absolute inset-x-0 h-1/2 top-0 bg-gradient-to-b from-primary/5 to-transparent -z-10 rounded-t-3xl" />
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center font-black text-4xl shadow-2xl shadow-primary/30 mb-4 ring-4 ring-white dark:ring-slate-900 transition-transform hover:scale-105 duration-300">
                        {user?.nombre?.charAt(0) || user?.name?.charAt(0) || 'U'}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user?.nombre || user?.name}</h2>
                    <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-full uppercase tracking-widest mt-3 border border-emerald-200 dark:border-emerald-500/30">
                        {user?.rolNombre || 'Rol Asignado'}
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 text-slate-400 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                            <i className="fas fa-envelope text-lg text-primary/70" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Correo Electrónico</p>
                            <p className="text-sm font-black text-slate-700 dark:text-slate-200">{user?.email || 'No especificado'}</p>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 text-slate-400 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                            <i className="fas fa-shield-alt text-lg text-primary/70" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Identificador de Usuario</p>
                            <p className="text-sm font-black text-slate-700 dark:text-slate-200">#{user?.id || '---'}</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={() => setShowModal(false)}
                        className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg shadow-slate-900/20 dark:shadow-white/10"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        );
        setShowModal(true);
    };

    return (
        <header
            className={`sticky top-0 z-30 h-[var(--header-height)] w-full glass ${dynamicBorderStyle} transition-all duration-500`}
            style={{
                backgroundColor: headerBaseColor,
                borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`
            }}
        >
            <div className="flex items-center justify-between h-full px-4 md:px-8">
                <div className="flex items-center gap-6">
                    <button
                        onClick={toggleSidebar}
                        className={`w-12 h-12 ${iconClasses} rounded-2xl border border-transparent active:scale-95 transition-all duration-300`}
                        title={sidebarOpen ? "Colapsar" : "Expandir"}
                    >
                        <i className={`fas ${sidebarOpen ? 'fa-indent' : 'fa-bars'} text-xl`} />
                    </button>

                    <div className="hidden lg:flex flex-col">
                        <h1 className={`text-lg font-black tracking-tight ${textColor} leading-none mb-1`}>
                            {configuracion?.nombre_comercial || "Panel de Administración"}
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] opacity-80">
                                Sistema Activo
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleDarkMode}
                        className={`w-12 h-12 ${iconClasses} rounded-2xl border border-transparent transition-all duration-500 overflow-hidden relative group`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-tr ${darkMode ? 'from-amber-400/20 to-orange-500/20' : 'from-indigo-500/10 to-purple-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <i className={`fas ${darkMode ? 'fa-sun text-amber-400 rotate-0' : 'fa-moon -rotate-12'} text-xl transition-all duration-500 relative z-10`} />
                    </button>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />

                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-4 p-1.5 rounded-[20px] hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300 group">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-all duration-500">
                                    {user?.nombre?.charAt(0) || user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="hidden sm:flex flex-col items-start pr-3">
                                    <span className={`text-sm font-black leading-none ${textColor} group-hover:text-primary transition-colors`}>
                                        {user?.nombre || user?.name?.split(' ')[0]}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1 hover:text-primary transition-colors">
                                        {user?.rolNombre || 'Usuario'}
                                    </span>
                                </div>
                                <i className="fas fa-chevron-down text-[10px] text-slate-400 mr-2 group-hover:translate-y-0.5 transition-transform" />
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content align="right" width="w-64" contentClasses="p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-premium-lg rounded-[24px] mt-3">
                            <div className="px-5 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl mb-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Identidad de Usuario</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                                        {user?.nombre?.charAt(0) || user?.name?.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.nombre || user?.name}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="my-2 border-t border-slate-100 dark:border-white/5" />

                            <Dropdown.Link
                                as="button"
                                onClick={handleProfile}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-black text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                    <i className="fas fa-user-circle" />
                                </div>
                                Mi Perfil
                            </Dropdown.Link>

                            <Dropdown.Link
                                as="button"
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300"
                            >
                                <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
                                    <i className="fas fa-power-off" />
                                </div>
                                Desconectar
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
