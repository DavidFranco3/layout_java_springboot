import React from "react";
import { useForm, Link } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";

export default function Form(props) {
    const { auth, errors, mode, routeBase, cliente } = props;
    const isEdit = mode === "update";

    const { data, setData, post, put, processing, errors: formErrors } = useForm({
        campoEjemplo: isEdit && cliente ? cliente.campoEjemplo : "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit && cliente?.id) {
            put(`/${routeBase}/${cliente.id}`);
        } else {
            post(`/${routeBase}`);
        }
    };

    return (
        <Authenticated auth={auth} errors={errors}>
            <div className="col-lg-12 d-flex justify-content-center">
                <div className="col-lg-12 col-lg-offset-1 mt-2">
                    <ContainerLaravel
                        titulo={isEdit ? "Editar Cliente" : "Crear Cliente"}
                        icono={isEdit ? "fa-edit" : "fa-plus"}
                    >
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Campo Ejemplo</label>
                                <input
                                    type="text"
                                    className={`form-control ${formErrors.campoEjemplo ? "is-invalid" : ""}`}
                                    value={data.campoEjemplo}
                                    onChange={(e) => setData("campoEjemplo", e.target.value)}
                                />
                                {formErrors.campoEjemplo && <div className="invalid-feedback">{formErrors.campoEjemplo}</div>}
                            </div>
                            <div className="d-flex justify-content-between">
                                <Link href={`/${routeBase}`} className="btn btn-secondary">
                                    Cancelar
                                </Link>
                                <button type="submit" disabled={processing} className="btn btn-primary">
                                    {isEdit ? "Actualizar" : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </ContainerLaravel>
                </div>
            </div>
        </Authenticated>
    );
}
