import { motion } from "framer-motion";

export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }) {
    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            {...props}
            type={type}
            className={
                `inline-flex items-center px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-700 uppercase tracking-widest shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:opacity-25 transition-all duration-200 dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 ${disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
}
