"use client";

import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface ProviderCardProps {
    name: string;
    logo: string;
    rating: number; // 0 to 1
    bonus?: string;
    onClick?: () => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ name, logo, rating, bonus, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group relative w-full aspect-square rounded-[10px] bg-[#181A2C] border border-[#1E2133] hover:border-[#30334A] flex flex-col items-center justify-between p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
        >
            {/* Bonus Badge */}
            {bonus && (
                <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[5px]">
                    <span className="text-white text-[10px] font-bold">+{bonus}%</span>
                </div>
            )}

            {/* Logo */}
            <div className="flex-grow flex items-center justify-center w-full p-4">
                <img
                    src={logo}
                    alt={name}
                    className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                />
            </div>

            {/* Footer / Rating */}
            <div className="w-full flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-white text-base font-semibold truncate" style={{ fontFamily: "var(--font-dm-sans)" }}>
                        {name}
                    </span>
                    <div className="flex items-center gap-1 text-[#8C8FA8]">
                        <ThumbsUp size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-bold">{(rating * 100).toFixed(0)}%</span>
                    </div>
                </div>

                {/* Rating Bar */}
                <div className="w-full h-[3px] bg-red-500 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${rating * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProviderCard;
