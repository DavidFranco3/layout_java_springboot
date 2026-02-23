import { motion } from "framer-motion";

export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            {...props}
            className={
                `inline-flex items-center px-6 py-2.5 bg-slate-900 border border-transparent rounded-xl font-bold text-xs text-white uppercase tracking-widest hover:bg-slate-800 focus:bg-slate-800 active:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-200 dark:bg-primary dark:text-white dark:hover:bg-primary/90 ${disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
}
