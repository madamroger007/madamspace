'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { deleteTool as deleteToolAction } from '@/src/server/actions/products/action';
import { ProductTool } from '@/src/types/type';
import { useDashboardToast } from '@/src/components/dashboard/toast/DashboardToastProvider';

interface ToolTableProps {
    tools: ProductTool[];
    onDelete: (id: number) => void;
}

export function ToolTable({ tools, onDelete }: ToolTableProps) {
    const { showToast } = useDashboardToast();
    const PAGE_SIZE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = tools.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));


    const paginatedTools = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return tools.slice(start, start + PAGE_SIZE);
    }, [tools, currentPage]);

    const from = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const to = Math.min(currentPage * PAGE_SIZE, totalItems);

    const handleDelete = async (toolId: number) => {
        if (!confirm('Are you sure you want to delete this tool?')) {
            return;
        }

        try {
            const data = await deleteToolAction(toolId);
            if (!data.success) {
                alert(data.message || 'Failed to delete tool');
                return;
            }

            onDelete(toolId);
            showToast(data.message || 'Tool deleted successfully', 'success', {
                onClose: () => window.location.reload(),
            });
        } catch {
            alert('An unexpected error occurred');
        }
    };

    return (
        <div className="bg-white/20 shadow overflow-x-auto sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200/20">
                <thead className="bg-gray-100/20">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Updated At</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-100 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white/10 divide-y divide-gray-200/10">
                    {paginatedTools.map((tool) => (
                        <ToolRow key={tool.id} tool={tool} onDelete={handleDelete} />
                    ))}
                    {tools.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-gray-300">
                                No tools found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="border-t border-gray-200/20 px-6 py-3 flex items-center justify-between">
                <p className="text-xs text-gray-300">Showing {from}-{to} of {totalItems}</p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage <= 1}
                        className="px-3 py-1.5 text-xs rounded border border-gray-300/30 text-gray-300 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-xs text-gray-300">Page {currentPage} / {totalPages}</span>
                    <button
                        type="button"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage >= totalPages}
                        className="px-3 py-1.5 text-xs rounded border border-gray-300/30 text-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ToolRowProps {
    tool: ProductTool;
    onDelete: (id: number) => void;
}

function ToolRow({ tool, onDelete }: ToolRowProps) {
    const formatDate = (date: string) => new Date(date).toLocaleDateString();

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-300">{tool.name}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-300">{formatDate(tool.createdAt)}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-300">{formatDate(tool.updatedAt)}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                <Link href={`/dashboard/products/tools/form/${tool.id}`} className="text-blue-100 hover:text-blue-300">
                    Edit
                </Link>
                <button onClick={() => onDelete(tool.id)} className="text-red-400 hover:text-red-500">
                    Delete
                </button>
            </td>
        </tr>
    );
}
