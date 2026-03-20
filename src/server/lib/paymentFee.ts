import { getPaymentFeeConfigService, PaymentFeeConfigValues } from "@/src/server/services/paymentFeeConfig";
import { PaymentFeeRule } from "@/src/server/db/schema/paymentFeeConfig";

type PaymentMethodFeeInput = string | undefined;

type FeeRuleResult = {
    baseFee: number;
    totalFee: number;
    vatRate: number;
};

function roundIdr(amount: number) {
    return Math.round(amount);
}

function normalizeMethod(input: PaymentMethodFeeInput) {
    return (input || "").trim().toLowerCase();
}

function calculateRuleBaseFee(subtotal: number, rule: PaymentFeeRule) {
    if (rule.feeType === "percent") {
        return subtotal * rule.feeValue;
    }

    return rule.feeValue;
}

function findRule(method: string, rules: PaymentFeeRule[]) {
    const normalizedRules = rules.filter((rule) => rule.isActive);
    const direct = normalizedRules.find((rule) => normalizeMethod(rule.methodKey) === method);
    if (direct) return direct;

    const aliasMap: Record<string, string[]> = {
        bank_transfer: ["bni_va", "bri_va", "mandiri_va", "va"],
        echannel: ["mandiri_va", "va"],
        va: ["bni_va", "bri_va", "mandiri_va"],
    };

    const aliases = aliasMap[method] || [];
    for (const alias of aliases) {
        const aliasRule = normalizedRules.find((rule) => normalizeMethod(rule.methodKey) === alias);
        if (aliasRule) return aliasRule;
    }

    return undefined;
}

function getBaseFee(
    subtotal: number,
    paymentMethod: PaymentMethodFeeInput,
    config: PaymentFeeConfigValues
) {
    const method = normalizeMethod(paymentMethod);

    if (!method) return 0;

    const rule = findRule(method, config.methods);
    if (!rule) return 0;

    return calculateRuleBaseFee(subtotal, rule);
}

function getVatRate(paymentMethod: PaymentMethodFeeInput, config: PaymentFeeConfigValues) {
    const method = normalizeMethod(paymentMethod);
    if (!method) return 0;

    const rule = findRule(method, config.methods);
    return rule?.vatRate ?? 0;
}

export function calculateEstimatedFeeFromConfig(
    subtotal: number,
    paymentMethod: PaymentMethodFeeInput,
    config: PaymentFeeConfigValues
): FeeRuleResult {
    if (!Number.isFinite(subtotal) || subtotal <= 0) {
        return { baseFee: 0, totalFee: 0, vatRate: 0 };
    }

    const baseFee = getBaseFee(subtotal, paymentMethod, config);
    const vatRate = getVatRate(paymentMethod, config);
    const totalFee = baseFee + baseFee * vatRate;

    return {
        baseFee: roundIdr(baseFee),
        totalFee: roundIdr(totalFee),
        vatRate,
    };
}

export async function calculateEstimatedFee(
    subtotal: number,
    paymentMethod?: PaymentMethodFeeInput
): Promise<FeeRuleResult> {
    const config = await getPaymentFeeConfigService();
    return calculateEstimatedFeeFromConfig(subtotal, paymentMethod, config);
}
