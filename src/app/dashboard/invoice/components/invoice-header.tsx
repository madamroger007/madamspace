import { InvoiceHeaderProps } from './types';

export function InvoiceHeader({
    ordersCount,
    loading,
    syncing,
    error,
    onSync,
    onRefresh,
}: InvoiceHeaderProps) {
    return (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium text-gray-900">All Transactions (Midtrans Sandbox)</h2>
                    <p className="mt-1 text-sm text-gray-500">{ordersCount} order(s) found</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onSync}
                        disabled={syncing}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {syncing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Syncing...
                            </>
                        ) : (
                            <>
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Sync with Midtrans
                            </>
                        )}
                    </button>
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}
        </div>
    );
}
