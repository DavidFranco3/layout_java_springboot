import React from "react";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Link, router } from "@inertiajs/react";

const Index = (props) => {
    const { auth, errors, clientes } = props;

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de eliminar este registro?")) {
            router.delete(`/clientes/${id}`);
        }
    };

    return (
        <Authenticated auth={auth} errors={errors}>
            <div className="col-lg-12 d-flex justify-content-center">
                <div className="col-lg-12 col-lg-offset-1 mt-2">
                    <ContainerLaravel titulo={"Listado de Clientes"} icono={"fa-list"}>
                        
                        <div className="mb-3 text-end">
                            <Link
                                href={`/clientes/create`}
                                className="btn btn-success"
                            >
                                <i className="fa fa-plus me-2"></i> Crear Cliente
                            </Link>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Campo Ejemplo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientes?.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.id}</td>
                                            <td>{item.campoEjemplo}</td>
                                            <td>
                                                <Link href={`/clientes/${item.id}/edit`} className="btn btn-sm btn-primary me-2">
                                                    <i className="fa fa-edit"></i> Editar
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-danger">
                                                    <i className="fa fa-trash"></i> Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!clientes?.length && <p className="text-center mt-3">No hay registros.</p>}
                        </div>
                    </ContainerLaravel>
                </div>
            </div>
        </Authenticated>
    );
};

export default Index;
