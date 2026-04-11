import TopBar from "@/Components/Topbar";
import PageNavigation from "@/Components/Shared/PageNavigation";
import React from "react";
import Link from "next/link";
import { CheckSquare, Clock3, ListChecks, TrendingUp } from "lucide-react";
import Tasks from "@/Components/Tasks/Tasks";

const quickStats = [
    { label: "Live Tasks", value: "500+", icon: ListChecks },
    { label: "Avg. Completion", value: "8 min", icon: Clock3 },
    { label: "Task Categories", value: "12", icon: CheckSquare },
];

export default function Task() {
    return (
        <>
            <TopBar />
            <PageNavigation />
            <main className="md:p-6 p-3 bg-[#1E2133] min-h-screen">
                <section className="mb-5 rounded-xl border border-[#30334A] bg-gradient-to-b from-[#1A1D2E] to-[#151728] p-4 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-white text-xl sm:text-2xl font-bold">Tasks Hub</h1>
                            <p className="text-[#8C8FA8] text-sm sm:text-base mt-1">
                                Complete independent tasks and track your progress in one place.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Link
                                href="/earn"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#30334A] text-[#B3B6C7] hover:text-white hover:border-[#4A4E73] text-sm font-semibold transition-all duration-200"
                            >
                                <span>Go to Earn</span>
                            </Link>
                            <Link
                                href="/leaderboard"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20"
                            >
                                <TrendingUp className="w-4 h-4" />
                                <span>Leaderboard</span>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {quickStats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={stat.label}
                                    className="rounded-lg border border-[#30334A] bg-[#1E2133] px-4 py-3"
                                >
                                    <div className="flex items-center gap-2 text-[#8C8FA8] text-xs sm:text-sm">
                                        <Icon className="w-4 h-4 text-emerald-400" />
                                        {stat.label}
                                    </div>
                                    <p className="mt-1 text-lg sm:text-xl font-bold text-white">{stat.value}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="mb-4">
                    <p className="text-[#8C8FA8] text-xs sm:text-sm">
                        Tip: Use filters inside the task list to find high-value or device-specific tasks quickly.
                    </p>
                </div>

                <Tasks />
            </main>
        </>
    );
}
