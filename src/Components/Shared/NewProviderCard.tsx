"use client";

import React from "react";

const IcoStar: React.FC<{ active: boolean }> = ({ active }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill={active ? "#FBBF24" : "#374151"}
  >
    <path d="M8 0L10.09 5.26L16 6.06L12 10.08L12.92 16L8 13.27L3.08 16L4 10.08L0 6.06L5.91 5.26L8 0Z" />
  </svg>
);

const fallbackGameImages = [
  "/game-angry-bird.png",
  "/game-big-giant.png",
  "/game-goblins-woods.png",
  "/game-monopoly.png",
  "/game-screw-factory.png",
  "/game-slot.png",
  "/game-tile-tap-master.png",
  "/game-torox.png",
  "/game-worldcoin.png",
  "/farm-lobby.jpg",
  "/block-puzzle.png",
  "/coin-runner.jpg",
  "/maze-escape.png",
  "/jungle-adventure.jpg",
  "/img1.png",
  "/img2.png",
];

const getFallbackImage = (name?: string) => {
  const key = String(name || "default").toLowerCase();
  const index = Array.from(key).reduce((acc, char) => acc + char.charCodeAt(0), 0) % fallbackGameImages.length;
  return fallbackGameImages[index];
};




interface ProviderCardProps {
    name?: string;
    logoUrl?: string;
    progress?: number;
    bonus?: string;
    rating?: number;
    reviews?: number;
    description?: string;
    amount?: string;
    color?: string; // e.g., "#3BF7B1" or "emerald"
    onClick?: () => void;
}

const formatName = (name?: string) => 
    name?.replace(/EarnLab/gi, "Labwards") ?? "Offerwall";

const NewProviderCard: React.FC<ProviderCardProps> = ({
    name,
    logoUrl,
    progress = 55,
    bonus,
    rating = 4.2,
    reviews = 120,
    description,
    amount,
    color = "#3BF7B1",
    onClick,
}) => {
    const activeStars = Math.max(1, Math.min(5, Math.round(rating)));
    const heroImage = logoUrl || getFallbackImage(name);

    return (
        <div
            onClick={onClick}
            className="flex-shrink-0 relative overflow-hidden transition-all duration-300 w-[280px] sm:w-[320px] hover:translate-y-[-4px] cursor-pointer"
        >
            <div 
                className="relative w-full overflow-hidden rounded-[16px] bg-[#151728] border border-[#26293D] transition-colors"
                style={{ borderColor: `${color}20` } as React.CSSProperties}
            >
                {/* Hero Image Section */}
                <div className="relative h-[170px] bg-[#09101F] overflow-hidden">
                    <img
                        src={heroImage}
                        alt={name || "Offer"}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    {bonus && (
                        <div 
                            className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full shadow-lg"
                            style={{ backgroundColor: color }}
                        >
                            <span className="text-[#09101F] text-[10px] font-extrabold">+{bonus}%</span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="text-white text-[18px] font-bold tracking-tight truncate flex-1" style={{ fontFamily: "var(--font-manrope)" }}>
                            {formatName(name)}
                        </h3>
                        {amount && (
                            <div 
                                className="flex-shrink-0 rounded-full bg-[#1C2036] px-3 py-1.5 text-sm font-bold border border-[#2D3142]"
                                style={{ color: color }}
                            >
                                {amount}
                            </div>
                        )}
                    </div>

                    <p className="text-[#8C8FA8] text-xs sm:text-[13px] font-medium leading-relaxed line-clamp-2" style={{ fontFamily: "var(--font-dm-sans)" }}>
                        {description || "Play for 5 mins and earn rewards"}
                    </p>

                    <button 
                        className="w-full mt-1 rounded-full py-3 text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.98]"
                        style={{ 
                            backgroundColor: color,
                            boxShadow: `0 8px 20px ${color}20`
                        }}
                    >
                        Play and earn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewProviderCard;