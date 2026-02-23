import React, { useEffect, useState } from "react";
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import Create from "./Create";
import ModalCustom from "@/Components/Generales/ModalCustom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUsers, faUserShield, faExclamationTriangle, faEyeSlash, faLock, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import TblUsers from "./TblUsers";
import useAuth from "@/hooks/useAuth";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

const Index = (props) => {
    const { auth, errors, users } = props;
    const { user, rolNombre, hasModuleAccess, hasPermission } = useAuth();

    const [modalOpen, setModalOpen] = useState(false);
    const [roles, setRoles] = useState([]);

    if (!hasModuleAccess('Users')) {
        return (
            <Authenticated auth={auth} errors={errors}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="max-w-md w-full bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 p-8 rounded-2xl text-center shadow-xl">
                        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-500 mx-auto mb-4">
                            <FontAwesomeIcon icon={faExclamationTriangle} size="xl" />
                        </div>
                        <h2 className="text-xl font-bold text-rose-800 dark:text-rose-400 mb-2">Acceso Denegado</h2>
                        <p className="text-rose-600/80 dark:text-rose-500/80 text-sm mb-6">
                            No tienes los privilegios necesarios para acceder al módulo de gestión de usuarios.
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-200/50 dark:bg-rose-900/50 rounded-full text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                            <FontAwesomeIcon icon={faUserShield} />
                            <span>Tu Rol: {rolNombre || 'Sin asignar'}</span>
                        </div>
                    </div>
                </div>
            </Authenticated>
        );
    }

    if (!hasPermission('ver users')) {
        return (
            <Authenticated auth={auth} errors={errors}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="max-w-md w-full bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-8 rounded-2xl text-center shadow-xl">
                        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-500 mx-auto mb-4">
                            <FontAwesomeIcon icon={faEyeSlash} size="xl" />
                        </div>
                        <h2 className="text-xl font-bold text-amber-800 dark:text-amber-400 mb-2">Sin Permisos de Lectura</h2>
                        <p className="text-amber-600/80 dark:text-amber-500/80 text-sm mb-6">
                            No tienes permiso para visualizar el listado de usuarios del sistema.
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-200/50 dark:bg-amber-900/50 rounded-full text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                            <FontAwesomeIcon icon={faUserShield} />
                            <span>Tu Rol: {rolNombre || 'Sin asignar'}</span>
                        </div>
                    </div>
                </div>
            </Authenticated>
        );
    }

    const abrirModal = () => setModalOpen(true);
    const cerrarModal = () => setModalOpen(false);

    const getRoles = async () => {
        try {
            const response = await axios.get(route('roles.getRoles'));
            setRoles(response.data.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }

    useEffect(() => {
        getRoles();
    }, []);

    return (
        <Authenticated auth={auth} errors={errors}>
            <ContainerLaravel
                titulo="Gestión de Usuarios"
                icono={faUsers}
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Bento Block: Info */}
                    <div className="lg:col-span-2 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border border-[var(--border-light)] flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                            <FontAwesomeIcon icon={faUserShield} className="text-xl" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Seguridad de Acceso</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Administra las credenciales y el nivel de acceso para cada colaborador de la plataforma.
                            </p>
                        </div>
                    </div>

                    {/* Bento Block: Action */}
                    <button
                        onClick={hasPermission('crear users') ? abrirModal : null}
                        disabled={!hasPermission('crear users')}
                        className={`group relative overflow-hidden p-6 rounded-3xl border transition-all duration-500 flex flex-col items-center justify-center gap-3 text-center ${hasPermission('crear users')
                            ? 'bg-transparent border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 shadow-sm hover:shadow-xl hover:shadow-primary/10 cursor-pointer active:scale-95'
                            : 'bg-slate-100/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${hasPermission('crear users')
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                            }`}>
                            <FontAwesomeIcon icon={hasPermission('crear users') ? faPlus : faLock} className="text-xl" />
                        </div>
                        <div className="space-y-1">
                            <p className={`text-sm font-black uppercase tracking-widest ${hasPermission('crear users') ? 'text-primary' : 'text-slate-400'}`}>
                                {hasPermission('crear users') ? 'Nuevo Usuario' : 'Bloqueado'}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                                {hasPermission('crear users') ? 'Registrar colaborador' : 'Sin permisos'}
                            </p>
                        </div>
                    </button>
                </div>

                <div className="mt-4">
                    <TblUsers
                        users={users}
                        roles={roles}
                        permisos={{
                            editar: hasPermission('editar users'),
                            eliminar: hasPermission('eliminar users')
                        }}
                    />
                </div>

                {hasPermission('crear users') && (
                    <ModalCustom
                        show={modalOpen}
                        onClose={() => setModalOpen(false)}
                        maxWidth="md"
                    >
                        <ModalCustom.Header onClose={() => setModalOpen(false)} closeButton>
                            <div className="flex items-center gap-3 font-bold text-slate-900 dark:text-white">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <FontAwesomeIcon icon={faUserPlus} />
                                </div>
                                <span>Registrar Nuevo Usuario</span>
                            </div>
                        </ModalCustom.Header>
                        <ModalCustom.Body>
                            <Create cerrarModal={cerrarModal} roles={roles} />
                        </ModalCustom.Body>
                    </ModalCustom>
                )}
            </ContainerLaravel>
        </Authenticated>
    );
};

export default Index;
