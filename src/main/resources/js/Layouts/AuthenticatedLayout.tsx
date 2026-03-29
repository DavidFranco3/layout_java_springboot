import React, { useEffect, useState } from "react";
import Header from "./Sections/Header";
import Menu from "./Sections/Menu";
import Footer from "./Sections/Footer";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface AuthenticatedProps {
    auth?: any;
    user?: any;
    errors?: any;
    children: React.ReactNode;
    [key: string]: any;
}

export default function Authenticated({ auth, user, children }: AuthenticatedProps) {
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) return savedTheme === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    const [configuracion, setConfiguracion] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    useEffect(() => {
        getConfiguracion();
    }, []);

    useEffect(() => {
        const primary = configuracion?.colores || '#0f172a';
        document.documentElement.style.setProperty('--app-primary', primary);
        // Also set a "soft" version for components that might not use T4 color-mix
        document.documentElement.style.setProperty('--app-primary-soft', `color-mix(in srgb, ${primary}, transparent 92%)`);
    }, [configuracion]);

    const getConfiguracion = async () => {
        try {
            const res = await axios.get("/api/configuracion");
            // Logic mirrored from your working Index.jsx to ensure we get the right data
            const configDataRaw = Array.isArray(res.data) ? res.data[0] : (res.data.data ? res.data.data[0] : res.data);
            
            if (configDataRaw) {
                let rawColor = configDataRaw.colores || "#0f172a";
                let color = rawColor;

                // If it looks like JSON (parsed from database), parse it
                if (typeof rawColor === 'string' && rawColor.trim().startsWith('{')) {
                    try {
                        const parsed = JSON.parse(rawColor);
                        color = parsed.primary || parsed.claro || Object.values(parsed)[0] || "#0f172a";
                    } catch (e) {
                        console.error("Error parsing colors JSON:", e);
                    }
                }
                
                // Ensure it's a valid hex with #
                if (color && typeof color === 'string' && !color.startsWith("#") && /^[0-9a-fA-F]{3,6}$/.test(color)) {
                    color = `#${color}`;
                }
                
                console.log("🎨 Aplicando color corporativo:", color);

                setConfiguracion({
                    ...configDataRaw,
                    colores: color,
                });
            }
        } catch (err) {
            console.error("Error al obtener configuración:", err);
        }
    };

    const isDashboard = window.location.pathname === '/dashboard' || window.location.pathname === '/';

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-700 font-sans">
            <Menu
                auth={auth}
                configuracion={configuracion}
                sidebarOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                darkMode={darkMode}
            />

            <div
                className="flex-1 flex flex-col min-h-screen transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
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

                <main className="flex-1 px-6 py-10 md:px-12 md:py-14 overflow-x-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={window.location.pathname}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-[1600px] mx-auto"
                        >
                            {isDashboard && (
                                <div className="mb-14 animate-soft">
                                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                        ¡Hola, <span className="text-primary">{auth?.user?.name || user?.nombre || 'Admin'}</span>!
                                    </h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mt-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                                        Hoy es {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </p>
                                </div>
                            )}

                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                <Footer darkMode={darkMode} configuracion={configuracion} />
            </div>
        </div>
    );
}

