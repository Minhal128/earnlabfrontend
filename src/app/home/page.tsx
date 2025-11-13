import TopBar from "@/Components/Topbar";
import React from "react";

import HeroSection from "@/Components/HomePage/HeroSection";
import RewardStreakBoxes from "@/Components/HomePage/RewardStreakBoxes";
import FeedBar from "@/Components/HomePage/FeedBar";

export default function Home() {
    return (
        <>
            <TopBar />
            <main className="min-h-screen bg-[#0A0C1A] pb-20 lg:pb-0">
                {/* Container with max width */}
                <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 space-y-3 sm:space-y-4 md:space-y-6">
                    {/* Dashboard Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Welcome Back! 👋
                        </h1>
                        <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto">
                            Track your progress, view recent activity, and manage your rewards from your personal dashboard.
                        </p>
                    </div>

                    {/* Hero Section - User Stats */}
                    <HeroSection />

                    {/* Reward & Streak Boxes */}
                    <RewardStreakBoxes />

                    {/* Activity Feed */}
                    <FeedBar />

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">💰</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Start Earning</h3>
                            <p className="text-[#9CA3AF] text-sm mb-4">Complete tasks and surveys to earn money</p>
                            <a href="/earn" className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                                View Opportunities
                            </a>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🎁</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Daily Rewards</h3>
                            <p className="text-[#9CA3AF] text-sm mb-4">Claim your daily bonuses and spin rewards</p>
                            <a href="/rewards" className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                View Rewards
                            </a>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">👥</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Refer Friends</h3>
                            <p className="text-[#9CA3AF] text-sm mb-4">Earn commissions by inviting friends</p>
                            <a href="/Affiliate" className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                                Start Referring
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
