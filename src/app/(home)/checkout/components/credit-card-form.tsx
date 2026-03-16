import React from "react";

type CardInput = {
    card_number: string;
    card_exp_month: string;
    card_exp_year: string;
    card_cvv: string;
};

type CreditCardFormProps = {
    value: CardInput;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CreditCardForm({ value, onChange }: CreditCardFormProps) {
    return (
        <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Card Details</p>

            <div className="space-y-3">
                <input
                    name="card_number"
                    placeholder="Card Number"
                    value={value.card_number}
                    onChange={onChange}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm outline-none focus:border-neon-blue/60"
                />

                <div className="grid grid-cols-3 gap-2">
                    <input
                        name="card_exp_month"
                        placeholder="MM"
                        value={value.card_exp_month}
                        onChange={onChange}
                        inputMode="numeric"
                        autoComplete="cc-exp-month"
                        className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm outline-none focus:border-neon-blue/60"
                    />
                    <input
                        name="card_exp_year"
                        placeholder="YYYY"
                        value={value.card_exp_year}
                        onChange={onChange}
                        inputMode="numeric"
                        autoComplete="cc-exp-year"
                        className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm outline-none focus:border-neon-blue/60"
                    />
                    <input
                        name="card_cvv"
                        placeholder="CVV"
                        value={value.card_cvv}
                        onChange={onChange}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm outline-none focus:border-neon-blue/60"
                    />
                </div>

                <p className="text-[11px] text-white/40">
                    Card details are tokenized by Midtrans 3DS script and not sent directly to your backend.
                </p>
            </div>
        </div>
    );
}
