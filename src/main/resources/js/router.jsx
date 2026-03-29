import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Welcome from './Pages/Welcome';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Dashboard from './Pages/Dashboard';

// Clientes
import ClientesIndex from './Pages/Clientes/Index';
import ClientesForm from './Pages/Clientes/Form';

// Roles
import RolesIndex from './Pages/Roles/Index';

// Users
import UsersIndex from './Pages/Users/Index';
import UsersCreate from './Pages/Users/Create';

// Profile
import ProfileEdit from './Pages/Profile/Edit';

// Empresas
import EmpresasIndex from './Pages/Empresas/Index';
import EmpresasForm from './Pages/Empresas/Form';

// Auditoria
import AuditoriaIndex from './Pages/AuditoriaLogs/Index';

// Configuracion
import ConfiguracionsIndex from './Pages/Configuracions/Index';
import ConfiguracionsForm from './Pages/Configuracions/Form';

// Layouts - We might need to refactor these to be used as Wrapper components
import AuthenticatedLayout from './Layouts/AuthenticatedLayout';
import GuestLayout from './Layouts/GuestLayout';

export default function AppRouter() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Welcome />} />
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

            {/* Profile */}
            <Route path="/profile/edit" element={<ProfileEdit />} />

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
    );
}
