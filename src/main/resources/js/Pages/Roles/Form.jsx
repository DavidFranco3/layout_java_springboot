import React from "react";
import { useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";

export default function Form(props) {
    const { mode, routeBase, roles } = props;
    const isEdit = mode === "update";

    const { data, setData, post, put, processing } = useForm({
        campo_ejemplo: isEdit ? roles?.campo_ejemplo || "" : "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit && roles?.id) {
            put(`/${routeBase}/${roles.id}`);
        } else {
            post(`/${routeBase}`);
        }
    };

    return (
        <Authenticated auth={props.auth} errors={props.errors}>
            <div className="col-lg-12 d-flex justify-content-center">
                <div className="col-lg-12 col-lg-offset-1 mt-2">
                    <ContainerLaravel
                        titulo={isEdit ? "Editar Roles" : "Crear Roles"}
                        icono={isEdit ? "fa-edit" : "fa-plus"}
                    >
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>Campo ejemplo</label>
                                <input
                                    className="form-control"
                                    value={data.campo_ejemplo}
                                    onChange={(e) => setData("campo_ejemplo", e.target.value)}
                                />
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