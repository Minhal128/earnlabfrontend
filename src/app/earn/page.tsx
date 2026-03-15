"use client";

import React from "react";
import TopBar from "@/Components/Topbar";
import PageNavigation from "@/Components/Shared/PageNavigation";
import FeaturedTask from "@/Components/HomePage/FeaturedTask";
import OfferWalls from "@/Components/HomePage/OfferWalls";
import FeedBar from "@/Components/HomePage/FeedBar";

export default function Earn() {
    return (
        <>
            <TopBar />
            <PageNavigation />
            <main className="p-3 sm:p-4 md:p-6 bg-[#1E2133] min-h-screen">
                <FeedBar />
                
                {/* Earning Opportunities */}
                <FeaturedTask />
                <OfferWalls />
            </main>
        </>
    );
}
