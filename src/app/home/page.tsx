import TopBar from "@/Components/Topbar";
import Image, { type StaticImageData } from "next/image";
import React from "react";

import FeaturedTask from "@/Components/HomePage/FeaturedTask";
import OfferWalls from "@/Components/HomePage/OfferWalls";
import FeaturedSurvey from "@/Components/HomePage/FeaturedSurvey";
import ServeyWalls from "@/Components/Servey/ServeyWalls";
import WatchWalls from "@/Components/HomePage/WatchWalls";
import FeedBar from "@/Components/HomePage/FeedBar";

export default function Home() {
    return (
        <>
            <TopBar />
            <main className="md:p-6 p-3 bg-[#1E2133] min-h-screen">
                <FeedBar />

                {/* Page Content */}
                <FeaturedTask />
                <OfferWalls />
                <FeaturedSurvey />
                <ServeyWalls />
                <WatchWalls />
            </main>
        </>
    );
}
