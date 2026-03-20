'use client';
import { useMemo, useState } from 'react';
import { InvoiceTableProps } from './types';
import { InvoiceStatusBadge } from './invoice-status-badge';

export function InvoiceTable({
    orders,
    loading,
    selectedOrder,
    onSelectOrder,
    onDeleteOrder,
    formatCurrency,
    formatDate,
}: InvoiceTableProps) {
    const PAGE_SIZE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = orders.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));


    const paginatedOrders = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return orders.slice(start, start + PAGE_SIZE);
    }, [orders, currentPage]);

    const from = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const to = Math.min(currentPage * PAGE_SIZE, totalItems);

    if (loading) {
        return (
            <div className="p-8 text-center">
                <svg className="animate-spin mx-auto h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-sm text-gray-500">Loading orders...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">No transactions yet</p>
                <p className="text-xs text-gray-400">Create a transaction to see it here</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedOrders.map((order) => (
                        <tr
                            key={order.id}
                            className={`hover:bg-gray-50 cursor-pointer ${selectedOrder?.id === order.id ? 'bg-blue-50' : ''}`}
                            onClick={() => onSelectOrder(order)}
                        >
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 font-mono">
                                    {order.orderId}
                                </div>
                                {order.customerName && (
                                    <div className="text-sm text-gray-500">
                                        {order.customerName}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(order.grossAmount)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <InvoiceStatusBadge status={order.transactionStatus} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(order.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onDeleteOrder(order.orderId);
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between">
                <p className="text-xs text-gray-500">Showing {from}-{to} of {totalItems}</p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage <= 1}
                        className="px-3 py-1.5 text-xs rounded border border-gray-300 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-xs text-gray-600">Page {currentPage} / {totalPages}</span>
                    <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage >= totalPages}
                        className="px-3 py-1.5 text-xs rounded border border-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
