"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { ExternalLink, TrendingUp } from "lucide-react";

interface ModernCardProps {
    image: StaticImageData | string;
    title: string;
    description?: string;
    reward?: number;
    onClick?: () => void;
    variant?: "default" | "featured" | "compact";
    showPlatforms?: boolean;
    platforms?: ("web" | "ios" | "android")[];
}

const ModernCard: React.FC<ModernCardProps> = ({
    image,
    title,
    description,
    reward,
    onClick,
    variant = "default",
    showPlatforms = false,
    platforms = ["web", "ios", "android"],
}) => {
    const isCompact = variant === "compact";
    const isFeatured = variant === "featured";

    return (
        <div
            onClick={onClick}
            className={`
                group relative overflow-hidden rounded-xl transition-all duration-300
                ${onClick ? "cursor-pointer" : ""}
                ${isFeatured 
                    ? "bg-gradient-to-br from-[#1E2133] via-[#26293E] to-[#1E2133] border-2 border-teal-500/30 hover:border-teal-400" 
                    : "bg-[#1E2133] border border-gray-700/50 hover:border-teal-500/50"
                }
                ${onClick ? "hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-500/10" : ""}
            `}
        >
            {/* Gradient Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 via-transparent to-purple-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

            {/* Image Container */}
            <div className={`relative ${isCompact ? "h-24" : "h-32 md:h-40"} overflow-hidden`}>
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E2133] via-transparent to-transparent z-10" />
                
                {typeof image === "string" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                )}

                {/* Featured Badge */}
                {isFeatured && (
                    <div className="absolute top-2 right-2 z-20">
                        <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full text-[10px] font-bold text-white shadow-lg">
                            <TrendingUp size={10} />
                            FEATURED
                        </div>
                    </div>
                )}

                {/* Reward Badge */}
                {reward !== undefined && (
                    <div className="absolute top-2 left-2 z-20">
                        <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-yellow-500/30">
                            <span className="text-yellow-400 text-xs font-bold">
                                +{reward}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={`p-3 ${isCompact ? "space-y-1" : "space-y-2"}`}>
                {/* Title */}
                <h3 className={`
                    font-semibold text-white group-hover:text-teal-400 transition-colors line-clamp-1
                    ${isCompact ? "text-xs" : "text-sm md:text-base"}
                `}>
                    {title}
                </h3>

                {/* Description */}
                {description && !isCompact && (
                    <p className="text-xs text-gray-400 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2">
                    {/* Platform Icons */}
                    {showPlatforms && (
                        <div className="flex gap-1.5">
                            {platforms.includes("web") && (
                                <div className="w-6 h-6 flex items-center justify-center bg-[#26293E] rounded-full border border-gray-700 group-hover:border-teal-500 transition-colors">
                                    <svg className="w-3 h-3 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11H6v2H4v-2H2V9h2V7h2v2h2v2zm6 0h-2v2h-2v-2h-2V9h2V7h2v2h2v2z"/>
                                    </svg>
                                </div>
                            )}
                            {platforms.includes("ios") && (
                                <div className="w-6 h-6 flex items-center justify-center bg-[#26293E] rounded-full border border-gray-700 group-hover:border-teal-500 transition-colors">
                                    <svg className="w-3 h-3 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13.2 2.6c.7-.8 1.2-2 1-3.2-1 .1-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.3zm4.5 13.1c-.5 1.1-1.1 2.1-2 3.1-.8.9-1.5 1.5-2 1.5-.5 0-1.2-.2-2-.5-.8-.4-1.5-.5-2.2-.5-.7 0-1.5.2-2.3.6-.8.3-1.4.5-1.8.5-.5 0-1.2-.6-2.1-1.7-1-1.2-1.8-2.6-2.4-4.2-.6-1.7-.9-3.3-.9-4.8 0-1.8.4-3.3 1.2-4.5.8-1.2 2-1.8 3.5-1.8.9 0 2 .3 3.2.9 1.2.6 2 .9 2.3.9.3 0 1.3-.4 2.8-1.1 1.4-.7 2.6-1 3.5-.9 2.6.2 4.5 1.3 5.8 3.3-2.3 1.4-3.4 3.3-3.4 5.7 0 1.9.7 3.5 2 4.8.6.6 1.3 1.1 2.1 1.4-.2.5-.4 1-.6 1.5z"/>
                                    </svg>
                                </div>
                            )}
                            {platforms.includes("android") && (
                                <div className="w-6 h-6 flex items-center justify-center bg-[#26293E] rounded-full border border-gray-700 group-hover:border-teal-500 transition-colors">
                                    <svg className="w-3 h-3 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3.5 8.5v5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5zm10 0v5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5zM7 7v7c0 .6.4 1 1 1h1v2.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V15h1c.6 0 1-.4 1-1V7H7zm5.6-4.5l.9-1.6c.1-.1 0-.3-.1-.3-.1-.1-.3 0-.3.1l-.9 1.6c-.7-.3-1.5-.5-2.3-.5s-1.6.2-2.3.5L6.7.7c-.1-.1-.3-.1-.3.1-.1.1 0 .3.1.3l.9 1.6C5.7 3.5 4.5 5 4.5 6.8h11c0-1.8-1.2-3.3-2.9-4.3zM8.5 5c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5zm3 0c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5z"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Icon */}
                    {onClick && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-teal-400 transition-colors">
                            <span className="hidden md:inline">View</span>
                            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );
};

export default ModernCard;
