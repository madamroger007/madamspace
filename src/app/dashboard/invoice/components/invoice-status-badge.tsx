import { TransactionStatus, TransactionStatusBadge } from './types';

const statusColors: TransactionStatusBadge = {
    settlement: { bg: 'bg-green-100', text: 'text-green-800' },
    capture: { bg: 'bg-green-100', text: 'text-green-800' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    deny: { bg: 'bg-red-100', text: 'text-red-800' },
    cancel: { bg: 'bg-gray-100', text: 'text-gray-800' },
    expire: { bg: 'bg-orange-100', text: 'text-orange-800' },
    failure: { bg: 'bg-red-100', text: 'text-red-800' },
    refund: { bg: 'bg-purple-100', text: 'text-purple-800' },
    partial_refund: { bg: 'bg-purple-100', text: 'text-purple-800' },
    authorize: { bg: 'bg-blue-100', text: 'text-blue-800' },
};

type InvoiceStatusBadgeProps = {
    status: string | null;
};

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
    const statusKey = (status || 'pending') as TransactionStatus;
    const colors = statusColors[statusKey] || { bg: 'bg-gray-100', text: 'text-gray-800' };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
            {statusKey.toUpperCase()}
        </span>
    );
}
