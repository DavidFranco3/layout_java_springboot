import React, { useState } from "react";
import Dropdown from "@/Components/Dropdown";
import BasicModal from "@/Components/Modal/BasicModal";
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
    const effectiveBg = darkMode ? "#1e293b" : headerBg;
    const isDark = isColorDark(effectiveBg);

    // Clases dinámicas según el contraste del header resultante
    const textColor = isDark ? "text-slate-100" : "text-slate-700";
    const iconColor = isDark ? "text-slate-300 hover:bg-white/10" : "text-slate-500 hover:bg-black/5";
    const borderColor = isDark ? "border-slate-700" : "border-black/5";

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "¿Cerrar sesión?",
            text: "Tu sesión se finalizará",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "Cancelar",
            background: darkMode ? "#1f2937" : "#fff",
            color: darkMode ? "#fff" : "#000",
        });

        if (result.isConfirmed) {
            router.post(route("logout"), {
                onSuccess: () => {
                    Swal.fire({
                        title: "Sesión finalizada",
                        text: "Has cerrado sesión correctamente",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                        background: darkMode ? "#1f2937" : "#fff",
                        color: darkMode ? "#fff" : "#000",
                    });
                    setTimeout(() => {
                        router.visit("/login");
                    }, 1600);
                },
            });
        }
    };

    return (
        <header
            className={`fixed top-0 right-0 z-20 flex h-16 items-center justify-between border-b px-4 shadow-sm transition-all duration-300 ${sidebarOpen ? 'lg:left-64 lg:w-[calc(100%-16rem)]' : 'lg:left-20 lg:w-[calc(100%-5rem)]'} w-full ${borderColor}`}
            style={{ backgroundColor: effectiveBg }}
        >
            {/* Left side: Toggle & Title */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className={`rounded p-2 focus:outline-none transition-colors ${iconColor}`}
                >
                    <i className="fas fa-bars text-xl" />
                </button>

                <h1 className={`text-lg font-semibold hidden sm:block ${textColor}`}>
                    {configuracion?.nombre_comercial || "Panel de Administración"}
                </h1>
            </div>

            {/* Right side: User & Actions */}
            <div className="flex items-center gap-4">
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleDarkMode}
                    className={`rounded-full p-2 transition-colors ${iconColor}`}
                    title="Alternar modo oscuro"
                >
                    {darkMode ? <i className="fas fa-sun text-yellow-500"></i> : <i className="fas fa-moon"></i>}
                </button>

                {/* User Dropdown */}
                <Dropdown>
                    <Dropdown.Trigger>
                        <button className={`flex items-center gap-2 rounded-full border border-transparent py-1 px-2 text-sm font-medium transition focus:outline-none ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isDark ? 'bg-white/20 text-white' : 'bg-black/10 text-slate-700'}`}>
                                <i className="bi bi-person-fill text-lg leading-none" />
                            </div>
                            <span className="hidden text-left md:block">
                                <span className={`block leading-none ${textColor}`}>{user?.name}</span>
                                {rolNombre && (
                                    <span className={`mt-0.5 block text-xs font-normal ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                                        {rolNombre}
                                    </span>
                                )}
                            </span>
                            <i className={`fas fa-chevron-down ml-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content align="right" width="48" contentClasses="py-1 bg-white dark:bg-slate-800 border dark:border-slate-700">
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 md:hidden">
                            <span className="block text-sm text-slate-700 dark:text-slate-200">{user?.name}</span>
                            <span className="block text-xs text-slate-500 dark:text-slate-400">{rolNombre}</span>
                        </div>

                        <Dropdown.Link href={route("profile.edit")} className="dark:text-slate-300 dark:hover:bg-slate-700">
                            <i className="fas fa-user-circle mr-2 opacity-75"></i> Perfil
                        </Dropdown.Link>

                        <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                        <Dropdown.Link
                            as="button"
                            className="w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={handleLogout}
                        >
                            <i className="fas fa-sign-out-alt mr-2 opacity-75"></i> Cerrar Sesión
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>

                <BasicModal
                    show={showModal}
                    setShow={setShowModal}
                    title={titulosModal}
                >
                    {contentModal}
                </BasicModal>
            </div>
        </header>
    );
}
