import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ContainerApp from "@/Components/Generales/ContainerApp";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSave, faTimes, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

interface ClienteFormValues {
    nombre: string;
}

interface ClienteFormProps {
    mode: "create" | "update";
}

export default function Form({ mode }: ClienteFormProps) {
    const { id } = useParams();
    const isEdit = mode === "update";
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [processing, setProcessing] = useState(false);
    const [serverErrors, setServerErrors] = useState<Partial<Record<keyof ClienteFormValues, string>>>({});
    const [loading, setLoading] = useState(isEdit);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ClienteFormValues>({
        defaultValues: { nombre: "" },
    });

    useEffect(() => {
        if (isEdit && id) {
            fetchCliente();
        }
    }, [isEdit, id]);

    const fetchCliente = async () => {
        try {
            const res = await axios.get(`/api/clientes/${id}`);
            setValue("nombre", res.data.nombre);
        } catch (err) {
            console.error("Error al cargar cliente:", err);
            Swal.fire("Error", "No se pudo cargar la información del cliente", "error");
            navigate("/clientes");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setProcessing(true);
        setServerErrors({});

        try {
            if (isEdit) {
                await axios.put(`/api/clientes/${id}`, data);
            } else {
                await axios.post("/api/clientes", data);
            }

            Swal.fire({
                icon: "success",
                title: isEdit ? "¡Cliente Actualizado!" : "¡Cliente Registrado!",
                text: isEdit ? "Los cambios han sido guardados." : "El nuevo cliente ha sido agregado con éxito.",
                showConfirmButton: false,
                timer: 2000,
                background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
            });
            navigate("/clientes");
        } catch (err) {
            if (err.response?.data?.errors) {
                setServerErrors(err.response.data.errors);
            }
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "Por favor revisa los campos del formulario.",
                confirmButtonColor: "var(--app-primary)",
            });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <Authenticated user={user}>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <Link
                    to="/clientes"
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-6 group text-decoration-none"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al listado
                </Link>

                <ContainerApp
                    titulo={isEdit ? "Editar Cliente" : "Nuevo Cliente"}
                    icono={faUser}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-2">
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <FontAwesomeIcon icon={faUser} className="text-sm" />
                                </span>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 italic">Información Principal</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <InputLabel value="Nombre Completo o Razón Social" />
                                    <div className="relative group">
                                        <TextInput
                                            className="w-full h-12"
                                            placeholder="Ingresa el nombre del cliente"
                                            isError={!!errors.nombre || !!serverErrors.nombre}
                                            {...register("nombre", { required: "El nombre es requerido" })}
                                        />
                                    </div>
                                    <InputError message={errors.nombre?.message || serverErrors.nombre} />
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Link to="/clientes">
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
                                        <span>{isEdit ? "Guardar Cambios" : "Registrar Cliente"}</span>
                                    </div>
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </ContainerApp>
            </div>
        </Authenticated>
    );
}
