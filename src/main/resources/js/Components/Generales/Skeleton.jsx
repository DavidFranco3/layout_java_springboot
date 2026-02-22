import React from 'react';

const Skeleton = ({ className = "", variant = "rect", width, height }) => {
    const baseClass = "animate-pulse bg-slate-200 dark:bg-slate-800";

    // Estilos dinámicos para variantes
    const variantClasses = {
        rect: "rounded-md",
        circle: "rounded-full",
        text: "rounded h-4 w-full mb-2"
    };

    const style = {
        width: width || '100%',
        height: height || (variant === 'text' ? '1rem' : '100%')
    };

    return (
        <div
            className={`${baseClass} ${variantClasses[variant] || variantClasses.rect} ${className}`}
            style={style}
        />
    );
};

// Componentes predefinidos para casos comunes
Skeleton.Table = ({ rows = 5, cols = 4 }) => (
    <div className="w-full space-y-4">
        <Skeleton variant="rect" height="40px" className="mb-6" /> {/* Header */}
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex gap-4">
                {[...Array(cols)].map((_, j) => (
                    <Skeleton key={j} variant="rect" height="24px" className="flex-1" />
                ))}
            </div>
        ))}
    </div>
);

Skeleton.Card = () => (
    <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
        <Skeleton variant="circle" width="48px" height="48px" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" />
        <Skeleton variant="rect" height="150px" />
    </div>
);

export default Skeleton;
