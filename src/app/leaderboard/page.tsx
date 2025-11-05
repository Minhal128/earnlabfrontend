import TopBar from "@/Components/Topbar";
import React from "react";
import LeaderBoard from "@/Components/Leaderboard.tsx/Leaderboard";
import FeedBar from "@/Components/HomePage/FeedBar";

export default function LeaderBoardMain() {
    return (
        <>
            <TopBar />
            <main className="min-h-screen bg-[#0A0C1A] pb-20 lg:pb-0">
                {/* Page Content */}
                <LeaderBoard />
            </main>
        </>
    );
}
