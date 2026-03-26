import { describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { GET, POST } from '@/src/app/api/auth/users/route';
import { requireSession } from '@/src/lib/auth/withAuth';
import { authRepository } from '@/src/server/repositories/auth';
import { authService } from '@/src/server/services/auth';
import { makeUser } from './utils';

// Mock dependencies
vi.mock('@/src/lib/auth/withAuth', () => ({
    requireSession: vi.fn(),
}));

vi.mock('@/src/server/repositories/auth', () => ({
    authRepository: {
        getUsers: vi.fn(),
    },
}));

vi.mock('@/src/server/services/auth', () => ({
    authService: {
        registerUser: vi.fn(),
    },
}));
// Integration tests for /api/auth/users route
describe('GET /api/auth/users', () => {
    // check requireSession success case
    it('should call requireSession with auth token response 201', async () => {
        // Arrange
        vi.mocked(requireSession).mockResolvedValue({ userId: 'user-1', role: 'admin' });
        vi.mocked(authRepository.getUsers).mockResolvedValue([makeUser()]);
        // Act
        const response = await GET();
        // Assert
        expect(requireSession).toHaveBeenCalled();
        expect(authRepository.getUsers).toHaveBeenCalled();
        await expect(response.json()).resolves.toEqual({
            success: true,
            users: [
                {
                    id: 'user-1',
                    name: 'Admin',
                    email: 'admin@example.com',
                    role: 'admin',
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                },
            ],
        });
    });

    // check requireSession failure case (no token)
    it('should return 401 if not authenticated and it has no auth token', async () => {
        // Arrange
        vi.mocked(requireSession).mockResolvedValue(NextResponse.json({ success: false }, { status: 401 }));
        // Act
        const response = await GET();
        // Assert
        expect(requireSession).toHaveBeenCalled();
        expect(response.status).toBe(401);

    });

    // check requireSession failure case (invalid token)
    it('should return 401 if session token is invalid', async () => {
        // Arrange
        vi.mocked(requireSession).mockResolvedValue(NextResponse.json({ success: false }, { status: 401 }));
        // Act
        const response = await GET();
        // Assert
        expect(requireSession).toHaveBeenCalled();
        expect(response.status).toBe(401);
    });

    // check get response status 500 case
    it('should return 500 if there is an error', async () => {
        // Arrange
        vi.mocked(requireSession).mockResolvedValue({ userId: 'user-1', role: 'admin' });
        vi.mocked(authRepository.getUsers).mockRejectedValue(new Error('Database error'));
        // Act
        const response = await GET();
        // Assert
        expect(requireSession).toHaveBeenCalled();
        expect(authRepository.getUsers).toHaveBeenCalled();
        expect(response.status).toBe(500);
    });
});


// Describe Post /api/auth/users route
describe('POST /api/auth/users', () => {
    // check requireSession success case
    it('should call requireSession with auth token response 201', async () => {
        // Arrange
        vi.mocked(requireSession).mockResolvedValue({ userId: 'user-1', role: 'admin' });
        vi.mocked(authService.registerUser).mockResolvedValue({
            success: true, user: makeUser(),
            message: 'success',
        });
        // Act
        const newUser = { name: 'New User', email: 'new@example.com', password: 'Password1' };
        const request = new Request('http://localhost/api/auth/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token',
            },
            body: JSON.stringify(newUser),
        });
        const response = await POST(request as NextRequest);
        // Assert
        expect(requireSession).toHaveBeenCalled();
        expect(authService.registerUser).toHaveBeenCalledWith({
            ...newUser,
            role: 'user',
        });
        expect(response.status).toBe(201);
    });

    // check requireSession failure case (no token)
    it('should return 401 if not authenticated', async () => {
        // Arrange
        vi.mocked(requireSession).mockResolvedValue(NextResponse.json({ success: false }, { status: 401 }));
        const newUser = { name: 'New User', email: 'new@example.com', password: 'Password1' };
        // Act
        const request = new Request('http://localhost/api/auth/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token',
            },
            body: JSON.stringify(newUser),
        });
        const response = await POST(request as NextRequest);
        // Assert
        expect(requireSession).toHaveBeenCalled();
        expect(response.status).toBe(401);
    });

    // check requireSession failure case (invalid token)
    it('should return 401 if session token is invalid', async () => {
        // Arrange
        vi.mocked(requireSession).mockResolvedValue(NextResponse.json({ success: false }, { status: 401 }));
        const newUser = { name: 'New User', email: 'new@example.com', password: 'Password1' };
        // Act
        const request = new Request('http://localhost/api/auth/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token',
            },
            body: JSON.stringify(newUser),
        });
        const response = await POST(request as NextRequest);
        // Assert
        expect(requireSession).toHaveBeenCalled();
        expect(response.status).toBe(401);
    });

        // check post response status 500 case
    it('should return 500 if there is an error', async () => {
        // Arrange
        vi.mocked(requireSession).mockResolvedValue({ userId: 'user-1', role: 'admin' });
        vi.mocked(authService.registerUser).mockRejectedValue(new Error('Database error'));
        const newUser = { name: 'New User', email: 'new@example.com', password: 'Password1' };
        // Act
        const request = new Request('http://localhost/api/auth/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token',
            },
            body: JSON.stringify(newUser),
        });
        const response = await POST(request as NextRequest);
        // Assert
        expect(requireSession).toHaveBeenCalled();
        expect(authService.registerUser).toHaveBeenCalled();
        expect(response.status).toBe(500);
    });
});

// Get /api/auth/users/[id] route tests are in 