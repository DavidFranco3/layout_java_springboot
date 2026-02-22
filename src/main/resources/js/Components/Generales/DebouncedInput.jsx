import React, { useState, useEffect } from 'react';

/**
 * DebouncedInput
 * Un input que retrasa la ejecución del evento onChange hasta que el usuario deja de escribir.
 * Ideal para búsquedas en tiempo real contra el servidor.
 * 
 * @param {string|number} value - El valor inicial controlado
 * @param {function} onChange - Callback que recibe el valor final (no el evento)
 * @param {number} debounce - Tiempo de espera en ms (default: 500)
 * @param {string} placeholder - Placeholder del input
 * @param {string} className - Clases CSS adicionales
 * @param {object} props - Props adicionales para el input
 */
const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    className = "",
    placeholder = "Buscar...",
    ...props
}) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            // Solo notificar al padre si el valor ha cambiado respecto a lo que tiene
            // Esto previene loops si el padre actualiza el value con lo mismo (aunque useEffect [initialValue] lo cubre)
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value, debounce]); // Quitamos onChange de dependencias para evitar re-triggers si la función cambia/no está memoizada

    return (
        <div className={`relative ${className}`}>
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 dark:text-slate-500 pointer-events-none">
                <i className="fas fa-search"></i>
            </span>
            <input
                {...props}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full pl-11 pr-10 h-11 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner focus:ring-4 focus:ring-primary/10 focus:border-primary bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300"
                placeholder={placeholder}
            />
            {value && (
                <button
                    onClick={() => setValue('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                    <i className="fas fa-times-circle"></i>
                </button>
            )}
        </div>
    );
};

export default DebouncedInput;
