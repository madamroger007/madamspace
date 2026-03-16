import { Orders } from "@/src/types/type";
import { extractPaymentPersistenceFields } from "@/src/utils/payment";

export type PaymentDisplayData = {
    paymentName?: string;
    paymentVa?: string;
    vaNumbers: Array<{ bank: string; va_number: string }>;
    hasVaList: boolean;
    singleVa?: string;
    billerCode?: string;
    billKey?: string;
    paymentCode?: string;
    transactionId?: string;
    maskedCard?: string;
    cardType?: string;
    cardBank?: string;
    cardRedirectUrl?: string;
    shouldShowVa: boolean;
    qrisUrl?: string;
    deeplinkUrl?: string;
    shouldShowQris: boolean;
    shouldShowWallet: boolean;
    shouldShowCard: boolean;
    shouldShowStorePayment: boolean;
};

export function normalizeStatus(transactionStatus?: string) {
    if (!transactionStatus) return "pending";

    if (["settlement", "capture"].includes(transactionStatus)) {
        return "success";
    }

    if (["expire", "cancel", "failure", "deny"].includes(transactionStatus)) {
        return "failed";
    }

    return "pending";
}

export function extractPaymentMetaFromStatus(
    data: Record<string, unknown>,
    options: { preferredPaymentName?: string } = {}
) {
    const paymentFields = extractPaymentPersistenceFields(data, {
        preferredPaymentName: options.preferredPaymentName,
    });

    const actions = Array.isArray(data.actions)
        ? (data.actions as Array<{ name?: string; url?: string }>)
        : [];

    const qrAction =
        actions.find((a) => a.name === "generate-qr-code") ||
        actions.find((a) => a.name?.toLowerCase().includes("qr")) ||
        actions.find((a) => a.url?.toLowerCase().includes("qr"));

    const deeplinkAction =
        actions.find((a) => a.name?.toLowerCase().includes("deeplink")) ||
        actions.find((a) => a.name?.toLowerCase().includes("redirect"));

    return {
        payment_method: (data.payment_type as string | undefined) || undefined,
        payment_name: paymentFields.payment_name || undefined,
        payment_va: paymentFields.payment_va || undefined,
        va_numbers:
            (data.va_numbers as Array<{ bank: string; va_number: string }> | undefined) || undefined,
        biller_code: (data.biller_code as string | undefined) || undefined,
        bill_key: (data.bill_key as string | undefined) || undefined,
        payment_code: (data.payment_code as string | undefined) || undefined,
        transaction_id: (data.transaction_id as string | undefined) || undefined,
        bank: (data.bank as string | undefined) || undefined,
        masked_card: (data.masked_card as string | undefined) || undefined,
        card_type: (data.card_type as string | undefined) || undefined,
        store: (data.store as string | undefined) || undefined,
        redirect_url: (data.redirect_url as string | undefined) || undefined,
        qris_url: qrAction?.url,
        deeplink_url: deeplinkAction?.url,
        raw_snap_result: data,
    };
}

export function buildPaymentDisplayData(order: Orders): PaymentDisplayData {
    const snapRaw = (order.raw_snap_result as Record<string, unknown> | undefined) || {};
    const actions = Array.isArray(snapRaw.actions)
        ? (snapRaw.actions as Array<{ name?: string; url?: string }>)
        : [];

    const snapQrUrl =
        actions.find((a) => a.name === "generate-qr-code")?.url ||
        actions.find((a) => a.name?.toLowerCase().includes("qr"))?.url ||
        actions.find((a) => a.url?.toLowerCase().includes("qr"))?.url;

    const snapDeeplink =
        actions.find((a) => a.name?.toLowerCase().includes("deeplink"))?.url ||
        actions.find((a) => a.name?.toLowerCase().includes("redirect"))?.url;

    const vaNumbers =
        order.va_numbers || ((snapRaw.va_numbers as Array<{ bank: string; va_number: string }>) || []);
    const hasVaList = vaNumbers.length > 0;
    const paymentFields = extractPaymentPersistenceFields({
        ...snapRaw,
        payment_type: order.payment_method || (snapRaw.payment_type as string | undefined),
        va_numbers: order.va_numbers || (snapRaw.va_numbers as Array<{ bank: string; va_number: string }> | undefined),
        bank: order.bank || (snapRaw.bank as string | undefined),
        store: order.store || (snapRaw.store as string | undefined),
        bill_key: order.bill_key || (snapRaw.bill_key as string | undefined),
        payment_code: order.payment_code || (snapRaw.payment_code as string | undefined),
    });
    const paymentName = order.payment_name || paymentFields.payment_name || undefined;
    const displayVaNumbers =
        paymentName && vaNumbers.length === 1
            ? vaNumbers.map((va) => ({ ...va, bank: paymentName }))
            : vaNumbers;
    const billerCode = order.biller_code || (snapRaw.biller_code as string | undefined);
    const billKey = order.bill_key || (snapRaw.bill_key as string | undefined);
    const paymentCode = order.payment_code || (snapRaw.payment_code as string | undefined);
    const paymentVa = order.payment_va || paymentFields.payment_va || paymentCode;
    const transactionId = order.transaction_id || (snapRaw.transaction_id as string | undefined);
    const maskedCard = order.masked_card || (snapRaw.masked_card as string | undefined);
    const cardType = order.card_type || (snapRaw.card_type as string | undefined);
    const cardBank = order.bank || (snapRaw.bank as string | undefined);
    const cardRedirectUrl = order.redirect_url || (snapRaw.redirect_url as string | undefined);
    const shouldShowVa =
        order.payment_method === "bank_transfer" ||
        order.payment_method === "echannel" ||
        order.payment_method === "va" ||
        hasVaList ||
        Boolean(paymentVa) ||
        Boolean(billerCode && billKey);
    const qrisUrl = order.qris_url || snapQrUrl || (snapRaw.qris_url as string | undefined);
    const deeplinkUrl = order.deeplink_url || snapDeeplink;
    const shouldShowQris =
        Boolean(qrisUrl) ||
        ["qris", "gopay", "dana", "ovo", "wallet"].includes(order.payment_method || "");
    const shouldShowWallet =
        Boolean(deeplinkUrl) || ["gopay", "dana", "ovo", "wallet"].includes(order.payment_method || "");
    const shouldShowCard = order.payment_method === "credit_card" || Boolean(maskedCard);
    const shouldShowStorePayment = order.payment_method === "cstore" || Boolean(paymentCode);

    return {
        paymentName,
        paymentVa,
        vaNumbers: displayVaNumbers,
        hasVaList,
        singleVa: paymentVa,
        billerCode,
        billKey,
        paymentCode,
        transactionId,
        maskedCard,
        cardType,
        cardBank,
        cardRedirectUrl,
        shouldShowVa,
        qrisUrl,
        deeplinkUrl,
        shouldShowQris,
        shouldShowWallet,
        shouldShowCard,
        shouldShowStorePayment,
    };
}
