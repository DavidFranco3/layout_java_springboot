import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ContainerLaravel = ({ children, titulo, icono }) => {
    return (
        <div className="py-2 container-laravel-custom animate-fade-in">
            <div className="bg-[var(--card-bg)] shadow-premium rounded-[2.5rem] border border-[var(--border-light)] overflow-hidden transition-all duration-500 hover:shadow-premium-lg">
                {/* Header Estilo Bento */}
                <div className="px-8 pt-8 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/5 transition-transform hover:scale-110 duration-300">
                            {typeof icono === 'string' ? (
                                <i className={`${icono.startsWith('fa') ? 'fas' : ''} ${icono} text-xl`}></i>
                            ) : (
                                <FontAwesomeIcon icon={icono} className="text-xl" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                                {titulo}
                            </h2>
                            <div className="h-1 w-12 bg-primary rounded-full mt-1 opacity-60"></div>
                        </div>
                    </div>
                </div>

                {/* Content Área */}
                <div className="px-8 py-6 text-slate-700 dark:text-slate-300">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ContainerLaravel;
