import React from "react";
import { isColorDark, shadeColor } from "@/utils/Color";

export default function Footer({ darkMode, configuracion }) {
    const corporateColor = configuracion?.colores || "#0f172a";

    // El footer usa el color real con un ajuste mínimo para diferenciar
    const footerBg = darkMode
        ? shadeColor(corporateColor, -0.7)
        : corporateColor;

    const isFooterDark = isColorDark(footerBg);

    return (
        <footer
            className={`mt-auto border-t py-6 px-4 text-center transition-all duration-300 ${isFooterDark ? 'border-white/5 text-slate-400' : 'border-black/5 text-slate-500'}`}
            style={{ backgroundColor: footerBg }}
        >
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1700px]">
                <div className={`text-[11px] font-bold uppercase tracking-[0.2em] opacity-80 ${isFooterDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    © {new Date().getFullYear()} <span className="text-primary">Isotech.mx</span> — Gestión Inteligente
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest opacity-60 ${isFooterDark ? 'text-slate-400' : 'text-slate-500'}`}>Sistema Operativo</span>
                    </div>
                    <div className={`text-[10px] px-2 py-1 rounded-lg font-bold opacity-80 uppercase ${isFooterDark ? 'bg-white/5 text-white' : 'bg-black/5 text-slate-900'}`}>
                        v1.2.0 Stable
                    </div>
                </div>
            </div>
        </footer>
    );
};
