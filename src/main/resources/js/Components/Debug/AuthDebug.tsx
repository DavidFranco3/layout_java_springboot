import React from 'react';
import useAuth, { AuthPermission } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import ContainerApp from '@/Components/Generales/ContainerApp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserShield, 
    faKey, 
    faFingerprint, 
    faCheckCircle, 
    faTimesCircle, 
    faShieldAlt,
    faTerminal
} from '@fortawesome/free-solid-svg-icons';

const AuthDebug: React.FC = () => {
    const {
        user,
        isAuthenticated,
        rolId,
        rolNombre,
        permisos,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasModuleAccess,
        getModules,
        loading
    } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="p-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-[2.5rem] flex items-center gap-4 text-amber-800 dark:text-amber-200">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faTimesCircle} className="text-xl" />
                </div>
                <div>
                    <h4 className="font-black text-lg">Usuario no autenticado</h4>
                    <p className="opacity-80">No hay información de sesión disponible para depuración.</p>
                </div>
            </div>
        );
    }

    const modules = getModules();

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Información básica del usuario */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="bg-[var(--card-bg)] shadow-premium rounded-[2.5rem] border border-[var(--border-light)] overflow-hidden h-full flex flex-col">
                        <div className="px-8 pt-8 pb-4 border-b border-[var(--border-light)]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner border border-indigo-500/5">
                                    <FontAwesomeIcon icon={faUserShield} className="text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Período de Sesión</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Información de Identidad</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 space-y-4 flex-1">
                            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-[var(--border-light)]">
                                <span className="text-xs font-bold text-slate-500 uppercase">ID de Usuario</span>
                                <span className="font-mono text-sm text-indigo-500 font-black">{user.id}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-[var(--border-light)]">
                                <span className="text-xs font-bold text-slate-500 uppercase">Nombre Completo</span>
                                <span className="text-sm text-slate-800 dark:text-white font-bold">{user.name}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-[var(--border-light)]">
                                <span className="text-xs font-bold text-slate-500 uppercase">Email</span>
                                <span className="text-sm text-slate-800 dark:text-white font-bold">{user.email}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="p-4 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                    <span className="text-[10px] font-black text-indigo-500 uppercase block mb-1">ID Rol</span>
                                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{rolId || 'N/A'}</span>
                                </div>
                                <div className="p-4 bg-rose-500/5 dark:bg-rose-500/10 rounded-2xl border border-rose-500/20">
                                    <span className="text-[10px] font-black text-rose-500 uppercase block mb-1">Nombre Rol</span>
                                    <span className="text-lg font-black text-rose-600 dark:text-rose-400">{rolNombre || 'Staff'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Permisos */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="bg-[var(--card-bg)] shadow-premium rounded-[2.5rem] border border-[var(--border-light)] overflow-hidden h-full flex flex-col">
                        <div className="px-8 pt-8 pb-4 border-b border-[var(--border-light)] flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner border border-emerald-500/5">
                                    <FontAwesomeIcon icon={faKey} className="text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Privilegios</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{permisos.length} Permisos asignados</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 flex-1">
                            <div className="max-h-[350px] overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                {permisos.length > 0 ? (
                                    permisos.map((permiso: AuthPermission) => (
                                        <div key={permiso.id} className="p-4 bg-[var(--brand-surface)]/5 dark:bg-white/5 rounded-2xl border border-[var(--border-light)] transition-all hover:bg-white dark:hover:bg-slate-800 group">
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">{permiso.nombre}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: {permiso.id}</span>
                                            </div>
                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                <span className="text-[11px] font-bold text-slate-500 uppercase">Módulo: <span className="text-emerald-500">{permiso.modulo_nombre}</span></span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-slate-500 italic">No hay permisos asignados</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Módulos disponibles */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <div className="bg-[var(--card-bg)] shadow-premium rounded-[2.5rem] border border-[var(--border-light)] p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-xl" />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Módulos</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {modules.map(module => (
                                <span key={module} className="px-5 py-2.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-2xl text-xs font-black uppercase tracking-widest border border-cyan-500/20">
                                    {module}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Pruebas de verificación */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <div className="bg-[var(--card-bg)] shadow-premium rounded-[2.5rem] border border-[var(--border-light)] p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <FontAwesomeIcon icon={faFingerprint} className="text-xl" />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Verificación en Vivo</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: 'Es Admin', value: hasRole('Admin') || hasRole('Super Admin') },
                                { label: 'Admin/Moderador', value: hasAnyRole(['Admin', 'Super Admin', 'Moderador']) },
                                { label: 'Acceso Usuarios', value: hasModuleAccess('Users') },
                                { label: 'Crear Usuarios', value: hasPermission('crear_usuarios') || hasPermission('users_create') },
                            ].map((test, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-[var(--border-light)]">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">{test.label}</span>
                                    <div className={`p-1.5 rounded-lg ${test.value ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                                        <FontAwesomeIcon icon={test.value ? faCheckCircle : faTimesCircle} className="text-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Información técnica */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faTerminal} className="text-emerald-500 text-sm" />
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sesión Raw Payload (JSON)</h5>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                        </div>
                    </div>
                    <div className="p-8 bg-slate-950/30">
                        <pre className="text-emerald-400/80 font-mono text-xs overflow-x-auto custom-scrollbar leading-relaxed">
                            {JSON.stringify({ user, rolId, rolNombre, permisos }, null, 2)}
                        </pre>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthDebug;
