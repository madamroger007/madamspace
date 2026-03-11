import DirectPayment from '../../../../components/email/Directpayment';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { requireApiToken } from '@/src/lib/auth/withAuth';

/** POST /api/email/payment-link — requires Bearer token */
export async function POST(req: NextRequest) {
    const auth = await requireApiToken(req);
    if (auth instanceof NextResponse) return auth;

    try {
        const { email, name, order_id, total } = await req.json();
        const resend = new Resend(process.env.RESEND_API_KEY);
        const link = `${process.env.NEXT_PUBLIC_URL}/checkout/payment/${order_id}`;

        const { data, error } = await resend.emails.send({
            from: `MadamSpace <${process.env.NEXT_PUBLIC_EMAIL}>`,
            to: email,
            subject: `Order - ${order_id} payment link`,
            react: DirectPayment({ order_id, name, total, link }),
        });

        if (error) {
            return NextResponse.json({ success: false, error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Send payment link error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}