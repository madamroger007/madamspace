import { describe, expect, it, vi } from 'vitest';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import type { SelectUser } from '@/src/server/db/schema/user';
import { makeUser } from "./users/utils";
import { requireSession } from '@/src/lib/auth/withAuth';
import { authService } from '@/src/server/services/auth';
import { GET } from '@/src/app/api/auth/me/route';

vi.mock('@/src/lib/auth/withAuth', () => ({
    requireSession: vi.fn(),
}));

vi.mock('@/src/server/services/auth', () => ({
    authService: {
        getCurrentUser: vi.fn(),
    },
}));

describe('auth me route', () => {
    // response 200 with user data
    it('should return 200 with user data for authenticated user', async () => {
        // Arrange
        const { id, role } = makeUser();
        vi.mocked(requireSession).mockResolvedValue({ userId: id, role: role });
        vi.mocked(authService.getCurrentUser).mockResolvedValue({
            success: true, user: { id, role } as SelectUser,
            message: ''
        });

        // Act
        const request = new NextRequest('http://localhost/api/auth/me'); // Mock request object
        const response = await GET(request);

        // Assert
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            success: true,
            user: { id, role }
        });
        expect(requireSession).toHaveBeenCalled();
        expect(authService.getCurrentUser).toHaveBeenCalledWith(id);
    });

    // response 401 if not authenticated
    it('should return 401 if user is not authenticated', async () => {
        // Arrange
        vi.mocked(requireSession).mockResolvedValue(new NextResponse(null, { status: 401 }));
        // Act
        const request = new NextRequest('http://localhost/api/auth/me'); // Mock request object
        const response = await GET(request);
        // Assert
        expect(response.status).toBe(401);
        expect(requireSession).toHaveBeenCalled();
    });

    // response 401 if authService returns success: false
    it('should return 401 if authService returns success: false', async () => {
        // Arrange
        const { id, role } = makeUser();
        vi.mocked(requireSession).mockResolvedValue({ userId: id, role: role });
        vi.mocked(authService.getCurrentUser).mockResolvedValue({ success: false, message: 'User not found' });
        // Act
        const request = new NextRequest('http://localhost/api/auth/me'); // Mock request object
        const response = await GET(request);
        // Assert
        expect(response.status).toBe(401);
        expect(requireSession).toHaveBeenCalled();
        expect(authService.getCurrentUser).toHaveBeenCalledWith(id);
    });

    // response 500 if authService throws an error
    it('should return 500 if authService throws an error', async () => {
        // Arrange
        const { id, role } = makeUser();
        vi.mocked(requireSession).mockResolvedValue({ userId: id, role: role });
        vi.mocked(authService.getCurrentUser).mockRejectedValue(new Error('Database error'));
        // Act
        const request = new NextRequest('http://localhost/api/auth/me'); // Mock request object
        const response = await GET(request);
        // Assert
        expect(response.status).toBe(500);
        expect(requireSession).toHaveBeenCalled();
        expect(authService.getCurrentUser).toHaveBeenCalledWith(id);
    });

});

