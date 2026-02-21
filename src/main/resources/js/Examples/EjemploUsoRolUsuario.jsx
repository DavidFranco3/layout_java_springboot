// Ejemplo de cómo usar la información del rol del usuario autenticado en React

import React from 'react';
import { usePage } from '@inertiajs/react';

const EjemploUsoRolUsuario = () => {
    // Obtener la información del usuario autenticado desde Inertia
    const { auth } = usePage().props;
    const usuario = auth.user;

    // Verificar si el usuario está autenticado
    if (!usuario) {
        return <div>Usuario no autenticado</div>;
    }

    // Obtener información del rol y permisos
    const rolId = usuario.rol_id;
    const rolNombre = usuario.rol_nombre;
    const permisos = usuario.permisos || []; // Array de permisos con estructura completa

    return (
        <div>
            <h3>Información del Usuario Autenticado</h3>
            <p><strong>ID:</strong> {usuario.id}</p>
            <p><strong>Nombre:</strong> {usuario.name}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>ID del Rol:</strong> {rolId || 'Sin rol asignado'}</p>
            <p><strong>Nombre del Rol:</strong> {rolNombre || 'Sin rol asignado'}</p>

            {/* Nueva sección: Permisos del usuario */}
            <div className="mt-4">
                <h4>Permisos del Usuario</h4>
                {permisos.length > 0 ? (
                    <div>
                        <p><strong>Total de permisos:</strong> {permisos.length}</p>
                        <div className="table-responsive">
                            <table className="table table-sm table-striped">
                                <thead>
                                    <tr>
                                        <th>ID Permiso</th>
                                        <th>Nombre Permiso</th>
                                        <th>ID Módulo</th>
                                        <th>Nombre Módulo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permisos.map((permiso) => (
                                        <tr key={permiso.id}>
                                            <td>{permiso.id}</td>
                                            <td>{permiso.nombre}</td>
                                            <td>{permiso.modulo_id}</td>
                                            <td>{permiso.modulo_nombre}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted">No hay permisos asignados</p>
                )}
            </div>

            {/* Ejemplo de renderizado condicional basado en el rol */}
            {rolNombre === 'Administrador' && (
                <div className="alert alert-info">
                    <strong>Panel de Administrador</strong>
                    <p>Tienes acceso completo al sistema.</p>
                </div>
            )}

            {/* Ejemplo de renderizado condicional basado en permisos específicos */}
            {permisos.some(p => p.nombre === 'crear users') && (
                <div className="alert alert-success">
                    <strong>Permiso de Creación</strong>
                    <p>Puedes crear nuevos usuarios.</p>
                </div>
            )}

            {/* Ejemplo de verificación por módulo */}
            {permisos.some(p => p.modulo_nombre === 'Users') && (
                <div className="alert alert-warning">
                    <strong>Acceso al Módulo de Usuarios</strong>
                    <p>Tienes permisos en el módulo de usuarios.</p>
                </div>
            )}
        </div>
    );
};

// Hook personalizado para facilitar el uso de la información del usuario
export const useAuthUser = () => {
    const { auth } = usePage().props;
    
    return {
        user: auth.user,
        isAuthenticated: !!auth.user,
        rolId: auth.user?.rol_id,
        rolNombre: auth.user?.rol_nombre,
        permisos: auth.user?.permisos || [],
        hasRole: (rolName) => auth.user?.rol_nombre === rolName,
        hasAnyRole: (roles) => roles.includes(auth.user?.rol_nombre),
        hasPermission: (permissionName) => auth.user?.permisos?.some(p => p.nombre === permissionName) || false,
        hasAnyPermission: (permissions) => auth.user?.permisos?.some(p => permissions.includes(p.nombre)) || false,
        hasModuleAccess: (moduleName) => auth.user?.permisos?.some(p => p.modulo_nombre === moduleName) || false,
        getPermissionsByModule: (moduleName) => auth.user?.permisos?.filter(p => p.modulo_nombre === moduleName) || [],
    };
};

// Ejemplo de uso del hook personalizado
const ComponenteConHook = () => {
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
        getPermissionsByModule
    } = useAuthUser();

    if (!isAuthenticated) {
        return <div>Debes iniciar sesión</div>;
    }

    const permisosUsuarios = getPermissionsByModule('Users');

    return (
        <div>
            <h4>Usando Hook Personalizado</h4>
            <p>Usuario: {user.name}</p>
            <p>Rol ID: {rolId}</p>
            <p>Rol: {rolNombre}</p>
            <p>Total permisos: {permisos.length}</p>
            
            {/* Verificaciones de rol */}
            {hasRole('Administrador') && <p>✅ Eres administrador</p>}
            {hasAnyRole(['Administrador', 'Moderador']) && <p>✅ Tienes permisos especiales</p>}

            {/* Verificaciones de permisos específicos */}
            {hasPermission('crear users') && <p>✅ Puedes crear usuarios</p>}
            {hasPermission('editar users') && <p>✅ Puedes editar usuarios</p>}
            {hasPermission('eliminar users') && <p>✅ Puedes eliminar usuarios</p>}

            {/* Verificaciones de múltiples permisos */}
            {hasAnyPermission(['crear users', 'editar users']) && (
                <p>✅ Puedes gestionar usuarios</p>
            )}
            
            {/* Verificaciones por módulo */}
            {hasModuleAccess('Users') && (
                <div>
                    <p>✅ Tienes acceso al módulo de Users</p>
                    <p>Permisos en este módulo: {permisosUsuarios.length}</p>
                    {permisosUsuarios.map(p => (
                        <span key={p.id} className="badge bg-primary me-1">{p.nombre}</span>
                    ))}
                </div>
            )}
            
            {hasModuleAccess('Roles') && <p>✅ Tienes acceso al módulo de Roles</p>}
        </div>
    );
};

export default EjemploUsoRolUsuario;
