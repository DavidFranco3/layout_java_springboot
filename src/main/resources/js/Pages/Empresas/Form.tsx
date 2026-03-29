import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ContainerApp from "@/Components/Generales/ContainerApp";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faBriefcase, faIdCard, faPhone, faEnvelope, faSave, faTimes, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

interface EmpresaFormValues {
    nombre: string;
    razon_social: string;
    rfc: string;
    tipo_persona: string;
    calle: string;
    numero_exterior: string;
    numero_interior: string;
    colonia: string;
    municipio: string;
    estado: string;
    cp: string;
    telefono: string;
    email: string;
    giro: string;
    status: boolean;
    [key: string]: any; // Allow for dynamic keys during fetch
}

interface EmpresaFormProps {
    mode: "create" | "update";
}

export default function Form({ mode }: EmpresaFormProps) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEdit = mode === "update";

    const [loading, setLoading] = useState(isEdit);
    const [processing, setProcessing] = useState(false);
    const [serverErrors, setServerErrors] = useState<Partial<Record<keyof EmpresaFormValues, string>>>({});

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EmpresaFormValues>({
        defaultValues: {
            nombre: "", razon_social: "", rfc: "", tipo_persona: "Moral",
            calle: "", numero_exterior: "", numero_interior: "", colonia: "",
            municipio: "", estado: "", cp: "", telefono: "", email: "", giro: "", status: true,
        },
    });

    const watchedNombre = watch("nombre");

    const fetchEmpresa = useCallback(async () => {
        if (!id) return;
        try {
            const response = await axios.get(`/api/empresas/${id}`);
            const empresa = response.data;
            Object.keys(empresa).forEach(key => {
                if (key in empresa) setValue(key, empresa[key] ?? "");
            });
        } catch (error) {
            console.error("Error fetching company:", error);
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo cargar la información de la empresa." });
            navigate("/empresas");
        } finally {
            setLoading(false);
        }
    }, [id, navigate, setValue]);

    useEffect(() => {
        if (isEdit) fetchEmpresa();
    }, [isEdit, fetchEmpresa]);

    const onSubmit = async (data) => {
        setProcessing(true);
        setServerErrors({});

        try {
            if (isEdit) {
                await axios.put(`/api/empresas/${id}`, data);
            } else {
                await axios.post("/api/empresas", data);
            }

            Swal.fire({
                icon: "success",
                title: isEdit ? "Actualización Exitosa" : "Registro Exitoso",
                text: "La información de la empresa ha sido guardada correctamente.",
                timer: 2500,
                showConfirmButton: false,
                background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
            });
            navigate("/empresas");
        } catch (error) {
            if (error.response?.data?.errors) {
                setServerErrors(error.response.data.errors);
            }
            Swal.fire({
                icon: "error",
                title: "Error en el Formulario",
                text: error.response?.data?.message || "Por favor revisa los campos marcados en rojo.",
                confirmButtonColor: "var(--app-primary)",
            });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <Authenticated user={user}>
            <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-fade-in text-slate-900 dark:text-slate-100">
                <Link to="/empresas" className="inline-flex items-center text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 hover:text-primary transition-all mb-4 group">
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al listado
                </Link>
                <ContainerApp titulo={isEdit ? `Editando: ${watchedNombre}` : "Nueva Empresa"} icono={faBuilding}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* BENTO BOX 1: INFORMACIÓN GENERAL Y CONTACTO */}
                            <div className="lg:col-span-2 bg-slate-50/50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-[var(--border-light)] shadow-sm space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
                                        <FontAwesomeIcon icon={faBuilding} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold tracking-tight">Datos de la Empresa</h4>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Información básica y de contacto</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="nombre" value="Nombre Comercial" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"><FontAwesomeIcon icon={faBuilding} /></span>
                                            <TextInput
                                                id="nombre"
                                                className="w-full pl-11 h-12"
                                                placeholder="Nombre público"
                                                isError={!!errors.nombre || !!serverErrors.nombre}
                                                {...register("nombre", { required: "El nombre es requerido" })}
                                            />
                                        </div>
                                        <InputError message={errors.nombre?.message || serverErrors.nombre} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="giro" value="Giro / Sector" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"><FontAwesomeIcon icon={faBriefcase} /></span>
                                            <TextInput id="giro" className="w-full pl-11 h-12" placeholder="Ej. Servicios, Alimentos" isError={!!serverErrors.giro} {...register("giro")} />
                                        </div>
                                        <InputError message={serverErrors.giro} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="telefono" value="Teléfono de Contacto" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"><FontAwesomeIcon icon={faPhone} /></span>
                                            <TextInput id="telefono" className="w-full pl-11 h-12" placeholder="10 dígitos" isError={!!serverErrors.telefono} {...register("telefono")} />
                                        </div>
                                        <InputError message={serverErrors.telefono} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="email" value="Correo Electrónico" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"><FontAwesomeIcon icon={faEnvelope} /></span>
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="w-full pl-11 h-12"
                                                placeholder="contacto@empresa.com"
                                                isError={!!errors.email || !!serverErrors.email}
                                                {...register("email", { pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" } })}
                                            />
                                        </div>
                                        <InputError message={errors.email?.message || serverErrors.email} />
                                    </div>
                                </div>
                            </div>

                            {/* BENTO BOX 2: DATOS FISCALES */}
                            <div className="lg:col-span-2 bg-slate-50/50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-[var(--border-light)] shadow-sm space-y-6 text-slate-900 dark:text-slate-100">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-sm">
                                        <FontAwesomeIcon icon={faIdCard} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold tracking-tight">Detalles Fiscales</h4>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Información Legal</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-1.5">
                                        <InputLabel htmlFor="razon_social" value="Razón Social" />
                                        <TextInput id="razon_social" className="w-full h-12" placeholder="Nombre legal completo" isError={!!serverErrors.razon_social} {...register("razon_social")} />
                                        <InputError message={serverErrors.razon_social} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="rfc" value="RFC" />
                                        <TextInput id="rfc" className="w-full h-12 uppercase" maxLength={13} placeholder="ABC123456XYZ" isError={!!serverErrors.rfc} {...register("rfc")} />
                                        <InputError message={serverErrors.rfc} />
                                    </div>
                                </div>
                            </div>

                            {/* BENTO BOX 3: DOMICILIO FISCAL */}
                            <div className="lg:col-span-2 bg-slate-50/50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-[var(--border-light)] shadow-sm space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-sm">
                                        <FontAwesomeIcon icon={faBuilding} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold tracking-tight">Ubicación</h4>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Domicilio Fiscal</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-6 space-y-1.5">
                                        <InputLabel htmlFor="calle" value="Calle" />
                                        <TextInput id="calle" className="w-full h-12" placeholder="Nombre de la calle" {...register("calle")} />
                                        <InputError message={serverErrors.calle} />
                                    </div>
                                    <div className="md:col-span-3 space-y-1.5">
                                        <InputLabel htmlFor="numero_exterior" value="Ext." />
                                        <TextInput id="numero_exterior" className="w-full h-12" placeholder="Ext." {...register("numero_exterior")} />
                                    </div>
                                    <div className="md:col-span-3 space-y-1.5">
                                        <InputLabel htmlFor="numero_interior" value="Int." />
                                        <TextInput id="numero_interior" className="w-full h-12" placeholder="Int." {...register("numero_interior")} />
                                    </div>
                                    <div className="md:col-span-4 space-y-1.5">
                                        <InputLabel htmlFor="colonia" value="Colonia" />
                                        <TextInput id="colonia" className="w-full h-12" placeholder="Nombre de la colonia" {...register("colonia")} />
                                    </div>
                                    <div className="md:col-span-4 space-y-1.5">
                                        <InputLabel htmlFor="municipio" value="Municipio" />
                                        <TextInput id="municipio" className="w-full h-12" placeholder="Nombre del municipio" {...register("municipio")} />
                                    </div>
                                    <div className="md:col-span-4 space-y-1.5">
                                        <InputLabel htmlFor="cp" value="CP" />
                                        <TextInput id="cp" className="w-full h-12" maxLength={5} placeholder="54321" {...register("cp")} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ACCIONES DEL FORMULARIO */}
                        <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
                            <SecondaryButton type="button" onClick={() => navigate(-1)} className="h-14 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]">
                                <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
                            </SecondaryButton>
                            <PrimaryButton type="submit" disabled={processing} className="h-14 px-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faSave} />
                                    <span>{processing ? "Guardando..." : (isEdit ? "Actualizar Empresa" : "Crear Empresa")}</span>
                                </div>
                            </PrimaryButton>
                        </div>
                    </form>
                </ContainerApp>
            </div>
        </Authenticated>
    );
}
