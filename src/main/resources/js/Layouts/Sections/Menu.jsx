import React from "react";
import { Link } from "@inertiajs/react";
import SubMenu from "@/Components/Generales/SubMenu";
import useAuth from "@/hooks/useAuth";
import { isColorDark, shadeColor } from "@/utils/Color";
import { motion, AnimatePresence } from "framer-motion";

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <>
            {/* Overlay para móvil con backdrop blur */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>

            <aside
                className={`fixed inset-y-0 left-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex flex-col shadow-2xl border-r border-white/5
                    ${sidebarOpen ? 'w-[var(--sidebar-width)]' : 'w-24 -translate-x-full lg:translate-x-0'}`}
                style={{ backgroundColor: sidebarBg }}
            >
                {/* Logo Area Premium */}
                <div className={`relative h-[var(--header-height)] flex items-center shrink-0 overflow-hidden border-b ${isSidebarDark ? 'border-white/5' : 'border-black/5'}`}>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                    <Link href={route("dashboard")} className={`flex items-center justify-center w-full h-full transition-all duration-500 !no-underline ${sidebarOpen ? 'px-4' : 'px-0'}`}>
                        {configuracion?.logo ? (
                            <motion.img
                                layout
                                src={`/storage/${configuracion.logo}`}
                                alt="Logo"
                                className={`object-contain transition-all duration-500 scale-110 ${sidebarOpen ? 'h-12 w-auto' : 'h-10 w-10 p-1'}`}
                            />
                        ) : (
                            <div className="flex items-center justify-center gap-4">
                                <motion.div
                                    layout
                                    className="w-14 h-14 rounded-[20px] bg-white text-primary flex items-center justify-center text-2xl font-black shadow-2xl shadow-black/40 group-hover:scale-110 transition-transform duration-500">
                                    {configuracion?.nombre_comercial?.charAt(0) || 'D'}
                                </motion.div>
                                <AnimatePresence>
                                    {sidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className={`text-2xl font-black tracking-tighter transition-all duration-500 ${isSidebarDark ? 'text-white' : 'text-slate-800'}`}>
                                            {configuracion?.nombre_comercial?.split(' ')[0] || 'DEMO'}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </Link>
                </div>

                {/* User Context Card Premium */}
                <div className={`px-2 py-6 transition-all duration-500`}>
                    <motion.div
                        layout
                        className={`relative group p-3 rounded-[24px] overflow-hidden transition-all duration-500 ${sidebarOpen ? (isSidebarDark ? 'bg-white/5' : 'bg-black/5') : 'bg-transparent py-0 px-1'}`}>
                        <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'flex-col gap-3'}`}>
                            <div className="relative shrink-0">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-lg font-black shadow-xl ring-2 ring-white/10 group-hover:ring-white/30 transition-all duration-500">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-slate-900 rounded-full animate-pulse shadow-glow"></div>
                            </div>

                            <AnimatePresence>
                                {sidebarOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="flex flex-col min-w-0"
                                    >
                                        <h4 className="text-sm font-black text-white truncate drop-shadow-sm">
                                            {user?.name?.split(' ')[0]}
                                        </h4>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                                                Administrador
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>

                {/* Navigation Premium */}
                <nav className="flex-1 overflow-y-auto px-2 space-y-4 custom-scrollbar pb-10">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <ul className="space-y-1">
                            <motion.li variants={itemVariants}>
                                <Link
                                    href={route("dashboard")}
                                    className={`flex items-center h-12 rounded-2xl transition-all duration-500 group !no-underline relative overflow-hidden ${sidebarOpen ? 'px-4' : 'justify-center'}
                                        ${route().current("dashboard") ? activeLinkClasses + ' ring-1 ring-white/10' : inactiveLinkClasses}`}
                                >
                                    {route().current("dashboard") && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-white/10"
                                        />
                                    )}
                                    <div className="relative z-10 w-6 flex justify-center">
                                        <i className="fas fa-th-large text-lg transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <AnimatePresence mode="wait">
                                        {sidebarOpen && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="ml-3 text-sm font-bold tracking-tight relative z-10"
                                            >
                                                Dashboard
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            </motion.li>
                        </ul>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <ul className="space-y-1">
                            {/* SubMenus with balanced alignment */}
                            {hasModuleAccess('Users') && (
                                <motion.li variants={itemVariants}>
                                    <SubMenu
                                        title="Centro de Control"
                                        icon="fas fa-layer-group"
                                        isDark={isSidebarDark}
                                        sidebarOpen={sidebarOpen}
                                        toggleSidebar={toggleSidebar}
                                        subItems={[
                                            ...(hasModuleAccess('Users') ? [{
                                                route: "users.index",
                                                label: "Usuarios",
                                                icon: "bi bi-person-badge",
                                            }] : []),
                                        ]}
                                    />
                                </motion.li>
                            )}

                            {(hasModuleAccess('Configuracion') || hasModuleAccess('Empresas') || hasModuleAccess('Auditoria') || hasModuleAccess('Roles')) && (
                                <motion.li variants={itemVariants}>
                                    <SubMenu
                                        title="Configuración"
                                        icon="fas fa-rocket"
                                        isDark={isSidebarDark}
                                        sidebarOpen={sidebarOpen}
                                        toggleSidebar={toggleSidebar}
                                        subItems={[
                                            ...(hasModuleAccess('Configuracion') ? [{
                                                route: "configuracions.index",
                                                label: "Parámetros",
                                                icon: "bi bi-sliders2",
                                            }] : []),
                                            ...(hasModuleAccess('Empresas') ? [{
                                                route: "empresas.index",
                                                label: "Mi Empresa",
                                                icon: "fas fa-building",
                                            }] : []),
                                            ...(hasModuleAccess('Auditoria') ? [{
                                                route: "auditoria.index",
                                                label: "Seguridad",
                                                icon: "fas fa-fingerprint",
                                            }] : []),
                                            ...(hasModuleAccess('Roles') ? [{
                                                route: "roles.index",
                                                label: "Roles",
                                                icon: "bi bi-shield-lock",
                                            }] : []),
                                        ]}
                                    />
                                </motion.li>
                            )}
                        </ul>
                    </motion.div>
                </nav>
            </aside>
        </>
    );
};

export default Menu;
