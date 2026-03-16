import { AlertCircle, ShoppingBag } from "lucide-react";
import { Orders } from "@/src/types/type";
import { MethodDetails } from "./payment-method-details";

type PaymentTopInfoProps = {
    order: Orders;
    isSuccess: boolean;
    methodDetails: MethodDetails;
};

export default function PaymentTopInfo({ order, isSuccess, methodDetails }: PaymentTopInfoProps) {
    const paymentName = order.payment_name || methodDetails.label;
    const paymentIdentifier = order.payment_va || order.bill_key;

    return (
        <div className="p-8 border-b border-white/5">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-neon-blue" />
                    </div>
                    <div>
                        <h2 className="font-syne font-bold text-xl uppercase tracking-tighter">MadamSpace</h2>
                        <p className="text-xs text-white/30">Official Merchant</p>
                    </div>
                </div>
                <div
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isSuccess
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        }`}
                >
                    {order.status}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-white/40">Your name :</span>
                    <span className="text-white/80 font-medium">{order.customer?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-white/40">Your email :</span>
                    <span className="text-white/80 font-medium">{order.customer?.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-white/40">Your Phone :</span>
                    <span className="text-white/80 font-medium">{order.customer?.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-white/40">Products :</span>
                    <span className="text-white/80 font-medium">
                        {order.items.length}x {order.items[0]?.name}
                        {order.items.length > 1 ? ` & ${order.items.length - 1} more` : ""}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-white/40">Method :</span>
                    <span className="text-neon-blue font-bold flex items-center gap-2">
                        {methodDetails.icon}
                        {methodDetails.label}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-white/40">Wallet / Bank :</span>
                    <span className="text-neon-blue font-bold">{paymentName}</span>
                </div>
                {paymentIdentifier && (
                    <div className="flex justify-between text-sm gap-4">
                        <span className="text-white/40">Account / Bill Key :</span>
                        <span className="text-neon-blue font-mono font-bold break-all text-right">{paymentIdentifier}</span>
                    </div>
                )}
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-white/2 border border-white/5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <p className="text-xs text-white/50 leading-relaxed">
                    Make sure the merchant name, amount, and details are correct before proceeding with the payment.
                </p>
            </div>
        </div>
    );
}
