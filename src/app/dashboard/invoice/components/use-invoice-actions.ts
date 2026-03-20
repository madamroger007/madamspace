'use client';

import { deleteInvoices } from '@/src/server/actions/invoice/action';
import { useDashboardToast } from '@/src/components/dashboard/toast/DashboardToastProvider';
import { UseInvoiceActionsReturn } from './types';

type UseInvoiceActionsParams = {
    removeOrder: (orderId: string) => void;
};

export function useInvoiceActions({ removeOrder }: UseInvoiceActionsParams): UseInvoiceActionsReturn {
    const { showToast } = useDashboardToast();

    const handleDelete = async (orderId: string) => {
        if (!confirm('Are you sure you want to delete this order?')) {
            return;
        }

        try {
            const response = await deleteInvoices(orderId);

            if (response.success) {
                removeOrder(orderId);
                showToast('Order deleted successfully', 'success', {
                    onClose: () => window.location.reload(),
                });
                return;
            }

            alert(response.error || 'Failed to delete order.');
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order. Please try again.');
        }
    };

    return { handleDelete };
}
