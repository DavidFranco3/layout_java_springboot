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
import { faBuilding, faBriefcase, faIdCard, faPhone, faEnvelope, faCheckCircle, faSave, faTimes, faUserCircle, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Link } from "@inertiajs/react";

export default function Form(props) {
    const { mode, routeBase, empresa } = props;
    const isEdit = mode === "update";

    const { data, setData, post, put, processing, errors } = useForm({
        nombre: isEdit ? empresa?.nombre || "" : "",
        razon_social: isEdit ? empresa?.razon_social || "" : "",
        rfc: isEdit ? empresa?.rfc || "" : "",
        tipo_persona: isEdit ? empresa?.tipo_persona || "Moral" : "Moral",
        calle: isEdit ? empresa?.calle || "" : "",
        numero_exterior: isEdit ? empresa?.numero_exterior || "" : "",
        numero_interior: isEdit ? empresa?.numero_interior || "" : "",
        colonia: isEdit ? empresa?.colonia || "" : "",
        municipio: isEdit ? empresa?.municipio || "" : "",
        estado: isEdit ? empresa?.estado || "" : "",
        cp: isEdit ? empresa?.cp || "" : "",
        telefono: isEdit ? empresa?.telefono || "" : "",
        email: isEdit ? empresa?.email || "" : "",
        giro: isEdit ? empresa?.giro || "" : "",
        status: isEdit ? empresa?.status || true : true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const onSuccess = () => {
            Swal.fire({
                icon: "success",
                title: isEdit ? "Actualización Exitosa" : "Registro Exitoso",
                text: "La información de la empresa ha sido guardada correctamente.",
                timer: 2500,
                showConfirmButton: false,
                background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
                color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#0f172a',
            });
        };

        const onError = () => {
            Swal.fire({
                icon: "error",
                title: "Error en el Formulario",
                text: "Por favor revisa los campos marcados en rojo.",
                confirmButtonColor: "var(--app-primary)",
            });
        };

        if (isEdit && empresa?.id) {
            put(`/${routeBase}/${empresa.id}`, { onSuccess, onError });
        } else {
            post(`/${routeBase}`, { onSuccess, onError });
        }
    };

    return (
        <Authenticated auth={props.auth} errors={props.errors}>
            <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 animate-fade-in text-slate-900 dark:text-slate-100">
                <Link
                    href={route("empresas.index")}
                    className="inline-flex items-center text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 hover:text-primary transition-all mb-4 group"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver al listado
                </Link>
                <ContainerLaravel
                    titulo={isEdit ? `Editando: ${empresa?.nombre}` : "Nueva Empresa"}
                    icono={isEdit ? faBuilding : faBuilding}
                >
                    <form onSubmit={handleSubmit} className="space-y-8 py-4">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* BENTO BOX 1: INFORMACIÓN GENERAL */}
                            <div className="bg-slate-50/50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-[var(--border-light)] shadow-sm space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
                                        <FontAwesomeIcon icon={faBuilding} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold tracking-tight">Información Corporativa</h4>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Datos públicos</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="nombre" value="Nombre Comercial" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                                <FontAwesomeIcon icon={faBuilding} />
                                            </span>
                                            <TextInput
                                                id="nombre"
                                                className="w-full pl-11 h-12"
                                                value={data.nombre}
                                                placeholder="Nombre público de la empresa"
                                                onChange={(e) => setData("nombre", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <InputError message={errors.nombre} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="giro" value="Sector / Giro" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                                <FontAwesomeIcon icon={faBriefcase} />
                                            </span>
                                            <TextInput
                                                id="giro"
                                                className="w-full pl-11 h-12"
                                                value={data.giro}
                                                placeholder="Ej. Comercial, Servicios, Tecnología"
                                                onChange={(e) => setData("giro", e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.giro} />
                                    </div>
                                </div>
                            </div>

                            {/* BENTO BOX 2: CONTACTO (Arriba con General) */}
                            <div className="bg-slate-50/50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-[var(--border-light)] shadow-sm space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-sm">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold tracking-tight">Comunicación</h4>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Canales Directos</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="telefono" value="Teléfono" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                                <FontAwesomeIcon icon={faPhone} />
                                            </span>
                                            <TextInput
                                                id="telefono"
                                                className="w-full pl-11 h-12"
                                                value={data.telefono}
                                                placeholder="10 dígitos"
                                                onChange={(e) => setData("telefono", e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.telefono} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="email" value="Correo Electrónico" />
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                                <FontAwesomeIcon icon={faEnvelope} />
                                            </span>
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="w-full pl-11 h-12"
                                                value={data.email}
                                                placeholder="contacto@empresa.com"
                                                onChange={(e) => setData("email", e.target.value)}
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>
                                </div>
                            </div>

                            {/* BENTO BOX 3: DATOS FISCALES (Ancho completo o Grid) */}
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
                                        <TextInput
                                            id="razon_social"
                                            className="w-full h-12"
                                            value={data.razon_social}
                                            placeholder="Nombre legal completo"
                                            onChange={(e) => setData("razon_social", e.target.value)}
                                        />
                                        <InputError message={errors.razon_social} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <InputLabel htmlFor="rfc" value="RFC" />
                                        <TextInput
                                            id="rfc"
                                            className="w-full h-12 uppercase"
                                            value={data.rfc}
                                            maxLength={13}
                                            placeholder="ABC123456XYZ"
                                            onChange={(e) => setData("rfc", e.target.value)}
                                        />
                                        <InputError message={errors.rfc} />
                                    </div>
                                </div>
                            </div>

                            {/* BENTO BOX 4: DOMICILIO FISCAL (Ancho completo) */}
                            <div className="lg:col-span-2 bg-slate-50/50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-[var(--border-light)] shadow-sm space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-sm text-slate-900 dark:text-slate-100">
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
                                        <TextInput
                                            id="calle"
                                            className="w-full h-12"
                                            value={data.calle}
                                            placeholder="Nombre de la calle"
                                            onChange={(e) => setData("calle", e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-3 space-y-1.5">
                                        <InputLabel htmlFor="numero_exterior" value="Ext." />
                                        <TextInput
                                            id="numero_exterior"
                                            className="w-full h-12"
                                            value={data.numero_exterior}
                                            placeholder="Ext."
                                            onChange={(e) => setData("numero_exterior", e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-3 space-y-1.5">
                                        <InputLabel htmlFor="numero_interior" value="Int." />
                                        <TextInput
                                            id="numero_interior"
                                            className="w-full h-12"
                                            value={data.numero_interior}
                                            placeholder="Int."
                                            onChange={(e) => setData("numero_interior", e.target.value)}
                                        />
                                    </div>

                                    <div className="md:col-span-4 space-y-1.5">
                                        <InputLabel htmlFor="colonia" value="Colonia" />
                                        <TextInput
                                            id="colonia"
                                            className="w-full h-12"
                                            value={data.colonia}
                                            placeholder="Nombre de la colonia"
                                            onChange={(e) => setData("colonia", e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-4 space-y-1.5">
                                        <InputLabel htmlFor="municipio" value="Municipio" />
                                        <TextInput
                                            id="municipio"
                                            className="w-full h-12"
                                            value={data.municipio}
                                            placeholder="Nombre del municipio"
                                            onChange={(e) => setData("municipio", e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-4 space-y-1.5 text-slate-900 dark:text-slate-100">
                                        <InputLabel htmlFor="cp" value="CP" />
                                        <TextInput
                                            id="cp"
                                            className="w-full h-12"
                                            value={data.cp}
                                            maxLength={5}
                                            placeholder="54321"
                                            onChange={(e) => setData("cp", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ACCIONES DEL FORMULARIO */}
                        <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
                            <SecondaryButton
                                type="button"
                                onClick={() => window.history.back()}
                                className="h-14 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]"
                            >
                                <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
                            </SecondaryButton>

                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="h-14 px-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20"
                            >
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faSave} />
                                    <span>{processing ? "Guardando..." : (isEdit ? "Actualizar Empresa" : "Crear Empresa")}</span>
                                </div>
                            </PrimaryButton>
                        </div>

                    </form>
                </ContainerLaravel>
            </div>
        </Authenticated>
    );
}
