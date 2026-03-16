"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import FireEffect from "@/src/components/FireEffect";
import LogoComponent from "@/src/components/LogoComponent";

const creatorStats = [
    { label: "Images", val: "100+" },
    { label: "Videos", val: "100+" },
    { label: "Website", val: "100+" },
];

export default function ArtworkCTA() {
    return (
        <div>
            <div className="grid md:grid-cols-2 gap-20 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-syne font-bold mb-8 leading-tight">
                        Make Your Design Now!
                    </h2>
                    <div className="space-y-6 mb-12">
                        <p className="text-white/40 text-sm leading-relaxed font-space max-w-lg">
                            We provide professional design improvement services to help transform your ideas into visually appealing and functional results. Our team focuses on refining layouts, enhancing visual hierarchy, and creating modern, user-friendly designs that align with your brand identity.
                        </p>
                        <p className="text-white/40 text-sm leading-relaxed font-space max-w-lg">
                            we analyze existing designs and optimize them with better structure, typography, color balance, and usability. Our goal is to ensure that every design not only looks attractive but also communicates clearly and delivers an excellent user experience.
                        </p>
                    </div>

                    <button className="poly-button font-syne text-base md:text-lg uppercase tracking-wider mx-auto lg:mx-0 hover:border-b-4 hover:border-neon-blue hover:text-neon-blue transition-colors">
                        Explore Now
                    </button>
                </motion.div>

                {/* Right Content - Full Creator Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="glass-card rounded-3xl p-10 relative z-10 bg-white/[0.02]">
                        {/* Header info */}
                        <div className="flex items-center gap-5 mb-10">
                            <LogoComponent />

                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mb-12">
                            {creatorStats.map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3 font-bold">{stat.label}</p>
                                    <p className="text-xl font-bold font-syne">{stat.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Thumbnails row */}
                        <div className="grid grid-cols-5 gap-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className={`relative aspect-[3/4] rounded-lg overflow-hidden border border-white/5 transition-all hover:border-neon-blue/50 group/fire cursor-pointer ${i === 3 ? "scale-110 shadow-xl shadow-neon-blue/20 z-10 border-neon-blue/30" : ""
                                        }`}
                                >
                                    <Image
                                        src={`/nft-card-1.png`}
                                        alt="Work"
                                        fill={true}
                                        loading="lazy"
                                        className="object-cover group-hover/fire:scale-110 transition-transform"
                                    />
                                    <div className="absolute inset-0 opacity-0 group-hover/fire:opacity-100 transition-opacity duration-300">
                                        <FireEffect />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/fire:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-1 left-1 right-1 text-[6px] opacity-0 group-hover/fire:opacity-100 transition-opacity">
                                        <p className="font-bold">#132</p>
                                        <p className="text-white/60">5 ETH</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-neon-blue/5 blur-[100px] -z-10" />
                </motion.div>
            </div>
        </div>
    );
}
