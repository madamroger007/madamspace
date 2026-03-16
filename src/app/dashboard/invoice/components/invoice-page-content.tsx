'use client';

import { useInvoices } from './use-invoice';
import { useInvoiceActions } from './use-invoice-actions';
import { useInvoiceFormatters } from './use-invoice-formatters';
import { InvoiceHeader } from './invoice-header';
import { InvoiceTable } from './invoice-table';
import { InvoiceDetailPanel } from './invoice-detail-panel';
import NavbarDashboard from '@/src/components/dashboard/NavbarDashboard';

export function InvoicePageContent() {
    const {
        orders,
        loading,
        error,
        selectedOrder,
        syncing,
        setSelectedOrder,
        fetchOrders,
        removeOrder,
    } = useInvoices();

    const { formatCurrency, formatDate } = useInvoiceFormatters();
    const { handleDelete } = useInvoiceActions({ removeOrder });

    return (
        <div className="min-h-screen">
            <NavbarDashboard menuTitle="Invoice / Transactions" />

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <InvoiceHeader
                    ordersCount={orders.length}
                    loading={loading}
                    syncing={syncing}
                    error={error}
                    onSync={() => fetchOrders(true)}
                    onRefresh={() => fetchOrders()}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <InvoiceTable
                                orders={orders}
                                loading={loading}
                                selectedOrder={selectedOrder}
                                onSelectOrder={setSelectedOrder}
                                onDeleteOrder={handleDelete}
                                formatCurrency={formatCurrency}
                                formatDate={formatDate}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <InvoiceDetailPanel
                            selectedOrder={selectedOrder}
                            onClose={() => setSelectedOrder(null)}
                            formatCurrency={formatCurrency}
                            formatDate={formatDate}
                        />
                    </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Info</h4>
                    <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                        <li>Orders are stored locally when created via checkout</li>
                        <li>Click &quot;Sync with Midtrans&quot; to update pending order statuses</li>
                        <li>
                            Status: <code className="bg-blue-100 px-1 rounded">settlement</code> = paid,{' '}
                            <code className="bg-blue-100 px-1 rounded">pending</code> = awaiting payment
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
