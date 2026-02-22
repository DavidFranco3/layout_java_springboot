import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt, faCheckCircle, faSave, faTimes, faTrash, faExclamationTriangle, faLayerGroup, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";

const Acciones = ({ setShow, data: rol, accion }) => {
    const isEdit = accion === "editar";
    const isEliminar = accion === "eliminar";

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            name: rol?.name || '',
            permisos: rol?.permisos || []
        }
    });

    const [permisos, setPermisos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('');
    const [permisosPorModulo, setPermisosPorModulo] = useState({});

    const watchedName = watch('name');
    const watchedPermisos = watch('permisos');

    useEffect(() => {
        getPermisos();
        if (rol && isEdit) {
            setValue('name', rol.name || '');
            const initialPermisos = Array.isArray(rol.permisos)
                ? rol.permisos.map(p => typeof p === 'object' ? p.id : p)
                : [];
            setValue('permisos', initialPermisos);
        }
    }, [rol, accion]);

    useEffect(() => {
        if (permisos && permisos.length > 0) {
            const grupos = permisos.reduce((acc, permiso) => {
                const moduloNombre = permiso.modulo_nombre || 'Sin Módulo';
                if (!acc[moduloNombre]) {
                    acc[moduloNombre] = [];
                }
                acc[moduloNombre].push(permiso);
                return acc;
            }, {});

            setPermisosPorModulo(grupos);
            if (!activeTab && Object.keys(grupos).length > 0) {
                setActiveTab(Object.keys(grupos)[0]);
            }
        }
    }, [permisos]);

    const getPermisos = async () => {
        try {
            const response = await axios.get(route('roles.getPermisos'));
            setPermisos(response.data.data);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    }

    const togglePermiso = (id) => {
        if (!isEdit) return;
        const current = watchedPermisos || [];
        const nuevos = current.includes(id)
            ? current.filter(pid => pid !== id)
            : [...current, id];
        setValue("permisos", nuevos);
    };

    const onFormSubmit = async (formData) => {
        setIsLoading(true);
        const onSuccess = (msg) => {
            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: msg,
                showConfirmButton: false,
                timer: 2000,
                background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
            });
            setShow(false);
        };

        const onError = () => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un problema al procesar la solicitud.",
                confirmButtonColor: "var(--app-primary)",
            });
            setIsLoading(false);
        };

        if (isEdit) {
            router.put(route('roles.update', rol.id), {
                name: formData.name,
                permisos: formData.permisos
            }, { onSuccess: () => onSuccess("Rol actualizado correctamente"), onError });
        } else if (isEliminar) {
            router.delete(route('roles.destroy', rol.id), {
                onSuccess: () => onSuccess("Rol eliminado correctamente"),
                onError
            });
        }
    };

    if (isEliminar) {
        return (
            <div className="p-1 space-y-6 animate-fade-in">
                <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 mb-4 shadow-inner">
                        <FontAwesomeIcon icon={faExclamationTriangle} size="xl" />
                    </div>
                    <h4 className="text-lg font-bold text-red-900 dark:text-red-400 mb-2">Confirmar Eliminación</h4>
                    <p className="text-sm text-red-700 dark:text-red-600/80 leading-relaxed max-w-xs mx-auto">
                        ¿Estás seguro de eliminar el rol <span className="font-bold text-red-900 dark:text-red-300">"{rol?.name}"</span>? Esta acción revocará todos los accesos asociados.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <SecondaryButton onClick={() => setShow(false)} className="h-12 px-6">
                        <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
                    </SecondaryButton>
                    <DangerButton onClick={handleSubmit(onFormSubmit)} disabled={isLoading} className="h-12 px-8 shadow-lg shadow-red-500/20">
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Eliminando...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faTrash} />
                                <span>Eliminar Rol</span>
                            </div>
                        )}
                    </DangerButton>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 animate-fade-in p-1">
            <div className="space-y-2">
                <InputLabel value="Nombre del Rol" />
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <FontAwesomeIcon icon={faShieldAlt} />
                    </span>
                    <TextInput
                        className="w-full pl-11 h-12"
                        placeholder="Ingrese nombre del rol"
                        {...register('name', { required: 'El nombre es requerido' })}
                        isError={!!errors.name}
                    />
                </div>
                {errors.name && <p className="text-xs text-red-500 font-medium pl-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-primary" />
                    <span>Permisos Asignados</span>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                        {Object.keys(permisosPorModulo).map((modulo) => (
                            <button
                                key={modulo}
                                type="button"
                                onClick={() => setActiveTab(modulo)}
                                className={`px-5 py-4 text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border-b-2 ${activeTab === modulo
                                    ? "border-primary text-primary bg-primary/5"
                                    : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                    }`}
                            >
                                {modulo}
                                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === modulo ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                                    }`}>
                                    {permisosPorModulo[modulo].length}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="max-h-[300px] overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {activeTab && permisosPorModulo[activeTab]?.map((permiso) => (
                            <div
                                key={permiso.id}
                                onClick={() => togglePermiso(permiso.id)}
                                className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${watchedPermisos?.includes(permiso.id)
                                    ? "bg-primary/5 border-primary/20 shadow-sm"
                                    : "bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-primary/30"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${watchedPermisos?.includes(permiso.id) ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-primary"
                                        }`}>
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                                    </div>
                                    <p className={`text-sm font-bold transition-colors ${watchedPermisos?.includes(permiso.id) ? "text-primary" : "text-slate-700 dark:text-slate-200"
                                        }`}>
                                        {permiso.name}
                                    </p>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${watchedPermisos?.includes(permiso.id) ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                                    }`}>
                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${watchedPermisos?.includes(permiso.id) ? "left-6" : "left-1"
                                        }`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {watchedPermisos?.length > 0 && (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold">Resumen de Selección</h5>
                                <p className="text-xs text-slate-500">{watchedPermisos.length} permisos habilitados para este rol</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-primary">{watchedPermisos.length}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <SecondaryButton type="button" onClick={() => setShow(false)} className="h-12 px-6">
                    <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={isLoading} className="h-12 px-10 shadow-xl shadow-primary/20">
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Guardando...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faSave} />
                            <span>Actualizar Rol</span>
                        </div>
                    )}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default Acciones;