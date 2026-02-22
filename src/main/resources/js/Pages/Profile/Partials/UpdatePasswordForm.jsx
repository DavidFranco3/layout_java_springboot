import { useRef } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-xl">
                    <i className="fas fa-lock text-2xl text-emerald-600 dark:text-emerald-400"></i>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Actualizar Contraseña</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Asegúrate de que tu cuenta esté usando una contraseña larga y aleatoria para mantenerla segura.
                    </p>
                </div>
            </header>

            <form onSubmit={updatePassword} className="space-y-6 max-w-2xl">
                <div className="group transition-all duration-200">
                    <InputLabel htmlFor="current_password" value="Contraseña Actual" className="text-gray-700 dark:text-gray-300 font-semibold mb-2" />
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                            <i className="fas fa-key text-lg"></i>
                        </span>
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className="block w-full pl-12 py-4 text-lg border-gray-200 dark:border-slate-700 dark:bg-slate-900/50 backdrop-blur-sm focus:border-emerald-500 focus:ring-emerald-500 rounded-2xl transition-all shadow-sm"
                            autoComplete="current-password"
                            placeholder="••••••••"
                        />
                    </div>
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div className="group transition-all duration-200">
                    <InputLabel htmlFor="password" value="Nueva Contraseña" className="text-gray-700 dark:text-gray-300 font-semibold mb-2" />
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                            <i className="fas fa-shield-alt text-lg"></i>
                        </span>
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="block w-full pl-12 py-4 text-lg border-gray-200 dark:border-slate-700 dark:bg-slate-900/50 backdrop-blur-sm focus:border-emerald-500 focus:ring-emerald-500 rounded-2xl transition-all shadow-sm"
                            autoComplete="new-password"
                            placeholder="Nueva contraseña"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="group transition-all duration-200">
                    <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" className="text-gray-700 dark:text-gray-300 font-semibold mb-2" />
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                            <i className="fas fa-check-double text-lg"></i>
                        </span>
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                            className="block w-full pl-12 py-4 text-lg border-gray-200 dark:border-slate-700 dark:bg-slate-900/50 backdrop-blur-sm focus:border-emerald-500 focus:ring-emerald-500 rounded-2xl transition-all shadow-sm"
                            autoComplete="new-password"
                            placeholder="Confirmar contraseña"
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <PrimaryButton
                        disabled={processing}
                        className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-lg shadow-emerald-500/25 px-8 py-2.5 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        {processing ? <i className="fas fa-circle-notch fa-spin me-2"></i> : <i className="fas fa-save me-2"></i>}
                        Actualizar Contraseña
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
                            Actualizado correctamente.
                        </div>
                    </Transition>
                </div>
            </form>
        </section>
    );
}

