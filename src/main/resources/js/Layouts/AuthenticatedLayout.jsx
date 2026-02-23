import React, { useEffect, useState } from "react";
import Header from "./Sections/Header";
import Menu from "./Sections/Menu";
import Footer from "./Sections/Footer";
import axios from "axios";
import { getContrasteColor, suavizarColor } from "@/utils/Color";

export default function Authenticated({ auth, user, children }) {
    // Inicializar modo oscuro leyendo de localStorage o preferencia del sistema
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            return savedTheme === "dark";
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    const [configuracion, setConfiguracion] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Colores dinámicos solo para acentos, el resto será Slate
    const baseColor = darkMode ? "#121212" : configuracion?.colores || "#005073";

    // Modo oscuro: aplicar clase y guardar en localStorage
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    // Cargar configuración
    useEffect(() => {
        getConfiguracion();
    }, []);

    const getConfiguracion = async () => {
        try {
            const storedConfigRaw = localStorage.getItem("configuracion");
            let storedConfig = storedConfigRaw ? JSON.parse(storedConfigRaw) : null;
            let yaSeteadoDesdeStorage = false;

            if (storedConfig) {
                setConfiguracion(storedConfig);
                yaSeteadoDesdeStorage = true;
            }

            const res = await axios.get("/configuracions/api/list");

            if (res.status === 200 && res.data.length > 0) {
                const nuevaConfig = {
                    ...res.data[0],
                    colores: res.data[0].colores || "#005073",
                    logo: res.data[0].logo || null,
                };

                const esDiferente =
                    !storedConfig ||
                    JSON.stringify(storedConfig) !== JSON.stringify(nuevaConfig);

                if (esDiferente) {
                    localStorage.setItem("configuracion", JSON.stringify(nuevaConfig));
                    setConfiguracion(nuevaConfig);
                } else if (!yaSeteadoDesdeStorage) {
                    setConfiguracion(nuevaConfig);
                }
            }
        } catch (err) {
            console.error("Error al obtener configuración:", err);
        }
    };

    return (
        <div
            className="min-h-screen bg-[var(--app-bg)] transition-colors duration-500 font-sans"
            style={{ '--app-primary': configuracion?.colores || '#005073' }}
        >
            {/* Sidebar con transición premium */}
            <Menu
                auth={auth}
                configuracion={configuracion}
                sidebarOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                darkMode={darkMode}
            />

            {/* Main Content Wrapper */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
                style={{
                    marginLeft: sidebarOpen ? 'var(--sidebar-width)' : 'var(--sidebar-collapsed-width)'
                }}
            >

                <Header
                    auth={auth}
                    user={user}
                    configuracion={configuracion}
                    toggleDarkMode={() => setDarkMode(!darkMode)}
                    darkMode={darkMode}
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    sidebarOpen={sidebarOpen}
                />

                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <div className="max-w-[1700px] mx-auto animate-fade-in">
                        {/* Portada / Breadcrumbs / Page Header Area could go here */}
                        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                {((window.location.pathname === '/dashboard' || window.location.pathname === '/') || (window.route && window.route().current('dashboard'))) ? (
                                    <>
                                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                                            <span className="w-2.5 h-10 bg-gradient-to-b from-primary to-blue-600 rounded-full hidden md:block" />
                                            ¡Hola, <span className="text-primary">{auth?.user?.name || user?.name || 'Usuario'}</span>! 👋
                                        </h1>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                                            Qué gusto verte de nuevo • {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </p>
                                    </>
                                ) : null}
                            </div>
                        </div>

                        {children &&
                            React.cloneElement(children, {
                                configuracion,
                                darkMode,
                                toggleDarkMode: () => setDarkMode(!darkMode),
                            })}
                    </div>
                </main>

                <Footer
                    darkMode={darkMode}
                    configuracion={configuracion}
                />
            </div>
        </div>
    );
}

