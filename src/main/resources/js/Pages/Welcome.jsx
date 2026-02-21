import { Link, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [scrolled, setScrolled] = useState(false);

    // Efecto de navbar al hacer scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="Bienvenido" />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">

                {/* Navbar */}
                <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
                    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                        <div className="text-2xl font-bold tracking-tighter text-indigo-600 dark:text-indigo-400">
                            HIDALQRO<span className="text-slate-700 dark:text-slate-300">.APP</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-lg hover:shadow-indigo-500/30"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="hidden sm:block text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-lg hover:shadow-indigo-500/30"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    {/* Background Blobs */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none opacity-40 dark:opacity-20">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 animate-fadeInUp">
                            Gestión Empresarial <br className="hidden md:block" /> Sin Límites.
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto animate-fadeInUp animation-delay-500">
                            Una plataforma robusta, segura y escalable diseñada para potenciar tu productividad.
                            Roles, auditoría y análisis en un solo lugar.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp animation-delay-700">
                            <Link href={route('register')} className="px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                                <i className="fas fa-rocket"></i> Empezar Gratis
                            </Link>
                            <a href="#features" className="px-8 py-4 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-lg transition-colors flex items-center justify-center gap-2">
                                <i className="fas fa-search"></i> Explorar
                            </a>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section id="features" className="py-20 bg-white dark:bg-slate-800/50 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Todo lo que necesitas</h2>
                            <p className="text-slate-500 dark:text-slate-400">Herramientas poderosas integradas desde el primer día.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon="fas fa-shield-alt"
                                title="Seguridad Avanzada"
                                desc="Roles y permisos granulares. Auditoría completa de cada acción que ocurre en el sistema."
                                color="text-emerald-500"
                            />
                            <FeatureCard
                                icon="fas fa-bolt"
                                title="Alto Rendimiento"
                                desc="Construido con React y Laravel para una experiencia de usuario instantánea y fluida."
                                color="text-amber-500"
                            />
                            <FeatureCard
                                icon="fas fa-chart-line"
                                title="Análisis en Tiempo Real"
                                desc="Dashboards interactivos y reportes exportables para tomar decisiones basadas en datos."
                                color="text-blue-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-10 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-slate-500 text-sm">
                            &copy; {new Date().getFullYear()} HidalQro S.A. de C.V. Todos los derechos reservados.
                        </div>
                        <div className="flex gap-6 text-slate-400">
                            <a href="#" className="hover:text-indigo-500 transition-colors"><i className="fab fa-twitter text-xl"></i></a>
                            <a href="#" className="hover:text-indigo-500 transition-colors"><i className="fab fa-github text-xl"></i></a>
                            <a href="#" className="hover:text-indigo-500 transition-colors"><i className="fab fa-linkedin text-xl"></i></a>
                        </div>
                        <div className="text-slate-500 text-xs">
                            Laravel v{laravelVersion} (PHP v{phpVersion})
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function FeatureCard({ icon, title, desc, color }) {
    return (
        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-500/50 hover:shadow-xl transition-all duration-300 group">
            <div className={`w-14 h-14 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-2xl shadow-sm mb-6 group-hover:scale-110 transition-transform ${color}`}>
                <i className={icon}></i>
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {desc}
            </p>
        </div>
    );
}
