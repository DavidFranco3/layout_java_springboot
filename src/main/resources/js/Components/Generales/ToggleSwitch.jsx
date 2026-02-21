import React from 'react';

/**
 * ToggleSwitch
 * Componente de interruptor estilo iOS.
 * 
 * @param {boolean} checked - Estado actual
 * @param {function} onChange - Callback al cambiar (recibe el nuevo booleano)
 * @param {string} label - Etiqueta opcional a mostrar junto al switch
 * @param {string} name - Nombre del input (útil para forms)
 * @param {string} size - 'sm', 'md', 'lg' (default: 'md')
 * @param {boolean} disabled - Estado deshabilitado
 */
const ToggleSwitch = ({
    checked,
    onChange,
    label,
    name,
    size = 'md',
    disabled = false
}) => {

    // Tamaños configurables
    const sizes = {
        sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
        md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
        lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
    };

    const currentSize = sizes[size] || sizes.md;

    return (
        <label className={`inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={(e) => !disabled && onChange(e.target.checked)}
                    name={name}
                    disabled={disabled}
                />

                {/* Track */}
                <div className={`${currentSize.track} bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:${currentSize.translate} peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all ${currentSize.thumb} peer-checked:bg-indigo-600 transition-colors duration-200`}></div>

                {/* Iconos opcionales dentro del track (avanzado, no incluido por simplicidad pero posible) */}
            </div>

            {label && (
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 select-none">
                    {label}
                </span>
            )}
        </label>
    );
};

export default ToggleSwitch;
