import TopBar from "@/Components/Topbar";
import PageNavigation from "@/Components/Shared/PageNavigation";
import React from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import FeaturedTask from "@/Components/HomePage/FeaturedTask";
import Tasks from "@/Components/Tasks/Tasks";
import FeedBar from "@/Components/HomePage/FeedBar";

export default function Task() {
    return (
        <>
            <TopBar />
            <PageNavigation />
            <main className="md:p-6 p-3 bg-[#1E2133] min-h-screen">
                {/* Navigation to Leaderboard */}
                <div className="flex justify-end mb-6">
                    <Link 
                        href="/leaderboard"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20"
                    >
                        <TrendingUp className="w-4 h-4" />
                        <span>View Leaderboard</span>
                    </Link>
                </div>

                <FeedBar />

                {/* Page Content */}
                <FeaturedTask />
                <Tasks />
            </main>
        </>
    );
}
