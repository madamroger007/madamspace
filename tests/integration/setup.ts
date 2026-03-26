import { afterEach, beforeAll, vi } from 'vitest';

// Auth service initialization requires JWT_SECRET at import time.
process.env.JWT_SECRET ??= 'test-jwt-secret';

beforeAll(() => {
    if (!process.env.POSTGRES_DB_TEST) {
        throw new Error('POSTGRES_DB_TEST is required for integration tests');
    }
});

afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});
