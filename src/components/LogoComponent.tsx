"use client";
import Link from "next/link";

export default function LogoComponent() {
    return (
        <>
            <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-radial-[at_40%_80%] from-[#547792]/20 via-[#000080]/40 to-[#000000]/80 rounded-xl flex items-center justify-center shadow-lg shadow-neon-blue/20">
                    <span className="text-white font-syne font-bold text-xl">M</span>
                </div>
                <span className="text-2xl font-syne font-bold tracking-tight text-white group-hover:neon-text transition-all">
                    DM<span className="text-neon-blue">Space</span>
                </span>
            </Link>
        </>
    )
}