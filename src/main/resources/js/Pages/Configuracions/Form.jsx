import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Swal from "sweetalert2";

export default function Form(props) {
    const { mode, routeBase, configuracion } = props;
    const isEdit = mode === "update";

    // Preview del logo existente o nuevo
    const [previewLogo, setPreviewLogo] = useState(
        isEdit && configuracion?.logo ? `/storage/${configuracion.logo}` : null
    );

    // Datos iniciales del formulario
    const { data, setData, post, put, processing, errors } = useForm({
        nombre_comercial: isEdit ? configuracion?.nombre_comercial || "" : "",
        colores: isEdit ? configuracion?.colores || "" : "",
        logo: null,
        status: isEdit ? configuracion?.status || true : true,
    });

    // Manejo de archivo para previsualización
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("logo", file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    // Envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        const onSuccess = () => {
            Swal.fire({
                icon: "success",
                title: isEdit
                    ? "Configuración actualizada"
                    : "Configuración creada",
                text: "La información se guardó correctamente.",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                window.location.href = route("configuracions.index");
            });
        };

        const onError = () => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un problema al guardar la configuración. Revisa los campos.",
            });
        };

        if (isEdit && configuracion?.id) {
            // En edición: usar PUT directo (JSON) como los demás módulos
            put(route("configuracions.update", configuracion.id), {
                onSuccess,
                onError,
            });
        } else {
            // En creación: POST normal (JSON)
            post(route("configuracions.store"), {
                onSuccess,
                onError,
            });
        }
    };

    return (
        <Authenticated auth={props.auth} errors={props.errors}>
            <div className="col-lg-12 d-flex justify-content-center">
                <div className="col-lg-12 col-lg-offset-1 mt-2">
                    <ContainerLaravel
                        titulo={
                            isEdit
                                ? "Editar Configuración"
                                : "Crear Configuración"
                        }
                        icono={isEdit ? "fa-edit" : "fa-plus"}
                    >
                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            {/* Nombre Comercial */}
                            <div className="mb-3">
                                <label>Nombre Comercial</label>
                                <input
                                    className={`form-control ${errors.nombre_comercial
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    value={data.nombre_comercial}
                                    onChange={(e) =>
                                        setData(
                                            "nombre_comercial",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                {errors.nombre_comercial && (
                                    <div className="invalid-feedback">
                                        {errors.nombre_comercial}
                                    </div>
                                )}
                            </div>

                            {/* Colores */}
                            <div className="mb-3">
                                <label>Color</label>
                                <input
                                    type="color"
                                    className={`form-control form-control-color ${errors.colores ? "is-invalid" : ""
                                        }`}
                                    value={data.colores}
                                    onChange={(e) =>
                                        setData("colores", e.target.value)
                                    }
                                    title="Selecciona un color"
                                />
                                {errors.colores && (
                                    <div className="invalid-feedback">
                                        {errors.colores}
                                    </div>
                                )}
                            </div>

                            {/* Logo */}
                            <div className="mb-3">
                                <label>Logo (250x70)</label>
                                <input
                                    type="file"
                                    className={`form-control ${errors.logo ? "is-invalid" : ""
                                        }`}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {errors.logo && (
                                    <div className="invalid-feedback">
                                        {errors.logo}
                                    </div>
                                )}
                                {previewLogo && (
                                    <div className="mt-2">
                                        <img
                                            src={previewLogo}
                                            alt="Preview Logo"
                                            style={{
                                                width: "250px",
                                                height: "70px",
                                                objectFit: "contain",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Datos de la Empresa */}
                            <div className="mb-3">
                                <label>Empresa Vinculada</label>
                                <select
                                    className={`form-control ${errors.id_datos_empresa ? "is-invalid" : ""}`}
                                    value={data.id_datos_empresa || ""}
                                    onChange={(e) => setData("id_datos_empresa", e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione una empresa</option>
                                    {props.empresas?.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.id_datos_empresa && (
                                    <div className="invalid-feedback">
                                        {errors.id_datos_empresa}
                                    </div>
                                )}
                            </div>

                            {/* Estado */}
                            <div className="mb-3">
                                <label>Estado</label>
                                <select
                                    className={`form-control ${errors.status ? "is-invalid" : ""
                                        }`}
                                    value={data.status}
                                    onChange={(e) =>
                                        setData(
                                            "status",
                                            e.target.value === "true"
                                        )
                                    }
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                                {errors.status && (
                                    <div className="invalid-feedback">
                                        {errors.status}
                                    </div>
                                )}
                            </div>

                            {/* Botón */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary"
                            >
                                {isEdit ? "Actualizar" : "Guardar"}
                            </button>
                        </form>
                    </ContainerLaravel>
                </div>
            </div>
        </Authenticated>
    );
}
