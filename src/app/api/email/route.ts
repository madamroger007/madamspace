import { NextRequest, NextResponse } from 'next/server';
import { requireApiToken } from '@/src/lib/auth/withAuth';

/** GET /api/email — internal health check, requires Bearer token */
export async function GET(request: NextRequest) {
    const auth = await requireApiToken(request);
    if (auth instanceof NextResponse) return auth;

    return NextResponse.json({ success: true, message: 'Email API is working!' });
}