import React from "react";

const ContainerLaravel = ({ children, titulo, icono }) => {
    return (
        <div className="py-1 px-1 container-laravel-custom">
            <style>{`
                html.dark .container-laravel-custom .bg-white {
                    background-color: #1e293b !important;
                    border-color: #334155 !important;
                }
                html.dark .container-laravel-custom .text-gray-700,
                html.dark .container-laravel-custom .text-gray-800,
                html.dark .container-laravel-custom .text-gray-500 {
                    color: #e2e8f0 !important;
                }
            `}</style>
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-gray-200 dark:border-slate-700 transition-colors duration-200">
                <div className="px-5 pt-4">
                    <div className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <i className={`fas ${icono} text-gray-500 dark:text-gray-400`}></i>
                        {titulo}
                    </div>
                </div>
                <div className="px-5 py-4 text-gray-800 dark:text-gray-300 text-sm md:text-base">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ContainerLaravel;
