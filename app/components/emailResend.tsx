import * as React from 'react';
type Items = {
    name: string,
    quantity: number,
    price: number;
}
interface EmailTemplateProps {
    items: Items[];
    name: string;
    order_id: string
    total: number;
}

export function EmailTemplate({ items, name, order_id, total }: EmailTemplateProps) {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #eee' }}>
            <h2 style={{ color: '#6c47ff' }}>Thank you for your order, {name}!</h2>
            <p>Your payment was successful and your order <strong>{order_id}</strong> is being processed.</p>

            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f8f8' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Item</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Qty</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item: Items, idx: number) => (
                        <tr key={idx}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{item.name}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{item.quantity}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{(item.price / 1000000).toFixed(2)} ETH</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={2} style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>Subtotal:</td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{(total / 1000000).toFixed(2)} ETH</td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>Total Paid:</td>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#6c47ff' }}>{(total / 1000000 + 0.02).toFixed(2)} ETH (incl. fee)</td>
                    </tr>
                </tfoot>
            </table>

            <p style={{ color: '#666', fontSize: '12px', marginTop: '30px' }}>
                This is an automated message. Please do not reply to this email.
            </p>
        </div>
    );
}