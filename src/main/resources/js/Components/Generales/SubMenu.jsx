import React, { useState } from "react";
import { Link } from "@inertiajs/react";

const SubMenu = ({ title, icon, subItems, isDark = true, sidebarOpen = true, toggleSidebar }) => {
    const isAnyChildActive = subItems.some(item => route().current(item.route));
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

    const parentColor = isDark ? "text-white/70" : "text-slate-600";
    const childColor = isDark ? "text-white/60" : "text-slate-500";
    const hoverBg = isDark ? "hover:bg-white/10" : "hover:bg-slate-100";
    const hoverText = isDark ? "hover:text-white" : "hover:text-primary";
    const activeColor = "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]";

    return (
        <li className="mb-1">
            <button
                onClick={toggleSubMenu}
                className={`w-full flex items-center py-3 text-sm font-bold rounded-2xl transition-all duration-500 group relative overflow-hidden
                    ${sidebarOpen ? 'px-4' : 'justify-center px-0'}
                    ${expandedMenu && sidebarOpen
                        ? (isDark ? "bg-white/10 text-white shadow-inner" : "bg-slate-50 text-slate-900 shadow-inner")
                        : `${parentColor} ${hoverBg} ${hoverText}`
                    }`}
                title={!sidebarOpen ? title : ""}
            >
                {expandedMenu && sidebarOpen && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-glow" />
                )}

                <i className={`${icon} text-lg transition-all duration-500 ${expandedMenu && sidebarOpen ? 'opacity-100 scale-110' : 'opacity-60 group-hover:opacity-100'} ${sidebarOpen ? 'mr-3' : 'mr-0'}`} />

                <span className={`flex-1 text-left tracking-tight transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                    {title}
                </span>

                {sidebarOpen && (
                    <i
                        className={`fas fa-chevron-right text-[10px] transition-all duration-500 ${expandedMenu ? "rotate-90 text-primary" : "rotate-0 opacity-40 group-hover:opacity-100"
                            }`}
                    />
                )}
            </button>

            {/* Submenús con animación Premium */}
            <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${expandedMenu && sidebarOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <ul className="space-y-1 ml-1 pl-2 border-l border-white/10 dark:border-white/5">
                    {subItems.map((item) => {
                        const isActive = route().current(item.route);
                        return (
                            <li key={item.route} className="relative group">
                                {isActive && (
                                    <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-glow" />
                                )}
                                <Link
                                    href={route(item.route)}
                                    className={`flex items-center px-3 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 group !no-underline ${isActive
                                        ? activeColor
                                        : `${childColor} ${hoverBg} ${hoverText}`
                                        }`}
                                >
                                    <i className={`${item.icon} text-base transition-all duration-300 ${isActive ? 'opacity-100 scale-110' : 'opacity-50 group-hover:opacity-100 group-hover:scale-110'} mr-3`} />
                                    <span className={`truncate tracking-tight ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </li>
    );
};

export default SubMenu;
