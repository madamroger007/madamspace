'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchVouchers } from '@/src/server/actions/vouchers/action';
import { Voucher, VoucherFormData, VoucherFormError, UseVouchersReturn } from './types';
import { createVoucher, updateVoucher, deleteVoucher as deleteVoucherAction } from '@/src/server/actions/vouchers/action';
import { useDashboardToast } from '@/src/components/dashboard/toast/DashboardToastProvider';

export function useVouchers(): UseVouchersReturn {
    const { showToast } = useDashboardToast();
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
    const [formData, setFormData] = useState<VoucherFormData>({
        code: '',
        discount: '0',
        expiredAt: '',
    });
    const [formError, setFormError] = useState<VoucherFormError>(null);
    const [formLoading, setFormLoading] = useState(false);

    // ── Fetch vouchers ─────────────────────────────────────────────────────

    const fetchVouchersRender = useCallback(async () => {
        try {
            const response = await fetchVouchers();
            setVouchers(response.vouchers);
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVouchersRender();
    }, [fetchVouchersRender]);

    // ── Form handlers ──────────────────────────────────────────────────────

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setFormError(null);
    };

    const handleOpenModal = (voucher?: Voucher) => {
        if (voucher) {
            setEditingVoucher(voucher);
            setFormData({
                code: voucher.code,
                discount: voucher.discount,
                expiredAt: voucher.expiredAt,
            });
        } else {
            setEditingVoucher(null);
            setFormData({ code: '', discount: '0', expiredAt: '' });
        }
        setShowModal(true);
        setFormError(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingVoucher(null);
        setFormError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);

        try {
            const data = editingVoucher
                ? await updateVoucher(editingVoucher.id!, formData)
                : await createVoucher(formData);

            if (!data.success) {
                if (data.errors) {
                    setFormError(data.errors);
                } else {
                    setFormError({ formErrors: [data.message || 'Operation failed'], fieldErrors: {} });
                }
                return;
            }

            handleCloseModal();
            fetchVouchers();
        } catch {
            setFormError({ formErrors: ['An unexpected error occurred'], fieldErrors: {} });
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (voucherId: number) => {
        if (!confirm('Are you sure you want to delete this voucher?')) {
            return;
        }

        try {
            const data = await deleteVoucherAction(voucherId);

            if (!data.success) {
                alert(data.message || 'Failed to delete voucher');
                return;
            }

            showToast('Voucher deleted successfully', 'success', {
                onClose: () => window.location.reload(),
            });
            fetchVouchers();
        } catch {
            alert('An unexpected error occurred');
        }
    };

    return {
        vouchers,
        loading,
        error,
        showModal,
        editingVoucher,
        formData,
        formError,
        formLoading,
        handleChange,
        handleOpenModal,
        handleCloseModal,
        handleSubmit,
        handleDelete,
    };
}
