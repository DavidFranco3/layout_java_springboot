import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Spinner, Button, Form, Row, Col } from 'react-bootstrap';
import Swal from "sweetalert2";

const Acciones = ({ setShow, data: empresa, accion }) => {
    const isEdit = accion === "editar";
    const isEliminar = accion === "eliminar";

    const { data, setData, post, put, processing, errors, delete: destroy } = useForm({
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
                    : `Empresa ${isEdit ? "actualizada" : "creada"} correctamente`,
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
            destroy(route("empresas.destroy", empresa.id), { onSuccess, onError });
        } else if (isEdit) {
            put(route("empresas.update", empresa.id), {
                onSuccess,
                onError,
            });
        }
    };

    if (isEliminar) {
        return (
            <div className="p-3">
                <div className="alert alert-warning">
                    <strong>¡Atención!</strong> ¿Estás seguro de que deseas eliminar la empresa <strong>{empresa?.nombre}</strong>? Esta acción no se puede deshacer.
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
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            value={data.nombre}
                            onChange={(e) => setData("nombre", e.target.value)}
                            isInvalid={!!errors.nombre}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Razón Social</Form.Label>
                        <Form.Control
                            value={data.razon_social}
                            onChange={(e) => setData("razon_social", e.target.value)}
                            isInvalid={!!errors.razon_social}
                        />
                        <Form.Control.Feedback type="invalid">{errors.razon_social}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>RFC</Form.Label>
                        <Form.Control
                            value={data.rfc}
                            onChange={(e) => setData("rfc", e.target.value)}
                            isInvalid={!!errors.rfc}
                        />
                        <Form.Control.Feedback type="invalid">{errors.rfc}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo Persona</Form.Label>
                        <Form.Select
                            value={data.tipo_persona}
                            onChange={(e) => setData("tipo_persona", e.target.value)}
                        >
                            <option value="Moral">Moral</option>
                            <option value="Física">Física</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            value={data.telefono}
                            onChange={(e) => setData("telefono", e.target.value)}
                            isInvalid={!!errors.telefono}
                        />
                        <Form.Control.Feedback type="invalid">{errors.telefono}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Giro</Form.Label>
                        <Form.Control
                            value={data.giro}
                            onChange={(e) => setData("giro", e.target.value)}
                            isInvalid={!!errors.giro}
                        />
                        <Form.Control.Feedback type="invalid">{errors.giro}</Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col md={6}>
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
