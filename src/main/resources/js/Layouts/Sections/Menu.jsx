import React from "react";
import { Link } from "@inertiajs/react";
import SubMenu from "@/Components/Generales/SubMenu";
import useAuth from "@/hooks/useAuth";
import { isColorDark, shadeColor } from "@/utils/Color";

const Menu = ({ configuracion, sidebarOpen, toggleSidebar, darkMode }) => {
    // Hook para acceso a información de autenticación
    const { user, rolNombre, hasModuleAccess } = useAuth();

    // Lógica de color dinámica basada en la configuración
    const corporateColor = configuracion?.colores || "#0f172a";

    // Usar el color real en la medida de lo posible
    const sidebarBg = darkMode
        ? shadeColor(corporateColor, -0.7) // Versión oscura para dark mode
        : corporateColor; // COLOR REAL en light mode

    const isSidebarDark = isColorDark(sidebarBg);

    const activeLinkClasses = isSidebarDark
        ? "bg-white/20 text-white shadow-lg shadow-black/20 scale-[1.02]"
        : "bg-black/10 text-slate-900 shadow-sm scale-[1.02]";

    const inactiveLinkClasses = isSidebarDark
        ? "text-white/70 hover:text-white hover:bg-white/10"
        : "text-slate-800/80 hover:text-slate-900 hover:bg-black/5";

    const sectionTitleClasses = isSidebarDark ? "text-white/40" : "text-slate-500/60";

    return (
        <>
            {/* Overlay para móvil con backdrop blur */}
            <div
                className={`fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            />

            <aside
                className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-in-out flex flex-col shadow-2xl
                    ${sidebarOpen ? 'w-64' : 'w-20 -translate-x-full lg:translate-x-0'}`}
                style={{ backgroundColor: sidebarBg }}
            >
                {/* Logo Area con Gradiente Gradual */}
                <div className={`relative h-20 flex items-center shrink-0 overflow-hidden border-b ${isSidebarDark ? 'border-white/5' : 'border-black/5'}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
                    <Link href={route("dashboard")} className={`flex items-center w-full h-full transition-all duration-300 !no-underline ${sidebarOpen ? 'px-4' : 'justify-center px-0'}`}>
                        {configuracion?.logo ? (
                            <div className="w-full flex justify-center items-center overflow-hidden">
                                <img
                                    src={`/storage/${configuracion.logo}`}
                                    alt="Logo"
                                    className={`object-contain transition-all duration-300 ${sidebarOpen ? 'w-full h-auto max-h-14 p-1' : 'h-10 w-10 p-1'}`}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/30`}>
                                    {configuracion?.nombre_comercial?.charAt(0) || 'D'}
                                </div>
                                <span className={`text-base font-black tracking-widest uppercase truncate transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'} ${isSidebarDark ? 'text-white' : 'text-slate-800'}`}>
                                    {configuracion?.nombre_comercial?.split(' ')[0] || 'DEMO'}
                                </span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Account Section - Rediseñada como Card */}
                <div className={`p-4 transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-100'}`}>
                    <div className={`flex items-center gap-3 rounded-2xl transition-all duration-300 ${sidebarOpen ? (isSidebarDark ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5') + ' p-3 border' : 'justify-center border-none p-0'}`}>
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-bold shadow-md">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 rounded-full shadow-sm ${isSidebarDark ? 'border-slate-900' : 'border-white'}`}></div>
                        </div>

                        <div className={`flex flex-col min-w-0 transition-all duration-500 ${sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                            <span className={`text-[13px] font-bold truncate leading-tight ${isSidebarDark ? 'text-white' : 'text-slate-900'}`}>
                                {user?.name}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-tighter mt-0.5 ${isSidebarDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {rolNombre || 'Online'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation - Con Separadores y Títulos */}
                <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-8 custom-scrollbar scrollbar-hide">
                    {/* Sección Principal */}
                    <div>
                        {sidebarOpen && (
                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-2 ${sectionTitleClasses}`}>Menú Principal</p>
                        )}
                        <ul className="space-y-1.5">
                            <li>
                                <Link
                                    href={route("dashboard")}
                                    className={`flex items-center h-11 text-sm font-bold rounded-xl transition-all duration-300 group !no-underline ${sidebarOpen ? 'px-4' : 'justify-center px-0'}
                                        ${route().current("dashboard") ? activeLinkClasses : inactiveLinkClasses}`}
                                >
                                    <div className="w-5 flex justify-center">
                                        <i className="fas fa-th-large text-balance opacity-80 group-hover:opacity-100" />
                                    </div>
                                    <span className={`ml-3 transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden w-0'}`}>
                                        Dashboard
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Otras Secciones dinámicas */}
                    <div>
                        {sidebarOpen && (
                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-2 ${sectionTitleClasses}`}>Administración</p>
                        )}
                        <ul className="space-y-1.5">
                            {/* Catálogos */}
                            {hasModuleAccess('Users') && (
                                <SubMenu
                                    title="Catálogos"
                                    icon="fas fa-folder-tree"
                                    isDark={isSidebarDark}
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
                                    title="Ajustes"
                                    icon="fas fa-sliders"
                                    isDark={isSidebarDark}
                                    sidebarOpen={sidebarOpen}
                                    toggleSidebar={toggleSidebar}
                                    subItems={[
                                        ...(hasModuleAccess('Configuracion') ? [{
                                            route: "configuracions.index",
                                            label: "Configuración Gen",
                                            icon: "bi bi-gear",
                                        }] : []),
                                        ...(hasModuleAccess('Empresas') ? [{
                                            route: "empresas.index",
                                            label: "Mi Empresa",
                                            icon: "bi bi-building",
                                        }] : []),
                                        ...(hasModuleAccess('Auditoria') ? [{
                                            route: "auditoria.index",
                                            label: "Seguridad / Logs",
                                            icon: "fas fa-shield-halved",
                                        }] : []),
                                        ...(hasModuleAccess('Roles') ? [{
                                            route: "roles.index",
                                            label: "Permisos y Roles",
                                            icon: "bi bi-lock",
                                        }] : []),
                                    ]}
                                />
                            )}
                        </ul>
                    </div>
                </nav>

                {/* Footer del sidebar - Rediseñado */}
                <div className="p-4 border-t border-white/5">
                    <div className={`rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden transition-all duration-300 ${sidebarOpen ? 'p-3 border border-white/5 opacity-100' : 'opacity-0 h-0 p-0'}`}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase text-center tracking-widest leading-relaxed">
                            Soporte Técnico<br />
                            <span className="text-primary hover:underline cursor-pointer">isotech.mx</span>
                        </p>
                    </div>
                    {!sidebarOpen && (
                        <div className="flex justify-center text-slate-600">
                            <i className="fas fa-info-circle" />
                        </div>
                    )}
                </div>

            </aside>
        </>
    );
};

export default Menu;
