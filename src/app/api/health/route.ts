import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * Used by Docker and load balancers to verify the application is running
 * 
 * Returns:
 *   - 200 OK: Application is healthy
 *   - 503 Service Unavailable: Application is unhealthy
 */
export async function GET() {
    try {
        // Basic health check - add more checks as needed
        const healthCheck = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
        };

        return NextResponse.json(healthCheck, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 503 }
        );
    }
}
