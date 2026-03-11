// ─── Token Row ────────────────────────────────────────────────────────────────

import { CheckIcon, CopyIcon } from "../icons/iconsComponents";

export interface ApiToken {
    id: string;
    userId: string;
    name: string;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
}


export default function TokenRow({
    token,
    rawToken,
    onRevoke,
    onCopy,
    copiedId,
}: {
    token: ApiToken;
    rawToken?: string; // only available right after generation
    onRevoke: (id: string) => void;
    onCopy: (id: string, value: string) => void;
    copiedId: string | null;
}) {
    const displayValue = rawToken ?? '••••••••••••••••••••••••••••••••••••••••';
    const isCopied = copiedId === token.id;

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                {token.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-400 bg-gray-800/60 px-2 py-1 rounded max-w-xs truncate">
                        {displayValue}
                    </span>
                    {rawToken && (
                        <button
                            onClick={() => onCopy(token.id, rawToken)}
                            title="Copy token"
                            className={`p-1 rounded transition-colors ${isCopied
                                ? 'text-green-400'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                }`}
                        >
                            {isCopied ? <CheckIcon /> : <CopyIcon />}
                        </button>
                    )}
                </div>
                {rawToken && (
                    <p className="text-xs text-amber-400 mt-1">
                        ⚠ Copy now — this token will not be shown again.
                    </p>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {token.expiresAt
                    ? new Date(token.expiresAt).toLocaleDateString()
                    : <span className="text-gray-500 italic">Never</span>}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {new Date(token.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={() => onRevoke(token.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                >
                    Revoke
                </button>
            </td>
        </tr>
    );
}