/**
 * A synthetic route helper to replace Laravel's Ziggy in a Spring Boot environment.
 */
export default function route(name, params, absolute) {
    // Return a router object if called without arguments
    if (name === undefined) {
        return {
            current: function (matchName) {
                const currentPath = window.location.pathname;
                if (!matchName) return true;

                if (matchName === 'dashboard') return currentPath === '/dashboard' || currentPath === '/';

                // Match prefix for resource routes (e.g. users.* matches /users)
                const resource = matchName.split('.')[0];
                return currentPath.startsWith(`/${resource}`);
            }
        };
    }

    let url = '/';

    // Auth and static mappings
    if (name === 'dashboard') url = '/dashboard';
    else if (name === 'login') url = '/login';
    else if (name === 'logout') url = '/logout';
    else if (name === 'verification.send') url = '/email/verification-notification';
    else if (name === 'password.email') url = '/forgot-password';
    else if (name === 'password.update') url = '/password/update';
    else if (name === 'password.store') url = '/reset-password';
    else if (name === 'password.confirm') url = '/confirm-password';
    else if (name === 'profile.update' || name === 'profile.destroy') url = '/profile';
    else {
        // Resource routing logic (e.g. users.index, users.create)
        const parts = name.split('.');
        let resource = parts[0];
        const action = parts[1];

        if (resource === 'configuraciones') resource = 'configuracions';

        url = `/${resource}`;

        let idStr = '';
        if (params !== null && typeof params === 'object') {
            idStr = params.id || Object.values(params)[0] || '';
        } else if (params !== undefined && params !== null) {
            idStr = params;
        }

        if (action === 'create') {
            url += '/create';
        } else if (['edit', 'update', 'destroy', 'show'].includes(action)) {
            if (idStr) url += `/${idStr}`;
            if (action === 'edit') url += '/edit';
        } else if (action && !['index', 'store'].includes(action)) {
            // E.g. roles.getRoles -> /roles/getRoles
            url += `/${action}`;
        }
    }

    return url;
}
