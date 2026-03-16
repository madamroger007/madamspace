import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { PAYMENT_METHOD_OPTIONS, PaymentMethodValue } from "./checkout-types";

type PaymentMethodSelectorProps = {
    value: PaymentMethodValue | "";
    onChange: (value: PaymentMethodValue) => void;
};

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const selected = PAYMENT_METHOD_OPTIONS.find((option) => option.value === value);

    React.useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!containerRef.current) return;

            const target = event.target as Node;
            if (!containerRef.current.contains(target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const handleSelect = (nextValue: PaymentMethodValue) => {
        onChange(nextValue);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="mb-8 relative">
            <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Payment Method</p>

            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3 text-left transition-colors flex items-center justify-between"
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <div>
                    <p className="text-sm font-semibold text-white">
                        {selected ? selected.label : "Select payment method"}
                    </p>
                    <p className="text-[11px] text-white/50">
                        {selected ? selected.detail : "Click to choose one payment method"}
                    </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div
                    className="absolute mt-2 w-full max-h-72 overflow-auto rounded-xl border border-white/10 bg-[#0f1220] shadow-2xl z-40"
                    role="listbox"
                >
                    {PAYMENT_METHOD_OPTIONS.map((option) => {
                        const active = value === option.value;
                        const isEnabled = option.enabled !== false;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => isEnabled && handleSelect(option.value)}
                                disabled={!isEnabled}
                                className={`w-full text-left px-4 py-3 border-b border-white/5 last:border-b-0 transition-colors flex items-start gap-3 ${!isEnabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : active
                                            ? "bg-neon-blue/10"
                                            : "hover:bg-white/10"
                                    }`}
                                role="option"
                                aria-selected={active}
                            >
                                <span className="pt-0.5">
                                    {active ? (
                                        <Check className="w-4 h-4 text-neon-blue" />
                                    ) : (
                                        <span className="block w-4 h-4 rounded-full border border-white/30" />
                                    )}
                                </span>
                                <span>
                                    <p className="text-sm font-semibold text-white">{option.label}</p>
                                    <p className="text-[11px] text-white/50">{option.detail}</p>
                                    {!isEnabled && option.unavailableReason && (
                                        <p className="text-[10px] text-orange-300/90 mt-0.5">{option.unavailableReason}</p>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
