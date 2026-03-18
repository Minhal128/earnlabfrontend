"use client";

import TopBar from "@/Components/Topbar";
import PageNavigation from "@/Components/Shared/PageNavigation";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowLeft } from "lucide-react";
import ServeyWalls from "@/Components/Servey/ServeyWalls";
import FeedBar from "@/Components/HomePage/FeedBar";

export default function ProfileMain() {
    const router = useRouter();
    return (
        <>
            <TopBar />
            <PageNavigation />
            <main className="md:p-6 p-3 bg-[#1E2133] min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>

                    {/* Navigation to Leaderboard */}
                    <Link
                        href="/leaderboard"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20"
                    >
                        <TrendingUp className="w-4 h-4" />
                        <span>View Leaderboard</span>
                    </Link>
                </div>

                <FeedBar />
                <ServeyWalls />
            </main>
        </>
    );
}
