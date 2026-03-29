import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import useAuth from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faKey, faShieldAlt, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

interface UserCreateValues {
    nombre: string;
    email: string;
    password: string;
    rol_id: string;
}

interface UserCreateProps {
    cerrarModal?: () => void;
    roles?: Array<{ id: number; name: string }>;
    onRefresh?: () => void;
}

export default function Create({ cerrarModal, roles: initialRoles, onRefresh }: UserCreateProps) {
    const navigate = useNavigate();
    const { hasPermission } = useAuth();
    const [roles, setRoles] = useState(initialRoles || []);
    const [serverErrors, setServerErrors] = useState<Partial<Record<keyof UserCreateValues, string>>>({});
    const [processing, setProcessing] = useState(false);

    // Default cerrar action
    const handleCerrar = cerrarModal || (() => navigate(-1));

    useEffect(() => {
        if (!initialRoles) {
            const fetchRoles = async () => {
                try {
                    const response = await axios.get("/api/roles/list");
                    setRoles(response.data);
                } catch (error) {
                    console.error("Error fetching roles:", error);
                }
            };
            fetchRoles();
        }
    }, [initialRoles]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserCreateValues>({
        defaultValues: {
            nombre: "",
            email: "",
            password: "",
            rol_id: "",
        },
    });

    if (!hasPermission('crear users')) {
        return (
            <div className="p-6 text-center animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4 shadow-inner">
                    <FontAwesomeIcon icon={faShieldAlt} size="2x" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Acceso Denegado</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">No tienes permisos para crear usuarios.</p>
                <SecondaryButton onClick={handleCerrar}>Cerrar</SecondaryButton>
            </div>
        );
    }

    const onSubmit = async (data) => {
        setProcessing(true);
        setServerErrors({});

        try {
            await axios.post("/api/users", data);
            Swal.fire({
                icon: "success",
                title: "¡Logrado!",
                text: "Usuario registrado con éxito",
                showConfirmButton: false,
                timer: 2000,
                background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
            });
            if (onRefresh) onRefresh();
            handleCerrar();
        } catch (err) {
            if (err.response?.data?.errors) {
                setServerErrors(err.response.data.errors);
            }
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: err.response?.data?.message || "Hubo un problema al registrar el usuario",
                confirmButtonColor: "var(--app-primary)",
            });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-fade-in p-1">
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
                <div className="space-y-1.5">
                    <InputLabel htmlFor="nombre" value="Nombre Completo" />
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                            <FontAwesomeIcon icon={faUser} />
                        </span>
                        <TextInput
                            id="nombre"
                            className="w-full pl-10 h-11"
                            placeholder="Ej. Juan Pérez"
                            isError={!!errors.nombre || !!serverErrors.nombre}
                            {...register("nombre", { required: "El nombre es requerido" })}
                        />
                    </div>
                    <InputError message={errors.nombre?.message || serverErrors.nombre} />
                </div>

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
                            placeholder="juan@ejemplo.com"
                            isError={!!errors.email || !!serverErrors.email}
                            {...register("email", {
                                required: "El correo es requerido",
                                pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" },
                            })}
                        />
                    </div>
                    <InputError message={errors.email?.message || serverErrors.email} />
                </div>

                <div className="space-y-1.5">
                    <InputLabel htmlFor="rol_id" value="Asignar Rol" />
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                            <FontAwesomeIcon icon={faShieldAlt} />
                        </span>
                        <select
                            id="rol_id"
                            className="w-full pl-10 h-11 rounded-xl border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary"
                            {...register("rol_id", { required: "Debes seleccionar un rol" })}
                        >
                            <option value="">Selecciona un rol...</option>
                            {roles.map((rol) => (
                                <option key={rol.id} value={rol.id}>{rol.name}</option>
                            ))}
                        </select>
                    </div>
                    <InputError message={errors.rol_id?.message || serverErrors.rol_id} />
                </div>

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
                            placeholder="••••••••"
                            isError={!!errors.password || !!serverErrors.password}
                            {...register("password", {
                                required: "La contraseña es requerida",
                                minLength: { value: 8, message: "Mínimo 8 caracteres" },
                            })}
                        />
                    </div>
                    <InputError message={errors.password?.message || serverErrors.password} />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <SecondaryButton
                    type="button"
                    onClick={handleCerrar}
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
