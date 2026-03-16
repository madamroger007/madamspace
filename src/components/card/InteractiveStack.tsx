"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import FireEffect from "../FireEffect";
import { Product } from "@/src/types/type";
import { getYouTubeEmbedUrl } from "../../utils/utils";
import { useCallback } from "react";

interface InteractiveStackProps {
    cards: Product[];
    variant?: "stack" | "fan";
    containerClassName?: string;
}

export default function InteractiveStack({
    cards,
    variant = "stack",
    containerClassName
}: InteractiveStackProps) {
    const [stack, setStack] = useState(cards);
    const [isAnimating, setIsAnimating] = useState(false);

    const swipeCard = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);

        setTimeout(() => {
            setStack((prev) => {
                if (prev.length <= 1) return prev;
                const newStack = [...prev];
                const topCard = newStack.shift()!;
                newStack.push(topCard);
                return newStack;
            });
            setIsAnimating(false);
        }, 3000);
    }, [isAnimating]);

    const defaultContainerClass = variant === "stack"
        ? "relative h-[400px] md:h-[500px] w-full gap-10 flex items-center justify-center "
        : "relative h-[450px] md:h-[550px] w-full flex items-center justify-center";

    useEffect(() => {
        const interval = setInterval(swipeCard, 4000);
        if (isAnimating) return;
        return () => clearInterval(interval);
    }, [isAnimating, swipeCard]);

    useEffect(() => {
        setStack(cards);
    }, [cards]);

    return (
        <div className={containerClassName || defaultContainerClass}>
            <AnimatePresence mode="popLayout">
                {stack.map((card, index) => {
                    const isTop = index === 0;

                    return (
                        <motion.div
                            key={card.id}
                            initial={false}
                            animate={
                                variant === "stack"
                                    ? {
                                        x: index * 100,
                                        scale: 1 - index * 0.3,
                                        opacity: 1 - index * 0.1,
                                        zIndex: stack.length - index,
                                    }
                                    : {
                                        x: index === 0 ? 0 : index === 1 ? -150 : 150,
                                        rotate: index === 0 ? 0 : index === 1 ? -15 : 15,
                                        scale: index === 0 ? 1 : 0.9,
                                        opacity: index < 3 ? 1 : 0,
                                        zIndex: stack.length - index,
                                    }
                            }
                            exit={isTop ? {
                                x: 300,
                                opacity: 0,
                                scale: 0.8,
                                transition: { duration: 0.6, ease: "easeInOut" }
                            } : undefined}
                            className="absolute w-[240px] sm:w-[280px] md:w-[320px] aspect-[3/4] glass-card rounded-2xl p-4 shadow-2xl cursor-pointer"
                        >
                            <div className="relative w-full h-[85%] rounded-xl overflow-hidden mb-4 group/fire">
                                {card.videoUrl ? (
                                    <div className="relative w-full h-full">
                                        <iframe
                                            src={getYouTubeEmbedUrl(card.videoUrl) || ""}
                                            className="absolute inset-0 w-full h-full border-0"
                                            allow="autoplay; encrypted-media"
                                            allowFullScreen
                                            loading="lazy"
                                        />
                                    </div>
                                ) : (
                                    <Image
                                        src={card.image || "/nft-card-1.png"}
                                        alt={card.name}
                                        fill
                                        loading="lazy"
                                        className="object-cover transition-transform duration-500 group-hover/fire:scale-110"
                                    />
                                )}

                                {isTop && (
                                    <div className="absolute inset-0 opacity-0 group-hover/fire:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <FireEffect />
                                    </div>
                                )}
                            </div>

                            {(variant === "stack" || isTop) && (
                                <div className="p-1">
                                    <h4 className="text-xs md:text-sm font-syne font-bold mb-1">{card.name}</h4>
                                    <div className="flex justify-between items-end text-[10px] md:text-xs">
                                        <div>
                                            <p className="text-white/40">Price:</p>
                                            <p className="text-white/40">{card.createdAt}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-neon-blue">{card.price}</p>
                                            <p className="text-white/40">{card.likes} Likes</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}