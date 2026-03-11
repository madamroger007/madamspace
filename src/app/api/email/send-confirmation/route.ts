import { EmailTemplate } from '../../../../components/email/ConfirmationPayment';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { requireApiToken } from '@/src/lib/auth/withAuth';

/** POST /api/email/send-confirmation — requires Bearer token */
export async function POST(req: NextRequest) {
    const auth = await requireApiToken(req);
    if (auth instanceof NextResponse) return auth;

    try {
        const { email, name, order_id, items, total } = await req.json();
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: `MadamSpace <${process.env.NEXT_PUBLIC_EMAIL}>`,
            to: email,
            subject: `Order Confirmation - ${order_id}`,
            react: EmailTemplate({ items, order_id, name, total }),
        });

        if (error) {
            return NextResponse.json({ success: false, error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Send confirmation error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
