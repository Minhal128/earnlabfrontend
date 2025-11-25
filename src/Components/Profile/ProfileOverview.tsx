"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Award, Clock, ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface RecentEarning {
    _id: string;
    title: string;
    rewardCents: number;
    completedAt: string;
    type: string;
    metadata?: {
        provider?: string;
        gameType?: string;
    };
}

interface ProfileStats {
    totalEarningsCents: number;
    completedOffersCount: number;
    last7DaysEarningsCents: number;
    last30DaysEarningsCents: number;
}

const ProfileOverview: React.FC = () => {
    const [recentEarnings, setRecentEarnings] = useState<RecentEarning[]>([]);
    const [stats, setStats] = useState<ProfileStats>({
        totalEarningsCents: 0,
        completedOffersCount: 0,
        last7DaysEarningsCents: 0,
        last30DaysEarningsCents: 0,
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const getApi = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const api = getApi();
            
            // Fetch user profile for stats
            const profileRes = await fetch(`${api}/api/v1/user/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (profileRes.ok) {
                const profileData = await profileRes.json();
                if (profileData.profile) {
                    setStats({
                        totalEarningsCents: profileData.profile.balanceCents || 0,
                        completedOffersCount: profileData.stats?.tasksCompleted || 0,
                        last7DaysEarningsCents: profileData.stats?.last7DaysCents || 0,
                        last30DaysEarningsCents: profileData.stats?.last30DaysCents || 0,
                    });
                }
            }

            // Fetch recent completed tasks
            const tasksRes = await fetch(`${api}/api/v1/tasks?status=completed&limit=5`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (tasksRes.ok) {
                const tasksData = await tasksRes.json();
                if (tasksData.tasks && Array.isArray(tasksData.tasks)) {
                    setRecentEarnings(tasksData.tasks);
                }
            }
        } catch (err) {
            console.error("Error fetching profile data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOfferClick = (earning: RecentEarning) => {
        // Navigate to the specific game/offer based on type
        if (earning.type === "game" || earning.metadata?.gameType) {
            // Navigate to games section or specific game
            router.push("/home#games");
        } else if (earning.type === "offer" || earning.type === "survey") {
            // Navigate to offers/surveys section
            router.push("/home#offers");
        } else {
            // Default to home
            router.push("/home");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-teal-400" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recent Earnings (Last 7 Days) */}
                <div className="bg-[#26293E] rounded-lg p-5 border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <TrendingUp className="text-green-400" size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Last 7 Days</p>
                            <h3 className="text-2xl font-bold text-white">
                                ${(stats.last7DaysEarningsCents / 100).toFixed(2)}
                            </h3>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">Recent earnings</p>
                </div>

                {/* Completed Offers */}
                <div className="bg-[#26293E] rounded-lg p-5 border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-teal-500/20 rounded-lg">
                            <Award className="text-teal-400" size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Total Completed</p>
                            <h3 className="text-2xl font-bold text-white">
                                {stats.completedOffersCount}
                            </h3>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">Offers completed</p>
                </div>

                {/* Last 30 Days */}
                <div className="bg-[#26293E] rounded-lg p-5 border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Clock className="text-purple-400" size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Last 30 Days</p>
                            <h3 className="text-2xl font-bold text-white">
                                ${(stats.last30DaysEarningsCents / 100).toFixed(2)}
                            </h3>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">Monthly earnings</p>
                </div>
            </div>

            {/* Latest Activity */}
            <div className="bg-[#26293E] rounded-lg p-5 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Award className="text-teal-400" size={20} />
                    Latest Activity
                </h3>

                {recentEarnings.length === 0 ? (
                    <div className="text-center py-8">
                        <Award className="mx-auto mb-3 text-gray-600" size={48} />
                        <p className="text-gray-400 text-sm">No recent activity</p>
                        <p className="text-gray-500 text-xs mt-1">
                            Complete offers and games to see your activity here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentEarnings.map((earning) => (
                            <div
                                key={earning._id}
                                onClick={() => handleOfferClick(earning)}
                                className="flex items-center justify-between p-4 bg-[#1E2133] rounded-lg border border-gray-700 hover:border-teal-500 transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="p-2 bg-teal-500/10 rounded-lg group-hover:bg-teal-500/20 transition">
                                        <Award className="text-teal-400" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium text-sm mb-1 group-hover:text-teal-400 transition">
                                            {earning.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            {earning.metadata?.provider && (
                                                <span className="flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                                                    {earning.metadata.provider}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(earning.completedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-green-400 font-semibold">
                                            +${(earning.rewardCents / 100).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            {earning.type || "Task"}
                                        </p>
                                    </div>
                                    <ExternalLink 
                                        className="text-gray-600 group-hover:text-teal-400 transition" 
                                        size={16} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => router.push("/home")}
                    className="p-4 bg-gradient-to-r from-[#099F86] to-[#0EA88F] rounded-lg text-white font-medium hover:opacity-90 transition flex items-center justify-center gap-2 text-sm md:text-base"
                >
                    <Award size={20} />
                    <span className="truncate">Browse New Offers</span>
                </button>
                <button
                    onClick={() => router.push("/rewards")}
                    className="p-4 bg-[#26293E] border border-gray-700 rounded-lg text-white font-medium hover:border-teal-500 transition flex items-center justify-center gap-2 text-sm md:text-base"
                >
                    <TrendingUp size={20} />
                    <span className="truncate">View All Rewards</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileOverview;
