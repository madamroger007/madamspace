'use client';

import { useCallback, useEffect, useState } from "react";
import { Order, UseInvoicesReturn } from "./types";


export function useInvoices(): UseInvoicesReturn {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState<string>('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = useCallback(async (sync: boolean = false) => {
        if (sync) {
            setSyncing(true);
        } else {
            setLoading(true);
        }
        setError('');

        try {
            const query = sync ? '/api/payment/orders?sync=true&backfill=true' : '/api/payment/orders?sync=false';
            const response = await fetch(query);
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to fetch orders');
                return;
            }

            setOrders(data.orders || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
            setSyncing(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const removeOrder = useCallback((orderId: string) => {
        setOrders((currentOrders) => currentOrders.filter((order) => order.orderId !== orderId));
        setSelectedOrder((currentSelectedOrder) => {
            if (currentSelectedOrder?.orderId === orderId) {
                return null;
            }

            return currentSelectedOrder;
        });
    }, []);

    return {
        orders,
        loading,
        error,
        selectedOrder,
        syncing,
        setSelectedOrder,
        fetchOrders,
        removeOrder,

    };
}
