import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ContainerAppProps {
    children: React.ReactNode;
    titulo: string;
    icono: any;
}

const ContainerApp: React.FC<ContainerAppProps> = ({ children, titulo, icono }) => {
    return (
        <div className="py-2 w-full mx-auto animate-soft">
            <div className="glass-card transition-all duration-500 hover:shadow-premium-lg group">
                {/* Header Estilo Island */}
                <div className="px-6 md:px-10 pt-8 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/30 dark:bg-primary/50 blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500 rounded-[22px]" />
                            <div className="relative w-14 h-14 rounded-[22px] bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 text-primary dark:text-indigo-300 flex items-center justify-center shadow-inner ring-1 ring-primary/10 dark:ring-white/10 transition-all hover:scale-110 hover:-rotate-3 duration-300">
                                {typeof icono === 'string' ? (
                                    <i className={`${icono.startsWith('fa') ? 'fas' : ''} ${icono} text-xl`}></i>
                                ) : (
                                    <FontAwesomeIcon icon={icono} className="text-xl" />
                                )}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                {titulo}
                            </h2>
                            <div className="h-1 w-12 bg-gradient-to-r from-primary to-indigo-500 rounded-full mt-1.5 opacity-80" />
                        </div>
                    </div>
                </div>

                {/* Content Área */}
                <div className="px-6 md:px-10 py-6 text-slate-700 dark:text-slate-300">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ContainerApp;
