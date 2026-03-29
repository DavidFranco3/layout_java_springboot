import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import SubMenu from "@/Components/Generales/SubMenu";
import { eliminaSucursal } from "@/utils/consultas";

interface SubModulo {
    ruta: string;
    nombre: string;
    icon?: string;
}

interface Modulo {
    nombre: string;
    submodulos: SubModulo[];
}

interface AuthUser {
    id: number;
    id_rol: number;
    id_configuracion?: number;
}

interface MenuValProps {
    auth: AuthUser;
    configuracion: any;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    darkMode: boolean;
}

const MenuVal = ({ auth, configuracion, sidebarOpen, toggleSidebar, darkMode }: MenuValProps) => {
    const location = useLocation();
    const [turno, setTurno] = useState<boolean | null>(null);

    const verificarTurnoActivo = async () => {
        try {
            const response = await axios.get(
                "/api/turnos/tiene-turno-activo"
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

    const mystylelogo = {
        backgroundColor: configuracion?.colores || "#748895",
        color: "#ffffff",
        borderBottom: "0 solid transparent",
        display: "block",
        fontFamily: "Arial, sans-serif",
        fontWeight: "bold",
    };

    const baseUrl = window.location.origin;

    const isAdministrador = auth.id_rol === 1;
    const isSuperAdministrador = auth.id_rol === 6;
    const isVentas = auth.id_rol === 2;
    const isInventarios = auth.id_rol === 3;
    const isOperaciones = auth.id_rol === 4;
    const isAuditor = auth.id_rol === 5;

    //console.log(isVentas);

    //validacion extrena
    const [modulosPermitidos, setModulosPermitidos] = useState<Modulo[]>([]);
    const cacheKey = `modulos_empresa_${auth.id}`;
    const intervalRef = useRef<number | null>(null);

    const fetchModulosDesdeBackend = async () => {
        try {
            //console.log("📡 Solicitando módulos desde backend...");
            const response = await axios.get(
                "/api/modulos-por-empresa?empresa=saas"
            );

            if (response.status === 200) {
                const newModulos = response.data; // ✅ correcto
                // console.log(
                //     "🧪 Tipo:",
                //     typeof newModulos,
                //     "| Longitud:",
                //     newModulos.length
                // );

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
                            intervalRef.current = window.setInterval(
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
                        "/api/modulos-por-empresa?empresa=saas"
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
            intervalRef.current = window.setInterval(fetchModulosDesdeBackend, 5000);
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
    const tieneModulo = (nombreModulo: string) => {
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
    const obtenerSubmodulos = (nombreModulo: string): SubModulo[] => {
        if (!Array.isArray(modulosPermitidos)) return [];

        const modulo = modulosPermitidos.find(
            (mod) =>
                typeof mod?.nombre === "string" && mod.nombre === nombreModulo
        );

        if (!modulo || !Array.isArray(modulo.submodulos)) return [];

        return modulo.submodulos;
    };

    // ✅ Verifica si existe un submódulo específico dentro de un módulo
    const tieneSubmodulo = (nombreModulo: string, rutaSubmodulo: string) => {
        const submodulos = obtenerSubmodulos(nombreModulo);
        return submodulos.some(
            (sub) => typeof sub?.ruta === "string" && sub.ruta === rutaSubmodulo
        );
    };

    return (
        <div>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <Link to="/dashboard" style={mystylelogo}>
                    <img
                        src={
                            configuracion?.logo
                                ? `${baseUrl}/storage/${configuracion.logo}`
                                : "https://appseguritec.com/logo.jpg"
                        }
                        alt="AdminLTE Logo"
                        style={{ height: "55px" }}
                    />
                </Link>
                {(auth.id_rol !== 2 ||
                    (auth.id_rol == 2 && turno === true)) && (
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
                                        <Link
                                            to="/dashboard"
                                            className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                                        >
                                            <i className="nav-icon fas fa-th" />
                                            <p>Bienvenido</p>
                                        </Link>
                                    </li>
                                )}

                                {(isSuperAdministrador ||
                                    isAdministrador ||
                                    isOperaciones ||
                                    isAuditor) &&
                                    tieneModulo("Turnos") && (
                                        <li className="nav-item">
                                            <Link
                                                to="/turnos"
                                                className={`nav-link ${location.pathname === "/turnos" ? "active" : ""}`}
                                            >
                                                <i className="nav-icon bi bi-arrows-collapse" />
                                                <p>Turnos</p>
                                            </Link>
                                        </li>
                                    )}
                                {(isSuperAdministrador ||
                                    isAdministrador ||
                                    isAuditor) &&
                                    tieneModulo("Empleados") && (
                                        <li className="nav-item">
                                            <Link
                                                to="/empleados"
                                                className={`nav-link ${location.pathname === "/empleados" ? "active" : ""}`}
                                            >
                                                <i className="nav-icon bi bi-people" />
                                                <p>Empleados</p>
                                            </Link>
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
                                            sidebarOpen={sidebarOpen}
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
                                                    to: `/${sub.ruta.replace(/\./g, "/")}`,
                                                    label: sub.nombre,
                                                    icon: icono,
                                                };
                                            })}
                                        />
                                    )}

                                {isVentas && tieneModulo("Contratos") && (
                                    <li className="nav-item">
                                        <Link
                                            to="/contratos"
                                            className={`nav-link ${location.pathname === "/contratos" ? "active" : ""}`}
                                        >
                                            <i className="nav-icon bi bi-safe" />
                                            <p>Contratos</p>
                                        </Link>
                                    </li>
                                )}
                                {isVentas && tieneModulo("Clientes") && (
                                    <li className="nav-item">
                                        <Link
                                            to="/clientes"
                                            className={`nav-link ${location.pathname === "/clientes" ? "active" : ""}`}
                                        >
                                            <i className="nav-icon bi bi-person-circle" />
                                            <p>Clientes</p>
                                        </Link>
                                    </li>
                                )}
                                {isVentas && tieneModulo("Metodos de pago") && (
                                    <li className="nav-item">
                                        <Link
                                            to="/metodos-pago"
                                            className={`nav-link ${location.pathname === "/metodos-pago" ? "active" : ""}`}
                                        >
                                            <i className="nav-icon bi bi-cash-stack" />
                                            <p>Metodos de pago</p>
                                        </Link>
                                    </li>
                                )}
                                {(isSuperAdministrador ||
                                    isAdministrador ||
                                    isInventarios ||
                                    isAuditor) &&
                                    tieneModulo("Orden de compra") && (
                                        <li className="nav-item">
                                            <Link
                                                to="/ordenes-compra"
                                                className={`nav-link ${location.pathname === "/ordenes-compra" ? "active" : ""}`}
                                            >
                                                <i className="nav-icon bi bi-currency-dollar" />
                                                <p>Orden de compra</p>
                                            </Link>
                                        </li>
                                    )}
                                {isInventarios && tieneModulo("Productos") && (
                                    <li className="nav-item">
                                        <Link
                                            to="/productos"
                                            className={`nav-link ${location.pathname === "/productos" ? "active" : ""}`}
                                        >
                                            <i className="nav-icon bi bi-bag-check" />
                                            <p>Productos</p>
                                        </Link>
                                    </li>
                                )}
                                {isInventarios &&
                                    tieneModulo("Proveedores") && (
                                        <li className="nav-item">
                                            <Link
                                                to="/proveedores"
                                                className={`nav-link ${location.pathname === "/proveedores" ? "active" : ""}`}
                                            >
                                                <i className="nav-icon bi bi-file-person-fill" />
                                                <p>Proveedores</p>
                                            </Link>
                                        </li>
                                    )}
                                {isInventarios &&
                                    tieneModulo("Ingredientes") && (
                                        <li className="nav-item">
                                            <Link
                                                to="/ingredientes"
                                                className={`nav-link ${location.pathname === "/ingredientes" ? "active" : ""}`}
                                            >
                                                <i className="nav-icon bi bi-bag-check" />
                                                <p>Ingredientes</p>
                                            </Link>
                                        </li>
                                    )}
                                {isInventarios &&
                                    tieneModulo("Unidades de medida") && (
                                        <li className="nav-item">
                                            <Link
                                                to="/unidades-medida"
                                                className={`nav-link ${location.pathname === "/unidades-medida" ? "active" : ""}`}
                                            >
                                                <i className="nav-icon bi bi-window-sidebar" />
                                                <p>Unidades de medida</p>
                                            </Link>
                                        </li>
                                    )}
                                {isAuditor &&
                                    tieneModulo("Historial de ventas") && (
                                        <li className="nav-item">
                                            <Link
                                                to="/historial-ventas"
                                                className={`nav-link ${location.pathname === "/historial-ventas" ? "active" : ""}`}
                                            >
                                                <i className="nav-icon fas fa-list-alt" />
                                                <p>Historial de ventas</p>
                                            </Link>
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
                                            sidebarOpen={sidebarOpen}
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
                                                    to: `/${sub.ruta.replace(/\./g, "/")}`,
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
                                            sidebarOpen={sidebarOpen}
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
                                                    to: `/${sub.ruta.replace(/\./g, "/")}`,
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
                                            sidebarOpen={sidebarOpen}
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
                                                    to: `/${sub.ruta.replace(/\./g, "/")}`,
                                                    label: sub.nombre,
                                                    icon: icono,
                                                };
                                            })}
                                        />
                                    )}

                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className="nav-link w-full text-left"
                                        onClick={async () => {
                                            try {
                                                await axios.post("/api/logout");
                                                eliminaSucursal();
                                                window.location.href = "/login";
                                            } catch (error) {
                                                console.error("Error al cerrar sesión:", error);
                                            }
                                        }}
                                    >
                                        <i className="nav-icon fas fa-th" />
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </aside>
        </div>
    );
};

export default MenuVal;
