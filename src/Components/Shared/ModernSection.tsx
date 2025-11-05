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
        <div className="w-full rounded-2xl overflow-hidden border border-[#2A2D3E] bg-[#1A1D2E]">
            {/* Header */}
            <div className="relative px-6 py-5 border-b border-[#2A2D3E]">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
                
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className="p-2.5 bg-emerald-500/10 rounded-lg">
                                {icon}
                            </div>
                        )}
                        <div className="space-y-1">
                            <h2 className="text-xl md:text-2xl font-bold text-white">
                                {title}
                            </h2>
                            {description && (
                                <p className="text-sm text-[#9CA3AF]">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {onSeeMore && (
                        <button
                            onClick={onSeeMore}
                            className="group flex items-center gap-1 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg transition-all duration-200 text-emerald-400 hover:text-emerald-300 text-sm font-semibold"
                        >
                            <span className="hidden md:inline">See More</span>
                            <span className="md:hidden">More</span>
                            <ChevronRight 
                                size={16} 
                                className="group-hover:translate-x-1 transition-transform duration-200" 
                            />
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default ModernSection;
