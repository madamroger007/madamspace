import { InvoiceDetailPanelProps } from './types';
import { InvoiceStatusBadge } from './invoice-status-badge';

function formatPaymentLabel(value: string) {
    return value.replace(/_/g, ' ');
}

export function InvoiceDetailPanel({
    selectedOrder,
    onClose,
    formatCurrency,
    formatDate,
}: InvoiceDetailPanelProps) {
    if (!selectedOrder) {
        return (
            <div className="bg-white shadow rounded-lg p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Select an order to view details</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden sticky top-6">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="px-6 py-4 space-y-4">
                <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase">Order ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{selectedOrder.orderId}</dd>
                </div>
                {selectedOrder.transactionId && (
                    <div>
                        <dt className="text-xs font-medium text-gray-500 uppercase">Transaction ID</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{selectedOrder.transactionId}</dd>
                    </div>
                )}
                <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase">Amount</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(selectedOrder.grossAmount)}</dd>
                </div>
                <div>
                    <dt className="text-xs font-medium text-gray-500 uppercase">Status</dt>
                    <dd className="mt-1"><InvoiceStatusBadge status={selectedOrder.transactionStatus} /></dd>
                </div>
                {selectedOrder.paymentType && (
                    <div>
                        <dt className="text-xs font-medium text-gray-500 uppercase">Payment Method</dt>
                        <dd className="mt-1 text-sm text-gray-900 capitalize">{formatPaymentLabel(selectedOrder.paymentType)}</dd>
                    </div>
                )}
                {selectedOrder.paymentName && (
                    <div>
                        <dt className="text-xs font-medium text-gray-500 uppercase">Bank / Wallet</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedOrder.paymentName}</dd>
                    </div>
                )}
                {selectedOrder.paymentVa && (
                    <div>
                        <dt className="text-xs font-medium text-gray-500 uppercase">Account / VA Number</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{selectedOrder.paymentVa}</dd>
                    </div>
                )}
                {selectedOrder.fraudStatus && (
                    <div>
                        <dt className="text-xs font-medium text-gray-500 uppercase">Fraud Status</dt>
                        <dd className="mt-1 text-sm text-gray-900 capitalize">{selectedOrder.fraudStatus}</dd>
                    </div>
                )}

                {(selectedOrder.customerName || selectedOrder.customerEmail) && (
                    <div className="border-t pt-4">
                        <dt className="text-xs font-medium text-gray-500 uppercase mb-2">Customer</dt>
                        {selectedOrder.customerName && <dd className="text-sm text-gray-900">{selectedOrder.customerName}</dd>}
                        {selectedOrder.customerEmail && <dd className="text-sm text-gray-500">{selectedOrder.customerEmail}</dd>}
                        {selectedOrder.customerPhone && <dd className="text-sm text-gray-500">{selectedOrder.customerPhone}</dd>}
                    </div>
                )}

                {selectedOrder.items && selectedOrder.items.length > 0 && (
                    <div className="border-t pt-4">
                        <dt className="text-xs font-medium text-gray-500 uppercase mb-2">Items</dt>
                        <dd className="space-y-2">
                            {selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-gray-900">{item.name} x{item.quantity}</span>
                                    <span className="text-gray-500">{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </dd>
                    </div>
                )}

                <div className="border-t pt-4">
                    <dt className="text-xs font-medium text-gray-500 uppercase mb-2">Timestamps</dt>
                    <dd className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Created</span>
                            <span className="text-gray-900">{formatDate(selectedOrder.createdAt)}</span>
                        </div>
                        {selectedOrder.transactionTime && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Transaction</span>
                                <span className="text-gray-900">{formatDate(selectedOrder.transactionTime)}</span>
                            </div>
                        )}
                        {selectedOrder.settlementTime && (
                            <div className="flex justify-between">
                                <span className="text-gray-500">Settlement</span>
                                <span className="text-gray-900">{formatDate(selectedOrder.settlementTime)}</span>
                            </div>
                        )}
                    </dd>
                </div>
            </div>
        </div>
    );
}
