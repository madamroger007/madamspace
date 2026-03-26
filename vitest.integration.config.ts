import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '.'),
        },
    },
    test: {
        globals: true,
        environment: 'node',
        fileParallelism: false,
        setupFiles: ['./tests/integration/setup.ts'],
        include: ['tests/integration/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/**/*.ts', 'src/**/*.tsx'],
            exclude: ['**/*.d.ts', 'src/**/*.test.ts', 'tests/**'],
        },
    },
});
