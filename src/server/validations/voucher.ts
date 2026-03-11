import zod from "zod"

export const voucherSchema = zod.object({
    code: zod.string().min(5, 'Code must be at least 5 characters long').max(15, 'Code cannot exceed 15 characters'),
    discount: zod.string().min(0, 'Discount must be a positive number').max(100, 'Discount cannot exceed 100%'),
    expiredAt: zod.string().min(1, 'Expired date is required'),
});


export type VoucherSchema = zod.infer<typeof voucherSchema>;
export interface ZodErrorVoucherSchema {
    formErrors: string[];
    fieldErrors: {
        code?: string[];
        discount?: string[];
        expiredAt?: string[];
    };
}