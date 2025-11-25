import TopBar from "@/Components/Topbar";
import PageNavigation from "@/Components/Shared/PageNavigation";
import React from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import TopSection from "@/Components/Rewards/TopSection";


export default function Home() {
    return (
        <>
            <TopBar />
            <PageNavigation />
            <main className="min-h-screen bg-[#0A0C1A] pb-20 lg:pb-0">
                <div className="bg-[#0A0C1A] px-4 sm:px-6 lg:px-8 py-4">
                    <div className="max-w-7xl mx-auto flex justify-end">
                        <Link 
                            href="/leaderboard"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20"
                        >
                            <TrendingUp className="w-4 h-4" />
                            <span>View Leaderboard</span>
                        </Link>
                    </div>
                </div>
                <TopSection />
            </main>
        </>
    );
}
