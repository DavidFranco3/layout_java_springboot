/**
 * Componente de prueba para verificar el hook useAuth
 * 
 * Este componente muestra toda la información disponible del usuario autenticado
 * incluyendo rol y permisos. Es útil para debug y verificar que la información
 * se está pasando correctamente.
 */

import React from 'react';
import useAuth from '@/hooks/useAuth';

const AuthDebug = () => {
    const {
        user,
        isAuthenticated,
        rolId,
        rolNombre,
        permisos,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission,
        hasModuleAccess,
        getPermissionsByModule,
        getModules,
    } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="alert alert-warning">
                <h4>Usuario no autenticado</h4>
                <p>No hay información de usuario disponible.</p>
            </div>
        );
    }

    const modules = getModules();

    return (
        <div className="container-fluid mt-3">
            <div className="row">
                {/* Información básica del usuario */}
                <div className="col-md-6 mb-3">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Información del Usuario</h5>
                        </div>
                        <div className="card-body">
                            <p><strong>ID:</strong> {user.id}</p>
                            <p><strong>Nombre:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Rol ID:</strong> {rolId || 'Sin asignar'}</p>
                            <p><strong>Rol Nombre:</strong> {rolNombre || 'Sin asignar'}</p>
                        </div>
                    </div>
                </div>

                {/* Permisos */}
                <div className="col-md-6 mb-3">
                    <div className="card">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">Permisos ({permisos.length})</h5>
                        </div>
                        <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {permisos.length > 0 ? (
                                <div className="list-group">
                                    {permisos.map(permiso => (
                                        <div key={permiso.id} className="list-group-item">
                                            <strong>{permiso.nombre}</strong>
                                            <br />
                                            <small className="text-muted">
                                                Módulo: {permiso.modulo_nombre} (ID: {permiso.modulo_id})
                                            </small>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No hay permisos asignados</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Módulos disponibles */}
                <div className="col-md-6 mb-3">
                    <div className="card">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0">Módulos Disponibles ({modules.length})</h5>
                        </div>
                        <div className="card-body">
                            {modules.length > 0 ? (
                                <div className="d-flex flex-wrap">
                                    {modules.map(module => (
                                        <span key={module} className="badge badge-info me-2 mb-2">
                                            {module}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">Sin acceso a módulos</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pruebas de verificación */}
                <div className="col-md-6 mb-3">
                    <div className="card">
                        <div className="card-header bg-warning text-dark">
                            <h5 className="mb-0">Pruebas de Verificación</h5>
                        </div>
                        <div className="card-body">
                            <p>
                                <strong>¿Es Admin?</strong> 
                                <span className={`badge ${hasRole('Admin') ? 'badge-success' : 'badge-danger'} ms-2`}>
                                    {hasRole('Admin') ? 'Sí' : 'No'}
                                </span>
                            </p>
                            <p>
                                <strong>¿Es Admin o Moderador?</strong> 
                                <span className={`badge ${hasAnyRole(['Admin', 'Moderador']) ? 'badge-success' : 'badge-danger'} ms-2`}>
                                    {hasAnyRole(['Admin', 'Moderador']) ? 'Sí' : 'No'}
                                </span>
                            </p>
                            <p>
                                <strong>¿Acceso a Usuarios?</strong> 
                                <span className={`badge ${hasModuleAccess('Usuarios') ? 'badge-success' : 'badge-danger'} ms-2`}>
                                    {hasModuleAccess('Usuarios') ? 'Sí' : 'No'}
                                </span>
                            </p>
                            <p>
                                <strong>¿Puede crear usuarios?</strong> 
                                <span className={`badge ${hasPermission('crear_usuarios') ? 'badge-success' : 'badge-danger'} ms-2`}>
                                    {hasPermission('crear_usuarios') ? 'Sí' : 'No'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información técnica */}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header bg-dark text-white">
                            <h5 className="mb-0">Información Técnica (JSON)</h5>
                        </div>
                        <div className="card-body">
                            <pre className="bg-light p-3" style={{ fontSize: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                                {JSON.stringify({ user, rolId, rolNombre, permisos }, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthDebug;
