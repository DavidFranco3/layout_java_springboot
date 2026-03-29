import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomSelect from "@/Components/Generales/CustomSelect";
import { faCog, faSave, faTimes, faImage, faPalette, faCheckCircle, faUpload, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";

const PRESET_COLORS = [
    "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef",
    "#f43f5e", "#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#1e293b",
];

export default function Form({ mode }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEdit = mode === "update";

    const [previewLogo, setPreviewLogo] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(isEdit);
    const [processing, setProcessing] = useState(false);
    const [serverErrors, setServerErrors] = useState({});

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nombre_comercial: "",
            idDatosEmpresa: "",
            colores: "#3b82f6",
            status: true,
        },
    });

    const selectedColor = watch("colores");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resEmpresas = await axios.get("/api/empresas");
                setEmpresas(resEmpresas.data);

                if (isEdit && id) {
                    const resConfig = await axios.get(`/api/configuracion/${id}`);
                    const config = resConfig.data;
                    setValue("nombre_comercial", config.nombre_comercial || "");
                    setValue("idDatosEmpresa", config.idDatosEmpresa || "");
                    setValue("colores", config.colores || "#3b82f6");
                    setValue("status", config.status === 1 || config.status === true);
                    if (config.logo) {
                        setPreviewLogo(`/storage/${config.logo}`);
                    }
                }
            } catch (err) {
                console.error("Error fetching form data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isEdit, id, setValue]);

    const empresaOptions = empresas.map(emp => ({ value: emp.id, label: emp.nombre }));

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        setProcessing(true);
        setServerErrors({});

        const formData = new FormData();
        formData.append("nombre_comercial", data.nombre_comercial);
        formData.append("idDatosEmpresa", data.idDatosEmpresa);
        formData.append("colores", data.colores);
        formData.append("status", data.status ? "1" : "0");
        if (logoFile) {
            formData.append("logo", logoFile);
        }

        try {
            const url = isEdit ? `/api/configuracion/${id}` : "/api/configuracion";
            const res = await axios.post(url, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: isEdit ? "¡Configuración Actualizada!" : "¡Configuración Guardada!",
                    text: "Los cambios se han aplicado correctamente al sistema.",
                    timer: 2000,
                    showConfirmButton: false,
                    background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                    color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
                });
                navigate("/configuracion");
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                setServerErrors(err.response.data.errors);
            }
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "Por favor revisa los campos marcados en rojo.",
                confirmButtonColor: "var(--app-primary)",
            });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <Authenticated user={user}><div>Cargando...</div></Authenticated>;

    return (
        <Authenticated user={user}>
            <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-fade-in text-slate-900 dark:text-slate-100">
                <Link
                    to="/configuracion"
                    className="inline-flex items-center text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 hover:text-primary transition-all mb-4 group"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al listado
                </Link>

                <ContainerLaravel
                    titulo={isEdit ? "Editar Identidad Visual" : "Nueva Configuración de Layout"}
                    icono={faCog}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-2">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Columna Izquierda */}
                            <div className="lg:col-span-2 space-y-6">
                                <section className="space-y-4">
                                    <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <FontAwesomeIcon icon={faCog} className="text-sm" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Parámetros Generales</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <InputLabel value="Nombre Comercial del Sitio" />
                                            <TextInput
                                                className="w-full h-12"
                                                placeholder="Ej. Mi Plataforma SaaS"
                                                isError={!!errors.nombre_comercial || !!serverErrors.nombre_comercial}
                                                {...register("nombre_comercial", { required: "El nombre comercial es requerido" })}
                                            />
                                            <InputError message={errors.nombre_comercial?.message || serverErrors.nombre_comercial} />
                                        </div>

                                        <div className="space-y-2">
                                            <InputLabel value="Empresa Titular" />
                                            <Controller
                                                name="idDatosEmpresa"
                                                control={control}
                                                render={({ field }) => (
                                                    <CustomSelect
                                                        dataOptions={empresaOptions}
                                                        preDefaultValue={field.value}
                                                        setValue={(val) => field.onChange(val)}
                                                        placeholder="Selecciona una empresa"
                                                    />
                                                )}
                                            />
                                            <InputError message={serverErrors.idDatosEmpresa} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <InputLabel value="Color Identitario (Marca)" />
                                        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                                            {PRESET_COLORS.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setValue("colores", color)}
                                                    className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 active:scale-95 ${selectedColor === color
                                                        ? "border-slate-400 dark:border-white ring-2 ring-primary/20 scale-110 shadow-lg"
                                                        : "border-transparent"
                                                        }`}
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}

                                            <div className="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary transition-colors group">
                                                <input
                                                    type="color"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    value={selectedColor}
                                                    onChange={(e) => setValue("colores", e.target.value)}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faPalette}
                                                    className={`text-xs ${!PRESET_COLORS.includes(selectedColor) ? "text-primary" : "text-slate-400"}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded shadow-sm border border-black/10" style={{ backgroundColor: selectedColor }} />
                                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                                Seleccionado: {selectedColor}
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Columna Derecha: Logo */}
                            <div className="space-y-6">
                                <section className="space-y-4">
                                    <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <FontAwesomeIcon icon={faImage} className="text-sm" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Logo del Sistema</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div
                                            className="relative aspect-[25/7] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center overflow-hidden hover:border-primary/50 transition-all cursor-pointer group shadow-inner"
                                            onClick={() => document.getElementById('logo-upload').click()}
                                        >
                                            {previewLogo ? (
                                                <>
                                                    <img src={previewLogo} alt="Preview" className="w-full h-full object-contain p-4" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faUpload} className="text-white text-xl" />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center p-4">
                                                    <FontAwesomeIcon icon={faUpload} className="text-slate-300 text-2xl mb-2" />
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Click para subir logo</p>
                                                    <p className="text-[8px] text-slate-400 mt-1">(250x70px recomendado)</p>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            id="logo-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />

                                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                                            <div className="flex gap-3">
                                                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mt-0.5" size="xs" />
                                                <p className="text-[10px] text-blue-700 dark:text-blue-400/80 leading-snug">
                                                    Este logo se mostrará en el sidebar y en las cabeceras de los reportes PDF. Se recomienda un fondo transparente.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Link to="/configuracion">
                                <SecondaryButton type="button" className="h-12 px-6">
                                    <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
                                </SecondaryButton>
                            </Link>

                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="h-12 px-10 shadow-xl shadow-primary/20"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Procesando...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faSave} />
                                        <span>{isEdit ? "Guardar Cambios" : "Crear Configuración"}</span>
                                    </div>
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </ContainerLaravel>
            </div>
        </Authenticated>
    );
}
