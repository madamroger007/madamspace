import { beforeEach, describe, expect, it, vi } from 'vitest';
import { db } from '@/src/server/db';
import { ordersTable } from '@/src/server/db/schema/orders';
import { ordersRepository } from '@/src/server/repositories/orders';

vi.mock('@/src/lib/auth/withAuth', () => ({
    requireSession: vi.fn(),
}));

vi.mock('@/src/server/providers/midtransProvider', () => ({
    midtransProvider: {
        checkTransaction: vi.fn(),
    },
}));

vi.mock('@/src/server/lib/slack-error-reporter', () => ({
    reportErrorToSlack: vi.fn().mockResolvedValue(undefined),
}));

import { requireSession } from '@/src/lib/auth/withAuth';
import { midtransProvider } from '@/src/server/providers/midtransProvider';
import { GET as ordersGET, PATCH as ordersPATCH, DELETE as ordersDELETE } from '@/src/app/api/payment/orders/route';
import { GET as transactionStatusGET, POST as transactionStatusPOST } from '@/src/app/api/payment/transaction-status/route';
import { POST as feeEstimatePOST } from '@/src/app/api/payment/fee-estimate/route';

describe('payment management integration', () => {
    beforeEach(async () => {
        await db.delete(ordersTable);
        vi.clearAllMocks();
    });

    it('GET /api/payment/orders with sync updates order from provider', async () => {
        await ordersRepository.createOrder({
            orderId: 'ORDER-50001',
            grossAmount: 350000,
            snapToken: null,
            items: JSON.stringify([]),
            customerName: 'Sync User',
            customerEmail: 'sync-user@example.com',
            customerPhone: '0815',
            transactionStatus: 'pending',
            paymentType: 'qris',
            paymentName: null,
            paymentVa: null,
            transactionId: null,
        });

        vi.mocked(requireSession).mockResolvedValue({ userId: 'admin-1', role: 'admin' });
        vi.mocked(midtransProvider.checkTransaction).mockResolvedValue({
            order_id: 'ORDER-50001',
            transaction_id: 'trx-50001',
            transaction_status: 'settlement',
            payment_type: 'qris',
            fee_amount: '3500',
        } as never);

        const response = await ordersGET(
            new Request('http://localhost/api/payment/orders?sync=true&backfill=true') as never
        );

        expect(response.status).toBe(200);

        const updated = await ordersRepository.getOrderByOrderId('ORDER-50001');
        expect(updated?.transactionStatus).toBe('settlement');
        expect(updated?.transactionId).toBe('trx-50001');
    });

    it('PATCH /api/payment/orders updates workflow fields in database', async () => {
        await ordersRepository.createOrder({
            orderId: 'ORDER-60001',
            grossAmount: 400000,
            snapToken: null,
            items: JSON.stringify([]),
            customerName: 'Patch User',
            customerEmail: 'patch-user@example.com',
            customerPhone: '0816',
            transactionStatus: 'pending',
            paymentType: 'qris',
            paymentName: 'QRIS',
            paymentVa: null,
            transactionId: null,
            orderLabel: 'progress',
            productLink: null,
        });

        vi.mocked(requireSession).mockResolvedValue({ userId: 'admin-1', role: 'admin' });

        const response = await ordersPATCH(
            new Request('http://localhost/api/payment/orders?order_id=ORDER-60001', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderLabel: 'done',
                    productLink: 'https://example.com/final-artwork',
                }),
            }) as never
        );

        expect(response.status).toBe(200);

        const updated = await ordersRepository.getOrderByOrderId('ORDER-60001');
        expect(updated?.orderLabel).toBe('done');
        expect(updated?.productLink).toBe('https://example.com/final-artwork');
    });

    it('DELETE /api/payment/orders deletes order row', async () => {
        await ordersRepository.createOrder({
            orderId: 'ORDER-70001',
            grossAmount: 450000,
            snapToken: null,
            items: JSON.stringify([]),
            customerName: 'Delete User',
            customerEmail: 'delete-user@example.com',
            customerPhone: '0817',
            transactionStatus: 'pending',
            paymentType: 'qris',
            paymentName: 'QRIS',
            paymentVa: null,
            transactionId: null,
        });

        vi.mocked(requireSession).mockResolvedValue({ userId: 'admin-1', role: 'admin' });

        const response = await ordersDELETE(
            new Request('http://localhost/api/payment/orders?order_id=ORDER-70001', {
                method: 'DELETE',
            }) as never
        );

        expect(response.status).toBe(200);
        const deleted = await ordersRepository.getOrderByOrderId('ORDER-70001');
        expect(deleted).toBeUndefined();
    });

    it('GET /api/payment/transaction-status returns provider transaction', async () => {
        vi.mocked(midtransProvider.checkTransaction).mockResolvedValue({
            order_id: 'ORDER-80001',
            transaction_status: 'pending',
        } as never);

        const response = await transactionStatusGET(
            new Request('http://localhost/api/payment/transaction-status?order_id=ORDER-80001') as never
        );

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toMatchObject({ order_id: 'ORDER-80001' });
    });

    it('POST /api/payment/transaction-status handles mixed provider results', async () => {
        vi.mocked(requireSession).mockResolvedValue({ userId: 'admin-1', role: 'admin' });
        vi.mocked(midtransProvider.checkTransaction)
            .mockResolvedValueOnce({ order_id: 'ORDER-90001', transaction_status: 'settlement' } as never)
            .mockRejectedValueOnce(new Error('Provider error'));

        const response = await transactionStatusPOST(
            new Request('http://localhost/api/payment/transaction-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_ids: ['ORDER-90001', 'ORDER-90002'] }),
            }) as never
        );

        expect(response.status).toBe(200);
        const payload = (await response.json()) as { transactions: Array<Record<string, unknown>> };
        expect(payload.transactions).toHaveLength(2);
        expect(payload.transactions[1]).toMatchObject({ order_id: 'ORDER-90002', error: 'Failed to fetch' });
    });

    it('POST /api/payment/fee-estimate uses midtrans fee when available', async () => {
        vi.mocked(midtransProvider.checkTransaction).mockResolvedValue({
            fee_amount: '2500',
        } as never);

        const response = await feeEstimatePOST(
            new Request('http://localhost/api/payment/fee-estimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subtotal: 100000, paymentMethod: 'qris', orderId: 'ORDER-81001' }),
            }) as never
        );

        expect(response.status).toBe(200);
        await expect(response.json()).resolves.toMatchObject({ amount: 2500, source: 'midtrans' });
    });

    it('POST /api/payment/fee-estimate falls back to configured policy', async () => {
        vi.mocked(midtransProvider.checkTransaction).mockRejectedValue(new Error('Unavailable'));

        const response = await feeEstimatePOST(
            new Request('http://localhost/api/payment/fee-estimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subtotal: 100000, paymentMethod: 'qris', orderId: 'ORDER-82001' }),
            }) as never
        );

        expect(response.status).toBe(200);
        const payload = (await response.json()) as { source: string; amount: number };
        expect(payload.source).toBe('fallback');
        expect(payload.amount).toBeGreaterThan(0);
    });
});
