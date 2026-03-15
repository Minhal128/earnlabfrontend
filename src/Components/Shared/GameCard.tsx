"use client";

import React from "react";
import { Apple, Smartphone as Android, Monitor as Desktop, Star } from "lucide-react";

interface GameCardProps {
    title: string;
    image: string;
    reward: string;
    platforms: ("ios" | "android" | "desktop")[];
    isNew?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ title, image, reward, platforms, isNew }) => {
    return (
        <div className="group relative w-full aspect-[286/211] rounded-[10px] bg-[#181A2C] border-b-[3px] border-emerald-500 overflow-hidden cursor-pointer">
            {/* Platform Icons */}
            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
                {platforms.includes("ios") && <Apple size={14} className="text-[#8C8FA8]" />}
                {platforms.includes("android") && <Android size={14} className="text-[#8C8FA8]" />}
                {platforms.includes("desktop") && <Desktop size={14} className="text-[#8C8FA8]" />}
            </div>

            {/* New Badge */}
            {isNew && (
                <div className="absolute top-2.5 left-0 z-10 px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-r-[5px]">
                    <span className="text-white text-[10px] font-bold">NEW</span>
                </div>
            )}

            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${image})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#181A2C] via-transparent to-transparent opacity-80" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3.5 flex flex-col gap-1.5">
                <h3 className="text-white text-[17px] font-semibold leading-[20px] truncate" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {title}
                </h3>
                <div className="flex items-center gap-1.5">
                    <span
                        className="text-[20px] font-bold bg-clip-text text-transparent"
                        style={{
                            backgroundImage: "linear-gradient(337.7deg, rgba(255, 255, 255, 0) 40.23%, rgba(255, 255, 255, 0.6) 125.94%), #0AC07D",
                            fontFamily: "var(--font-manrope)"
                        }}
                    >
                        {reward}
                    </span>
                    <span className="text-[#B3B6C7] text-[13px] font-medium leading-[20px]" style={{ fontFamily: "var(--font-dm-sans)" }}>Points</span>
                </div>
            </div>
        </div>
    );
};

export default GameCard;
