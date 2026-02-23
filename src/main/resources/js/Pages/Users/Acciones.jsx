import React from "react";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { router } from '@inertiajs/react';
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import useAuth from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faShieldAlt, faTrash, faSave, faTimes, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const Acciones = ({ setShow, data, accion, roles }) => {
    const { user, rolNombre, hasPermission } = useAuth();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            name: data?.name || '',
            rol_id: data?.rol_id || ''
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const permisoRequerido = accion === 'editar' ? 'editar users' : 'eliminar users';
    const tienePermiso = hasPermission(permisoRequerido);

    if (!tienePermiso) {
        return (
            <div className="p-6 text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4 shadow-inner">
                    <FontAwesomeIcon icon={faShieldAlt} size="2x" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Acceso Denegado</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">No tienes permisos para {accion} usuarios.</p>
                <SecondaryButton onClick={() => setShow(false)}>Cerrar</SecondaryButton>
            </div>
        );
    }

    const buttonLabel = accion === 'editar' ? 'Actualizar' : 'Eliminar';

    useEffect(() => {
        if (data && accion === 'editar') {
            setValue('name', data.name || '');
            setValue('rol_id', data.rol_id || '');
        }
    }, [data, accion, setValue]);

    const onFormSubmit = async (formData) => {
        setIsLoading(true);
        try {
            if (accion === "editar") {
                router.put(route('users.update', data.id), {
                    rol_id: formData.rol_id
                }, {
                    onSuccess: () => {
                        Swal.fire({
                            icon: "success",
                            title: "Actualizado",
                            text: "Usuario actualizado correctamente",
                            showConfirmButton: false,
                            timer: 2000,
                            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                            color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
                        });
                        setShow(false);
                    },
                    onError: (errors) => {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Hubo un problema al actualizar",
                            confirmButtonColor: "var(--app-primary)",
                        });
                    },
                    onFinish: () => setIsLoading(false)
                });
            } else if (accion === "eliminar") {
                router.delete(route('users.destroy', data.id), {
                    onSuccess: () => {
                        Swal.fire({
                            icon: "success",
                            title: "Eliminado",
                            text: "Usuario eliminado con éxito",
                            showConfirmButton: false,
                            timer: 2000,
                            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                            color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
                        });
                        setShow(false);
                    },
                    onError: () => {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "No se pudo eliminar el usuario",
                            confirmButtonColor: "#ef4444",
                        });
                    },
                    onFinish: () => setIsLoading(false)
                });
            }
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 animate-fade-in">
            {accion === 'editar' ? (
                <div className="space-y-5">
                    {/* Header sutil */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <FontAwesomeIcon icon={faShieldAlt} />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white leading-none">Configuración de Usuario</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">Actualizar credenciales y nivel de acceso</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <InputLabel value="Rol Actual" />
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                                <FontAwesomeIcon icon={faShieldAlt} />
                            </span>
                            <select
                                {...register('rol_id', { required: 'El rol es requerido' })}
                                className="w-full pl-11 h-11 rounded-xl border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary"
                            >
                                <option value="">Selecciona un rol...</option>
                                {roles && roles.map((rol) => (
                                    <option key={rol.id} value={rol.id}>{rol.name}</option>
                                ))}
                            </select>
                        </div>
                        {errors.rol_id && <InputError message={errors.rol_id.message} />}
                    </div>

                    {/* Card de información del usuario */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
                                {data?.nombre?.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">{data?.nombre}</h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                    <FontAwesomeIcon icon={faEnvelope} className="mr-1 opacity-70" /> {data?.email}
                                </p>
                            </div>
                            <div className="shrink-0 text-right">
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-lg font-bold uppercase tracking-tighter">
                                    {data?.rol_nombre || 'Sin rol'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-5">
                    {/* Alerta de eliminación */}
                    <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 mb-3">
                            <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />
                        </div>
                        <h4 className="text-base font-bold text-amber-900 dark:text-amber-400 mb-1">Confirmar Eliminación</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-600/80 leading-relaxed font-medium">
                            Estás a punto de borrar permanentemente a <span className="font-black text-amber-900 dark:text-amber-300">"{data?.name}"</span>.
                            Esta acción no se puede deshacer.
                        </p>
                    </div>
                </div>
            )}

            {/* Footer de Acciones */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <SecondaryButton
                    type="button"
                    onClick={() => setShow(false)}
                    className="h-11 px-6 font-bold"
                >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
                </SecondaryButton>

                {accion === 'editar' ? (
                    <PrimaryButton
                        type="submit"
                        disabled={isLoading}
                        className="h-11 px-8 font-bold shadow-lg shadow-primary/20"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Actualizando...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faSave} />
                                <span>{buttonLabel}</span>
                            </div>
                        )}
                    </PrimaryButton>
                ) : (
                    <DangerButton
                        type="submit"
                        disabled={isLoading}
                        className="h-11 px-8 font-bold shadow-lg shadow-red-500/20"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Borrando...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faTrash} />
                                <span>{buttonLabel}</span>
                            </div>
                        )}
                    </DangerButton>
                )}
            </div>
        </form>
    );
};

export default Acciones;
