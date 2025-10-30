import TopBar from "@/Components/Topbar";
import React from "react";
import LeaderBoard from "@/Components/Leaderboard.tsx/Leaderboard";
import FeedBar from "@/Components/HomePage/FeedBar";

export default function LeaderBoardMain() {
    return (
        <>
            <TopBar />
            <main className="md:p-6 p-3 bg-[#1E2133] min-h-screen">
                <FeedBar />

                {/* Page Content */}
                <LeaderBoard />
            </main>
        </>
    );
}
