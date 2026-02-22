import Authenticated from "@/Layouts/AuthenticatedLayout";
import React from "react";
import useAuth from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUsers, faBuilding, faCheckCircle, faChartLine,
    faArrowUp, faBriefcase, faEllipsisH, faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-[var(--card-bg)] p-6 rounded-[2.5rem] shadow-premium border border-[var(--border-light)] hover:shadow-premium-lg transition-all duration-300 group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform duration-500">
            <FontAwesomeIcon icon={icon} size="6x" />
        </div>
        <div className="flex items-start justify-between relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg`} style={{ backgroundColor: color }}>
                <FontAwesomeIcon icon={icon} className="text-xl" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-500'}`}>
                    <FontAwesomeIcon icon={faArrowUp} className={trend < 0 ? 'rotate-180' : ''} />
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div className="mt-5 relative z-10">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-1">{title}</p>
            <h4 className="text-3xl font-black text-slate-800 dark:text-white leading-none">{value}</h4>
        </div>
    </div>
);

export default function Dashboard(props) {
    const { auth, errors } = props;
    const { user } = useAuth();

    const chartData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Crecimiento del Sistema',
                data: [65, 59, 80, 81, 56, 95],
                fill: true,
                borderColor: 'var(--app-primary)',
                backgroundColor: 'rgba(var(--app-primary-rgb, 0, 80, 115), 0.1)',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#fff',
                pointBorderColor: 'var(--app-primary)',
                pointBorderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                titleFont: { size: 12 },
                bodyFont: { size: 14, weight: 'bold' },
                padding: 12,
                cornerRadius: 12,
                displayColors: false
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { size: 11 } }
            },
            y: {
                grid: { color: 'rgba(148, 163, 184, 0.1)', borderDash: [5, 5] },
                ticks: { color: '#94a3b8', font: { size: 11 } }
            }
        },
    };

    return (
        <Authenticated auth={auth} errors={errors}>
            <div className="space-y-8 pb-12">

                {/* Header Section / Welcome Banner */}
                <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl border border-white/5">
                    {/* Abstract Decorations */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                Sistema Activo
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black leading-tight">
                                Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-400">{user?.name}</span> 👋
                            </h1>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                Bienvenido de nuevo a tu panel de control. El sistema está funcionando correctamente y tienes <span className="text-white font-bold">12 nuevas notificaciones</span> pendientes de revisión.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-lg active:scale-95">
                                    Ver Reportes
                                </button>
                                <button className="px-6 py-3 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/10 backdrop-blur-md active:scale-95">
                                    Configuraciones
                                </button>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-6">
                            <div className="bg-white/5 p-6 rounded-3xl backdrop-blur-sm border border-white/10 text-center space-y-2 min-w-[140px]">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actividad</p>
                                <p className="text-3xl font-black">+240%</p>
                            </div>
                            <div className="bg-primary/20 p-6 rounded-3xl backdrop-blur-sm border border-primary/20 text-center space-y-2 min-w-[140px]">
                                <p className="text-[10px] font-bold text-primary-soft uppercase tracking-widest uppercase">Empresas</p>
                                <p className="text-3xl font-black">{props.empresas_count || 42}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid de Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Clientes"
                        value="1,284"
                        icon={faUsers}
                        color="#3b82f6"
                        trend={12.5}
                    />
                    <StatCard
                        title="Empresas Vinculadas"
                        value="42"
                        icon={faBuilding}
                        color="#10b981"
                        trend={4.2}
                    />
                    <StatCard
                        title="Proyectos Activos"
                        value="156"
                        icon={faBriefcase}
                        color="#8b5cf6"
                        trend={-2.1}
                    />
                    <StatCard
                        title="Tasa de Éxito"
                        value="98.2%"
                        icon={faCheckCircle}
                        color="#f59e0b"
                    />
                </div>

                {/* Sección Inferior: Reporte Gráfico y Actividad */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Gráfica de Crecimiento */}
                    <div className="lg:col-span-2 bg-[var(--card-bg)] p-8 rounded-[2.5rem] shadow-premium border border-[var(--border-light)] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white">Rendimiento Mensual</h3>
                                <p className="text-sm text-slate-500">Visualización de crecimiento en los últimos 6 meses</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors">
                                    <FontAwesomeIcon icon={faEllipsisH} />
                                </button>
                            </div>
                        </div>
                        <div className="h-[300px] w-full mt-auto">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    {/* Próximos Eventos / Actividad */}
                    <div className="bg-[var(--card-bg)] p-8 rounded-[2.5rem] shadow-premium border border-[var(--border-light)]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white">Próximos Pasos</h3>
                        </div>

                        <div className="space-y-6">
                            {[
                                { date: 'Hoy, 10:00 AM', text: 'Reunión de alineación con Directores', status: 'priority' },
                                { date: 'Mañana, 09:00 AM', text: 'Sincronización de Base de Datos', status: 'normal' },
                                { date: 'Lunes, 12:00 PM', text: 'Revisión de Reportes Mensuales', status: 'normal' },
                                { date: 'Martes, 03:00 PM', text: 'Auditoría de Seguridad Trimestral', status: 'urgent' },
                            ].map((item, id) => (
                                <div key={id} className="group cursor-pointer">
                                    <div className="flex gap-4">
                                        <div className="relative">
                                            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-primary transition-colors z-10 relative mt-1.5" />
                                            {id !== 3 && <div className="absolute top-4 left-[3px] w-[2px] h-full bg-slate-100 dark:bg-slate-800" />}
                                        </div>
                                        <div className="space-y-1 -mt-1">
                                            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{item.date}</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors leading-snug">{item.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-8 py-4 bg-slate-100 dark:bg-slate-800/50 hover:bg-primary/10 hover:text-primary text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest rounded-2xl transition-all border border-transparent hover:border-primary/20">
                            Ver Agenda Completa
                        </button>
                    </div>

                </div>

            </div>
        </Authenticated>
    );
}
