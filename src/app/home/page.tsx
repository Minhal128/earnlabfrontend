import TopBar from "@/Components/Topbar";
import React from "react";

import HeroSection from "@/Components/HomePage/HeroSection";
import RewardStreakBoxes from "@/Components/HomePage/RewardStreakBoxes";
import FeaturedTask from "@/Components/HomePage/FeaturedTask";
import OfferWalls from "@/Components/HomePage/OfferWalls";
import FeaturedSurvey from "@/Components/HomePage/FeaturedSurvey";
import ServeyWalls from "@/Components/Servey/ServeyWalls";
import WatchWalls from "@/Components/HomePage/WatchWalls";
import FeedBar from "@/Components/HomePage/FeedBar";
import RedOrBlackGame from "@/Components/HomePage/RedOrBlackGame";
import PricingHoldTimes from "@/Components/HomePage/PricingHoldTimes";

export default function Home() {
    return (
        <>
            <TopBar />
            <main className="min-h-screen bg-[#0A0C1A] pb-20 lg:pb-0">
                {/* Container with max width */}
                <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-3 sm:space-y-4 md:space-y-6">
                    {/* Hero Section */}
                    <HeroSection />

                    {/* Reward & Streak Boxes */}
                    <RewardStreakBoxes />

                    {/* Activity Feed */}
                    <FeedBar />

                    {/* Red or Black Daily Bonus Game */}
                    <RedOrBlackGame />

                    {/* Featured Content */}
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
