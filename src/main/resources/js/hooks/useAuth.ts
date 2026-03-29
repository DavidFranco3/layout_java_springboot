/**
 * Hook personalizado para acceso a información de autenticación
 * 
 * Proporciona acceso centralizado a la información del usuario autenticado,
 * incluyendo datos de rol y permisos. Este hook utiliza Inertia.js para
 * acceder a los props compartidos de autenticación.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';

export interface AuthPermission {
    id: number;
    nombre: string;
    modulo_id: number;
    modulo_nombre: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    nombre?: string; // Legacy compatibility
    role_id?: number | null; // Legacy compatibility
    id_rol?: number | null; // Legacy compatibility
    rol_id?: number | null;
    rol_nombre?: string | null;
    rolNombre?: string | null; // Legacy compatibility
    permisos?: AuthPermission[];
}

export interface AuthContext {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    permisos: AuthPermission[];
    rolId: number | null;
    rolNombre: string | null;
    hasRole: (roleName: string) => boolean;
    hasAnyRole: (roleNames: string[]) => boolean;
    hasPermission: (permissionName: string) => boolean;
    hasAnyPermission: (permissionNames: string[]) => boolean;
    hasModuleAccess: (moduleName: string) => boolean;
    getPermissionsByModule: (moduleName: string) => AuthPermission[];
    getModules: () => string[];
}

const useAuth = (): AuthContext => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Array de permisos
    const permisos = user?.permisos || [];
    
    // Información del rol
    const rolNombre = user?.rol_nombre || user?.rolNombre || null;
    const rolId = user?.rol_id || user?.id_rol || null;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/profile');
                if (res.status === 200) {
                    const userData = res.data;
                    // Map legacy properties for compatibility
                    userData.nombre = userData.nombre || userData.name;
                    userData.rolNombre = userData.rolNombre || userData.rol_nombre;
                    userData.id_rol = userData.id_rol || userData.rol_id;
                    setUser(userData);
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
    const hasRole = (roleName: string) => {
        return rolNombre === roleName;
    };
    
    const hasAnyRole = (roleNames: string[]) => {
        return Array.isArray(roleNames) ? roleNames.includes(rolNombre || '') : false;
    };
    
    // Funciones helper para verificación de permisos
    const hasPermission = (permissionName: string) => {
        return permisos.some(p => p.nombre === permissionName);
    };
    
    const hasAnyPermission = (permissionNames: string[]) => {
        if (!Array.isArray(permissionNames)) return false;
        return permissionNames.some(name => hasPermission(name));
    };
    
    const hasModuleAccess = (moduleName: string) => {
        return permisos.some(p => p.modulo_nombre === moduleName);
    };
    
    const getPermissionsByModule = (moduleName: string) => {
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
        rolId,
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
