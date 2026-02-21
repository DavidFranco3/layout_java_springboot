// Ejemplo avanzado de manejo de permisos en componentes

import React from 'react';
import { usePage } from '@inertiajs/react';
import { useAuthUser } from './EjemploUsoRolUsuario';

/**
 * Componente que valida permisos antes de renderizar contenido
 */
const PermissionGuard = ({ permission, permissions, module, children, fallback = null }) => {
    const { hasPermission, hasAnyPermission, hasModuleAccess } = useAuthUser();

    // Verificar permiso único
    if (permission && !hasPermission(permission)) {
        return fallback;
    }

    // Verificar múltiples permisos (cualquiera)
    if (permissions && !hasAnyPermission(permissions)) {
        return fallback;
    }

    // Verificar acceso a módulo
    if (module && !hasModuleAccess(module)) {
        return fallback;
    }

    return children;
};

/**
 * Componente de navegación con control de permisos
 */
const NavigationWithPermissions = () => {
    const { permisos, hasModuleAccess, hasPermission } = useAuthUser();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <span className="navbar-brand">Sistema</span>
                
                <div className="navbar-nav">
                    {/* Enlace siempre visible */}
                    <a className="nav-link" href="/dashboard">Dashboard</a>
                    
                    {/* Enlaces basados en acceso a módulos */}
                    <PermissionGuard module="Users">
                        <a className="nav-link" href="/users">
                            Usuarios
                            <span className="badge bg-secondary ms-1">
                                {permisos.filter(p => p.modulo_nombre === 'Users').length}
                            </span>
                        </a>
                    </PermissionGuard>
                    
                    <PermissionGuard module="Roles">
                        <a className="nav-link" href="/roles">Roles</a>
                    </PermissionGuard>
                    
                    {/* Enlaces basados en permisos específicos */}
                    <PermissionGuard permission="reports.view">
                        <a className="nav-link" href="/reports">Reportes</a>
                    </PermissionGuard>
                    
                    <PermissionGuard permissions={['config.view', 'admin.access']}>
                        <a className="nav-link" href="/config">Configuración</a>
                    </PermissionGuard>
                </div>
            </div>
        </nav>
    );
};

/**
 * Componente de panel de control con secciones basadas en permisos
 */
