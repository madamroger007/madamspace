'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiToken } from './types';

export function useTokens() {
    const [tokens, setTokens] = useState<ApiToken[]>([]);
    const [loading, setLoading] = useState(false);
    const [tokenName, setTokenName] = useState('');
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

    /** Map of tokenId → raw value (only available right after generation) */
    const [newTokenMap, setNewTokenMap] = useState<Record<string, string>>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // ── Fetch tokens ───────────────────────────────────────────────────────

    const fetchTokens = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/token');
            const data = await res.json();
            if (data.success) setTokens(data.tokens ?? []);
        } catch {
            // silent — tokens section shows empty
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTokens();
    }, [fetchTokens]);

    // ── Token handlers ─────────────────────────────────────────────────────

    const handleGenerate = async () => {
        const name = tokenName.trim() || 'API Token';
        setGenerating(true);
        setError('');

        try {
            const res = await fetch('/api/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || 'Failed to generate token');
                return;
            }

            // Store raw token keyed by its meta id (shown once)
            setNewTokenMap((prev) => ({ ...prev, [data.meta.id]: data.token }));
            setTokens((prev) => [data.meta, ...prev]);
            setTokenName('');
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setGenerating(false);
        }
    };

    const handleRevoke = async (id: string) => {
        if (!confirm('Revoke this token? Any API calls using it will stop working.')) return;

        try {
            const res = await fetch(`/api/auth/token/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) {
                alert(data.message || 'Failed to revoke token');
                return;
            }

            setTokens((prev) => prev.filter((t) => t.id !== id));
            setNewTokenMap((prev) => {
                const n = { ...prev };
                delete n[id];
                return n;
            });
        } catch {
            alert('An unexpected error occurred');
        }
    };

    const handleCopy = (id: string, value: string) => {
        navigator.clipboard.writeText(value).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    return {
        // Data
        tokens,
        loading,
        newTokenMap,
        copiedId,

        // Input state
        tokenName,
        setTokenName,
        generating,
        error,

        // Handlers
        handleGenerate,
        handleRevoke,
        handleCopy,
    };
}
