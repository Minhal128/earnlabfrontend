import TopBar from "@/Components/Topbar";
import PageNavigation from "@/Components/Shared/PageNavigation";
import React from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

import FeaturedTask from "@/Components/HomePage/FeaturedTask";
import OfferWalls from "@/Components/HomePage/OfferWalls";
import FeaturedSurvey from "@/Components/HomePage/FeaturedSurvey";
import ServeyWalls from "@/Components/Servey/ServeyWalls";
import WatchWalls from "@/Components/HomePage/WatchWalls";
import PricingHoldTimes from "@/Components/HomePage/PricingHoldTimes";

export default function Earn() {
    return (
        <>
            <TopBar />
            <PageNavigation />
            <main className="min-h-screen bg-[#0A0C1A] pb-20 lg:pb-0">
                {/* Container with max width */}
                <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-3 sm:space-y-4 md:space-y-6">
                    {/* Navigation to Leaderboard */}
                    <div className="flex justify-between items-center mb-8">
                        <div></div>
                        <Link 
                            href="/leaderboard"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20"
                        >
                            <TrendingUp className="w-4 h-4" />
                            <span>View Leaderboard</span>
                        </Link>
                    </div>

                    {/* Earn Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                                Start Earning
                            </span>
                        </h1>
                        <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
                            Complete tasks, surveys, and offers to earn real money. Choose from hundreds of available opportunities.
                        </p>
                    </div>

                    {/* Earning Opportunities */}
                    <FeaturedTask />
                    <OfferWalls />
                    <FeaturedSurvey />
                    <ServeyWalls />
                    <WatchWalls />

                    {/* Pricing & Hold Times Section */}
                    <PricingHoldTimes />
                </div>
            </main>
        </>
    );
}
