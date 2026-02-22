import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faIdCard, faPhone, faEnvelope, faTrash, faSave, faTimes, faExclamationTriangle, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const Acciones = ({ setShow, data: empresa, accion }) => {
    const isEdit = accion === "editar";
    const isEliminar = accion === "eliminar";

    const { data, setData, put, processing, errors, delete: destroy } = useForm({
        nombre: isEdit ? empresa?.nombre || "" : "",
        razon_social: isEdit ? empresa?.razon_social || "" : "",
        rfc: isEdit ? empresa?.rfc || "" : "",
        tipo_persona: isEdit ? empresa?.tipo_persona || "Moral" : "Moral",
        telefono: isEdit ? empresa?.telefono || "" : "",
        email: isEdit ? empresa?.email || "" : "",
        giro: isEdit ? empresa?.giro || "" : "",
        status: isEdit ? empresa?.status : true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const onSuccess = () => {
            Swal.fire({
                icon: "success",
                title: isEliminar ? "Eliminado" : "Éxito",
                text: isEliminar
                    ? "Empresa eliminada correctamente"
                    : "Empresa actualizada correctamente",
                timer: 2000,
                showConfirmButton: false,
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
        };

        if (isEliminar) {
            destroy(route("empresas.destroy", empresa.id), { onSuccess, onError });
        } else if (isEdit) {
            put(route("empresas.update", empresa.id), { onSuccess, onError });
        }
    };

    if (isEliminar) {
        return (
            <div className="p-1 space-y-6 animate-fade-in">
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 mb-3">
                        <FontAwesomeIcon icon={faExclamationTriangle} size="lg" />
                    </div>
                    <h4 className="text-base font-bold text-amber-900 dark:text-amber-400 mb-1">Confirmar Eliminación</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-600/80 leading-relaxed">
                        ¿Estás seguro de eliminar <span className="font-bold text-amber-900 dark:text-amber-300">"{empresa?.nombre}"</span>? Esta acción es definitiva.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <SecondaryButton onClick={() => setShow(false)} className="h-11 px-6">
                        <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
                    </SecondaryButton>
                    <DangerButton onClick={handleSubmit} disabled={processing} className="h-11 px-8 shadow-lg shadow-red-500/20">
                        {processing ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Eliminando...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faTrash} />
                                <span>Eliminar Empresa</span>
                            </div>
                        )}
                    </DangerButton>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <InputLabel value="Nombre Comercial" />
                    <TextInput
                        className="w-full h-11"
                        value={data.nombre}
                        onChange={(e) => setData("nombre", e.target.value)}
                        required
                    />
                    <InputError message={errors.nombre} />
                </div>
                <div className="space-y-1.5">
                    <InputLabel value="Razón Social" />
                    <TextInput
                        className="w-full h-11"
                        value={data.razon_social}
                        onChange={(e) => setData("razon_social", e.target.value)}
                    />
                    <InputError message={errors.razon_social} />
                </div>
                <div className="space-y-1.5">
                    <InputLabel value="RFC" />
                    <TextInput
                        className="w-full h-11 uppercase"
                        value={data.rfc}
                        onChange={(e) => setData("rfc", e.target.value)}
                    />
                    <InputError message={errors.rfc} />
                </div>
                <div className="space-y-1.5">
                    <InputLabel value="Tipo Persona" />
                    <select
                        className="w-full h-11 rounded-xl border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 transition-all focus:ring-4 focus:ring-primary/10 focus:border-primary"
                        value={data.tipo_persona}
                        onChange={(e) => setData("tipo_persona", e.target.value)}
                    >
                        <option value="Moral">Moral</option>
                        <option value="Física">Física</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <InputLabel value="Teléfono" />
                    <TextInput
                        className="w-full h-11"
                        value={data.telefono}
                        onChange={(e) => setData("telefono", e.target.value)}
                    />
                    <InputError message={errors.telefono} />
                </div>
                <div className="space-y-1.5">
                    <InputLabel value="Email" />
                    <TextInput
                        type="email"
                        className="w-full h-11"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError message={errors.email} />
                </div>
                <div className="space-y-1.5">
                    <InputLabel value="Giro" />
                    <TextInput
                        className="w-full h-11"
                        value={data.giro}
                        onChange={(e) => setData("giro", e.target.value)}
                    />
                    <InputError message={errors.giro} />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                <SecondaryButton type="button" onClick={() => setShow(false)} className="h-11 px-6">
                    <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={processing} className="h-11 px-8 shadow-lg shadow-primary/20">
                    {processing ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Guardando...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faSave} />
                            <span>Actualizar Empresa</span>
                        </div>
                    )}
                </PrimaryButton>
            </div>
        </form>
    );
};

export default Acciones;
