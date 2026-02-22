import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={`${className} relative overflow-hidden`}>
            <header className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-xl">
                    <i className="fas fa-id-card text-2xl text-indigo-600 dark:text-indigo-400"></i>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Información del Perfil</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Actualiza la información de tu cuenta y dirección de correo electrónico.
                    </p>
                </div>
            </header>

            <form onSubmit={submit} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 gap-6">
                    <div className="group transition-all duration-200">
                        <InputLabel htmlFor="name" value="Nombre Completo" className="text-gray-700 dark:text-gray-300 font-semibold mb-2" />
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                <i className="fas fa-user-circle text-lg"></i>
                            </span>
                            <TextInput
                                id="name"
                                className="block w-full pl-12 py-4 text-lg border-gray-200 dark:border-slate-700 dark:bg-slate-900/50 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 rounded-2xl transition-all shadow-sm"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                isFocused
                                autoComplete="name"
                                placeholder="Tu nombre"
                            />
                        </div>
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="group transition-all duration-200">
                        <InputLabel htmlFor="email" value="Correo Electrónico" className="text-gray-700 dark:text-gray-300 font-semibold mb-2" />
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                <i className="fas fa-envelope text-lg"></i>
                            </span>
                            <TextInput
                                id="email"
                                type="email"
                                className="block w-full pl-12 py-4 text-lg border-gray-200 dark:border-slate-700 dark:bg-slate-900/50 backdrop-blur-sm focus:border-indigo-500 focus:ring-indigo-500 rounded-2xl transition-all shadow-sm"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                        <InputError className="mt-2" message={errors.email} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                        <p className="text-sm text-amber-800 dark:text-amber-400 flex items-center gap-2">
                            <i className="fas fa-exclamation-circle text-lg"></i>
                            Tu dirección de correo no está verificada.
                        </p>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="mt-2 text-sm text-amber-900 dark:text-amber-300 underline font-medium hover:text-amber-700 dark:hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
                        >
                            Haz clic aquí para reenviar el correo de verificación.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                                Un nuevo enlace de verificación ha sido enviado a tu correo.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <PrimaryButton
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-lg shadow-indigo-500/25 px-8 py-2.5 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        {processing ? <i className="fas fa-circle-notch fa-spin me-2"></i> : <i className="fas fa-save me-2"></i>}
                        Guardar Cambios
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-x-4"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in duration-300"
                        leaveTo="opacity-0 -translate-x-4"
                    >
                        <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                            <i className="fas fa-check-circle"></i>
                            Guardado.
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

