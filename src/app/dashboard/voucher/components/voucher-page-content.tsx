'use client';

import Link from 'next/link';
import NavbarDashboard from '@/src/components/dashboard/NavbarDashboard';
import { useVouchers, VoucherTable } from '@/src/app/dashboard/voucher/components';
import LoadingSpinner from '@/src/components/loading/loadingSpinner';
import ErrorDisplay from '@/src/components/errors/errorDisplay';


export default function VoucherPageContent() {
    const vouchers = useVouchers();

    if (vouchers.loading) return <LoadingSpinner />;
    if (vouchers.error) return <ErrorDisplay message={vouchers.error} />;

    return (
        <div className="min-h-screen">
            <NavbarDashboard menuTitle="Vouchers" />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-gray-300">Vouchers</h2>
                        <Link
                            href="/dashboard/voucher/form/new"
                            className="px-4 py-2 bg-gray-600 text-gray-300 text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Add Voucher
                        </Link>
                    </div>

                    <VoucherTable
                        vouchers={vouchers.vouchers}
                        onDelete={vouchers.handleDelete}
                    />
                </div>
            </main>
        </div>
    );
}