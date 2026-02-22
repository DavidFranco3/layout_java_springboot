import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
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
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#0f172a] selection:bg-indigo-500/30 selection:text-indigo-900 font-outfit relative overflow-hidden px-4">
            <Head title="Crear Cuenta | HidalQro" />

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
                .font-outfit { font-family: 'Outfit', sans-serif; }
            `}} />

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-xl relative z-10 py-12">
                {/* Branding / Logo centered */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <Link href="/" className="group flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
                            <i className="fas fa-cube text-white text-2xl"></i>
                        </div>
                        <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                            Hidal<span className="text-indigo-600 dark:text-indigo-400">Qro</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Únete a nosotros</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
                        Crea tu cuenta empresarial en pocos pasos.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-800">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Nombre */}
                        <div className="group">
                            <InputLabel htmlFor="name" value="Nombre Completo" className="font-bold text-slate-900 dark:text-slate-200 uppercase text-[10px] tracking-widest mb-1.5 ml-1" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none w-12 transition-transform group-focus-within:scale-110">
                                    <i className="fas fa-user-circle text-slate-400 dark:text-slate-600"></i>
                                </div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="pl-12 block w-full bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-opacity-50 text-slate-900 dark:text-white h-14 rounded-2xl font-semibold transition-all shadow-sm focus:shadow-indigo-500/10"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Nombre completo"
                                />
                            </div>
                            <InputError message={errors.name} className="mt-2 text-xs font-bold text-rose-500 ml-1 uppercase" />
                        </div>

                        {/* Email */}
                        <div className="group">
                            <InputLabel htmlFor="email" value="Correo electrónico" className="font-bold text-slate-900 dark:text-slate-200 uppercase text-[10px] tracking-widest mb-1.5 ml-1" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none w-12 transition-transform group-focus-within:scale-110">
                                    <i className="fas fa-envelope-open text-slate-400 dark:text-slate-600"></i>
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-12 block w-full bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-opacity-50 text-slate-900 dark:text-white h-14 rounded-2xl font-semibold transition-all shadow-sm focus:shadow-indigo-500/10"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    placeholder="email@ejemplo.com"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2 text-xs font-bold text-rose-500 ml-1 uppercase" />
                        </div>

                        {/* Password Grid */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="group">
                                <InputLabel htmlFor="password" value="Contraseña" className="font-bold text-slate-900 dark:text-slate-200 uppercase text-[10px] tracking-widest mb-1.5 ml-1" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none w-12 transition-transform group-focus-within:scale-110">
                                        <i className="fas fa-lock text-slate-400 dark:text-slate-600"></i>
                                    </div>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="pl-12 block w-full bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-opacity-50 text-slate-900 dark:text-white h-14 rounded-2xl font-semibold transition-all shadow-sm focus:shadow-indigo-500/10"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        placeholder="••••••••"
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-2 text-xs font-bold text-rose-500 ml-1 uppercase" />
                            </div>

                            <div className="group">
                                <InputLabel htmlFor="password_confirmation" value="Confirmar" className="font-bold text-slate-900 dark:text-slate-200 uppercase text-[10px] tracking-widest mb-1.5 ml-1" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none w-12 transition-transform group-focus-within:scale-110">
                                        <i className="fas fa-shield-check text-slate-400 dark:text-slate-600"></i>
                                    </div>
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="pl-12 block w-full bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-opacity-50 text-slate-900 dark:text-white h-14 rounded-2xl font-semibold transition-all shadow-sm focus:shadow-indigo-500/10"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                        placeholder="••••••••"
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-2 text-xs font-bold text-rose-500 ml-1 uppercase" />
                            </div>
                        </div>

                        <div className="pt-6">
                            <PrimaryButton
                                className="group relative w-full h-15 flex justify-center items-center rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white text-lg font-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-500/20 py-4 overflow-hidden disabled:opacity-50"
                                disabled={processing}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Creando...
                                        </>
                                    ) : (
                                        'Registrar mi Cuenta'
                                    )}
                                </span>
                            </PrimaryButton>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">
                            ¿Ya eres miembro?{' '}
                            <Link
                                href={route('login')}
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-all border-b-2 border-indigo-600/20 hover:border-indigo-600 ml-1"
                            >
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600 tracking-[0.2em]">
                        Join the Revolution &bull; HidalQro Platform
                    </p>
                </div>
            </div>
        </div>
    );
}
