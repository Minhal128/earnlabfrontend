import TopBar from "@/Components/Topbar";
import React from "react";

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
            <main className="min-h-screen bg-[#0A0C1A] pb-20 lg:pb-0">
                {/* Container with max width */}
                <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-3 sm:space-y-4 md:space-y-6">
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
