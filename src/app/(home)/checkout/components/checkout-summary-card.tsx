import { AlertCircle, Loader2, ShoppingCart } from "lucide-react";
import ModalVoucher from "@/src/components/ModalVoucher";
import { formatIDR, formatMoneyFromIdr } from "@/src/utils/utils";
import { LocaleCurrency, PaymentMethodValue } from "./checkout-types";
import PaymentMethodSelector from "./payment-method-selector";
import CreditCardForm from "./credit-card-form";

type CardInput = {
    card_number: string;
    card_exp_month: string;
    card_exp_year: string;
    card_cvv: string;
};

type CheckoutSummaryCardProps = {
    cartLength: number;
    cartTotal: number;
    localeCurrency: LocaleCurrency;
    feeAmount: number;
    feeSource: "midtrans" | "fallback";
    feeMessage: string;
    discountAmount: number;
    grandTotal: number;
    isFormValid: boolean;
    customerName: string;
    customerEmail: string;
    selectedPaymentMethod: PaymentMethodValue | "";
    checkoutStatus: "idle" | "loading" | "success" | "error";
    paymentError: string;
    openVoucher: boolean;
    voucherResult: { valid: boolean; message?: string } | undefined;
    voucherLoading: boolean;
    cardInput: CardInput;
    onOpenVoucher: () => void;
    onCloseVoucher: () => void;
    onSubmitVoucher: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    onSelectPaymentMethod: (value: PaymentMethodValue) => void;
    onCardInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCheckout: () => Promise<void>;
};

export default function CheckoutSummaryCard({
    cartLength,
    cartTotal,
    localeCurrency,
    feeAmount,
    feeSource,
    feeMessage,
    discountAmount,
    grandTotal,
    isFormValid,
    customerName,
    customerEmail,
    selectedPaymentMethod,
    checkoutStatus,
    paymentError,
    openVoucher,
    voucherResult,
    voucherLoading,
    cardInput,
    onOpenVoucher,
    onCloseVoucher,
    onSubmitVoucher,
    onSelectPaymentMethod,
    onCardInputChange,
    onCheckout,
}: CheckoutSummaryCardProps) {
    const checkoutDisabled =
        cartLength === 0 || checkoutStatus === "loading" || !isFormValid || !selectedPaymentMethod;

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-32">
                <div
                    className="glass-card rounded-[32px] p-8"
                    style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                        border: "1px solid rgba(255,255,255,0.1)",
                    }}
                >
                    <h3 className="font-syne font-bold text-xl mb-8">Summary</h3>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-white/40">Subtotal</span>
                            <span className="text-white/70">{formatMoneyFromIdr(cartTotal, localeCurrency)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-white/40">Payment Fee ({feeSource})</span>
                            <span className="text-white/70">{formatMoneyFromIdr(feeAmount, localeCurrency)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-white/40">Voucher Discount</span>
                            <span className="text-white/70">-{formatMoneyFromIdr(discountAmount, localeCurrency)}</span>
                        </div>
                        <div className="w-full h-px bg-white/5 my-2" />
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 font-bold">Total Price</span>
                            <span className="text-2xl font-syne font-bold text-neon-blue">
                                {formatMoneyFromIdr(grandTotal, localeCurrency)}
                            </span>
                        </div>
                        <p className="text-xs text-white/40">Charged in IDR: {formatIDR(grandTotal)}</p>
                        {feeMessage && <p className="text-xs text-yellow-300/80">{feeMessage}</p>}
                    </div>

                    <ModalVoucher
                        open={openVoucher}
                        openModal={onOpenVoucher}
                        closeModal={onCloseVoucher}
                        handleSubmitVoucher={onSubmitVoucher}
                        isLoading={voucherLoading}
                        validationResult={voucherResult}
                    />

                    <PaymentMethodSelector value={selectedPaymentMethod} onChange={onSelectPaymentMethod} />

                    {selectedPaymentMethod === "credit_card" && (
                        <CreditCardForm value={cardInput} onChange={onCardInputChange} />
                    )}

                    <button
                        onClick={onCheckout}
                        disabled={checkoutDisabled}
                        className="w-full py-5 rounded-2xl font-syne font-bold text-base tracking-wide transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed group/btn"
                        style={{
                            background: "linear-gradient(135deg, #00d2ff 0%, #6c47ff 100%)",
                            boxShadow: isFormValid ? "0 0 40px rgba(0,210,255,0.3)" : "none",
                        }}
                    >
                        {checkoutStatus === "loading" ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                {!customerName || !customerEmail
                                    ? "Check your input"
                                    : !selectedPaymentMethod
                                        ? "Select payment method"
                                        : "Complete Payment"}
                            </>
                        )}
                    </button>

                    {paymentError && (
                        <p className="text-sm text-red-300 mt-4 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {paymentError}
                        </p>
                    )}

                    <p className="text-[10px] text-white/20 text-center mt-6 uppercase tracking-wider leading-relaxed px-4">
                        Secure checkout powered by Midtrans Payment Gateway. Standard blockchain fees apply.
                    </p>
                </div>
            </div>
        </div>
    );
}
