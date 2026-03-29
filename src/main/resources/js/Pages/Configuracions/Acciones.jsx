import React, { useState } from "react";
import axios from "axios";
import { Spinner, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from "sweetalert2";

const Acciones = ({ setShow, data: config, accion, onRefresh }) => {
    const isEdit = accion === "editar";
    const isEliminar = accion === "eliminar";

    const [processing, setProcessing] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("logo", file);
            setPreviewLogo(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            if (isEliminar) {
                await axios.delete(`/api/configuracion/${config.id}`);
                Swal.fire({
                    icon: "success",
                    title: "Eliminado",
                    text: "Configuración eliminada correctamente",
                    timer: 2000,
                    showConfirmButton: false,
                });
                if (onRefresh) onRefresh();
                setShow(false);
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "Ocurrió un problema al procesar la solicitud.",
            });
        } finally {
            setProcessing(false);
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
