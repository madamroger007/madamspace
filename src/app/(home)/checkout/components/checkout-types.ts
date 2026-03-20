import { CartItem } from "@/src/types/type";

export type CustomerInfo = {
    name: string;
    email: string;
    phone: string;
};

export type LocaleCurrency = {
    locale: string;
    currency: string;
};

export type CheckoutItem = CartItem;

export type PaymentMethodValue =
    | "qris"
    | "dana"
    | "gopay"
    | "credit_card"
    | "bni_va"
    | "bri_va"
    | "mandiri_va";

export type PaymentMethodOption = {
    value: PaymentMethodValue;
    label: string;
    detail: string;
    enabled?: boolean;
    unavailableReason?: string;
};

export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
    { value: "qris", label: "QRIS", detail: "Scan QR with your preferred e-wallet or banking app." },
    { value: "dana", label: "DANA", detail: "Pay via DANA app through supported Core API flow." },
    { value: "gopay", label: "GoPay", detail: "Pay using GoPay deeplink or QR instruction." },
    {
        value: "credit_card",
        label: "Credit Card (MasterCard)",
        detail: "Card tokenization + 3DS authentication flow.",
        enabled: true,
    },
    { value: "bni_va", label: "BNI Virtual Account", detail: "Transfer to generated BNI VA number." },
    { value: "bri_va", label: "BRI Virtual Account", detail: "Transfer to generated BRI VA number." },
    { value: "mandiri_va", label: "Mandiri Virtual Account", detail: "Transfer using Mandiri Bill Key and Biller Code." },
];
