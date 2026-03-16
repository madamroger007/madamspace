import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Trash2 } from "lucide-react";
import { formatMoneyFromIdr, getYouTubeEmbedUrl } from "@/src/utils/utils";
import { CheckoutItem, LocaleCurrency } from "./checkout-types";

type CheckoutItemCardProps = {
    item: CheckoutItem;
    index: number;
    localeCurrency: LocaleCurrency;
    onDelete: (productId: number) => void;
    onIncrement: (item: CheckoutItem) => void;
    onDecrement: (productId: number) => void;
};

export default function CheckoutItemCard({
    item,
    index,
    localeCurrency,
    onDelete,
    onIncrement,
    onDecrement,
}: CheckoutItemCardProps) {
    return (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row gap-8 group"
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <div className="relative w-full md:w-64 aspect-square rounded-2xl overflow-hidden shrink-0">
                {item.videoUrl ? (
                    <div className="relative w-full h-full">
                        <iframe
                            src={getYouTubeEmbedUrl(item.videoUrl) || ""}
                            className="absolute inset-0 w-full h-full border-0 pointer-events-none scale-150"
                            allow="autoplay; encrypted-media"
                        />
                        <div className="absolute inset-0 bg-transparent" />
                    </div>
                ) : (
                    <Image
                        src={item.image ?? "/nft-card-1.png"}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                )}

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest backdrop-blur-xl bg-black/40 border border-white/10">
                    {item.category}
                </div>

                {item.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <Play className="w-10 h-10 text-white fill-white shadow-2xl" />
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl md:text-2xl font-syne font-bold group-hover:text-neon-blue transition-colors">
                            {item.name}
                        </h3>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 flex items-center justify-center transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-white/40 text-sm md:text-base leading-relaxed mb-6 max-w-lg">{item.description}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                        <button
                            onClick={() => onDecrement(item.id)}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-neon-blue/20 flex items-center justify-center font-bold transition-colors"
                        >
                            -
                        </button>
                        <span className="font-syne font-bold text-lg min-w-[20px] text-center">{item.quantity}</span>
                        <button
                            onClick={() => onIncrement(item)}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-neon-blue/20 flex items-center justify-center font-bold transition-colors"
                        >
                            +
                        </button>
                    </div>

                    <div className="text-right">
                        <p className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Line Total</p>
                        <p className="font-syne font-bold text-xl text-neon-blue">
                            {formatMoneyFromIdr(item.price * item.quantity, localeCurrency)}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
