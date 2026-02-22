import React from "react";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import useAuth from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faKey, faShieldAlt, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function Create({ cerrarModal, roles }) {
    const { user, rolNombre, hasPermission } = useAuth();

    if (!hasPermission('crear users')) {
        return (
            <div className="p-6 text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4 shadow-inner">
                    <FontAwesomeIcon icon={faShieldAlt} size="2x" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Acceso Denegado</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">No tienes permisos para crear usuarios.</p>
                <SecondaryButton onClick={cerrarModal}>Cerrar</SecondaryButton>
            </div>
        );
    }

    const { data, setData, post, processing, reset, errors } = useForm({
        nombre: "",
        email: "",
        password: "",
        rol_id: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("users.store"), {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "¡Logrado!",
                    text: "Usuario registrado con éxito",
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
                    title: "Oops...",
                    text: "Hubo un problema al registrar el usuario",
                    confirmButtonColor: "var(--app-primary)",
                });
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in p-1">
            {/* Header del Formulario Interno (Opcional, pero da jerarquía) */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                    <FontAwesomeIcon icon={faUser} />
                </div>
                <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-none">Información Personal</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">Datos básicos del nuevo integrante</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nombre */}
                <div className="space-y-1.5">
                    <InputLabel htmlFor="nombre" value="Nombre Completo" />
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                            <FontAwesomeIcon icon={faUser} />
                        </span>
                        <TextInput
                            id="nombre"
                            className="w-full pl-10 h-11"
                            value={data.nombre}
                            placeholder="Ej. Juan Pérez"
                            onChange={(e) => setData("nombre", e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.nombre} />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <InputLabel htmlFor="email" value="Correo Electrónico" />
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                        <TextInput
                            id="email"
                            type="email"
                            className="w-full pl-10 h-11"
                            value={data.email}
                            placeholder="juan@ejemplo.com"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>

                {/* Rol */}
                <div className="space-y-1.5">
                    <InputLabel htmlFor="rol_id" value="Asignar Rol" />
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                            <FontAwesomeIcon icon={faShieldAlt} />
                        </span>
                        <select
                            id="rol_id"
                            className="w-full pl-10 h-11 rounded-xl border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary"
                            value={data.rol_id}
                            onChange={(e) => setData("rol_id", e.target.value)}
                            required
                        >
                            <option value="">Selecciona un rol...</option>
                            {roles.map((rol) => (
                                <option key={rol.id} value={rol.id}>{rol.name}</option>
                            ))}
                        </select>
                    </div>
                    <InputError message={errors.rol_id} />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <InputLabel htmlFor="password" value="Contraseña" />
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                            <FontAwesomeIcon icon={faKey} />
                        </span>
                        <TextInput
                            id="password"
                            type="password"
                            className="w-full pl-10 h-11"
                            value={data.password}
                            placeholder="••••••••"
                            onChange={(e) => setData("password", e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.password} />
                </div>
            </div>

            {/* Footer de Acciones dentro del Formulario */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <SecondaryButton
                    type="button"
                    onClick={cerrarModal}
                    className="h-11 px-6 font-bold"
                >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
                </SecondaryButton>

                <PrimaryButton
                    type="submit"
                    disabled={processing}
                    className="h-11 px-8 font-bold shadow-lg shadow-primary/20"
                >
                    {processing ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Guardando...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faSave} />
                            <span>Crear Usuario</span>
                        </div>
                    )}
                </PrimaryButton>
            </div>
        </form>
    );
}
