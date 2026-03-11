"use client";
import { X } from "lucide-react";
import React from "react";

interface ModalVoucherProps {
    open: boolean;
    openModal: () => void;
    closeModal: () => void;
    handleSubmitVoucher: (e: React.FormEvent<HTMLFormElement>) => void;
    
}

export default function ModalVoucher({ open, openModal, closeModal, handleSubmitVoucher }: ModalVoucherProps) {


    return (
        <>
            <div className="mb-8">
                <button onClick={openModal} className="bg-white/11 w-full py-5 rounded-2xl font-syne font-bold text-base tracking-wide transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed group/btn">% Add Voucher</button>
            </div>

            <form onSubmit={handleSubmitVoucher} className={open ? "fixed inset-0 bg-black/70 flex items-center justify-center z-50" : "hidden"}>
                <div className="p-8 rounded-2xl bg-[#0D1A63]/80 border border-white/10" >
                    <div className="flex justify-end items-end">
                        <button onClick={closeModal} className="text-white/40 hover:text-white transition-colors text-sm font-medium">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="px-10 py-5 space-y-10">
                        <h2 className="text-2xl font-syne font-bold mb-6">Add Voucher</h2>
                        <input name="voucher" type="text" placeholder="Enter voucher code" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-neon-blue/50 transition-all text-sm" />
                        <button type="submit" className="bg-white/11 w-full py-5 rounded-2xl font-syne font-bold text-base tracking-wide transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed group/btn">Apply</button>
                    </div>
                </div>
            </form>
        </>
    )
}