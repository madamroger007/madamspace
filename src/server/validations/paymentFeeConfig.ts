import { z } from "zod";

export const paymentFeeRuleSchema = z.object({
    methodKey: z
        .string()
        .min(1, "Method key is required")
        .max(100, "Method key is too long")
        .regex(/^[a-z0-9_\-]+$/i, "Method key can only contain letters, numbers, underscore, or dash"),
    feeType: z.enum(["fixed", "percent"]),
    feeValue: z.number().min(0, "Fee value must be >= 0"),
    vatRate: z.number().min(0, "VAT rate must be >= 0").max(1, "VAT rate must be <= 1"),
    isActive: z.boolean(),
});

export const paymentFeeConfigSchema = z.object({
    methods: z.array(paymentFeeRuleSchema).min(1, "At least one payment method rule is required"),
});

export type PaymentFeeConfigInput = z.infer<typeof paymentFeeConfigSchema>;
