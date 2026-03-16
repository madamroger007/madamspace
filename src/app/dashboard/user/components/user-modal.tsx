'use client';

import { User, UserFormData, UserFormError } from './types';

interface UserModalProps {
    open: boolean;
    editingUser: User | null;
    formData: UserFormData;
    formError: UserFormError;
    formLoading: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function UserModal({
    open,
    editingUser,
    formData,
    formError,
    formLoading,
    onChange,
    onClose,
    onSubmit,
}: UserModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-gray-500/50 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg max-w-md w-full p-6">
                <h3 className="text-lg font-medium text-white mb-4">
                    {editingUser ? 'Edit User' : 'Add New User'}
                </h3>

                <form onSubmit={onSubmit}>
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-100">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={onChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {formError?.fieldErrors.name && (
                                <p className="mt-1 text-xs text-red-500">{formError.fieldErrors.name[0]}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-100">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={onChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {formError?.fieldErrors.email && (
                                <p className="mt-1 text-xs text-red-500">{formError.fieldErrors.email[0]}</p>
                            )}
                        </div>

                        {/* Password (only for new user) */}
                        {!editingUser && (
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-100">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={onChange}
                                    minLength={8}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Min 8 characters with uppercase, lowercase, and number
                                </p>
                                {formError?.fieldErrors.password && (
                                    <p className="mt-1 text-xs text-red-500">{formError.fieldErrors.password[0]}</p>
                                )}
                            </div>
                        )}

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-100">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={onChange}
                                className="bg-gray-800 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            {formError?.fieldErrors.role && (
                                <p className="mt-1 text-xs text-red-500">{formError.fieldErrors.role[0]}</p>
                            )}
                        </div>
                    </div>

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
                            {formLoading ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
