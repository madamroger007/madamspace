import { paymentFeeConfigRepository } from "@/src/server/repositories/paymentFeeConfig";
import { PaymentFeeConfigInput } from "@/src/server/validations/paymentFeeConfig";
import { PaymentFeeRule, SelectPaymentFeeConfig } from "@/src/server/db/schema/paymentFeeConfig";

export type PaymentFeeConfigValues = {
    id: number;
    methods: PaymentFeeRule[];
    createdAt: string;
    updatedAt: string;
};

const DEFAULT_METHOD_RULES: PaymentFeeRule[] = [
    { methodKey: "bni_va", feeType: "fixed", feeValue: 4000, vatRate: 0.12, isActive: true },
    { methodKey: "bri_va", feeType: "fixed", feeValue: 4000, vatRate: 0.12, isActive: true },
    { methodKey: "mandiri_va", feeType: "fixed", feeValue: 4000, vatRate: 0.12, isActive: true },
    { methodKey: "qris", feeType: "percent", feeValue: 0.007, vatRate: 0.12, isActive: true },
    { methodKey: "gopay", feeType: "percent", feeValue: 0.02, vatRate: 0.12, isActive: true },
    { methodKey: "dana", feeType: "percent", feeValue: 0.015, vatRate: 0.12, isActive: true },
];

function toNumber(value: string | number) {
    return typeof value === "number" ? value : Number(value);
}

function normalizeRules(raw: unknown): PaymentFeeRule[] {
    if (!Array.isArray(raw)) return [];

    return raw
        .map((item) => {
            if (!item || typeof item !== "object") return null;

            const candidate = item as Record<string, unknown>;
            const methodKey = String(candidate.methodKey || "").trim().toLowerCase();
            const feeType = candidate.feeType === "percent" ? "percent" : "fixed";
            const feeValue = Number(candidate.feeValue || 0);
            const vatRate = Number(candidate.vatRate || 0);
            const isActive = Boolean(candidate.isActive);

            if (!methodKey || !Number.isFinite(feeValue) || !Number.isFinite(vatRate)) {
                return null;
            }

            return {
                methodKey,
                feeType,
                feeValue,
                vatRate,
                isActive,
            } satisfies PaymentFeeRule;
        })
        .filter((rule): rule is PaymentFeeRule => Boolean(rule));
}

function migrateLegacyRules(row: SelectPaymentFeeConfig): PaymentFeeRule[] {
    const currentVatRate = toNumber(row.vatRate);
    return [
        { methodKey: "bni_va", feeType: "fixed", feeValue: row.bankTransferFixedFee, vatRate: currentVatRate, isActive: true },
        { methodKey: "bri_va", feeType: "fixed", feeValue: row.bankTransferFixedFee, vatRate: currentVatRate, isActive: true },
        { methodKey: "mandiri_va", feeType: "fixed", feeValue: row.bankTransferFixedFee, vatRate: currentVatRate, isActive: true },
        { methodKey: "qris", feeType: "percent", feeValue: toNumber(row.qrisPercent), vatRate: currentVatRate, isActive: true },
        { methodKey: "gopay", feeType: "percent", feeValue: toNumber(row.gopayPercent), vatRate: currentVatRate, isActive: true },
        { methodKey: "dana", feeType: "percent", feeValue: toNumber(row.danaPercent), vatRate: currentVatRate, isActive: true },
    ];
}

function mapRow(row: SelectPaymentFeeConfig): PaymentFeeConfigValues {
    const parsedRules = normalizeRules(row.methods);

    return {
        id: row.id,
        methods: parsedRules.length > 0 ? parsedRules : migrateLegacyRules(row),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

export async function getPaymentFeeConfigService(): Promise<PaymentFeeConfigValues> {
    const existing = await paymentFeeConfigRepository.getLatest();
    if (existing) {
        return mapRow(existing);
    }

    const now = new Date().toISOString();
    const created = await paymentFeeConfigRepository.create({
        bankTransferFixedFee: 4000,
        qrisPercent: "0.0070",
        gopayPercent: "0.0200",
        danaPercent: "0.0150",
        vatRate: "0.1200",
        methods: DEFAULT_METHOD_RULES,
        createdAt: now,
        updatedAt: now,
    });

    return mapRow(created);
}

export async function updatePaymentFeeConfigService(
    input: PaymentFeeConfigInput
): Promise<PaymentFeeConfigValues> {
    const current = await getPaymentFeeConfigService();

    const normalizedMethods = input.methods.map((rule) => ({
        methodKey: rule.methodKey.trim().toLowerCase(),
        feeType: rule.feeType,
        feeValue: Number(rule.feeValue),
        vatRate: Number(rule.vatRate),
        isActive: rule.isActive,
    }));

    const updated = await paymentFeeConfigRepository.updateById(current.id, {
        methods: normalizedMethods,
        updatedAt: new Date().toISOString(),
    });

    return mapRow(updated);
}
