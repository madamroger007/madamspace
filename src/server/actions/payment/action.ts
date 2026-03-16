'use server';

import { MidtransTransaction } from "@/src/types/type";

type CreateTransactionResult = {
    order_id: string;
    status: string;
    payment_method: string;
    payment_data: Record<string, unknown>;
};

export async function CreateTransaction(payload: MidtransTransaction) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payment/create-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + process.env.BEARER_TOKEN || "" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.detail || data?.error || 'Failed to create Midtrans transaction');
    }

    if (!data?.order_id) {
        throw new Error('Midtrans transaction returned no order id');
    }

    return data as CreateTransactionResult;
}

export async function sendLinkEmailPayment(payload: MidtransTransaction) {
    // Redirect to the persistent payment page
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/payment-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: payload.customer?.email,
            name: payload.customer?.name,
            phone: payload.customer?.phone,
            order_id: payload.order_id
        }),
    })
    return await res.json()
}