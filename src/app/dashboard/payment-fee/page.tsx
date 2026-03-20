"use client";

import { useEffect, useMemo, useState } from "react";
import NavbarDashboard from "@/src/components/dashboard/NavbarDashboard";

type FeeRule = {
    methodKey: string;
    feeType: "fixed" | "percent";
    feeValue: string;
    vatRatePercent: string;
    isActive: boolean;
};

type FeeConfigResponse = {
    success: boolean;
    message?: string;
    data?: {
        methods: Array<{
            methodKey: string;
            feeType: "fixed" | "percent";
            feeValue: number;
            vatRate: number;
            isActive: boolean;
        }>;
        updatedAt: string;
    };
};

function toPercentText(rate: number) {
    return String(rate * 100);
}

function createEmptyRule(): FeeRule {
    return {
        methodKey: "",
        feeType: "fixed",
        feeValue: "0",
        vatRatePercent: "12",
        isActive: true,
    };
}

export default function PaymentFeeDashboardPage() {
    const PAGE_SIZE = 10;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [updatedAt, setUpdatedAt] = useState("");
    const [rules, setRules] = useState<FeeRule[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = rules.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedRules = useMemo(() => {
        const start = (safeCurrentPage - 1) * PAGE_SIZE;
        return rules.slice(start, start + PAGE_SIZE).map((rule, idx) => ({
            rule,
            originalIndex: start + idx,
        }));
    }, [rules, safeCurrentPage]);

    const from = totalItems === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
    const to = Math.min(safeCurrentPage * PAGE_SIZE, totalItems);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch("/api/payment/fee-config");
                const data = (await res.json()) as FeeConfigResponse;

                if (!res.ok || !data.success || !data.data) {
                    throw new Error(data.message || "Failed to load payment fee config");
                }

                setRules(
                    data.data.methods.map((rule) => ({
                        methodKey: rule.methodKey,
                        feeType: rule.feeType,
                        feeValue: String(rule.feeValue),
                        vatRatePercent: toPercentText(rule.vatRate),
                        isActive: rule.isActive,
                    }))
                );
                setUpdatedAt(data.data.updatedAt);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const updateRule = (index: number, patch: Partial<FeeRule>) => {
        setRules((prev) => prev.map((rule, idx) => (idx === index ? { ...rule, ...patch } : rule)));
        setError("");
        setSuccessMessage("");
    };

    const addRule = () => {
        setRules((prev) => [...prev, createEmptyRule()]);
        setCurrentPage(Math.ceil((rules.length + 1) / PAGE_SIZE));
        setError("");
        setSuccessMessage("");
    };

    const removeRule = (index: number) => {
        setRules((prev) => prev.filter((_, idx) => idx !== index));
        setError("");
        setSuccessMessage("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccessMessage("");

        try {
            const payload = {
                methods: rules.map((rule) => ({
                    methodKey: rule.methodKey.trim().toLowerCase(),
                    feeType: rule.feeType,
                    feeValue: Math.max(0, Number(rule.feeValue || "0")),
                    vatRate: Math.max(0, Number(rule.vatRatePercent || "0")) / 100,
                    isActive: rule.isActive,
                })),
            };

            const res = await fetch("/api/payment/fee-config", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = (await res.json()) as FeeConfigResponse;
            if (!res.ok || !data.success || !data.data) {
                throw new Error(data.message || "Failed to save payment fee config");
            }

            setUpdatedAt(data.data.updatedAt);
            setSuccessMessage("Payment fee rules updated successfully.");
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save config");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen">
                <NavbarDashboard menuTitle="Payment Fee Settings" />
                <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 sm:px-0 text-gray-300">Loading fee rules...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <NavbarDashboard menuTitle="Payment Fee Settings" />

            <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <div className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-200">Dynamic Payment Method Fee Rules</h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Add new payment method keys anytime without database schema changes.
                                </p>
                                {updatedAt && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Last updated: {new Date(updatedAt).toLocaleString()}
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={addRule}
                                className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                            >
                                Add Method Rule
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="overflow-auto rounded-lg border border-white/10">
                                <table className="w-full min-w-[820px]">
                                    <thead className="bg-white/5 text-gray-300 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Method Key</th>
                                            <th className="px-3 py-2 text-left">Fee Type</th>
                                            <th className="px-3 py-2 text-left">Fee Value</th>
                                            <th className="px-3 py-2 text-left">VAT (%)</th>
                                            <th className="px-3 py-2 text-left">Active</th>
                                            <th className="px-3 py-2 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedRules.map(({ rule, originalIndex }) => (
                                            <tr key={`${rule.methodKey}-${originalIndex}`} className="border-t border-white/10">
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="text"
                                                        value={rule.methodKey}
                                                        onChange={(e) => updateRule(originalIndex, { methodKey: e.target.value })}
                                                        placeholder="ex: qris, gopay, shopeepay"
                                                        className="w-full rounded-md bg-white/10 border border-white/20 px-2 py-1.5 text-sm text-gray-200"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <select
                                                        value={rule.feeType}
                                                        onChange={(e) => updateRule(originalIndex, { feeType: e.target.value as "fixed" | "percent" })}
                                                        className="w-full rounded-md bg-white/10 border border-white/20 px-2 py-1.5 text-sm text-gray-400"
                                                    >
                                                        <option value="fixed">Fixed (IDR)</option>
                                                        <option value="percent">Percent (0-100%)</option>
                                                    </select>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        step="0.0001"
                                                        value={rule.feeValue}
                                                        onChange={(e) => updateRule(originalIndex, { feeValue: e.target.value })}
                                                        className="w-full rounded-md bg-white/10 border border-white/20 px-2 py-1.5 text-sm text-gray-200"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        step="0.01"
                                                        value={rule.vatRatePercent}
                                                        onChange={(e) => updateRule(originalIndex, { vatRatePercent: e.target.value })}
                                                        className="w-full rounded-md bg-white/10 border border-white/20 px-2 py-1.5 text-sm text-gray-200"
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={rule.isActive}
                                                        onChange={(e) => updateRule(originalIndex, { isActive: e.target.checked })}
                                                        className="h-4 w-4"
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRule(originalIndex)}
                                                        className="px-3 py-1.5 rounded-md bg-red-600/80 text-white text-xs hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="border border-white/10 border-t-0 rounded-b-lg px-4 py-3 flex items-center justify-between">
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

                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                                >
                                    {saving ? "Saving..." : "Save Fee Rules"}
                                </button>

                                {successMessage && <span className="text-sm text-green-300">{successMessage}</span>}
                                {error && <span className="text-sm text-red-300">{error}</span>}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
