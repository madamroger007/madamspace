'use client';

import { User } from '@/src/types/type';
import { createContext, useContext } from 'react';

interface AuthUserContextType {
    user: User | null;
    loading: boolean;
    handleLogout: () => Promise<void>;
}

export const AuthUserContext = createContext<AuthUserContextType | null>(null);

export function useDashboard() {
    const context = useContext(AuthUserContext);
    if (!context) {
        throw new Error('useDashboard must be used within DashboardLayoutComponent');
    }
    return context;
}
