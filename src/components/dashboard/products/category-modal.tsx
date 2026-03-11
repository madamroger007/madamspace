'use client';

import { Category, CategoryFormData, CategoryFormError } from './types';

interface CategoryModalProps {
    open: boolean;
    editingCategory: Category | null;
    formData: CategoryFormData;
    formError: CategoryFormError;
    formLoading: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function CategoryModal({
    open,
    editingCategory,
    formData,
    formError,
    formLoading,
    onChange,
    onClose,
    onSubmit,
}: CategoryModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-medium text-white mb-4">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>

                <form onSubmit={onSubmit}>
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-100">
                                Category Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={onChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formError?.fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {formError?.fieldErrors.name && (
                                <p className="mt-1 text-xs text-red-500">{formError.fieldErrors.name[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Form Errors */}
                    {formError?.formErrors && formError.formErrors.length > 0 && (
                        <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-md">
                            {formError.formErrors.map((err, i) => (
                                <p key={i} className="text-sm text-red-400">{err}</p>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-100 bg-red-400 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={formLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {formLoading ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
