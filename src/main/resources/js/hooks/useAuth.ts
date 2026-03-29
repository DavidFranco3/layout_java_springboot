/**
 * Hook personalizado para acceso a información de autenticación
 * 
 * Proporciona acceso centralizado a la información del usuario autenticado,
 * incluyendo datos de rol y permisos. Este hook utiliza Inertia.js para
 * acceder a los props compartidos de autenticación.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Array de permisos
    const permisos = user?.permisos || [];
    
    // Información del rol
    const rolNombre = user?.rol_nombre || null;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/profile');
                if (res.status === 200) {
                    setUser(res.data);
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.error("Not authenticated");
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);
    
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
        user,
        isAuthenticated,
        loading,
        permisos,
        rolNombre,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission,
        hasModuleAccess,
        getPermissionsByModule,
        getModules,
    };
};

export default useAuth;
