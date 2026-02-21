import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ErrorPage({ status }) {
    const title = {
        503: '503: Servicio no disponible',
        500: '500: Error del servidor',
        404: '404: Página no encontrada',
        403: '403: Acceso Denegado',
    }[status];

    const description = {
        503: 'Lo sentimos, estamos realizando tareas de mantenimiento. Por favor, vuelve más tarde.',
        500: '¡Ups! Algo salió mal en nuestros servidores.',
        404: 'Lo sentimos, la página que buscas no pudo ser encontrada.',
        403: 'No tienes los permisos necesarios para acceder a esta página.',
    }[status];

    const iconClass = {
        503: 'fas fa-tools',
        500: 'fas fa-server',
        404: 'fas fa-search',
        403: 'fas fa-user-lock',
    }[status] || 'fas fa-exclamation-triangle';

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Head title={title} />

            <div className="text-center p-6 max-w-md w-full animate-fadeIn">
                <div className="mb-6 flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800">
                        <i className={`${iconClass} text-5xl text-indigo-600 dark:text-indigo-400`}></i>
                    </div>
                </div>

                <h1 className="text-4xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white">
                    {status}
                </h1>

                <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-300">
                    {status === 403 ? 'Acceso Restringido' : 'Algo salió mal'}
                </h2>

                <p className="text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    {description}
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 transform hover:scale-105"
                >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Volver al Inicio
                </Link>
            </div>

            {/* Footer minimalista */}
            <div className="absolute bottom-4 text-xs text-slate-400 dark:text-slate-600">
                &copy; {new Date().getFullYear()} Sistema de Gestión
            </div>
        </div>
    );
}
