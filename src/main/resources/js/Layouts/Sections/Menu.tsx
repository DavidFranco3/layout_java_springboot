import React from "react";
import { Link, useLocation } from "react-router-dom";
import SubMenu from "@/Components/Generales/SubMenu";
import useAuth from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

interface MenuProps {
    configuracion: any;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    darkMode: boolean;
    auth?: any;
    [key: string]: any;
}

const Menu: React.FC<MenuProps> = ({ configuracion, sidebarOpen, toggleSidebar, darkMode, auth }) => {
    const { user, hasModuleAccess } = useAuth();
    const location = useLocation();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    const isCurrent = (path) => location.pathname === path;

    const activeLinkClasses = "nav-item-active";
    const inactiveLinkClasses = "nav-item-inactive";

    return (
        <>
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm lg:hidden transition-all duration-700"
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>

            <aside
                className={`fixed inset-y-0 left-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col bg-[var(--brand-surface)]/95 backdrop-blur-[64px] border-r border-white/10 dark:border-white/5 shadow-2xl shadow-black/10
                    ${sidebarOpen ? 'w-[var(--sidebar-width)]' : 'w-[var(--sidebar-collapsed-width)] -translate-x-full lg:translate-x-0'}`}
            >
                <div className="h-[var(--header-height)] flex items-center px-6 shrink-0 border-b border-white/10 dark:border-white/5">
                    <Link to="/dashboard" className="flex items-center gap-4 !no-underline group">
                        <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-white to-white/90 text-[var(--app-primary)] flex items-center justify-center text-xl font-black shadow-xl shadow-black/10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                            {configuracion?.nombre_comercial?.charAt(0) || 'D'}
                        </div>
                        <AnimatePresence>
                            {sidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="text-xl font-black tracking-tight text-white"
                                >
                                    {configuracion?.nombre_comercial?.split(' ')[0] || 'App'}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar space-y-8">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <p className={`text-[11px] font-black uppercase tracking-[0.3em] text-white/60 mb-4 px-4 ${!sidebarOpen && 'text-center opacity-0'}`}>
                            Navegación
                        </p>
                        <ul className="space-y-1.5">
                            <motion.li variants={itemVariants}>
                                <Link
                                    to="/dashboard"
                                    className={`flex items-center h-12 rounded-2xl transition-all duration-300 group !no-underline relative ${sidebarOpen ? 'px-4' : 'justify-center'}
                                        ${isCurrent("/dashboard") ? activeLinkClasses : inactiveLinkClasses}`}
                                >
                                    <div className="w-6 flex justify-center">
                                        <i className="fas fa-grid-2 text-lg" />
                                    </div>
                                    {sidebarOpen && <span className="ml-4 text-sm font-bold tracking-tight">Dashboard</span>}
                                    {isCurrent("/dashboard") && sidebarOpen && (
                                        <motion.div layoutId="nav-pill" className="absolute left-0 w-1 h-5 bg-white rounded-full" />
                                    )}
                                </Link>
                            </motion.li>
                        </ul>
                    </motion.div>

                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                        {/* Centro de Control */}
                        {hasModuleAccess('Users') && (
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 px-4 ${!sidebarOpen && 'hidden'}`}>
                                    Centro de Control
                                </p>
                                <ul className="space-y-1.5">
                                    <motion.li variants={itemVariants}>
                                        <SubMenu
                                            title="Usuarios"
                                            icon="fas fa-users-gear"
                                            sidebarOpen={sidebarOpen}
                                            subItems={[
                                                { to: "/users", label: "Usuarios", icon: "bi bi-person-badge" },
                                            ]}
                                        />
                                    </motion.li>
                                </ul>
                            </div>
                        )}

                        {/* Catálogos */}
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 px-4 ${!sidebarOpen && 'hidden'}`}>
                                Catálogos
                            </p>
                            <ul className="space-y-1.5">
                                <motion.li variants={itemVariants}>
                                    <SubMenu
                                        title="Catálogos"
                                        icon="fas fa-book-open"
                                        sidebarOpen={sidebarOpen}
                                        subItems={[
                                            { to: "/clientes", label: "Clientes", icon: "fas fa-users" },
                                        ]}
                                    />
                                </motion.li>
                            </ul>
                        </div>

                        {/* Configuración */}
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 px-4 ${!sidebarOpen && 'hidden'}`}>
                                Configuración
                            </p>
                            <ul className="space-y-1.5">
                                <motion.li variants={itemVariants}>
                                    <SubMenu
                                        title="Parámetros"
                                        icon="fas fa-sliders"
                                        sidebarOpen={sidebarOpen}
                                        subItems={[
                                            { to: "/configuracion", label: "Parámetros", icon: "bi bi-sliders2" },
                                            { to: "/empresas", label: "Mi Empresa", icon: "fas fa-building" },
                                            { to: "/auditoria", label: "Seguridad", icon: "fas fa-fingerprint" },
                                            { to: "/roles", label: "Roles", icon: "bi bi-shield-lock" },
                                        ]}
                                    />
                                </motion.li>
                            </ul>
                        </div>
                    </motion.div>

                    <div className="pt-6 mt-6 border-t border-white/10 pb-6">
                        <motion.div
                            layout
                            className={`p-3 rounded-[24px] bg-white/5 border border-white/10 flex items-center hover:bg-white/10 transition-colors cursor-pointer ${sidebarOpen ? 'gap-4' : 'justify-center'}`}
                        >
                            <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-indigo-500 to-primary text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-indigo-500/30">
                                {user?.nombre?.charAt(0) || 'U'}
                            </div>
                            {sidebarOpen && (
                                <div className="min-w-0">
                                    <p className="text-sm font-black text-white truncate">{user?.nombre || 'Admin'}</p>
                                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest truncate mt-0.5">{user?.rolNombre || 'Staff'}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Menu;
