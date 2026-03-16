import { Landmark, QrCode, ShoppingBag, Wallet } from "lucide-react";
import type { ReactNode } from "react";

export type MethodDetails = {
    label: string;
    icon: ReactNode;
    instructions: string;
};

export function getMethodDetails(paymentMethod?: string): MethodDetails {
    switch (paymentMethod) {
        case "qris":
            return {
                label: "QRIS / QR Code",
                icon: <QrCode className="w-5 h-5 text-neon-blue" />,
                instructions:
                    "Scan the QR code below using your favorite payment app (OVO, GoPay, Dana, etc.)",
            };
        case "bank_transfer":
        case "va":
            return {
                label: "Bank Transfer",
                icon: <Landmark className="w-5 h-5 text-neon-blue" />,
                instructions: "Transfer the exact amount to the Virtual Account number displayed below.",
            };
        case "echannel":
            return {
                label: "Mandiri E-Channel",
                icon: <Landmark className="w-5 h-5 text-neon-blue" />,
                instructions: "Use Mandiri biller code and bill key shown below to complete your payment.",
            };
        case "wallet":
        case "gopay":
        case "dana":
        case "ovo":
            return {
                label: "E-Wallet",
                icon: <Wallet className="w-5 h-5 text-neon-blue" />,
                instructions: "Follow the prompts in your chosen E-Wallet app to complete the transaction.",
            };
        default:
            return {
                label: "Standard Payment",
                icon: <ShoppingBag className="w-5 h-5 text-neon-blue" />,
                instructions: "Proceed to secure payment platform to choose your preferred method.",
            };
    }
}
