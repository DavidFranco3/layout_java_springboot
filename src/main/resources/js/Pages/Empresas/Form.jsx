import React from "react";
import { useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Swal from "sweetalert2";

export default function Form(props) {
    const { mode, routeBase, empresa } = props;
    const isEdit = mode === "update";

    const { data, setData, post, put, processing, errors } = useForm({
        nombre: isEdit ? empresa?.nombre || "" : "",
        razon_social: isEdit ? empresa?.razon_social || "" : "",
        rfc: isEdit ? empresa?.rfc || "" : "",
        tipo_persona: isEdit ? empresa?.tipo_persona || "Moral" : "Moral",
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
                title: isEdit ? "Empresa actualizada" : "Empresa creada",
                text: "La información se guardó correctamente.",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                window.location.href = `/${routeBase}`;
            });
        };

        const onError = () => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un problema al guardar la empresa. Revisa los campos e inténtalo nuevamente.",
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
            <div className="col-lg-12 d-flex justify-content-center">
                <div className="col-lg-12 col-lg-offset-1 mt-2">
                    <ContainerLaravel
                        titulo={isEdit ? "Editar Empresa" : "Crear Empresa"}
                        icono={isEdit ? "fa-edit" : "fa-plus"}
                    >
                        <form onSubmit={handleSubmit}>

                            {/* Nombre */}
                            <div className="mb-3">
                                <label>Nombre</label>
                                <input
                                    className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                                    value={data.nombre}
                                    onChange={(e) => setData("nombre", e.target.value)}
                                    required
                                />
                                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                            </div>

                            {/* Razón Social */}
                            <div className="mb-3">
                                <label>Razón Social</label>
                                <input
                                    className={`form-control ${errors.razon_social ? "is-invalid" : ""}`}
                                    value={data.razon_social}
                                    onChange={(e) => setData("razon_social", e.target.value)}
                                />
                                {errors.razon_social && (
                                    <div className="invalid-feedback">{errors.razon_social}</div>
                                )}
                            </div>

                            {/* RFC */}
                            <div className="mb-3">
                                <label>RFC</label>
                                <input
                                    className={`form-control ${errors.rfc ? "is-invalid" : ""}`}
                                    value={data.rfc}
                                    onChange={(e) => setData("rfc", e.target.value)}
                                />
                                {errors.rfc && <div className="invalid-feedback">{errors.rfc}</div>}
                            </div>

                            {/* Tipo Persona */}
                            <div className="mb-3">
                                <label>Tipo Persona</label>
                                <select
                                    className={`form-control ${errors.tipo_persona ? "is-invalid" : ""}`}
                                    value={data.tipo_persona}
                                    onChange={(e) => setData("tipo_persona", e.target.value)}
                                >
                                    <option value="Moral">Moral</option>
                                    <option value="Física">Física</option>
                                </select>
                                {errors.tipo_persona && (
                                    <div className="invalid-feedback">{errors.tipo_persona}</div>
                                )}
                            </div>

                            {/* Teléfono */}
                            <div className="mb-3">
                                <label>Teléfono</label>
                                <input
                                    className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                                    value={data.telefono}
                                    onChange={(e) => setData("telefono", e.target.value)}
                                />
                                {errors.telefono && (
                                    <div className="invalid-feedback">{errors.telefono}</div>
                                )}
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            {/* Giro */}
                            <div className="mb-3">
                                <label>Giro</label>
                                <input
                                    className={`form-control ${errors.giro ? "is-invalid" : ""}`}
                                    value={data.giro}
                                    onChange={(e) => setData("giro", e.target.value)}
                                />
                                {errors.giro && <div className="invalid-feedback">{errors.giro}</div>}
                            </div>

                            {/* Status */}
                            <div className="mb-3">
                                <label>Estado</label>
                                <select
                                    className={`form-control ${errors.status ? "is-invalid" : ""}`}
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value === "true")}
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                            </div>

                            <button type="submit" disabled={processing} className="btn btn-primary">
                                {isEdit ? "Actualizar" : "Guardar"}
                            </button>
                        </form>
                    </ContainerLaravel>
                </div>
            </div>
        </Authenticated>
    );
}