const DashboardWithPermissions = () => {
    const { user, permisos, getPermissionsByModule } = useAuthUser();

    const permisosUsuarios = getPermissionsByModule('Usuarios');
    const permisosRoles = getPermissionsByModule('Roles');
    const permisosReportes = getPermissionsByModule('Reportes');

    return (
        <div className="container mt-4">
            <h2>Dashboard - {user.name}</h2>
            
            <div className="row">
                {/* Tarjeta de estadísticas generales */}
                <div className="col-md-12 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Resumen de Permisos</h5>
                            <p><strong>Total de permisos:</strong> {permisos.length}</p>
                            <div className="row">
                                <div className="col-md-4">
                                    <strong>Módulos con acceso:</strong>
                                    <ul>
                                        {[...new Set(permisos.map(p => p.modulo_nombre))].map(modulo => (
                                            <li key={modulo}>
                                                {modulo} ({permisos.filter(p => p.modulo_nombre === modulo).length})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                /* Sección de Usuarios - Solo si tiene permisos */
                <PermissionGuard module="Usuarios">
                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Gestión de Usuarios</h5>
                                <p>Permisos disponibles: {permisosUsuarios.length}</p>
                                
                                <div className="d-flex flex-wrap gap-2">
                                    <PermissionGuard permission="ver users">
                                        <button className="btn btn-info btn-sm">Ver Usuarios</button>
                                    </PermissionGuard>
                                    
                                    <PermissionGuard permission="crear users">
                                        <button className="btn btn-success btn-sm">Crear Usuario</button>
                                    </PermissionGuard>
                                    
                                    <PermissionGuard permission="editar users">
                                        <button className="btn btn-warning btn-sm">Editar Usuarios</button>
                                    </PermissionGuard>
                                    
                                    <PermissionGuard permission="eliminar users">
                                        <button className="btn btn-danger btn-sm">Eliminar Usuarios</button>
                                    </PermissionGuard>
                                </div>

                                <div className="mt-3">
                                    <small className="text-muted">
                                        Permisos específicos:
                                        {permisosUsuarios.map(p => (
                                            <span key={p.id} className="badge bg-light text-dark ms-1">
                                                {p.nombre}
                                            </span>
                                        ))}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </PermissionGuard>

                {/* Sección de Roles - Solo si tiene permisos */}
                <PermissionGuard module="Roles">
                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Gestión de Roles</h5>
                                <p>Permisos disponibles: {permisosRoles.length}</p>
                                
                                <div className="d-flex flex-wrap gap-2">
                                    <PermissionGuard permission="ver roles">
                                        <button className="btn btn-info btn-sm">Ver Roles</button>
                                    </PermissionGuard>
                                    
                                    <PermissionGuard permission="crear roles">
                                        <button className="btn btn-success btn-sm">Crear Rol</button>
                                    </PermissionGuard>
                                    
                                    <PermissionGuard permission="editar roles">
                                        <button className="btn btn-warning btn-sm">Editar Roles</button>
                                    </PermissionGuard>
                                    
                                    <PermissionGuard permission="eliminar roles">
                                        <button className="btn btn-danger btn-sm">Eliminar Roles</button>
                                    </PermissionGuard>
                                </div>

                                <div className="mt-3">
                                    <small className="text-muted">
                                        Permisos específicos:
                                        {permisosRoles.map(p => (
                                            <span key={p.id} className="badge bg-light text-dark ms-1">
                                                {p.nombre}
                                            </span>
                                        ))}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </PermissionGuard>

                {/* Sección de Reportes - Solo si tiene permisos */}
                <PermissionGuard module="Reportes">
                    <div className="col-md-12 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Reportes y Análisis</h5>
                                <p>Permisos disponibles: {permisosReportes.length}</p>
                                
                                <div className="d-flex flex-wrap gap-2">
                                    <PermissionGuard permission="reports.users">
                                        <button className="btn btn-outline-primary btn-sm">Reporte de Usuarios</button>
                                    </PermissionGuard>
                                    
                                    <PermissionGuard permission="reports.activity">
                                        <button className="btn btn-outline-secondary btn-sm">Reporte de Actividad</button>
                                    </PermissionGuard>
                                    
                                    <PermissionGuard permission="reports.export">
                                        <button className="btn btn-outline-success btn-sm">Exportar Datos</button>
                                    </PermissionGuard>
                                </div>
                            </div>
                        </div>
                    </div>
                </PermissionGuard>

                {/* Mensaje si no tiene permisos para ningún módulo */}
                {permisos.length === 0 && (
                    <div className="col-md-12">
                        <div className="alert alert-warning">
                            <h5>Sin permisos asignados</h5>
                            <p>No tienes permisos asignados actualmente. Contacta al administrador para obtener acceso.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Componente para mostrar tabla de permisos del usuario
 */
const MyPermissionsTable = () => {
    const { permisos } = useAuthUser();

    return (
        <div className="card">
            <div className="card-header">
                <h5>Mis Permisos ({permisos.length})</h5>
            </div>
            <div className="card-body">
                {permisos.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Permiso</th>
                                    <th>Módulo</th>
                                    <th>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permisos.map((permiso) => (
                                    <tr key={permiso.id}>
                                        <td>{permiso.id}</td>
                                        <td>
                                            <code>{permiso.nombre}</code>
                                        </td>
                                        <td>
                                            <span className="badge bg-info">
                                                {permiso.modulo_nombre}
                                            </span>
                                        </td>
                                        <td>
                                            <small className="text-muted">
                                                Módulo ID: {permiso.modulo_id}
                                            </small>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-muted py-4">
                        <p>No hay permisos asignados</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export {
    PermissionGuard,
    NavigationWithPermissions,
    DashboardWithPermissions,
    MyPermissionsTable
};
