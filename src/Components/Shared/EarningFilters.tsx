"use client";

import React from "react";
import { Search, ChevronDown, LayoutGrid, Zap, Timer, DollarSign, Puzzle, Ticket, Disc as Casino } from "lucide-react";

const EarningFilters: React.FC = () => {
    return (
        <div
            className="w-full flex flex-col lg:flex-row items-center justify-between gap-4 p-2.5 bg-[#151728] border border-[#1E2133] rounded-[10px]"
        >
            {/* Categories */}
            <div className="flex items-center gap-[28px] overflow-x-auto scrollbar-hide">
                <CategoryItem label="View all" icon={<LayoutGrid size={24} />} count="1K" active />
                <CategoryItem label="Fast completion" icon={<Zap size={24} />} count="0" />
                <CategoryItem label="Sign up trial" icon={<Timer size={24} />} count="0" />
                <CategoryItem label="Save money" icon={<DollarSign size={24} />} count="0" />
                <CategoryItem label="Casino" icon={<Casino size={24} />} count="0" />
                <CategoryItem label="Puzzle" icon={<Puzzle size={24} />} count="0" />
                <CategoryItem label="Sweepstake" icon={<Ticket size={24} />} count="0" />
            </div>

            {/* Search and Dropdowns */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
                <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#1E2133] border border-[#26293E] rounded-[7px] grow lg:w-[361px]">
                    <Search size={16} className="text-[#8C8FA8]" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent border-none outline-none text-[#6B6E8A] text-sm font-medium w-full"
                    />
                </div>

                <Dropdown label="Sort by" />
                <Dropdown label="Providers" />
            </div>
        </div>
    );
};

const CategoryItem = ({ label, icon, count, active }: { label: string; icon: React.ReactNode; count: string; active?: boolean }) => (
    <div className="relative group cursor-pointer flex flex-col items-center gap-1 group">
        <div className="flex flex-col items-center gap-[2px]">
            <div className={`${active ? "text-white" : "text-[#8C8FA8]"} transition-colors`}>
                {icon}
            </div>
            <span className={`text-[13px] leading-[20px] font-medium tracking-[-0.01em] ${active ? "text-white" : "text-[#8C8FA8]"} whitespace-nowrap`}>
                {label}
            </span>
        </div>
        {count && (
            <div className="absolute top-0 -right-4 px-1.5 py-0.5 bg-[rgba(126,129,147,0.2)] rounded-[5px] min-w-[16px] flex items-center justify-center">
                <span className="text-white text-[9.3px] font-medium">{count}</span>
            </div>
        )}
    </div>
);

const Dropdown = ({ label }: { label: string }) => (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-[#1E2133] border border-[#26293E] rounded-[7px] cursor-pointer hover:bg-[#26293E] transition-colors shrink-0">
        <span className="text-[#6B6E8A] text-sm font-medium truncate">{label}</span>
        <ChevronDown size={12} className="text-white" />
    </div>
);

export default EarningFilters;
