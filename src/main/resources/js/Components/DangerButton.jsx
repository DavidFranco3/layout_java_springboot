import { motion } from "framer-motion";

export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            {...props}
            className={
                `inline-flex items-center px-6 py-2.5 bg-red-500 border border-transparent rounded-xl font-bold text-xs text-white uppercase tracking-widest hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all duration-200 shadow-lg shadow-red-500/20 ${disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
}
