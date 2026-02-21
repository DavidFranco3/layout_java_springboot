import React from "react";
import { Link } from "@inertiajs/react";
import SubMenu from "@/Components/Generales/SubMenu";
import useAuth from "@/hooks/useAuth";
import { isColorDark } from "@/utils/Color";

const Menu = ({ configuracion, sidebarOpen, toggleSidebar, darkMode }) => {
    // Hook para acceso a información de autenticación
    const { user, rolNombre, hasModuleAccess } = useAuth();

    // En modo oscuro, usamos un color oscuro estándar (slate-900).
    // En modo claro, usamos el color corporativo.
    const corporateColor = configuracion?.colores || "#0f172a";
    const fondoColor = darkMode ? "#0f172a" : corporateColor;

    // Verificar si el fondo efectivo es oscuro para ajustar el texto
    const isDark = isColorDark(fondoColor);

    // Definir colores de texto basados en el fondo
    const textoColor = isDark ? "text-slate-100" : "text-slate-900";
    const textoColorHover = isDark ? "hover:text-white hover:bg-white/10" : "hover:text-black hover:bg-black/5";
    const activeColor = isDark ? "bg-white/20 text-white" : "bg-black/10 text-black";

    return (
        <>
            {/* Overlay para móvil */}
            <div
                className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-30 transition-all duration-300 shadow-2xl flex flex-col 
                    ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'} 
                    ${textoColor}`}
                style={{ backgroundColor: fondoColor }}
            >

                {/* Logo Area */}
                <div className={`flex items-center h-16 border-b border-white/10 shrink-0 transition-all duration-300 ${sidebarOpen ? 'justify-start px-4' : 'justify-center px-0'}`} style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                    <Link href={route("dashboard")} className="flex items-center space-x-2 w-full justify-center overflow-hidden">
                        {configuracion?.logo ? (
                            <img
                                src={`/storage/${configuracion.logo}`}
                                alt="Logo"
                                className="h-10 object-contain max-w-full"
                            />
                        ) : (
                            <span className={`text-lg font-bold tracking-wide truncate transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                {configuracion?.nombre_comercial || 'Panel Admin'}
                            </span>
                        )}
                        {/* Logo icon fallback for mini mode if no image? Assuming logo image handles resizing or user uses text */}
                        {!configuracion?.logo && !sidebarOpen && (
                            <span className="text-xl font-bold">QA</span>
                        )}
                    </Link>
                </div>

                {/* User Info Brief */}
                <div className={`border-b border-white/5 transition-all duration-300 ${sidebarOpen ? 'p-4' : 'p-2 flex justify-center'}`} style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isDark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className={`flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden w-0'}`}>
                            <p className="text-sm font-medium truncate">
                                {user?.name || 'Usuario'}
                            </p>
                            <p className="text-xs opacity-70 truncate">
                                {rolNombre || 'Sin Rol'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar overflow-x-hidden">
                    <ul className="space-y-1 px-3">
                        <li>
                            <Link
                                href={route("dashboard")}
                                className={`flex items-center py-2.5 text-sm font-medium rounded-lg transition-colors group ${sidebarOpen ? 'px-4' : 'justify-center px-2'} ${route().current("dashboard")
                                    ? activeColor
                                    : `${textoColor} opacity-80 ${textoColorHover}`
                                    }`}
                                title={!sidebarOpen ? "Dashboard" : ""}
                            >
                                <i className={`nav-icon fas fa-th w-5 h-5 text-center group-hover:opacity-100 ${sidebarOpen ? 'mr-3' : 'mr-0'}`} />
                                <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden w-0'}`}>Dashboard</span>
                            </Link>
                        </li>

                        {/* Catálogos */}
                        {hasModuleAccess('Users') && (
                            <SubMenu
                                title="Catálogos"
                                icon="fas fa-book"
                                isDark={isDark}
                                sidebarOpen={sidebarOpen}
                                toggleSidebar={toggleSidebar}
                                subItems={[
                                    ...(hasModuleAccess('Users') ? [{
                                        route: "users.index",
                                        label: "Usuarios",
                                        icon: "bi bi-people",
                                    }] : []),
                                ]}
                            />
                        )}

                        {/* Configuración */}
                        {(hasModuleAccess('Configuracion') || hasModuleAccess('Empresas') || hasModuleAccess('Auditoria') || hasModuleAccess('Roles')) && (
                            <SubMenu
                                title="Configuración"
                                icon="fas fa-cogs"
                                isDark={isDark}
                                sidebarOpen={sidebarOpen}
                                toggleSidebar={toggleSidebar}
                                subItems={[
                                    ...(hasModuleAccess('Configuracion') ? [{
                                        route: "configuracions.index",
                                        label: "Configuración",
                                        icon: "bi bi-gear",
                                    }] : []),
                                    ...(hasModuleAccess('Empresas') ? [{
                                        route: "empresas.index",
                                        label: "Empresa",
                                        icon: "bi bi-building",
                                    }] : []),
                                    ...(hasModuleAccess('Auditoria') ? [{
                                        route: "auditoria.index",
                                        label: "Logs de Auditoría",
                                        icon: "fas fa-file-alt",
                                    }] : []),
                                    ...(hasModuleAccess('Roles') ? [{
                                        route: "roles.index",
                                        label: "Roles",
                                        icon: "bi bi-shield-lock",
                                    }] : []),
                                ]}
                            />
                        )}
                    </ul>
                </nav>

                {/* Footer del sidebar (opcional, para debug) */}
                {process.env.NODE_ENV === 'development' && sidebarOpen && (
                    <div className="p-2 bg-black/20 text-[10px] opacity-70 text-center">
                        v1.0 Dev Mode
                    </div>
                )}
            </aside>
        </>
    );
};

export default Menu;
