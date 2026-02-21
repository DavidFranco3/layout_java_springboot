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

            const res = await axios.get(
                "/configuracions/api/list"
            );

            if (res.status === 200 && res.data.length > 0) {
                const nuevaConfig = {
                    ...res.data[0],
                    colores: res.data[0].colores || "#005073",
                    logo: res.data[0].logo ? `/files/${res.data[0].logo}` : null,
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
            className={`min-h-screen bg-slate-50 ${darkMode ? 'dark:bg-slate-900' : ''}`}
            style={{ '--app-primary': configuracion?.colores || '#005073' }}
        >
            {/* Sidebar */}
            <Menu
                auth={auth}
                configuracion={configuracion}
                sidebarOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                darkMode={darkMode}
            />

            {/* Main Content Wrapper */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>

                <Header
                    auth={auth}
                    user={user}
                    configuracion={configuracion}
                    toggleDarkMode={() => setDarkMode(!darkMode)}
                    darkMode={darkMode}
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    sidebarOpen={sidebarOpen}
                />

                <main className="flex-1 p-6 mt-16 overflow-x-hidden">
                    {children &&
                        React.cloneElement(children, {
                            configuracion,
                            darkMode,
                            toggleDarkMode: () => setDarkMode(!darkMode),
                        })}
                </main>

                <Footer
                    darkMode={darkMode}
                    configuracion={configuracion}
                />
            </div>
        </div>
    );
}
