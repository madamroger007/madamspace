export type PaymentPersistenceFields = {
    payment_name: string | null;
    payment_va: string | null;
};

type PaymentPersistenceOptions = {
    preferredPaymentName?: string;
};

type MidtransVaNumber = { bank?: string; va_number?: string };

const PROVIDER_NAME_MAP: Record<string, string> = {
    alfamart: "Alfamart",
    bca: "BCA",
    bni: "BNI",
    bri: "BRI",
    cimb: "CIMB Niaga",
    credit_card: "Credit Card",
    dana: "DANA",
    echannel: "Mandiri",
    gopay: "GoPay",
    mandiri: "Mandiri",
    ovo: "OVO",
    qris: "QRIS",
    seabank: "SeaBank",
};

const GENERIC_PAYMENT_TYPES = new Set(["bank_transfer", "cstore"]);

function asNonEmptyString(value: unknown) {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function normalizeProviderName(value: string) {
    const normalizedKey = value.trim().toLowerCase().replace(/[\s-]+/g, "_");

    if (PROVIDER_NAME_MAP[normalizedKey]) {
        return PROVIDER_NAME_MAP[normalizedKey];
    }

    return value
        .trim()
        .split(/[\s_-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");
}

function extractVaNumbers(data: Record<string, unknown>) {
    if (!Array.isArray(data.va_numbers)) {
        return [] as MidtransVaNumber[];
    }

    return data.va_numbers as MidtransVaNumber[];
}

export function extractPaymentPersistenceFields(
    data: Record<string, unknown>,
    options: PaymentPersistenceOptions = {}
): PaymentPersistenceFields {
    const vaNumbers = extractVaNumbers(data);
    const firstVa = vaNumbers.find((entry) => asNonEmptyString(entry?.va_number));
    const preferredPaymentName = asNonEmptyString(options.preferredPaymentName);
    const bank = asNonEmptyString(data.bank);
    const store = asNonEmptyString(data.store);
    const paymentType = asNonEmptyString(data.payment_type);
    const paymentTypeName =
        paymentType && !GENERIC_PAYMENT_TYPES.has(paymentType.toLowerCase()) ? paymentType : undefined;

    const paymentNameSource =
        preferredPaymentName ||
        asNonEmptyString(firstVa?.bank) ||
        bank ||
        store ||
        paymentTypeName;

    let paymentName = paymentNameSource ? normalizeProviderName(paymentNameSource) : null;

    if (!paymentName && paymentType === "echannel") {
        paymentName = "Mandiri";
    }

    const paymentVa =
        asNonEmptyString(firstVa?.va_number) ||
        asNonEmptyString(data.bill_key) ||
        asNonEmptyString(data.payment_code) ||
        null;

    return {
        payment_name: paymentName,
        payment_va: paymentVa,
    };
}