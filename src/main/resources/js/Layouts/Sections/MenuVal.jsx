import React, { useEffect, useState, useRef } from "react";
import Dropdown from "@/Components/Dropdown";
import axios from "axios"; // Asegúrate de tener axios importado
import SubMenu from "@/Components/Generales/SubMenu";
import { eliminaSucursal } from "@/utils/consultas";

const Menu = (props) => {
    //console.log(props.auth);

    const [turno, setTurno] = useState();

    const verificarTurnoActivo = async () => {
        try {
            const response = await axios.get(
                `${route("turnos.turnos.tieneTurnoActivo")}`
            );
            if (response.status === 200) {
                // Extraer el valor booleano de la respuesta
                const tieneTurnoActivo = response.data.tieneTurnoActivo;
                //console.log("Turno activo:", tieneTurnoActivo);

                // Opcional: Actualizar el estado o realizar alguna acción basada en el resultado
                if (tieneTurnoActivo) {
                    setTurno(true);
                } else {
                    setTurno(false);
                }

                return tieneTurnoActivo; // Devuelve el resultado si es necesario
            }
        } catch (error) {
            console.error(
                "Error al verificar si el usuario tiene un turno activo:",
                error
            );
            return false; // Manejo de error, retornar false si algo falla
        }
    };

    useEffect(() => {
        verificarTurnoActivo();
    }, []);

    //console.log(turno);

    const [dataConfiguracion, setDataConfiguracion] = useState([]);

    const getConfiguracion = async () => {
        try {
            const response = await axios.get(
                "/configuracions/api/list"
            );
            //console.log(response.data);
            if (response.status === 200) {
                // Filtrar los datos que coincidan con el id_configuracion
                const filteredData = response.data.filter(
                    (settings) => settings.id == props.auth.id_configuracion
                );

                //console.log(filteredData);

                // Mapear los datos filtrados para crear un nuevo arreglo de objetos
                const formattedData = filteredData.map((settings) => ({
                    id: settings.id,
                    colores: settings.colores,
                    logo: settings.logo,
                    id_datos_empresa: settings.id_datos_empresa,
                    id_datos_facturacion: settings.id_datos_facturacion,
                    nombre_empresa: settings.nombre_empresa,
                    razon_social: settings.razon_social,
                    created_at: settings.created_at,
                    updated_at: settings.updated_at,
                }));

                // Establecer los datos de configuración en el estado
                setDataConfiguracion(formattedData);
            }
        } catch (error) {
            //console.log(error);
        }
    };

    useEffect(() => {
        getConfiguracion();
    }, []);

    //console.log(dataConfiguracion);

    const mystylelogo = {
        backgroundColor: "#748895",
        color: "#ffffff",
        borderBottom: "0 solid transparent",
        display: "block",
        fontFamily: "Arial, sans-serif", // Cambia esto por la fuente que prefieras
        fontWeight: "bold", // Esto aplicará negritas a la fuente
    };

    const baseUrl = window.location.origin;

    const isAdministrador = props.auth.id_rol === 1;
    const isSuperAdministrador = props.auth.id_rol === 6;
    const isVentas = props.auth.id_rol === 2;
    const isInventarios = props.auth.id_rol == 3;
    const isOperaciones = props.auth.id_rol === 4;
    const isAuditor = props.auth.id_rol === 5;

    //console.log(isVentas);

    //validacion extrena
    const [modulosPermitidos, setModulosPermitidos] = useState([]);
    const cacheKey = `modulos_empresa_${props.auth.id}`;
    const intervalRef = useRef(null);

    const fetchModulosDesdeBackend = async () => {
        try {
            //console.log("📡 Solicitando módulos desde backend...");
            const response = await axios.get(
                "http://127.0.0.1:8000/api/modulos-por-empresa?empresa=saas"
            );

            if (response.status === 200) {
                const newModulos = response.data; // ✅ correcto
                //console.log(
                "🧪 Tipo:",
                    typeof newModulos,
                    "| Longitud:",
                    newModulos.length
                );

if (Array.isArray(newModulos) && newModulos.length > 0) {
    const newHash = JSON.stringify(newModulos);
    localStorage.setItem(
        cacheKey,
        JSON.stringify({ hash: newHash, modulos: newModulos })
    );
    setModulosPermitidos(newModulos);
    //console.log("✅ Módulos válidos recibidos:", newModulos);

    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        //console.log("🛑 Intervalo detenido (datos válidos)");
    }
} else {
    console.warn(
        "⚠️ Backend devolvió módulos vacíos, reintentando..."
    );
    localStorage.removeItem(cacheKey);
}
            }
        } catch (error) {
    console.error("❌ Error al obtener módulos desde backend:", error);
}
    };

