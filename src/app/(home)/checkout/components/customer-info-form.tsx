import React from "react";
import { CustomerInfo } from "./checkout-types";

type CustomerInfoFormProps = {
    customerInfo: CustomerInfo;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CustomerInfoForm({ customerInfo, onInputChange }: CustomerInfoFormProps) {
    return (
        <div
            className="glass-card rounded-[32px] p-8 mb-8"
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <h3 className="text-xl font-syne font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue text-sm">1</span>
                Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-widest text-white/40 ml-1">
                        Full Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        value={customerInfo.name}
                        onChange={onInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-blue/50 transition-all text-sm"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-xs uppercase tracking-widest text-white/40 ml-1">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={customerInfo.email}
                        onChange={onInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-blue/50 transition-all text-sm"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs uppercase tracking-widest text-white/40 ml-1">
                        Number Phone
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your number phone"
                        value={customerInfo.phone}
                        onChange={onInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neon-blue/50 transition-all text-sm"
                        required
                    />
                </div>
            </div>
        </div>
    );
}
