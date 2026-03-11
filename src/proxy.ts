import { NextResponse, NextRequest } from 'next/server'

// Public auth routes that don't require authentication
const PUBLIC_AUTH_ROUTES = [
    '/dashboard/auth/login',
    '/dashboard/auth/forgot-password',
    '/dashboard/auth/change-password',
]

// API routes that don't require authentication
const PUBLIC_API_ROUTES = [
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/health',
]

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const authToken = request.cookies.get('auth-token')?.value

    // Handle dashboard routes (cookie-based auth)
    if (pathname.startsWith('/dashboard')) {
        // Allow public auth routes
        if (PUBLIC_AUTH_ROUTES.some(route => pathname.startsWith(route))) {
            return NextResponse.next()
        }

        // If no auth token, redirect to login
        if (!authToken) {
            const loginUrl = new URL('/dashboard/auth/login', request.url)
            loginUrl.searchParams.set('from', pathname)
            return NextResponse.redirect(loginUrl)
        }

        return NextResponse.next()
    }

    // Handle API routes
    if (pathname.startsWith('/api/')) {
        // Allow public API routes
        if (PUBLIC_API_ROUTES.some(route => pathname.startsWith(route))) {
            return NextResponse.next()
        }

        // Check for cookie first (internal browser requests)
        if (authToken) {
            return NextResponse.next()
        }

        // Check for Authorization header (external API requests)
        const authHeader = request.headers.get('Authorization')

        if (!authHeader) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Authorization required' },
                { status: 401 }
            )
        }

        if (!authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'Invalid authorization format. Use: Bearer <token>' },
                { status: 401 }
            )
        }

        return NextResponse.next()
    }

    return NextResponse.next()
}