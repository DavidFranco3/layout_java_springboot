import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Spinner, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from "sweetalert2";

const Acciones = ({ setShow, data: config, accion }) => {
    const isEdit = accion === "editar";
    const isEliminar = accion === "eliminar";

    const [previewLogo, setPreviewLogo] = useState(
        isEdit && config?.logo ? `/storage/${config.logo}` : null
    );

    const { data, setData, post, processing, errors, delete: destroy } = useForm({
        nombre_comercial: isEdit ? config?.nombre_comercial || "" : "",
        colores: isEdit ? config?.colores || "#000000" : "#000000",
        logo: null,
        status: isEdit ? config?.status : true,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("logo", file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const onSuccess = () => {
            Swal.fire({
                icon: "success",
                title: isEliminar ? "Eliminado" : "Éxito",
                text: isEliminar
                    ? "Configuración eliminada correctamente"
                    : `Configuración ${isEdit ? "actualizada" : "creada"} correctamente`,
                timer: 2000,
                showConfirmButton: false,
            });
            setShow(false);
        };

        const onError = (err) => {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un problema al procesar la solicitud.",
            });
        };

        if (isEliminar) {
            destroy(route("configuracions.destroy", config.id), { onSuccess, onError });
        } else if (isEdit) {
            // FormData for file upload requires POST with _method PUT
            post(route("configuracions.update", config.id), {
                data: { ...data, _method: "PUT" },
                forceFormData: true,
                onSuccess,
                onError,
            });
        }
    };

    if (isEliminar) {
        return (
            <div className="p-3">
                <div className="alert alert-warning">
                    <strong>¡Atención!</strong> ¿Estás seguro de que deseas eliminar la configuración de <strong>{config?.nombre_comercial}</strong>? Esta acción no se puede deshacer.
                </div>
                <div className="text-center mt-4">
                    <Button variant="secondary" onClick={() => setShow(false)} className="me-2">
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleSubmit} disabled={processing}>
                        {processing ? <Spinner size="sm" /> : "Eliminar"}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre Comercial</Form.Label>
                        <Form.Control
                            value={data.nombre_comercial}
                            onChange={(e) => setData("nombre_comercial", e.target.value)}
                            isInvalid={!!errors.nombre_comercial}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.nombre_comercial}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Color Principal</Form.Label>
                        <Form.Control
                            type="color"
                            value={data.colores}
                            onChange={(e) => setData("colores", e.target.value)}
                            title="Selecciona un color"
                            isInvalid={!!errors.colores}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.colores}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Logo (Recomendado 250x70)</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            isInvalid={!!errors.logo}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.logo}
                        </Form.Control.Feedback>
                        {previewLogo && (
                            <div className="mt-2 text-center border rounded p-2 bg-light">
                                <img
                                    src={previewLogo}
                                    alt="Preview"
                                    style={{ maxHeight: "70px", maxWidth: "100%", objectFit: "contain" }}
                                />
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Estado</Form.Label>
                        <Form.Select
                            value={data.status}
                            onChange={(e) => setData("status", e.target.value === "true")}
                        >
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <div className="text-center mt-4">
                <Button variant="secondary" onClick={() => setShow(false)} className="me-2">
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" disabled={processing} style={{ backgroundColor: '#2C3E50', border: 'none' }}>
                    {processing ? <Spinner size="sm" /> : (isEdit ? "Actualizar" : "Guardar")}
                </Button>
            </div>
        </Form>
    );
};

export default Acciones;
