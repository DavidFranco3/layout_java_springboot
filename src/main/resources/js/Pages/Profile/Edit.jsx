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
                    <div className="max-w-5xl mx-auto py-4">
                        <div className="grid grid-cols-1 gap-8">
                            <div className="p-6 sm:p-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-3xl border border-white dark:border-slate-700 transition-all duration-300">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </div>

                            <div className="p-6 sm:p-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-3xl border border-white dark:border-slate-700 transition-all duration-300">
                                <UpdatePasswordForm />
                            </div>

                            <div className="p-6 sm:p-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl shadow-red-200/20 dark:shadow-none sm:rounded-3xl border border-white dark:border-slate-700 transition-all duration-300">
                                <DeleteUserForm />
                            </div>
                        </div>
                    </div>
                </ContainerLaravel>
            </div>
        </Authenticated>
    );
}


