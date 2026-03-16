'use client';

import Link from 'next/link';
import {
    deleteCategory as deleteCategoryAction
} from '@/src/server/actions/products/action';
import { ProductCategory } from '@/src/types/type';
interface CategoryTableProps {
    categories: ProductCategory[];
    onDelete: (id: number) => void;
}

export function CategoryTable({ categories, onDelete }: CategoryTableProps) {
    const handleDelete = async (categoryId: number) => {
        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            const data = await deleteCategoryAction(categoryId);

            if (!data.success) {
                alert(data.message || 'Failed to delete category');
                return;
            }else{
                alert(data.message || 'Category deleted successfully');
                onDelete(categoryId);
                console.log(`Category with ID ${categoryId} deleted successfully`);
            }
        } catch {
            alert('An unexpected error occurred');
        }
    };

    return (
        <div className="bg-white/20 shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200/20">
                <thead className="bg-gray-100/20">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">
                            Name
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
                    {categories.map((category) => (
                        <CategoryRow
                            key={category.id}
                            category={category}
                            onDelete={handleDelete}
                        />
                    ))}
                    {categories.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-4 text-center text-gray-300">
                                No categories found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

// ─── Row Component ───────────────────────────────────────────────────────────

interface CategoryRowProps {
    category: ProductCategory;
    onDelete: (id: number) => void;
}

function CategoryRow({ category, onDelete }: CategoryRowProps) {
    const formatDate = (date: string) => new Date(date).toLocaleDateString();

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-gray-300">{category.name}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-300">{formatDate(category.createdAt)}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-300">{formatDate(category.updatedAt)}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                <Link
                    href={`/dashboard/products/categories/form/${category.id}`}
                    className="text-blue-100 hover:text-blue-300"
                >
                    Edit
                </Link>
                <button
                    onClick={() => onDelete(category.id)}
                    className="text-red-400 hover:text-red-500"
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}
