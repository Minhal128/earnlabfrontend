"use client";

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import TopBar from "@/Components/Topbar";
import PageNavigation from "@/Components/Shared/PageNavigation";
import TickerBar from "../../Components/Shared/TickerBar";
import FeaturedTask from "@/Components/HomePage/FeaturedTask";
import OfferWalls from "@/Components/HomePage/OfferWalls";

export default function Earn() {
    const [showFilters, setShowFilters] = useState(false);
    const [showFeatured, setShowFeatured] = useState(true);
    const [showOfferWalls, setShowOfferWalls] = useState(true);

    return (
        <>
            <TopBar />
            <PageNavigation />
            <main className="p-3 sm:p-4 md:p-6 bg-[#1E2133] min-h-screen">
                <TickerBar />

                <div className="px-3 sm:px-6 md:px-10 lg:px-16 mt-4 sm:mt-6 flex items-center justify-between gap-3">
                    <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-manrope)" }}>
                        Earning Opportunities
                    </h1>
                    <button
                        onClick={() => setShowFilters((v) => !v)}
                        className="h-10 px-3.5 rounded-xl border border-[#30334A] bg-[#151728] text-white text-sm sm:text-base font-medium flex items-center gap-2 hover:bg-[#1B1E32] transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                {showFilters && (
                    <div className="mx-3 sm:mx-6 md:mx-10 lg:mx-16 mt-3 rounded-xl border border-[#30334A] bg-[#151728] p-3 sm:p-4">
                        <p className="text-[#B3B6C7] text-xs sm:text-sm mb-3">Show sections</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setShowFeatured((v) => !v)}
                                className={`h-9 px-3 rounded-lg text-sm font-medium border transition-colors ${
                                    showFeatured
                                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                                        : "bg-[#1E2133] border-[#2E3247] text-[#A3A7BC]"
                                }`}
                            >
                                Featured Games
                            </button>
                            <button
                                onClick={() => setShowOfferWalls((v) => !v)}
                                className={`h-9 px-3 rounded-lg text-sm font-medium border transition-colors ${
                                    showOfferWalls
                                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                                        : "bg-[#1E2133] border-[#2E3247] text-[#A3A7BC]"
                                }`}
                            >
                                Offer Walls
                            </button>
                        </div>
                    </div>
                )}
                
                {showFeatured && <FeaturedTask />}
                {showOfferWalls && <OfferWalls />}
            </main>
        </>
    );
}
