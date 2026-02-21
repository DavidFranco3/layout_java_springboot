import React from "react";
import { isColorDark, shadeColor } from "@/utils/Color";

export default function Footer({ darkMode, configuracion }) {
    const baseColor = configuracion?.colores || "#0f172a";
    // Footer un poco más oscuro que el header si es light mode
    const footerBg = isColorDark(baseColor) ? shadeColor(baseColor, -0.4) : shadeColor(baseColor, 0.05);
    const effectiveBg = darkMode ? "#1e293b" : footerBg;
    const isDark = isColorDark(effectiveBg);

    // Contraste
    const textColor = isDark ? "text-slate-400" : "text-slate-500";
    const borderColor = isDark ? "border-slate-800" : "border-slate-200/50";

    return (
        <footer
            className={`mt-auto border-t p-4 text-center text-sm transition-colors ${borderColor}`}
            style={{ backgroundColor: effectiveBg, color: isDark ? '#cbd5e1' : '#64748b' }}
        >
            <div className="container mx-auto">
                <strong>
                    Copyright © {new Date().getFullYear()} <span className={`font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>Isotech.mx</span>.
                </strong>{" "}
                Todos los derechos reservados.
                <div className="hidden sm:inline-block ml-2 opacity-75">
                    <b>Versión</b> 1.0.0
                </div>
            </div>
        </footer>
    );
}
