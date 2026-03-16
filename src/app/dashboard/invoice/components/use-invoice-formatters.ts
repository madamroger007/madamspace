'use client';

import { useCallback } from 'react';

export function useInvoiceFormatters() {
    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    }, []);

    const formatDate = useCallback((dateString: string | null) => {
        if (!dateString) {
            return '-';
        }

        return new Date(dateString).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    }, []);

    return {
        formatCurrency,
        formatDate,
    };
}
