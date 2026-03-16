'use client';

import { User } from './types';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (userId: string) => void;
}

const TABLE_HEADERS = ['Name', 'Email', 'Role', 'Created', 'Actions'];

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
    return (
        <div className="bg-white/20 shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200/20">
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
                <tbody className="bg-white/10 divide-y divide-gray-200/10">
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                                {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-green-100 text-green-800'
                                        }`}
                                >
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onEdit(user)}
                                    className="text-blue-100 hover:text-blue-300 mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(user.id)}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                                No users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
