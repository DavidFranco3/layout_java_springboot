import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SubMenu = ({ title, icon, subItems, sidebarOpen = true, toggleSidebar }) => {
    const location = useLocation();
    const isAnyChildActive = subItems.some(item => location.pathname === item.to);
    const [expandedMenu, setExpandedMenu] = useState(isAnyChildActive);

    const toggleSubMenu = (e) => {
        e.preventDefault();
        if (!sidebarOpen && toggleSidebar) {
            toggleSidebar();
            setExpandedMenu(true);
        } else {
            setExpandedMenu((prevState) => !prevState);
        }
    };

    const activeColor = "bg-white/20 text-white shadow-md ring-1 ring-white/30 backdrop-blur-md";
    const inactiveColor = "text-white hover:text-white dark:text-slate-400 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5 font-bold";

    return (
        <div className="mb-2">
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={toggleSubMenu}
                className={`w-full flex items-center py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 group relative
                    ${sidebarOpen ? 'px-4' : 'justify-center px-0'}
                    ${expandedMenu && sidebarOpen
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                title={!sidebarOpen ? title : ""}
            >
                <div className={`w-6 flex justify-center text-lg transition-transform duration-300 ${expandedMenu && sidebarOpen ? 'scale-110 opacity-100' : 'opacity-60 group-hover:opacity-100 group-hover:scale-110'}`}>
                    <i className={icon} />
                </div>

                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex-1 text-left ml-4 tracking-tight"
                        >
                            {title}
                        </motion.span>
                    )}
                </AnimatePresence>

                {sidebarOpen && (
                    <motion.i
                        animate={{ rotate: expandedMenu ? 90 : 0 }}
                        className={`fas fa-chevron-right text-[10px] transition-colors ${expandedMenu ? "text-white" : "text-white/30 group-hover:text-white/60"}`}
                    />
                )}
            </motion.button>

            <AnimatePresence>
                {expandedMenu && sidebarOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <ul className="space-y-1 mt-2 ml-7 pl-4 border-l-2 border-white/20">
                            {subItems.map((item) => {
                                const isActive = location.pathname === item.to;
                                return (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            className={`flex items-center px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 group !no-underline ${isActive
                                                ? activeColor
                                                : inactiveColor
                                                }`}
                                        >
                                            <div className="w-5 flex justify-center mr-3 text-white transition-transform group-hover:scale-110">
                                                <i className={item.icon} />
                                            </div>
                                            <span className="flex-1 text-[13px] font-bold tracking-tight transition-all group-hover:translate-x-0.5">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubMenu;
