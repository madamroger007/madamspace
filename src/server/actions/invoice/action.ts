'use server';

export async function deleteInvoices(orderId: string) {
    const response = await fetch(`/api/payment/orders?order_id=${encodeURIComponent(orderId)}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
        }
    });

    return response.json();
}
