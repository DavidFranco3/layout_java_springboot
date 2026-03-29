import React, { useEffect, useState } from "react";
import ContainerApp from "@/Components/Generales/ContainerApp";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import Create from "./Create";
import ModalCustom from "@/Components/Generales/ModalCustom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import TblRoles from "./TblRoles";
import useAuth from "@/hooks/useAuth";

const Index = () => {
    const { user } = useAuth();
    const [roles, setRoles] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [permisos, setPermisos] = useState([]);
    const [modulos, setModulos] = useState([]);
    const [loading, setLoading] = useState(true);

    const abrirModal = () => setModalOpen(true);
    const cerrarModal = () => setModalOpen(false);

    const fetchRoles = async () => {
        try {
            const response = await axios.get("/api/roles");
            setRoles(response.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const getPermisos = async () => {
        try {
            const response = await axios.get("/api/roles/getPermisos");
            setPermisos(response.data.data);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    };

    const getModulos = async () => {
        try {
            const response = await axios.get("/api/roles/getModulos");
            setModulos(response.data.data);
        } catch (error) {
            console.error("Error fetching modules:", error);
            setModulos([]);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchRoles(), getPermisos(), getModulos()]);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div>Cargando...</div>;

    return (
        <Authenticated user={user}>
            <ContainerApp
                titulo="Control de Roles y Accesos"
                icono={faShieldAlt}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-[var(--border-light)] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                            <FontAwesomeIcon icon={faShieldAlt} className="text-xl" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Jerarquía de Permisos</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Define los niveles de seguridad y el alcance de las acciones permitidas para cada perfil organizacional.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={abrirModal}
                        className="group relative overflow-hidden p-6 rounded-3xl border border-dashed border-primary/30 bg-transparent hover:bg-primary/5 transition-all duration-500 flex flex-col items-center justify-center gap-3 text-center cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/10 active:scale-95"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                            <FontAwesomeIcon icon={faPlus} className="text-xl" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-black uppercase tracking-widest text-primary">
                                Crear Nuevo Rol
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                                Configurar nivel de acceso
                            </p>
                        </div>
                    </button>
                </div>

                <div className="mt-4">
                    <TblRoles roles={roles} onRefresh={fetchRoles} permisos={permisos} modulos={modulos} />
                </div>

                <ModalCustom
                    show={modalOpen}
                    onClose={() => setModalOpen(false)}
                    maxWidth="xl"
                >
                    <ModalCustom.Header onClose={() => setModalOpen(false)} closeButton>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <FontAwesomeIcon icon={faShieldAlt} />
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white">Registrar Nuevo Rol</span>
                        </div>
                    </ModalCustom.Header>
                    <ModalCustom.Body>
                        <Create cerrarModal={cerrarModal} permisos={permisos} modulos={modulos} onRefresh={fetchRoles} />
                    </ModalCustom.Body>
                </ModalCustom>
            </ContainerApp>
        </Authenticated>
    );
};

export default Index;