'use client';

import { useMemo, useState } from 'react';
import TokenRow from '@/src/components/dashboard/TokenRoww';
import { KeyIcon } from '@/src/components/icons/iconsComponents';
import { ApiToken } from './types';

interface TokenSectionProps {
    tokens: ApiToken[];
    loading: boolean;
    newTokenMap: Record<string, string>;
    copiedId: string | null;
    tokenName: string;
    setTokenName: (name: string) => void;
    generating: boolean;
    error: string;
    onGenerate: () => void;
    onRevoke: (id: string) => void;
    onCopy: (id: string, value: string) => void;
}

const TABLE_HEADERS = ['Name', 'Token', 'Expires', 'Created', 'Actions'];

export function TokenSection({
    tokens,
    loading,
    newTokenMap,
    copiedId,
    tokenName,
    setTokenName,
    generating,
    error,
    onGenerate,
    onRevoke,
    onCopy,
}: TokenSectionProps) {
    const PAGE_SIZE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = tokens.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedTokens = useMemo(() => {
        const start = (safeCurrentPage - 1) * PAGE_SIZE;
        return tokens.slice(start, start + PAGE_SIZE);
    }, [tokens, safeCurrentPage]);

    const from = totalItems === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
    const to = Math.min(safeCurrentPage * PAGE_SIZE, totalItems);

    return (
        <div className="px-4 sm:px-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <KeyIcon className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-medium text-gray-300">API Bearer Tokens</h2>
                </div>
            </div>

            {/* Generate token row */}
            <div className="flex items-center gap-3 mb-4">
                <input
                    type="text"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="Token name (e.g. CI/CD pipeline)"
                    className="flex-1 max-w-xs px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onGenerate();
                    }}
                />
                <button
                    onClick={onGenerate}
                    disabled={generating}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <KeyIcon className="w-4 h-4" />
                    {generating ? 'Generating…' : 'Generate Token'}
                </button>
            </div>

            {error && <p className="text-sm text-red-400 mb-3">{error}</p>}

            {/* Tokens table */}
            <div className="bg-white/10 shadow overflow-hidden sm:rounded-lg">
                {loading ? (
                    <div className="px-6 py-8 text-center text-gray-400 text-sm">Loading tokens…</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200/10">
                        <thead className="bg-gray-100/20">
                            <tr>
                                {TABLE_HEADERS.map((h, i) => (
                                    <th
                                        key={h}
                                        className={`px-6 py-3 text-xs font-medium text-gray-100 uppercase tracking-wider ${i === 4 ? 'text-right' : 'text-left'}`}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/10">
                            {paginatedTokens.map((token) => (
                                <TokenRow
                                    key={token.id}
                                    token={token}
                                    rawToken={newTokenMap[token.id]}
                                    onRevoke={onRevoke}
                                    onCopy={onCopy}
                                    copiedId={copiedId}
                                />
                            ))}
                            {tokens.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500">
                                        No API tokens yet. Generate one above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {!loading && (
                    <div className="border-t border-gray-200/20 px-6 py-3 flex items-center justify-between">
                        <p className="text-xs text-gray-300">Showing {from}-{to} of {totalItems}</p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                                disabled={safeCurrentPage <= 1}
                                className="px-3 py-1.5 text-xs rounded border border-gray-300/30 text-gray-300 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-xs text-gray-300">Page {safeCurrentPage} / {totalPages}</span>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
                                disabled={safeCurrentPage >= totalPages}
                                className="px-3 py-1.5 text-xs rounded border border-gray-300/30 text-gray-300 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
