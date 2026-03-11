'use client';

import Link from 'next/link';
import { Voucher } from './types';

interface VoucherTableProps {
    vouchers: Voucher[];
    onDelete: (id: number) => void;
}

export function VoucherTable({ vouchers, onDelete }: VoucherTableProps) {
    return (
        <div className="bg-white/20 shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200/20">
                <thead className="bg-gray-100/20">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                            Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                            Discount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                            Expired At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                            Created At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                            Updated At
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-100 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white/10 divide-y divide-gray-200/10">
                    {vouchers.map((voucher) => (
                        <VoucherRow
                            key={voucher.id}
                            voucher={voucher}
                            onDelete={onDelete}
                        />
                    ))}
                    {vouchers.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-gray-300">
                                No vouchers found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// ─── Row Component ───────────────────────────────────────────────────────────

interface VoucherRowProps {
    voucher: Voucher;
    onDelete: (id: number) => void;
}

function VoucherRow({ voucher, onDelete }: VoucherRowProps) {
    const formatDate = (date: string | null) =>
        date ? new Date(date).toLocaleDateString() : '-';

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-300">{voucher.code}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-300">{voucher.discount}%</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-300">
                    {voucher.expiredAt ? formatDate(voucher.expiredAt) : 'Never'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-300">{formatDate(voucher.createdAt)}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-300">
                    {voucher.updatedAt ? formatDate(voucher.updatedAt) : '-'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                <Link
                    href={`/dashboard/voucher/form/${voucher.id}`}
                    className="text-blue-100 hover:text-blue-300"
                >
                    Edit
                </Link>
                <button
                    onClick={() => onDelete(voucher.id ?? 0)}
                    className="text-red-400 hover:text-red-500"
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}