const fetchModulosPorEmpresa = async () => {
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
        try {
            const parsed = JSON.parse(cached);
            if (parsed && Array.isArray(parsed.modulos)) {
                const { hash, modulos } = parsed;

                if (modulos.length === 0) {
                    console.warn(
                        "⚠️ Cache vacío. Reintentando desde backend..."
                    );
                    localStorage.removeItem(cacheKey);
                    setModulosPermitidos([]);
                    fetchModulosDesdeBackend();

                    if (!intervalRef.current) {
                        intervalRef.current = setInterval(
                            fetchModulosDesdeBackend,
                            1000
                        );
                    }
                    return;
                }

                setModulosPermitidos(modulos);
                //console.log("✅ Cache válido con módulos:", modulos);

                // 🔁 Verificación en segundo plano
                axios
                    .get(
                        "http://127.0.0.1:8000/api/modulos-por-empresa?empresa=saas"
                    )
                    .then((response) => {
                        const newModulos = response.data; // ✅ acceso correcto
                        const newHash = JSON.stringify(newModulos);
                        if (newHash !== hash) {
                            localStorage.setItem(
                                cacheKey,
                                JSON.stringify({
                                    hash: newHash,
                                    modulos: newModulos,
                                })
                            );
                            setModulosPermitidos(newModulos);
                            //console.log("🔄 Cache actualizado.");
                        }
                    })
                    .catch((err) =>
                        console.error(
                            "🔁 Error actualizando módulos en segundo plano:",
                            err
                        )
                    );

                return;
            } else {
                console.warn("⚠️ Cache inválido. Forzando recarga...");
                localStorage.removeItem(cacheKey);
            }
        } catch (error) {
            console.error("❌ Error al parsear cache:", error);
            localStorage.removeItem(cacheKey);
        }
    }

    // Si no hay cache o es inválido
    fetchModulosDesdeBackend();
    if (!intervalRef.current) {
        intervalRef.current = setInterval(fetchModulosDesdeBackend, 5000);
    }
};

useEffect(() => {
    fetchModulosPorEmpresa();

    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
}, []);

// ✅ Verifica si el módulo con el nombre especificado está habilitado
const tieneModulo = (nombreModulo) => {
    return (
        Array.isArray(modulosPermitidos) &&
        modulosPermitidos.some(
            (mod) =>
                typeof mod?.nombre === "string" &&
                mod.nombre === nombreModulo
        )
    );
};

// ✅ Devuelve los submódulos de un módulo por nombre
const obtenerSubmodulos = (nombreModulo) => {
    if (!Array.isArray(modulosPermitidos)) return [];

    const modulo = modulosPermitidos.find(
        (mod) =>
            typeof mod?.nombre === "string" && mod.nombre === nombreModulo
    );

    if (!modulo || !Array.isArray(modulo.submodulos)) return [];

    return modulo.submodulos;
};

// ✅ Verifica si existe un submódulo específico dentro de un módulo
const tieneSubmodulo = (nombreModulo, rutaSubmodulo) => {
    const submodulos = obtenerSubmodulos(nombreModulo);
    return submodulos.some(
        (sub) => typeof sub?.ruta === "string" && sub.ruta === rutaSubmodulo
    );
};

