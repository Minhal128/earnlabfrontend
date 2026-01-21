"use client";

import React, { useState, useEffect } from "react";
import { Activity, DollarSign, Gift, Users, TrendingUp, Wallet } from "lucide-react";
import ModernSection from "../Shared/ModernSection";

interface RecentActivityItem {
    type: "earning" | "payout" | "referral";
    username: string;
    avatarUrl?: string;
    amount: number;
    method?: string;
    offerName?: string;
    provider?: string;
    timestamp: string;
}

// Simple relative time function to avoid date-fns dependency
const getRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
};

const RecentActivity: React.FC = () => {
    const [activities, setActivities] = useState<RecentActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentActivity();
        
        // Refresh every 30 seconds
        const interval = setInterval(fetchRecentActivity, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchRecentActivity = async () => {
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const response = await fetch(`${api}/api/v1/offerwalls/recent-activity?limit=10`);
            const data = await response.json();
            setActivities(data.activities || []);
        } catch (error) {
            console.error("Failed to fetch recent activity:", error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "earning":
                return <TrendingUp className="h-4 w-4 text-emerald-400" />;
            case "payout":
                return <Wallet className="h-4 w-4 text-blue-400" />;
            case "referral":
                return <Users className="h-4 w-4 text-purple-400" />;
            default:
                return <Activity className="h-4 w-4 text-gray-400" />;
        }
    };

    const getActivityColor = (type: string) => {
        switch (type) {
            case "earning":
                return "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20";
            case "payout":
                return "from-blue-500/20 to-blue-500/5 border-blue-500/20";
            case "referral":
                return "from-purple-500/20 to-purple-500/5 border-purple-500/20";
            default:
                return "from-gray-500/20 to-gray-500/5 border-gray-500/20";
        }
    };

    const getActivityLabel = (activity: RecentActivityItem) => {
        switch (activity.type) {
            case "earning":
                return `earned from ${activity.offerName || activity.provider || "offer"}`;
            case "payout":
                return `withdrew via ${activity.method || "payout"}`;
            case "referral":
                return "earned from referral";
            default:
                return "activity";
        }
    };

    const maskUsername = (username: string) => {
        if (username.length <= 3) return username;
        return username.substring(0, 3) + "***";
    };

    if (loading) {
        return (
            <ModernSection
                title="Recent Activity"
                description="Live earnings, rewards, and cashouts"
                icon={<Activity className="text-cyan-400" size={20} />}
            >
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin h-6 w-6 border-3 border-cyan-500 border-t-transparent rounded-full" />
                </div>
            </ModernSection>
        );
    }

    return (
        <ModernSection
            title="Recent Activity"
            description="Live earnings, rewards, and cashouts"
            icon={<Activity className="text-cyan-400" size={20} />}
        >
            {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Activity className="h-10 w-10 text-gray-600 mb-3" />
                    <h3 className="text-md font-semibold text-gray-400 mb-1">
                        No recent activity
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Activity will appear here as users complete offers and withdraw earnings.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {activities.map((activity, index) => (
                        <div
                            key={index}
                            className={`
                                flex items-center gap-3 p-3 rounded-xl border
                                bg-gradient-to-r ${getActivityColor(activity.type)}
                                transition-all duration-200 hover:scale-[1.01]
                            `}
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                {activity.avatarUrl ? (
                                    <img
                                        src={activity.avatarUrl}
                                        alt={activity.username}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-[#2A2D3E]"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none";
                                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                                        }}
                                    />
                                ) : null}
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center text-white font-bold text-sm ${activity.avatarUrl ? "hidden" : ""}`}>
                                    {activity.username.charAt(0).toUpperCase()}
                                </div>
                                {/* Activity Type Icon */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1A1D2E] flex items-center justify-center border border-[#2A2D3E]">
                                    {getActivityIcon(activity.type)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white">
                                    <span className="font-semibold text-cyan-400">
                                        {maskUsername(activity.username)}
                                    </span>{" "}
                                    <span className="text-gray-400">
                                        {getActivityLabel(activity)}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-500">
                                    {getRelativeTime(activity.timestamp)}
                                </p>
                            </div>

                            {/* Amount */}
                            <div className="flex-shrink-0 text-right">
                                <p className={`font-bold text-sm ${
                                    activity.type === "earning" ? "text-emerald-400" :
                                    activity.type === "payout" ? "text-blue-400" :
                                    "text-purple-400"
                                }`}>
                                    +${(activity.amount / 100).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Live Indicator */}
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-[#2A2D3E]">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-gray-500">Live activity feed</span>
            </div>
        </ModernSection>
    );
};

export default RecentActivity;
