import React from "react";

interface FooterProps {
    darkMode: boolean;
    configuracion: any;
}

export default function Footer({ darkMode, configuracion }: FooterProps) {
    return (
        <footer className="mt-auto py-4 px-12 transition-all duration-300 bg-[var(--brand-surface)] text-white">
            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col items-center md:items-start gap-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-1">
                        © {new Date().getFullYear()} {configuracion?.nombre_comercial || 'Isotech'}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Plataforma Operativa</span>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center md:items-end gap-1">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Versión del Sistema</span>
                        <div className="px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold border border-white/10 shadow-sm">
                            v2.1.0-STABLE
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
