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
            className={`sticky top-0 z-30 h-16 w-full ${headerClasses} ${dynamicBorderStyle}`}
            style={{ backgroundColor: `${headerBaseColor}CC` }} // 80% de opacidad (CC en hex)
        >
            <div className="flex items-center justify-between h-full px-4 md:px-6">
                {/* Left: Sidebar Toggle & Brand */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className={`w-10 h-10 ${iconClasses}`}
                        title={sidebarOpen ? "Colapsar" : "Expandir"}
                    >
                        <i className={`fas ${sidebarOpen ? 'fa-indent' : 'fa-bars'} text-lg`} />
                    </button>

                    <div className="hidden sm:flex flex-col">
                        <h1 className={`text-sm font-bold tracking-tight ${textColor} leading-none mb-1`}>
                            {configuracion?.nombre_comercial || "Panel de Administración"}
                        </h1>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-80">
                            Dashboard Corporativo
                        </span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className={`w-10 h-10 ${iconClasses}`}
                        title="Modo Oscuro/Claro"
                    >
                        <i className={`fas ${darkMode ? 'fa-sun text-amber-400' : 'fa-moon'} text-lg`} />
                    </button>

                    {/* Separator */}
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

                    {/* User Dropdown */}
                    <div className="relative">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold relative overflow-hidden group-hover:shadow-md transition-all">
                                        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="hidden md:flex flex-col items-start pr-2">
                                        <span className={`text-[13px] font-bold leading-none ${textColor} group-hover:text-primary transition-colors`}>
                                            {user?.name?.split(' ')[0]}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                                            {rolNombre || 'Usuario'}
                                        </span>
                                    </div>
                                    <i className="fas fa-chevron-down text-[10px] text-slate-400 mr-1" />
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right" width="56" contentClasses="p-2 bg-white dark:bg-slate-900 border dark:border-slate-800 shadow-premium-lg rounded-2xl overflow-hidden mt-2">
                                <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 mb-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Conectado como:</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                                    <p className="text-[11px] text-slate-500 font-medium truncate">{user?.email}</p>
                                </div>

                                <Dropdown.Link href={route("profile.edit")} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <i className="fas fa-user-circle" />
                                    </div>
                                    Perfil de Usuario
                                </Dropdown.Link>

                                <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

                                <Dropdown.Link
                                    as="button"
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
                                        <i className="fas fa-sign-out-alt" />
                                    </div>
                                    Cerrar Sesión
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
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
