import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages - Lazy Loaded
const Welcome = lazy(() => import('./Pages/Welcome'));
const Login = lazy(() => import('./Pages/Auth/Login'));
const Register = lazy(() => import('./Pages/Auth/Register'));
const Dashboard = lazy(() => import('./Pages/Dashboard'));

// Clientes
const ClientesIndex = lazy(() => import('./Pages/Clientes/Index'));
const ClientesForm = lazy(() => import('./Pages/Clientes/Form'));

// Roles
const RolesIndex = lazy(() => import('./Pages/Roles/Index'));

// Users
const UsersIndex = lazy(() => import('./Pages/Users/Index'));
const UsersCreate = lazy(() => import('./Pages/Users/Create'));

// Empresas
const EmpresasIndex = lazy(() => import('./Pages/Empresas/Index'));
const EmpresasForm = lazy(() => import('./Pages/Empresas/Form'));

// Auditoria
const AuditoriaIndex = lazy(() => import('./Pages/AuditoriaLogs/Index'));

// Configuracion
const ConfiguracionsIndex = lazy(() => import('./Pages/Configuracions/Index'));
const ConfiguracionsForm = lazy(() => import('./Pages/Configuracions/Form'));

// Loading Fallback Component
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center p-8 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-600 border-indigo-200 dark:border-t-indigo-400 dark:border-indigo-900 mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">Cargando...</p>
        </div>
    </div>
);

export default function AppRouter() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Welcome springBootVersion="3.4.1" javaVersion="21" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes (Authenticated) */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Clientes */}
                <Route path="/clientes" element={<ClientesIndex />} />
                <Route path="/clientes/create" element={<ClientesForm mode="create" />} />
                <Route path="/clientes/:id/edit" element={<ClientesForm mode="update" />} />

                {/* Roles */}
                <Route path="/roles" element={<RolesIndex />} />

                {/* Users */}
                <Route path="/users" element={<UsersIndex />} />
                <Route path="/users/create" element={<UsersCreate />} />

                {/* Empresas */}
                <Route path="/empresas" element={<EmpresasIndex />} />
                <Route path="/empresas/create" element={<EmpresasForm mode="create" />} />
                <Route path="/empresas/:id/edit" element={<EmpresasForm mode="update" />} />

                {/* Auditoria */}
                <Route path="/auditoria" element={<AuditoriaIndex />} />

                {/* Configuracion */}
                <Route path="/configuracion" element={<ConfiguracionsIndex />} />
                <Route path="/configuracion/create" element={<ConfiguracionsForm mode="create" />} />
                <Route path="/configuracion/:id/edit" element={<ConfiguracionsForm mode="update" />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}
