/**
 * Componente PermissionGuard - Protector de contenido basado en permisos
 * 
 * Este componente permite proteger cualquier contenido basándose en permisos específicos,
 * múltiples permisos, acceso a módulos o roles. Es reutilizable en toda la aplicación.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.permission - Permiso específico requerido
 * @param {Array} props.permissions - Lista de permisos (requiere al menos uno)
 * @param {Array} props.allPermissions - Lista de permisos (requiere todos)
 * @param {string} props.module - Módulo al que debe tener acceso
 * @param {string} props.role - Rol específico requerido
 * @param {Array} props.roles - Lista de roles (requiere al menos uno)
 * @param {React.ReactNode} props.children - Contenido a mostrar si tiene permisos
 * @param {React.ReactNode} props.fallback - Contenido a mostrar si no tiene permisos
 * @param {boolean} props.showError - Si mostrar mensaje de error por defecto
 */

import React from 'react';
import useAuth from '@/hooks/useAuth';

const PermissionGuard = ({
    permission,
    permissions = [],
    allPermissions = [],
    module,
    role,
    roles = [],
    children,
    fallback = null,
    showError = false
}) => {
    const {
        user,
        rolNombre,
        hasPermission,
        hasAnyPermission,
        hasModuleAccess,
        hasRole,
        hasAnyRole
    } = useAuth();

    let hasAccess = false;
    let errorMessage = '';

    // Verificar permiso específico
    if (permission) {
        hasAccess = hasPermission(permission);
        errorMessage = `Requiere permiso: ${permission}`;
    }
    
    // Verificar múltiples permisos (requiere al menos uno)
    else if (permissions.length > 0) {
        hasAccess = hasAnyPermission(permissions);
        errorMessage = `Requiere uno de los permisos: ${permissions.join(', ')}`;
    }
    
    // Verificar todos los permisos (requiere todos)
    else if (allPermissions.length > 0) {
        hasAccess = allPermissions.every(p => hasPermission(p));
        errorMessage = `Requiere todos los permisos: ${allPermissions.join(', ')}`;
    }
    
    // Verificar acceso a módulo
    else if (module) {
        hasAccess = hasModuleAccess(module);
        errorMessage = `Requiere acceso al módulo: ${module}`;
    }
    
    // Verificar rol específico
    else if (role) {
        hasAccess = hasRole(role);
        errorMessage = `Requiere rol: ${role}`;
    }
    
    // Verificar múltiples roles (requiere al menos uno)
    else if (roles.length > 0) {
        hasAccess = hasAnyRole(roles);
        errorMessage = `Requiere uno de los roles: ${roles.join(', ')}`;
    }

    // Si tiene acceso, mostrar el contenido
    if (hasAccess) {
        return children;
    }

    // Si no tiene acceso y hay fallback personalizado
    if (fallback) {
        return fallback;
    }

    // Si no tiene acceso y debe mostrar error
    if (showError) {
        return (
            <div className="alert alert-warning">
                <small>
                    <i className="fas fa-exclamation-triangle"></i>
                    <strong> Sin permisos:</strong> {errorMessage}
                    <br />
                    <strong>Tu rol:</strong> {rolNombre || 'Sin asignar'}
                </small>
            </div>
        );
    }

    // Por defecto, no mostrar nada
    return null;
};

export default PermissionGuard;
