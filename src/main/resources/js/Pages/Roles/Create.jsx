import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt, faCheckCircle, faSave, faTimes, faChevronRight, faInfoCircle, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function Create({ cerrarModal, permisos, modulos }) {
    const [activeTab, setActiveTab] = useState('');
    const [permisosPorModulo, setPermisosPorModulo] = useState({});

    const { data, setData, post, processing, reset, errors } = useForm({
        nombre: "",
        permisos: [],
    });

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
            const primerModulo = Object.keys(grupos)[0];
            if (primerModulo) {
                setActiveTab(primerModulo);
            }
        }
    }, [permisos]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("roles.store"), {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "¡Rol Creado!",
                    text: "El nuevo rol y sus permisos han sido registrados.",
                    showConfirmButton: false,
                    timer: 2000,
                    background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                    color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
                });
                cerrarModal();
                reset();
            },
            onError: () => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo registrar el rol. Revisa los datos.",
                    confirmButtonColor: "var(--app-primary)",
                });
            },
        });
    };

    const togglePermiso = (id) => {
        const nuevosPermisos = data.permisos.includes(id)
            ? data.permisos.filter(pid => pid !== id)
            : [...data.permisos, id];
        setData("permisos", nuevosPermisos);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in p-1">
            {/* Nombre del Rol */}
            <div className="space-y-2">
                <InputLabel value="Nombre del Rol" />
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <FontAwesomeIcon icon={faShieldAlt} />
                    </span>
                    <TextInput
                        className="w-full pl-11 h-12"
                        placeholder="Ej. Administrador de Ventas"
                        value={data.nombre}
                        onChange={(e) => setData("nombre", e.target.value)}
                        required
                    />
                </div>
                <InputError message={errors.nombre} />
            </div>

            {/* Gestión de Permisos */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-primary" />
                    <span>Configuración de Permisos</span>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    {/* Tabs Módulos */}
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

                    {/* Lista de Permisos */}
                    <div className="max-h-[300px] overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {activeTab && permisosPorModulo[activeTab]?.map((permiso) => (
                            <div
                                key={permiso.id}
                                onClick={() => togglePermiso(permiso.id)}
                                className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${data.permisos.includes(permiso.id)
                                    ? "bg-primary/5 border-primary/20 shadow-sm"
                                    : "bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-primary/30"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${data.permisos.includes(permiso.id) ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-primary"
                                        }`}>
                                        <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold transition-colors ${data.permisos.includes(permiso.id) ? "text-primary" : "text-slate-700 dark:text-slate-200"
                                            }`}>
                                            {permiso.name}
                                        </p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">Acceso de módulo</p>
                                    </div>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${data.permisos.includes(permiso.id) ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                                    }`}>
                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${data.permisos.includes(permiso.id) ? "left-6" : "left-1"
                                        }`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <InputError message={errors.permisos} />

                {/* Resumen */}
                {data.permisos.length > 0 && (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </div>
                            <div>
                                <h5 className="text-sm font-bold">Resumen de Selección</h5>
                                <p className="text-xs text-slate-500">{data.permisos.length} permisos habilitados para este rol</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-black text-primary">{data.permisos.length}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer de Acciones */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <SecondaryButton
                    type="button"
                    onClick={cerrarModal}
                    className="h-12 px-6 font-bold"
                >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
                </SecondaryButton>

                <PrimaryButton
                    type="submit"
                    disabled={processing}
                    className="h-12 px-10 font-bold shadow-xl shadow-primary/20"
                >
                    {processing ? (
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Procesando...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faSave} />
                            <span>Crear Rol</span>
                        </div>
                    )}
                </PrimaryButton>
            </div>
        </form>
    );
}
