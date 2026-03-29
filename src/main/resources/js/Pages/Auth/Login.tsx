import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

interface LoginFormValues {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [serverErrors, setServerErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({});

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        defaultValues: { email: '', password: '', remember: false },
    });

    useEffect(() => {
        document.title = "Acceso | HidalQro";
    }, []);

    const onSubmit = async (data) => {
        setProcessing(true);
        setServerErrors({});

        try {
            const res = await axios.post('/login', data);
            if (res.status === 200) {
                window.location.href = '/dashboard';
            }
        } catch (err) {
            if (err.response?.data?.errors) {
                setServerErrors(err.response.data.errors);
            } else if (err.response?.data?.message) {
                setServerErrors({ email: err.response.data.message });
            } else {
                setServerErrors({ email: "Error al iniciar sesión. Intenta de nuevo." });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#0f172a] selection:bg-indigo-500/30 selection:text-indigo-900 font-outfit relative overflow-hidden px-4">


            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Branding / Logo centered */}
                <div className="flex flex-col items-center mb-10">
                    <Link to="/" className="group flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 group-hover:rotate-12 transition-transform duration-300">
                            <i className="fas fa-cube text-white text-2xl"></i>
                        </div>
                        <span className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                            Hidal<span className="text-indigo-600 dark:text-indigo-400">Qro</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white text-center">¡Bienvenido!</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-center mt-2">
                        Ingresa a tu cuenta para continuar
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-800">
                    {status && (
                        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-sm font-bold flex items-center gap-3">
                            <i className="fas fa-check-circle"></i> {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="email" value="Correo electrónico" className="font-bold text-slate-900 dark:text-slate-200 uppercase text-[10px] tracking-widest mb-1.5 ml-1" />
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none w-12 transition-transform group-focus-within:scale-110">
                                    <i className="fas fa-at text-slate-400 dark:text-slate-600"></i>
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="pl-12 block w-full bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-opacity-50 text-slate-900 dark:text-white h-14 rounded-2xl font-semibold transition-all shadow-sm focus:shadow-indigo-500/10 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                    autoComplete="username"
                                    isFocused={true}
                                    placeholder="admin@hidalqro.com"
                                    isError={!!errors.email || !!serverErrors.email}
                                    {...register("email", {
                                        required: "El correo es requerido",
                                        pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" },
                                    })}
                                />
                            </div>
                            <InputError message={errors.email?.message || serverErrors.email} className="mt-2 text-xs font-bold text-rose-500 ml-1 uppercase" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <InputLabel htmlFor="password" value="Contraseña" className="font-bold text-slate-900 dark:text-slate-200 uppercase text-[10px] tracking-widest" />
                                {canResetPassword && (
                                    <Link
                                        to="/password/request"
                                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none w-12 transition-transform group-focus-within:scale-110">
                                    <i className="fas fa-key text-slate-400 dark:text-slate-600"></i>
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    className="pl-12 block w-full bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-opacity-50 text-slate-900 dark:text-white h-14 rounded-2xl font-semibold transition-all shadow-sm focus:shadow-indigo-500/10 placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    isError={!!errors.password || !!serverErrors.password}
                                    {...register("password", { required: "La contraseña es requerida" })}
                                />
                            </div>
                            <InputError message={errors.password?.message || serverErrors.password} className="mt-2 text-xs font-bold text-rose-500 ml-1 uppercase" />
                        </div>

                        <div className="flex items-center">
                            <label className="flex items-center group cursor-pointer">
                                <Checkbox
                                    name="remember"
                                    className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900"
                                    {...register("remember")}
                                />
                                <span className="ml-3 text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors tracking-tight">Mantener sesión activa</span>
                            </label>
                        </div>

                        <div className="pt-4">
                            <PrimaryButton
                                className="group relative w-full h-14 flex justify-center items-center rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white text-lg font-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-500/20 disabled:opacity-50 overflow-hidden"
                                disabled={processing}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Sincronizando...
                                        </>
                                    ) : (
                                        'Entrar al Sistema'
                                    )}
                                </span>
                            </PrimaryButton>
                        </div>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">
                            ¿No tienes acceso?{' '}
                            <Link
                                to="/register"
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-all border-b-2 border-indigo-600/20 hover:border-indigo-600 ml-1"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600 tracking-[0.2em]">
                        HidalQro Security &bull; Protocol v3.4.1
                    </p>
                </div>
            </div>
        </div>
    );
}
