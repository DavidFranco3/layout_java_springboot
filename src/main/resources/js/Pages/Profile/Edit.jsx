import Authenticated from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import ContainerLaravel from "@/Components/Generales/ContainerLaravel";

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <Authenticated
            auth={auth}
            user={auth.user}
        >

            <div className="relative">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl invisible md:visible"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl invisible md:visible"></div>

                <ContainerLaravel titulo={"Perfil de Usuario"} icono={"fa-user-cog"}>
                    <div className="max-w-7xl mx-auto py-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Información de Perfil */}
                            <div className="p-6 sm:p-10 bg-[var(--card-bg)] backdrop-blur-xl shadow-premium sm:rounded-[2.5rem] border border-[var(--border-light)] transition-all duration-300">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </div>

                            {/* Cambio de Contraseña */}
                            <div className="p-6 sm:p-10 bg-[var(--card-bg)] backdrop-blur-xl shadow-premium sm:rounded-[2.5rem] border border-[var(--border-light)] transition-all duration-300">
                                <UpdatePasswordForm />
                            </div>

                            {/* Peligro: Eliminar Cuenta (Ancho Completo abajo) */}
                            <div className="lg:col-span-2 p-6 sm:p-10 bg-rose-50/50 dark:bg-rose-900/5 backdrop-blur-xl shadow-premium sm:rounded-[2.5rem] border border-rose-100 dark:border-rose-900/20 transition-all duration-300">
                                <DeleteUserForm className="max-w-xl" />
                            </div>
                        </div>
                    </div>
                </ContainerLaravel>
            </div>
        </Authenticated>
    );
}


