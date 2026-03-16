import { NextRequest, NextResponse } from 'next/server';
import { midtransProvider } from '@/src/server/providers/midtransProvider';

type FeeEstimateRequest = {
    subtotal: number;
    paymentMethod?: string;
    orderId?: string;
};

function fallbackFeeAmount(subtotal: number, paymentMethod?: string) {
    const method = (paymentMethod || '').toLowerCase();

    const byMethodPercent: Record<string, number> = {
        qris: Number(process.env.MIDTRANS_FEE_QRIS_PERCENT || '0.007'),
        va: Number(process.env.MIDTRANS_FEE_VA_PERCENT || '0.004'),
        wallet: Number(process.env.MIDTRANS_FEE_WALLET_PERCENT || '0.015'),
    };

    const percent = byMethodPercent[method] ?? Number(process.env.MIDTRANS_FEE_DEFAULT_PERCENT || '0.01');
    return Math.round(subtotal * percent);
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as FeeEstimateRequest;
        const subtotal = Number(body.subtotal || 0);

        if (!Number.isFinite(subtotal) || subtotal < 0) {
            return NextResponse.json({ error: 'subtotal must be a valid number' }, { status: 400 });
        }

        if (body.orderId) {
            try {
                const data = await midtransProvider.checkTransaction(body.orderId);
                const feeAmount = Number(data.fee_amount || 0);

                if (Number.isFinite(feeAmount) && feeAmount > 0) {
                    return NextResponse.json({
                        amount: feeAmount,
                        source: 'midtrans',
                    });
                }
            } catch (error) {
                console.error('[fee-estimate] Midtrans fee check failed:', error);
            }
        }

        const amount = fallbackFeeAmount(subtotal, body.paymentMethod);
        return NextResponse.json({
            amount,
            source: 'fallback',
            message: 'Midtrans fee detail is unavailable pre-payment. Fallback fee policy is used.',
        });
    } catch (error) {
        console.error('[fee-estimate]', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
