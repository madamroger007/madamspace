import { ZodErrorAuthSchema } from '@/src/server/validations/auth';

// ─── User Types ──────────────────────────────────────────────────────────────

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserFormData {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
}

export type UserFormError = ZodErrorAuthSchema | null;

// ─── Token Types ─────────────────────────────────────────────────────────────
// Re-export from TokenRoww to keep consistent types

export type { ApiToken } from '@/src/components/dashboard/TokenRoww';
