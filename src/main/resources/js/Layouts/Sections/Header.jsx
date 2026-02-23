import React, { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import ModalCustom from "@/Components/Generales/ModalCustom";
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";
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

    // Hook para acceso a información de autenticación
    const { user, rolNombre } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Lógica de Paleta de Colores
    const baseColor = configuracion?.colores || "#0f172a";
    const isBaseDark = isColorDark(baseColor);

    // Generar tono para el header:
    // Si la base es oscura, aclaramos un poco el header para que se distinga del sidebar.
    // Si la base es clara, oscurecemos un poco.
    const headerBg = isBaseDark ? shadeColor(baseColor, 0.2) : shadeColor(baseColor, -0.05);

    // Override en modo oscuro global
    // Clases dinámicas según el contraste del header resultante
    // Lógica de color dinámica basada en la marca
    const corporateColor = configuracion?.colores || "#0f172a";

    // Fondo del header: Usar el COLOR REAL en light mode
    const headerBaseColor = darkMode
        ? shadeColor(corporateColor, -0.7)
        : corporateColor;

    const isHeaderDark = isColorDark(headerBaseColor);

    // Clases dinámicas mejoradas con soporte para color de marca
    const headerClasses = "backdrop-blur-md shadow-sm border-b transition-all duration-300";
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
            customClass: {
                popup: 'rounded-3xl border border-slate-200 dark:border-slate-800 px-6 py-4'
            }
        });

        if (result.isConfirmed) {
            router.post(route("logout"));
        }
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
                {/* Left: Sidebar Toggle & Brand */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={toggleSidebar}
                        className={`w-12 h-12 ${iconClasses} rounded-2xl border border-transparent active:scale-95 transition-all duration-300`}
                        title={sidebarOpen ? "Colapsar" : "Expandir"}
                    >
                        <i className={`fas ${sidebarOpen ? 'fa-indent' : 'fa-bars'} text-xl`} />
                    </button>

                    <div className="hidden lg:flex flex-col">
                        <h1 className={`text-lg font-black tracking-tight ${textColor} leading-none mb-1 animate-fade-in`}>
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

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle Premium */}
                    <button
                        onClick={toggleDarkMode}
                        className={`w-12 h-12 ${iconClasses} rounded-2xl border border-transparent transition-all duration-500 overflow-hidden relative group`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-tr ${darkMode ? 'from-amber-400/20 to-orange-500/20' : 'from-indigo-500/10 to-purple-500/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <i className={`fas ${darkMode ? 'fa-sun text-amber-400 rotate-0' : 'fa-moon -rotate-12'} text-xl transition-all duration-500 relative z-10`} />
                    </button>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block" />

                    {/* User Profile Premium */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-4 p-1.5 rounded-[20px] hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300 group">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-all duration-500">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="hidden sm:flex flex-col items-start pr-3">
                                    <span className={`text-sm font-black leading-none ${textColor} group-hover:text-primary transition-colors`}>
                                        {user?.name?.split(' ')[0]}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1 hover:text-primary transition-colors">
                                        Administrador
                                    </span>
                                </div>
                                <i className="fas fa-chevron-down text-[10px] text-slate-400 mr-2 group-hover:translate-y-0.5 transition-transform" />
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content align="right" width="64" contentClasses="p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-premium-lg rounded-[24px] mt-3 animate-scale-in">
                            <div className="px-5 py-4 bg-slate-50 dark:bg-white/5 rounded-2xl mb-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Identidad de Usuario</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            <Dropdown.Link href={route("profile.edit")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-primary/5 hover:text-primary transition-all duration-300">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <i className="fas fa-id-card" />
                                </div>
                                Perfil Personal
                            </Dropdown.Link>

                            <div className="my-2 border-t border-slate-100 dark:border-white/5" />

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
