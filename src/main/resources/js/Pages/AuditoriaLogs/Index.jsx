import React, { useState, useRef } from "react";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import DataTablecustom from "@/Components/Generales/DataTable";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Overlay, Tooltip } from "react-bootstrap";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

const Index = (props) => {
    const { auth, errors, auditorialogs } = props;
    console.log("🚀 ~ Index ~ auditorialogs:", auditorialogs)

    const [showTooltip, setShowTooltip] = useState(null);
    const targetRefs = useRef({});

    const handleToggleTooltip = (id) => {
        setShowTooltip((prev) => (prev === id ? null : id));
    };

    const handleClickOutside = (event) => {
        if (
            !Object.values(targetRefs.current).some((ref) =>
                ref?.contains(event.target)
            )
        ) {
            setShowTooltip(null);
        }
    };

    React.useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // Tooltip ancho y con scroll
    const renderTooltipContent = (data) => (
        <Tooltip style={{ maxWidth: "600px" }}>
            <div
                style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    padding: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    maxHeight: "300px",       // Si el contenido es muy largo
                    overflowY: "auto",        // Scroll vertical
                }}
            >
                <pre
                    style={{
                        whiteSpace: "pre-wrap",
                        fontSize: "12px",
                        margin: 0,
                        color: "#000",
                    }}
                >
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </Tooltip>
    );

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "70px",
        },
        {
            name: "Usuario",
            selector: (row) => row.user.name || "N/A",
            sortable: true,
        },
        {
            name: "Modelo",
            selector: (row) => row.model,
            sortable: true,
        },
        {
            name: "ID del Modelo",
            selector: (row) => row.model_id,
            sortable: true,
        },
        {
            name: "Acción",
            selector: (row) => row.accion,
            sortable: true,
        },
        {
            name: "IP",
            selector: (row) => row.ip,
        },
        {
            name: "URL",
            cell: (row) => (
                <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#007bff", textDecoration: "underline" }}
                >
                    Ver
                </a>
            ),
        },
        {
            name: "Observaciones",
            selector: (row) => row.observaciones || "Sin observaciones",
            wrap: true,
        },
        {
            name: "Datos Anteriores",
            cell: (row) =>
                row.datos_anteriores ? (
                    <>
                        <span
                            ref={(el) => (targetRefs.current[`anteriores-${row.id}`] = el)}
                            className="fas fa-eye"
                            style={{ cursor: "pointer", color: "#007bff" }}
                            onClick={() => handleToggleTooltip(`anteriores-${row.id}`)}
                        ></span>
                        <Overlay
                            target={targetRefs.current[`anteriores-${row.id}`]}
                            show={showTooltip === `anteriores-${row.id}`}
                            placement="top"
                        >
                            {renderTooltipContent(row.datos_anteriores)}
                        </Overlay>
                    </>
                ) : (
                    "N/A"
                ),
        },
        {
            name: "Datos Nuevos",
            cell: (row) =>
                row.datos_nuevos ? (
                    <>
                        <span
                            ref={(el) => (targetRefs.current[`nuevos-${row.id}`] = el)}
                            className="fas fa-eye"
                            style={{ cursor: "pointer", color: "#28a745" }}
                            onClick={() => handleToggleTooltip(`nuevos-${row.id}`)}
                        ></span>
                        <Overlay
                            target={targetRefs.current[`nuevos-${row.id}`]}
                            show={showTooltip === `nuevos-${row.id}`}
                            placement="top"
                        >
                            {renderTooltipContent(row.datos_nuevos)}
                        </Overlay>
                    </>
                ) : (
                    "N/A"
                ),
        },
        {
            name: "Creado el",
            selector: (row) =>
                dayjs.utc(row.created_at).format("DD/MM/YYYY h:mm:ss A"),
        },
    ];

    return (
        <Authenticated auth={auth} errors={errors}>
            <div className="col-lg-12 d-flex justify-content-center">
                <div className="col-lg-12 col-lg-offset-1 mt-2">
                    <ContainerLaravel
                        titulo={"Listado de Auditoría"}
                        icono={"fa-list"}
                    >
                        <DataTablecustom datos={auditorialogs} columnas={columns} />
                    </ContainerLaravel>
                </div>
            </div>
        </Authenticated>
    );
};

export default Index;
