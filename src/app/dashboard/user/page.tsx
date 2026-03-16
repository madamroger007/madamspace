'use client';

import NavbarDashboard from '@/src/components/dashboard/NavbarDashboard';
import {
    useUsers,
    useTokens,
    UserTable,
    UserModal,
    TokenSection,
} from './components';

// ─── Loading Spinner ─────────────────────────────────────────────────────────

function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <svg
                className="animate-spin h-10 w-10 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
}

// ─── Error Display ───────────────────────────────────────────────────────────

function ErrorDisplay({ message }: { message: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-md">
                {message}
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function UserManagementPage() {
    const users = useUsers();
    const tokens = useTokens();

    if (users.loading) return <LoadingSpinner />;
    if (users.error) return <ErrorDisplay message={users.error} />;

    return (
        <div className="min-h-screen">
            <NavbarDashboard menuTitle="Manage Users" />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-10">
                {/* Users Section */}
                <div className="px-4 sm:px-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-300">Users</h2>
                        <button
                            onClick={() => users.handleOpenModal()}
                            className="px-4 py-2 bg-gray-600 text-gray-300 text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Add User
                        </button>
                    </div>

                    <UserTable
                        users={users.users}
                        onEdit={users.handleOpenModal}
                        onDelete={users.handleDelete}
                    />
                </div>

                {/* Tokens Section */}
                <TokenSection
                    tokens={tokens.tokens}
                    loading={tokens.loading}
                    newTokenMap={tokens.newTokenMap}
                    copiedId={tokens.copiedId}
                    tokenName={tokens.tokenName}
                    setTokenName={tokens.setTokenName}
                    generating={tokens.generating}
                    error={tokens.error}
                    onGenerate={tokens.handleGenerate}
                    onRevoke={tokens.handleRevoke}
                    onCopy={tokens.handleCopy}
                />
            </main>

            {/* User Modal */}
            <UserModal
                open={users.showModal}
                editingUser={users.editingUser}
                formData={users.formData}
                formError={users.formError}
                formLoading={users.formLoading}
                onChange={users.handleChange}
                onClose={users.handleCloseModal}
                onSubmit={users.handleSubmit}
            />
        </div>
    );
}
