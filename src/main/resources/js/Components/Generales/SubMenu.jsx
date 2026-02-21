import React, { useState } from "react";
import { Link } from "@inertiajs/react";

const SubMenu = ({ title, icon, subItems, isDark = true, sidebarOpen = true, toggleSidebar }) => {
    // Verificar si alguna ruta hija está activa para abrir el menú por defecto
    const isAnyChildActive = subItems.some(item => route().current(item.route));
    const [expandedMenu, setExpandedMenu] = useState(isAnyChildActive);

    // Ajustar estado expandido si el sidebar cambia (opcional: si colapsas sidebar, colapsar submenú?)
    // Por ahora mantenemos estado independiente, pero visualmente si sidebar cierra, submenú se oculta porque no cabe. 
    // Mejor lógica: Si sidebarOpen es false, expandedMenu no importa visualmente porque ocultaremos la lista, 
    // PERO si el usuario hace click, expandimos sidebar.

    const toggleSubMenu = (e) => {
        e.preventDefault();
        if (!sidebarOpen && toggleSidebar) {
            // Si está cerrado, abrir sidebar primero y expandir este menú
            toggleSidebar(); // Asumimos que esto pone sidebarOpen = true
            setExpandedMenu(true);
        } else {
            setExpandedMenu((prevState) => !prevState);
        }
    };

    const textoColor = isDark ? "text-slate-100" : "text-slate-900";
    const textoColorHover = isDark ? "hover:text-white hover:bg-white/10" : "hover:text-black hover:bg-black/5";
    const activeColor = isDark ? "bg-white/20 text-white" : "bg-black/10 text-black";

    return (
        <li className="mb-1">
            <button
                onClick={toggleSubMenu}
                className={`w-full flex items-center py-2.5 text-sm font-medium rounded-lg transition-colors group 
                    ${sidebarOpen ? 'px-4' : 'justify-center px-2'}
                    ${expandedMenu && sidebarOpen
                        ? (isDark ? "bg-white/10" : "bg-black/5")
                        : `${textoColor} opacity-80 ${textoColorHover}`
                    }`}
                title={!sidebarOpen ? title : ""}
            >
                <i className={`nav-icon ${icon} w-5 h-5 text-center transition-opacity ${expandedMenu && sidebarOpen ? 'opacity-100' : 'opacity-75 group-hover:opacity-100'} ${sidebarOpen ? 'mr-3' : 'mr-0'}`} />

                <span className={`flex-1 text-left transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden w-0'}`}>
                    {title}
                </span>

                {sidebarOpen && (
                    <i
                        className={`fas fa-chevron-right ml-2 text-xs transition-transform duration-200 ${expandedMenu ? "rotate-90" : "rotate-0 opacity-50"
                            }`}
                    />
                )}
            </button>

            {/* Submenús - Solo mostrar si sidebar está abierto y menú expandido */}
            <div className={`overflow-hidden transition-all duration-300 ${expandedMenu && sidebarOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <ul className="space-y-1 px-2">
                    {subItems.map((item) => {
                        const isActive = route().current(item.route);
                        return (
                            <li key={item.route}>
                                <Link
                                    href={route(item.route)}
                                    className={`flex items-center pl-10 pr-4 py-2 text-sm font-medium rounded-lg transition-colors group !no-underline hover:no-underline ${isActive
                                        ? activeColor
                                        : `${textoColor} opacity-70 hover:opacity-100 ${textoColorHover}`
                                        }`}
                                >
                                    <i className={`nav-icon ${item.icon} w-5 h-5 text-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'} mr-3`} />
                                    <span className="truncate">{item.label}</span>
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
