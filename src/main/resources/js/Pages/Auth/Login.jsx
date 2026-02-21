import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    console.log(data)

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
            <Head title="Iniciar Sesión" />

            {/* Left Side - Image/Branding */}
            <div className="hidden lg:flex w-1/2 bg-indigo-600 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10 text-white text-center px-12">
                    <h2 className="text-4xl font-bold mb-4">Bienvenido de nuevo</h2>
                    <p className="text-indigo-100 text-lg">Ingresa a tu panel de administración y gestiona tu empresa con eficiencia.</p>
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full opacity-10 blur-2xl"></div>
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full opacity-10 blur-3xl"></div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Iniciar Sesión</h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            ¿No tienes cuenta? {' '}
                            <Link
                                href="/register"
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                            >
                                Regístrate gratis
                            </Link>
                        </p>
                    </div>

                    {status && <div className="p-4 rounded-md bg-green-50 text-green-700 text-sm font-medium">{status}</div>}

                    <form onSubmit={submit} className="mt-8 space-y-6">
                        <div className="space-y-4">
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
                                        isFocused={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="ejemplo@empresa.com"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1" />
                            </div>

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
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="ms-2 text-sm text-slate-600 dark:text-slate-400">Recordarme</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>

                        <div>
                            <PrimaryButton
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-lg hover:-translate-y-0.5"
                                disabled={processing}
                            >
                                {processing ? (
                                    <><i className="fas fa-spinner fa-spin mr-2"></i> Procesando...</>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
