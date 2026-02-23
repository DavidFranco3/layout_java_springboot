import React from 'react';

const Skeleton = ({ className = "", variant = "rect", width, height }) => {
    // Usamos la clase .skeleton definida en app.css para el efecto shimmer premium
    const baseClass = "skeleton";

    // Estilos dinámicos para variantes
    const variantClasses = {
        rect: "rounded-xl",
        circle: "rounded-full",
        text: "rounded-lg h-4 w-full mb-2"
    };

    const style = {
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'text' ? '1rem' : undefined),
        flexShrink: 0
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
    <div className="w-full bg-[var(--card-bg)] rounded-[32px] overflow-hidden border border-[var(--border-light)] shadow-sm">
        <div className="p-8 border-b border-[var(--border-light)] flex justify-between items-center">
            <Skeleton variant="rect" width="300px" height="42px" className="rounded-2xl" />
            <div className="flex gap-2">
                <Skeleton variant="rect" width="80px" height="42px" className="rounded-2xl" />
                <Skeleton variant="rect" width="80px" height="42px" className="rounded-2xl" />
            </div>
        </div>
        <div className="p-0">
            <div className="flex px-8 py-5 border-b border-[var(--border-light)]">
                {[...Array(cols)].map((_, j) => (
                    <Skeleton key={j} variant="rect" height="14px" className="flex-1 mr-8 last:mr-0 opacity-40" />
                ))}
            </div>
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex px-8 py-6 border-b border-[var(--border-light)] last:border-0 items-center">
                    {[...Array(cols)].map((_, j) => (
                        <Skeleton key={j} variant="rect" height="12px" className="flex-1 mr-8 last:mr-0 opacity-20" />
                    ))}
                </div>
            ))}
        </div>
    </div>
);

Skeleton.Card = () => (
    <div className="p-6 bg-[var(--card-bg)] border border-[var(--border-light)] rounded-[28px] space-y-4 shadow-sm">
        <div className="flex items-center gap-4">
            <Skeleton variant="circle" width="56px" height="56px" />
            <div className="flex-1 space-y-2">
                <Skeleton variant="rect" width="40%" height="16px" />
                <Skeleton variant="rect" width="25%" height="12px" className="opacity-50" />
            </div>
        </div>
        <Skeleton variant="rect" height="140px" className="rounded-2xl" />
        <div className="space-y-2">
            <Skeleton variant="rect" height="12px" />
            <Skeleton variant="rect" width="80%" height="12px" />
        </div>
    </div>
);

Skeleton.Stats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 bg-[var(--card-bg)] rounded-[32px] border border-[var(--border-light)] shadow-sm flex items-center gap-5">
                <Skeleton variant="rect" width="56px" height="56px" className="rounded-2xl" />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="rect" width="40%" height="10px" className="opacity-50" />
                    <Skeleton variant="rect" width="70%" height="24px" />
                </div>
            </div>
        ))}
    </div>
);

export default Skeleton;
