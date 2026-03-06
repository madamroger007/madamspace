"use client";

import Link from "next/link";
import { Twitter, Instagram, Github, Send } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="pt-24 pb-12 px-6 max-w-7xl mx-auto border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-12">
                <div className="space-y-4 text-center md:text-left">
                    <h1 className="text-3xl font-bold tracking-tighter text-accent-blue">NFT</h1>
                    <p className="text-white/40 text-sm">Copy Right project | All Rights reserves</p>
                </div>

                <div className="flex items-center gap-6">
                    <SocialIcon icon={<Send size={18} />} />
                    <SocialIcon icon={<Twitter size={18} />} />
                    <SocialIcon icon={<Github size={18} />} />
                    <SocialIcon icon={<Instagram size={18} />} />
                </div>

                <div className="text-center md:text-right space-y-2">
                    <p className="text-white/60 text-sm hover:text-white cursor-pointer transition-colors">Terms and Conditions</p>
                    <p className="text-white/40 text-xs">Valorant is a registered trademark of Riot.</p>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
    return (
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-accent-blue hover:text-white transition-all cursor-pointer">
            {icon}
        </div>
    );
}