return (
    <div>
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <a href={route("dashboard")} style={mystylelogo}>
                <img
                    src={
                        dataConfiguracion.length > 0
                            ? `${baseUrl}/storage/${dataConfiguracion[0]?.logo}` ||
                            "https://appseguritec.com/logo.jpg" // Default si no hay colores
                            : "https://appseguritec.com/logo.jpg"
                    }
                    alt="AdminLTE Logo"
                    style={{ height: "55px" }}
                />
            </a>
            {(props.auth.id_rol !== 2 ||
                (props.auth.id_rol == 2 && turno === true)) && (
                    <div className="sidebar">
                        <nav className="mt-2">
                            <ul
                                className="nav nav-pills nav-sidebar flex-column"
                                data-widget="treeview"
                                role="menu"
                                data-accordion="false"
                            >
                                {tieneModulo("Bienvenido") && (
                                    <li className="nav-item">
                                        <a
                                            href={route("dashboard")}
                                            className="nav-link"
                                        >
                                            <i className="nav-icon fas fa-th" />
                                            <p>Bienvenido</p>
                                        </a>
                                    </li>
                                )}

                                {(isSuperAdministrador ||
                                    isAdministrador ||
                                    isOperaciones ||
                                    isAuditor) &&
                                    tieneModulo("Turnos") && (
                                        <li className="nav-item">
                                            <a
                                                href={route("turnos.index")}
                                                className="nav-link"
                                            >
                                                <i className="nav-icon bi bi-arrows-collapse" />
                                                <p>Turnos</p>
                                            </a>
                                        </li>
                                    )}
                                {(isSuperAdministrador ||
                                    isAdministrador ||
                                    isAuditor) &&
                                    tieneModulo("Empleados") && (
                                        <li className="nav-item">
                                            <a
                                                href={route("empleados.index")}
                                                className="nav-link"
                                            >
                                                <i className="nav-icon bi bi-people" />
                                                <p>Empleados</p>
                                            </a>
                                        </li>
                                    )}
                                {(isSuperAdministrador ||
                                    isAdministrador ||
                                    isAuditor ||
                                    isVentas) &&
                                    tieneModulo("Cotizaciones") &&
                                    obtenerSubmodulos("Cotizaciones").length >
                                    0 && (
                                        <SubMenu
                                            title="Cotizaciones"
                                            icon="nav-icon bi bi-currency-exchange"
                                            menuKey="cotizaciones"
                                            subItems={obtenerSubmodulos(
                                                "Cotizaciones"
                                            ).map((sub) => {
                                                let icono =
                                                    "nav-icon bi bi-file-text"; // ícono por defecto

                                                switch (sub.ruta) {
                                                    case "ticket.ticket.index":
                                                        icono =
                                                            "nav-icon bi bi-currency-exchange";
                                                        break;
                                                    case "ventas.ventas.indexHistorial":
                                                        icono =
                                                            "nav-icon bi bi-clock-history";
                                                        break;
                                                }

                                                return {
                                                    route: sub.ruta,
                                                    label: sub.nombre,
                                                    icon: icono,
                                                };
                                            })}
                                        />
                                    )}

                                {isVentas && tieneModulo("Contratos") && (
                                    <li className="nav-item">
                                        <a
                                            href={route(
                                                "contratoPersona.index"
                                            )}
                                            className="nav-link"
                                        >
                                            <i className="nav-icon bi bi-safe" />
                                            <p>Contratos</p>
                                        </a>
                                    </li>
                                )}
                                {isVentas && tieneModulo("Clientes") && (
                                    <li className="nav-item">
                                        <a
                                            href={route("clientes.index")}
                                            className="nav-link"
                                        >
                                            <i className="nav-icon bi bi-person-circle" />
                                            <p>Clientes</p>
                                        </a>
                                    </li>
                                )}
                                {isVentas && tieneModulo("Metodos de pago") && (
                                    <li className="nav-item">
                                        <a
                                            href={route("metodosPago.index")}
                                            className="nav-link"
                                        >
                                            <i className="nav-icon bi bi-cash-stack" />
                                            <p>Metodos de pago</p>
                                        </a>
                                    </li>
                                )}
                                {(isSuperAdministrador ||
                                    isAdministrador ||
                                    isInventarios ||
                                    isAuditor) &&
                                    tieneModulo("Orden de compra") && (
                                        <li className="nav-item">
                                            <a
                                                href={route(
                                                    "ordenesCompra.index"
                                                )}
                                                className="nav-link"
                                            >
                                                <i className="nav-icon bi bi-currency-dollar" />
                                                <p>Orden de compra</p>
                                            </a>
                                        </li>
                                    )}
                                {isInventarios && tieneModulo("Productos") && (
                                    <li className="nav-item">
                                        <a
                                            href={route("productos.index")}
                                            className="nav-link"
                                        >
                                            <i className="nav-icon bi bi-bag-check" />
                                            <p>Productos</p>
                                        </a>
                                    </li>
                                )}
                                {isInventarios &&
                                    tieneModulo("Proveedores") && (
                                        <li className="nav-item">
                                            <a
                                                href={route(
                                                    "proveedores.index"
                                                )}
                                                className="nav-link"
                                            >
                                                <i className="nav-icon bi bi-file-person-fill" />
                                                <p>Proveedores</p>
                                            </a>
                                        </li>
                                    )}
                                {isInventarios &&
                                    tieneModulo("Ingredientes") && (
                                        <li className="nav-item">
                                            <a
                                                href={route(
                                                    "ingredientes.index"
                                                )}
                                                className="nav-link"
                                            >
                                                <i className="nav-icon bi bi-bag-check" />
                                                <p>Ingredientes</p>
                                            </a>
                                        </li>
                                    )}
                                {isInventarios &&
                                    tieneModulo("Unidades de medida") && (
                                        <li className="nav-item">
                                            <a
                                                href={route(
                                                    "unidadesMedida.index"
                                                )}
                                                className="nav-link"
                                            >
                                                <i className="nav-icon bi bi-window-sidebar" />
                                                <p>Unidades de medida</p>
                                            </a>
                                        </li>
                                    )}
                                {isAuditor &&
                                    tieneModulo("Historial de ventas") && (
                                        <li className="nav-item">
                                            <a
                                                href={route(
                                                    "ventas.ventas.indexHistorial"
                                                )}
                                                className="nav-link"
                                            >
                                                <i className="nav-icon fas fa-list-alt" />
                                                <p>Historial de ventas</p>
                                            </a>
                                        </li>
                                    )}
                                {(isAdministrador ||
                                    isSuperAdministrador ||
                                    isOperaciones ||
                                    isVentas) &&
                                    tieneModulo("Ventas") &&
                                    obtenerSubmodulos("Ventas").length > 0 && (
                                        <SubMenu
                                            title="Ventas"
                                            icon="fas fa-shopping-cart"
                                            menuKey="ventas"
                                            subItems={obtenerSubmodulos(
                                                "Ventas"
                                            ).map((sub) => {
                                                let icono =
                                                    "nav-icon fas fa-shopping-cart"; // icono por defecto

                                                switch (sub.ruta) {
                                                    case "ventas.index":
                                                        icono =
                                                            "nav-icon fas fa-shopping-cart";
                                                        break;
                                                    case "ventas.ventas.indexHistorial":
                                                        icono =
                                                            "nav-icon fas fa-list-alt";
                                                        break;
                                                    case "creditos.index":
                                                        icono =
                                                            "nav-icon bi bi-credit-card";
                                                        break;
                                                }

                                                return {
                                                    route: sub.ruta,
                                                    label: sub.nombre,
                                                    icon: icono,
                                                };
                                            })}
                                        />
                                    )}

                                {(isSuperAdministrador ||
                                    isAdministrador ||
                                    isAuditor) &&
                                    tieneModulo("Catalogos") &&
                                    obtenerSubmodulos("Catalogos").length >
                                    0 && (
                                        <SubMenu
                                            title="Catalogos"
                                            icon="fas fa-book"
                                            menuKey="catalogos"
                                            subItems={obtenerSubmodulos(
                                                "Catalogos"
                                            ).map((sub) => {
                                                let icono =
                                                    "nav-icon bi bi-folder"; // ícono por defecto

                                                switch (sub.ruta) {
                                                    case "usuarios.index":
                                                        icono =
                                                            "nav-icon bi bi-person-fill";
                                                        break;
                                                    case "tiposServicio.index":
                                                    case "contratoPersona.index":
                                                        icono =
                                                            "nav-icon bi bi-safe";
                                                        break;
                                                    case "categorias.index":
                                                        icono =
                                                            "nav-icon bi bi-bar-chart-steps";
                                                        break;
                                                    case "mesas.index":
                                                        icono =
                                                            "nav-icon bi bi-table";
                                                        break;
                                                    case "departamentos.index":
                                                        icono =
                                                            "nav-icon bi bi-bar-chart-line";
                                                        break;
                                                    case "metodosPago.index":
                                                        icono =
                                                            "nav-icon bi bi-cash-stack";
                                                        break;
                                                    case "unidadesMedida.index":
                                                        icono =
                                                            "nav-icon bi bi-window-sidebar";
                                                        break;
                                                    case "clientes.index":
                                                        icono =
                                                            "nav-icon bi bi-person-circle";
                                                        break;
                                                    case "proveedores.index":
                                                        icono =
                                                            "nav-icon bi bi-file-person-fill";
                                                        break;
                                                    case "productos.index":
                                                    case "ingredientes.index":
                                                        icono =
                                                            "nav-icon bi bi-bag-check";
                                                        break;
                                                }

                                                return {
                                                    route: sub.ruta,
                                                    label: sub.nombre,
                                                    icon: icono,
                                                };
                                            })}
                                        />
                                    )}

                                {(isSuperAdministrador ||
                                    isAdministrador ||
                                    isAuditor) &&
                                    tieneModulo("Configuración") &&
                                    obtenerSubmodulos("Configuración").length >
                                    0 && (
                                        <SubMenu
                                            title="Configuración"
                                            icon="fas fa-cogs"
                                            menuKey="config"
                                            subItems={obtenerSubmodulos(
                                                "Configuración"
                                            ).map((sub) => {
                                                let icono =
                                                    "nav-icon bi bi-gear"; // ícono por defecto

                                                switch (sub.ruta) {
                                                    case "roles.index":
                                                        icono =
                                                            "nav-icon bi bi-list";
                                                        break;
                                                    case "puestos.index":
                                                        icono =
                                                            "nav-icon bi bi-people";
                                                        break;
                                                    case "logs.index":
                                                        icono =
                                                            "nav-icon bi bi-list";
                                                        break;
                                                    case "configuraciones.index":
                                                        icono =
                                                            "nav-icon bi bi-gear";
                                                        break;
                                                    case "empresas.index":
                                                        icono =
                                                            "nav-icon bi bi-building";
                                                        break;
                                                    case "impresoras.index":
                                                        icono =
                                                            "nav-icon bi bi-printer-fill";
                                                        break;
                                                }

                                                return {
                                                    route: sub.ruta,
                                                    label: sub.nombre,
                                                    icon: icono,
                                                };
                                            })}
                                        />
                                    )}

                                <li className="nav-item">
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="nav-link"
                                        onClick={() => {
                                            // Aquí puedes poner la función que quieras ejecutar antes de cerrar sesión
                                            //console.log("Sesión cerrada");
                                            // o una función más elaborada
                                            eliminaSucursal();
                                        }}
                                    >
                                        <i className="nav-icon fas fa-th" />
                                        Cerrar Sesión
                                    </Dropdown.Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
        </aside>
    </div>
);
};

export default Menu;
