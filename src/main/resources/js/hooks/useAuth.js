/**
 * Hook personalizado para acceso a información de autenticación
 * 
 * Proporciona acceso centralizado a la información del usuario autenticado,
 * incluyendo datos de rol y permisos. Este hook utiliza Inertia.js para
 * acceder a los props compartidos de autenticación.
 */

import { usePage } from '@inertiajs/react';

const useAuth = () => {
    const { auth } = usePage().props;
    
    // Información básica del usuario
    const user = auth?.user || null;
    const isAuthenticated = !!user;
    
    // Información del rol
    const rolId = user?.rol_id || null;
    const rolNombre = user?.rol_nombre || null;
    
    // Array de permisos
    const permisos = user?.permisos || [];
    
    // Funciones helper para verificación de roles
    const hasRole = (roleName) => {
        return rolNombre === roleName;
    };
    
    const hasAnyRole = (roleNames) => {
        return Array.isArray(roleNames) ? roleNames.includes(rolNombre) : false;
    };
    
    // Funciones helper para verificación de permisos
    const hasPermission = (permissionName) => {
        return permisos.some(p => p.nombre === permissionName);
    };
    
    const hasAnyPermission = (permissionNames) => {
        if (!Array.isArray(permissionNames)) return false;
        return permissionNames.some(name => hasPermission(name));
    };
    
    const hasModuleAccess = (moduleName) => {
        return permisos.some(p => p.modulo_nombre === moduleName);
    };
    
    const getPermissionsByModule = (moduleName) => {
        return permisos.filter(p => p.modulo_nombre === moduleName);
    };
    
    const getModules = () => {
        const modules = [...new Set(permisos.map(p => p.modulo_nombre))];
        return modules;
    };
    
    return {
        // Información básica
        user,
        isAuthenticated,
        
        // Información de rol
        rolId,
        rolNombre,
        
        // Permisos
        permisos,
        
        // Funciones de verificación de roles
        hasRole,
        hasAnyRole,
        
        // Funciones de verificación de permisos
        hasPermission,
        hasAnyPermission,
        hasModuleAccess,
        getPermissionsByModule,
        getModules,
    };
};

export default useAuth;
