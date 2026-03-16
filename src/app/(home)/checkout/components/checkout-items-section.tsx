import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import CheckoutItemCard from "./checkout-item-card";
import { CheckoutItem, CustomerInfo, LocaleCurrency } from "./checkout-types";
import CustomerInfoForm from "./customer-info-form";

type CheckoutItemsSectionProps = {
    cart: CheckoutItem[];
    customerInfo: CustomerInfo;
    localeCurrency: LocaleCurrency;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDelete: (productId: number) => void;
    onIncrement: (item: CheckoutItem) => void;
    onDecrement: (productId: number) => void;
};

export default function CheckoutItemsSection({
    cart,
    customerInfo,
    localeCurrency,
    onInputChange,
    onDelete,
    onIncrement,
    onDecrement,
}: CheckoutItemsSectionProps) {
    return (
        <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl md:text-4xl font-syne font-bold mb-8">Order Details</h2>

            <CustomerInfoForm customerInfo={customerInfo} onInputChange={onInputChange} />

            <h3 className="text-xl font-syne font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue text-sm">2</span>
                Review Items
            </h3>

            <AnimatePresence mode="popLayout">
                {cart.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-12 text-center"
                    >
                        <ShoppingBag className="w-16 h-16 text-white/10 mx-auto mb-4" />
                        <p className="text-white/40 mb-6">Your cart is empty</p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm transition-transform hover:scale-105"
                        >
                            Go to Products
                        </Link>
                    </motion.div>
                ) : (
                    cart.map((item, idx) => (
                        <CheckoutItemCard
                            key={item.id}
                            item={item}
                            index={idx}
                            localeCurrency={localeCurrency}
                            onDelete={onDelete}
                            onIncrement={onIncrement}
                            onDecrement={onDecrement}
                        />
                    ))
                )}
            </AnimatePresence>
        </div>
    );
}
