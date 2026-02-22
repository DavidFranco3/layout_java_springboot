import React from "react";
import { useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSave, faTimes, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Link } from "@inertiajs/react";

export default function Form(props) {
    const { mode, cliente } = props;
    const isEdit = mode === "update";

    const { data, setData, post, put, processing, errors } = useForm({
        nombre: isEdit ? cliente?.nombre || "" : "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = isEdit ? put : post;
        const url = isEdit ? route("clientes.update", cliente.id) : route("clientes.store");

        action(url, {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: isEdit ? "¡Cliente Actualizado!" : "¡Cliente Registrado!",
                    text: isEdit ? "Los cambios han sido guardados." : "El nuevo cliente ha sido agregado con éxito.",
                    showConfirmButton: false,
                    timer: 2000,
                    background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                    color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
                });
            },
            onError: () => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Por favor revisa los campos del formulario.",
                    confirmButtonColor: "var(--app-primary)",
                });
            }
        });
    };

    return (
        <Authenticated auth={props.auth} errors={props.errors}>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <Link
                    href={route("clientes.index")}
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-6 group"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al listado
                </Link>

                <ContainerLaravel
                    titulo={isEdit ? "Editar Cliente" : "Nuevo Cliente"}
                    icono={faUser}
                >
                    <form onSubmit={handleSubmit} className="space-y-8 p-2">
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
                                            value={data.nombre}
                                            onChange={(e) => setData("nombre", e.target.value)}
                                            isError={!!errors.nombre}
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.nombre} />
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Link href={route("clientes.index")}>
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
                </ContainerLaravel>
            </div>
        </Authenticated>
    );
}
