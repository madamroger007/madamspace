import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

type CheckoutHeaderProps = {
    cartCount: number;
};

export default function CheckoutHeader({ cartCount }: CheckoutHeaderProps) {
    return (
        <div
            className="sticky top-0 z-30 backdrop-blur-2xl"
            style={{
                background: "rgba(5,5,20,0.85)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link
                    href="/products"
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Marketplace
                </Link>

                <h1 className="font-syne font-bold text-lg hidden md:block">Review Your Order</h1>

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <ShoppingBag className="w-4 h-4 text-neon-blue" />
                    <span className="text-sm font-bold">{cartCount} Items</span>
                </div>
            </div>
        </div>
    );
}
