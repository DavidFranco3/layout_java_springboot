import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox'; // Si se usa en futuro
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
            <Head title="Registrarse" />

            {/* Left Side - Image/Branding (Orden inverso en móvil para que form salga primero o branding arriba, 
               aquí mantengo branding izquierda pero oculto en móvil) */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-indigo-800 to-purple-900"></div>
                <div className="relative z-10 text-white text-center px-12">
                    <h2 className="text-4xl font-bold mb-4">Únete a nosotros</h2>
                    <p className="text-slate-300 text-lg">Crea tu cuenta hoy y comienza a disfrutar de todos los beneficios de nuestra plataforma.</p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Crear Cuenta</h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            ¿Ya tienes cuenta? {' '}
                            <Link
                                href={route('login')}
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            {/* Nombre */}
                            <div>
                                <InputLabel htmlFor="name" value="Nombre Completo" className="text-slate-700 dark:text-slate-300" />
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-user text-slate-400"></i>
                                    </div>
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="pl-10 block w-full border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg py-2.5"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel htmlFor="email" value="Correo Electrónico" className="text-slate-700 dark:text-slate-300" />
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-envelope text-slate-400"></i>
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="pl-10 block w-full border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg py-2.5"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        placeholder="ejemplo@correo.com"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Password */}
                            <div>
                                <InputLabel htmlFor="password" value="Contraseña" className="text-slate-700 dark:text-slate-300" />
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-lock text-slate-400"></i>
                                    </div>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="pl-10 block w-full border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg py-2.5"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        placeholder="••••••••"
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" className="text-slate-700 dark:text-slate-300" />
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-lock text-slate-400"></i>
                                    </div>
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="pl-10 block w-full border-slate-300 dark:border-slate-700 dark:bg-slate-800 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg py-2.5"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        placeholder="••••••••"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>
                        </div>

                        <div>
                            <PrimaryButton
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-lg hover:-translate-y-0.5"
                                disabled={processing}
                            >
                                {processing ? (
                                    <><i className="fas fa-spinner fa-spin mr-2"></i> Creando cuenta...</>
                                ) : (
                                    'Registrarse'
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
