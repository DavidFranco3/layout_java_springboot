import { Link, Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="Bienvenido | HidalQro" />
            <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-900 transition-colors duration-500">

                {/* Modern Fixed Navbar */}
                <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out px-4 py-4 sm:px-8 ${scrolled ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50 py-3 shadow-2xl shadow-indigo-500/10' : 'bg-transparent'}`}>
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40 group-hover:rotate-12 transition-transform duration-300">
                                <i className="fas fa-cube text-white text-xl"></i>
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                                Hidal<span className="text-indigo-600 dark:text-indigo-400">Qro</span>
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
                            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Características</a>
                            <a href="#security" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Seguridad</a>
                            <a href="#about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Nosotros</a>
                        </div>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="relative px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl"
                                >
                                    Ir al Panel
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="hidden sm:block text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm transition-colors"
                                    >
                                        Acceso
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        Comenzar Ahora
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section - The "Hook" */}
                <main className="relative pt-40 pb-20 overflow-hidden">
                    {/* Abstract Shapes Container */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[80%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full rotate-12"></div>
                        <div className="absolute top-[10%] -right-[10%] w-[50%] h-[70%] bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] rounded-full -rotate-12 outline-8"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-widest animate-bounce-slow">
                                <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                                La evolución del control empresarial
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05] text-slate-900 dark:text-white mb-8">
                                ERP Inteligente <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-black italic">
                                    Para Mentes Audaces.
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                                Automatiza, escala y domina cada proceso de tu negocio con una infraestructura diseñada para la excelencia operativa y la seguridad absoluta.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                                <Link href={route('register')} className="group flex items-center justify-between gap-12 w-full sm:w-auto px-8 py-5 rounded-3xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl hover:scale-105 transition-all duration-300 shadow-2xl">
                                    <span>Crear mi cuenta</span>
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white group-hover:translate-x-2 transition-transform">
                                        <i className="fas fa-arrow-right text-sm"></i>
                                    </div>
                                </Link>
                                <a href="#features" className="w-full sm:w-auto px-8 py-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 font-bold text-xl text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-3">
                                    Conocer más
                                    <i className="fas fa-chevron-down text-sm opacity-50"></i>
                                </a>
                            </div>
                        </div>

                        {/* Interactive Dashboard Mockup PREVIEW */}
                        <div className="mt-24 relative max-w-6xl mx-auto animate-float">
                            <div className="rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-indigo-500/20">
                                <div className="bg-slate-950/80 backdrop-blur-md p-4 flex items-center gap-2 border-b border-white/5">
                                    <div className="flex gap-1.5 mr-4">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                                    </div>
                                    <div className="h-6 w-full max-w-md rounded-lg bg-white/5 mx-auto"></div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-3xl aspect-[16/10] flex items-center justify-center">
                                    <div className="grid grid-cols-12 w-full h-full p-8 gap-6">
                                        <div className="col-span-3 space-y-4">
                                            <div className="h-12 w-full rounded-2xl bg-indigo-600/20"></div>
                                            <div className="h-4 w-3/4 rounded-full bg-white/10"></div>
                                            <div className="h-4 w-1/2 rounded-full bg-white/10"></div>
                                            <div className="h-4 w-2/3 rounded-full bg-white/10 pt-12"></div>
                                            <div className="h-4 w-full rounded-full bg-white/10"></div>
                                        </div>
                                        <div className="col-span-9 grid grid-cols-3 gap-6">
                                            {[1, 2, 3, 4, 5, 6].map(i => (
                                                <div key={i} className="h-40 rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col justify-end gap-3 hover:bg-white/10 transition-colors">
                                                    <div className="h-4 w-1/2 rounded-full bg-white/20"></div>
                                                    <div className="h-8 w-full rounded-xl bg-indigo-500/30"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <div className="absolute -bottom-10 -right-10 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 hidden lg:block animate-bounce-slow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                        <i className="fas fa-check-circle text-2xl"></i>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase">Eficiencia</div>
                                        <div className="text-2xl font-black text-slate-900 dark:text-white">+99.9%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Features Grid */}
                <section id="features" className="py-32 bg-white dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 items-end gap-12 mb-20">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black mb-6">
                                    Potenciado por tecnología <br />
                                    <span className="text-indigo-600 italic">de última generación.</span>
                                </h2>
                            </div>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl pb-2 border-l-4 border-indigo-600 pl-8 ml-auto">
                                No solo gestionamos datos; creamos una ventaja competitiva. Nuestra arquitectura garantiza velocidad, seguridad y una experiencia fluida.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon="fas fa-fingerprint"
                                title="Seguridad Militar"
                                desc="Protocolos de encriptación de extremo a extremo y auditoría activa bajo estándares globales."
                                gradient="from-indigo-600 to-indigo-800"
                            />
                            <FeatureCard
                                icon="fas fa-atom"
                                title="Infraestructura Ágil"
                                desc="Actualizaciones instantáneas y rendimiento optimizado. React e Inertia en el núcleo."
                                gradient="from-purple-600 to-indigo-600"
                            />
                            <FeatureCard
                                icon="fas fa-gem"
                                title="Fácil de Usar"
                                desc="Interfaz intuitiva que elimina la curva de aprendizaje, permitiéndote operar desde el minuto uno."
                                gradient="from-pink-600 to-purple-600"
                            />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-20 bg-slate-50 dark:bg-[#080c14] border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                    <i className="fas fa-cube text-sm"></i>
                                </div>
                                <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                                    Hidal<span className="text-indigo-600">Qro</span>
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
                                Transformando el panorama digital para las empresas líderes que se atreven a innovar.
                            </p>
                            <div className="flex gap-4">
                                <SocialLink icon="fab fa-instagram" />
                                <SocialLink icon="fab fa-linkedin-in" />
                                <SocialLink icon="fab fa-x-twitter" />
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Compañía</h4>
                            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Sobre Nosotros</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Carreras</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacidad</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Recursos</h4>
                            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Documentación</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Soporte 24/7</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">API Status</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col md:row justify-between items-center gap-4">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            &copy; {new Date().getFullYear()} HidalQro S.A. de C.V.
                        </div>
                        <div className="text-slate-400 text-[10px]">
                            Optimizado para v{laravelVersion} (PHP v{phpVersion})
                        </div>
                    </div>
                </footer>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
                
                body {
                    font-family: 'Outfit', sans-serif;
                }

                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }

                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(1deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }

                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
                    50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 4s infinite;
                }
            `}} />
        </>
    );
}

function FeatureCard({ icon, title, desc, gradient }) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-2xl transition-all duration-500 group">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${gradient} flex items-center justify-center text-white text-3xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform mb-8`}>
                <i className={icon}></i>
            </div>
            <h3 className="text-2xl font-black mb-4 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {desc}
            </p>
        </div>
    );
}

function SocialLink({ icon }) {
    return (
        <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1">
            <i className={icon}></i>
        </a>
    );
}

