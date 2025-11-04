"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

interface ModernSectionProps {
    title: string;
    description?: string;
    onSeeMore?: () => void;
    children: React.ReactNode;
    icon?: React.ReactNode;
}

const ModernSection: React.FC<ModernSectionProps> = ({
    title,
    description,
    onSeeMore,
    children,
    icon,
}) => {
    return (
        <div className="w-full mt-5 rounded-xl overflow-hidden border border-gray-700/30 bg-gradient-to-br from-[#1E2133] to-[#151728]">
            {/* Header with Gradient Background */}
            <div className="relative px-6 py-5 border-b border-gray-700/30 bg-gradient-to-r from-[#1E2133] via-[#26293E] to-[#1E2133]">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
                
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
                                {icon}
                            </div>
                        )}
                        <div className="space-y-1">
                            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                                {title}
                                <div className="h-1 w-1 rounded-full bg-teal-400 animate-pulse" />
                            </h2>
                            {description && (
                                <p className="text-xs md:text-sm text-gray-400">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {onSeeMore && (
                        <button
                            onClick={onSeeMore}
                            className="group flex items-center gap-1 px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 hover:border-teal-500/50 rounded-lg transition-all duration-300 text-teal-400 hover:text-teal-300 text-sm font-semibold"
                        >
                            <span className="hidden md:inline">See More</span>
                            <span className="md:hidden">More</span>
                            <ChevronRight 
                                size={16} 
                                className="group-hover:translate-x-1 transition-transform duration-300" 
                            />
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6">
                {children}
            </div>

            {/* Bottom Accent */}
            <div className="h-1 bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />
        </div>
    );
};

export default ModernSection;
