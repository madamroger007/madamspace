import { Voucher } from '@/src/types/type';
import { ZodErrorVoucherSchema } from '@/src/server/validations/voucher';

// ─── Re-exports ──────────────────────────────────────────────────────────────
export type { Voucher };
export type { ZodErrorVoucherSchema };

// ─── Form Types ──────────────────────────────────────────────────────────────

export interface VoucherFormData {
    code: string;
    discount: string;
    expiredAt: string;
}

export type VoucherFormError = ZodErrorVoucherSchema | null;

// ─── Hook Return Type ────────────────────────────────────────────────────────

export interface UseVouchersReturn {
    // Data
    vouchers: Voucher[];
    loading: boolean;
    error: string;

    // Modal state
    showModal: boolean;
    editingVoucher: Voucher | null;
    formData: VoucherFormData;
    formError: VoucherFormError;
    formLoading: boolean;

    // Handlers
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleOpenModal: (voucher?: Voucher) => void;
    handleCloseModal: () => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleDelete: (id: number) => Promise<void>;
}

