"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const deviceData = [
    {
        name: "Desktop View",
        image: "/hero-nft.png",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Example video
        frameClass: "w-full md:w-[600px] aspect-[16/10] rounded-[24px]",
        innerClass: "rounded-[20px]",
        bezel: "p-2 bg-white/10"
    },
    {
        name: "Tablet View",
        image: "/nft-card-1.png",
        frameClass: "w-[300px] aspect-[3/4] rounded-[32px]",
        innerClass: "rounded-[28px]",
        bezel: "p-3 bg-white/10"
    },
    {
        name: "Mobile View",
        image: "/creator-avatar.png",
        frameClass: "w-[180px] aspect-[9/19] rounded-[40px]",
        innerClass: "rounded-[36px]",
        bezel: "p-3 bg-white/10"
    }
];

const getYouTubeEmbedUrl = (url: string, isPlaying: boolean) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;

    if (!videoId) return null;

    if (isPlaying) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&modestbranding=1`;
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1`;
};

export default function DevicePreview() {
    const [playingName, setPlayingName] = React.useState<string | null>(null);

    return (
        <div className="overflow-hidden">
            <div className="text-center mb-24">
                <h3 className="text-neon-blue font-syne font-bold text-xs uppercase tracking-[0.5em] mb-4">Responsive Layout</h3>
                <h2 className="text-4xl md:text-6xl font-syne font-bold mb-8">
                    View Of Desain Layout
                </h2>
                <p className="text-white/40 max-w-xl mx-auto font-space text-sm md:text-base">
                    Our design is fully responsive and optimized for any device. Check out how your NFT marketplace looks on different screens.
                </p>
            </div>

            <div className="flex flex-wrap justify-center items-center md:items-end gap-10 md:gap-20">
                {deviceData.map((device, i) => (
                    <motion.div
                        key={device.name}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2, duration: 0.8 }}
                        className="flex flex-col items-center group w-full sm:w-auto"
                    >
                        {/* Device Mockup */}
                        <div
                            className={`relative ${device.frameClass} ${device.bezel} border border-white/10 shadow-2xl glass-card transition-transform duration-500 lg:group-hover:-translate-y-4 mx-auto max-w-[90vw] md:max-w-none cursor-pointer`}
                            onClick={() => {
                                if (device.videoUrl) {
                                    setPlayingName(playingName === device.name ? null : device.name);
                                }
                            }}
                        >
                            <div className={`relative w-full h-full ${device.innerClass} overflow-hidden bg-black`}>
                                {device.videoUrl && (playingName === device.name || playingName === null) ? (
                                    <div className="relative w-full h-full">
                                        <iframe
                                            src={getYouTubeEmbedUrl(device.videoUrl, playingName === device.name) || ""}
                                            className="absolute inset-0 w-full h-full border-0"
                                            allow="autoplay; encrypted-media"
                                            allowFullScreen
                                        />
                                        {playingName !== device.name && (
                                            <div className="absolute inset-0 bg-transparent z-10" />
                                        )}
                                    </div>
                                ) : (
                                    <Image
                                        src={device.image}
                                        alt={device.name}
                                        fill
                                        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                )}

                                {/* Overlay Screen Shine */}
                                <div className="absolute inset-0  pointer-events-none" />

                                {device.videoUrl && playingName !== device.name && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                        <div className="w-12 h-12 rounded-full bg-neon-blue/80 flex items-center justify-center text-white shadow-lg">
                                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Device Accents (Buttons/Sensors) */}
                            {device.name === "Mobile View" && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-3 sm:h-4 bg-black/80 rounded-full z-10" />
                            )}
                            {device.name === "Tablet View" && (
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-1 h-10 sm:h-12 bg-white/20 rounded-full" />
                            )}
                        </div>

                        {/* Label */}
                        <div className="mt-6 md:mt-8 text-center flex flex-col items-center gap-2">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/40 group-hover:text-neon-blue transition-colors">
                                {device.name}
                            </span>
                            <div className="w-8 h-0.5 bg-neon-blue rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Background Decor */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-purple/20 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-blue/20 blur-[150px] rounded-full" />
            </div>
        </div>
    );
}
