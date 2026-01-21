"use client";

import React, { useState, useEffect } from "react";
import { Activity, Gift, Coins, Wallet } from "lucide-react";
import ModernSection from "../Shared/ModernSection";
import Image from "next/image";

type ActivityType = "earning" | "payout" | "reward";
type FilterTab = "all" | "earnings" | "cashout" | "rewards";

interface RecentActivityItem {
    type: ActivityType;
    username: string;
    avatarUrl?: string;
    amount: number;
    method?: string;
    offerName?: string;
    provider?: string;
    timestamp: string;
}

const getRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
};

const providerIcons: Record<string, string> = {
    "Gemsloot": "https://earnlab.gg/assets/gemsloot.png",
    "Adjoe": "https://earnlab.gg/assets/adjoe.png",
    "Timewall": "https://earnlab.gg/assets/timewall.png",
    "Torox": "https://earnlab.gg/assets/torox.png",
    "Bitlabs": "https://earnlab.gg/assets/bitlabs.png",
    "CPX Research": "https://earnlab.gg/assets/cpx.png",
};

const getProviderIcon = (provider?: string) => {
    if (!provider) return null;
    return providerIcons[provider] || null;
};

const getCryptoIcon = (name?: string) => {
    if (!name) return null;
    const lowered = name.toLowerCase();
    if (lowered.includes("doge")) return "https://cryptologos.cc/logos/dogecoin-doge-logo.png";
    if (lowered.includes("btc") || lowered.includes("bitcoin")) return "https://cryptologos.cc/logos/bitcoin-btc-logo.png";
    if (lowered.includes("sol") || lowered.includes("solana")) return "https://cryptologos.cc/logos/solana-sol-logo.png";
    if (lowered.includes("eth")) return "https://cryptologos.cc/logos/ethereum-eth-logo.png";
    if (lowered.includes("ltc") || lowered.includes("litecoin")) return "https://cryptologos.cc/logos/litecoin-ltc-logo.png";
    return null;
};

const RecentActivity: React.FC = () => {
    const [activities, setActivities] = useState<RecentActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<FilterTab>("all");

    useEffect(() => {
        fetchRecentActivity();
        const interval = setInterval(fetchRecentActivity, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchRecentActivity = async () => {
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const response = await fetch(`${api}/api/v1/offerwalls/recent-activity?limit=20`);
            const data = await response.json();
            setActivities(data.activities || []);
        } catch (error) {
            console.error("Failed to fetch recent activity:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredActivities = activities.filter((activity) => {
        if (activeTab === "all") return true;
        if (activeTab === "earnings") return activity.type === "earning";
        if (activeTab === "cashout") return activity.type === "payout";
        if (activeTab === "rewards") return activity.type === "reward";
        return true;
    });

    const tabs: { key: FilterTab; label: string }[] = [
        { key: "all", label: "All" },
        { key: "earnings", label: "Earnings" },
        { key: "cashout", label: "Cashout" },
        { key: "rewards", label: "Rewards" },
    ];

    const getTypeLabel = (type: ActivityType) => {
        switch (type) {
            case "earning": return "Earn";
            case "payout": return "Crypto";
            case "reward": return "Reward";
            default: return "Activity";
        }
    };

    const getTypeIcon = (type: ActivityType) => {
        switch (type) {
            case "earning":
                return <Coins className="h-3.5 w-3.5 text-emerald-400" />;
            case "payout":
                return <Wallet className="h-3.5 w-3.5 text-purple-400" />;
            case "reward":
                return <Gift className="h-3.5 w-3.5 text-pink-400" />;
            default:
                return <Activity className="h-3.5 w-3.5 text-gray-400" />;
        }
    };

    const renderTableHeader = () => {
        if (activeTab === "cashout") {
            return (
                <div className="grid grid-cols-4 gap-2 px-3 py-2 text-xs text-gray-500 border-b border-[#2A2D3E]">
                    <span>Provider</span>
                    <span>Time</span>
                    <span className="text-right">Amount</span>
                    <span></span>
                </div>
            );
        }
        return (
            <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs text-gray-500 border-b border-[#2A2D3E]">
                <span>Name</span>
                <span>Type</span>
                <span>User</span>
            </div>
        );
    };

    const renderActivityRow = (activity: RecentActivityItem, index: number) => {
        const cryptoIcon = getCryptoIcon(activity.offerName);
        const providerIcon = getProviderIcon(activity.provider);
        
        if (activeTab === "cashout") {
            return (
                <div
                    key={index}
                    className="grid grid-cols-4 gap-2 items-center px-3 py-2.5 hover:bg-[#1A1D2E]/50 transition-colors border-b border-[#2A2D3E]/50 last:border-b-0"
                >
                    <div className="flex items-center gap-2">
                        {providerIcon ? (
                            <Image
                                src={providerIcon}
                                alt={activity.provider || "Provider"}
                                width={20}
                                height={20}
                                className="rounded"
                            />
                        ) : (
                            <div className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center">
                                <Wallet className="h-3 w-3 text-purple-400" />
                            </div>
                        )}
                        <span className="text-white text-sm truncate">{activity.provider || "Unknown"}</span>
                    </div>
                    <span className="text-gray-400 text-sm">{getRelativeTime(activity.timestamp)}</span>
                    <span className="text-emerald-400 font-semibold text-sm text-right">
                        € {(activity.amount / 100).toFixed(2)}
                    </span>
                    <span></span>
                </div>
            );
        }

        return (
            <div
                key={index}
                className="grid grid-cols-3 gap-2 items-center px-3 py-2.5 hover:bg-[#1A1D2E]/50 transition-colors border-b border-[#2A2D3E]/50 last:border-b-0"
            >
                <div className="flex items-center gap-2">
                    {activity.type === "payout" && cryptoIcon ? (
                        <Image
                            src={cryptoIcon}
                            alt={activity.offerName || "Crypto"}
                            width={20}
                            height={20}
                            className="rounded-full"
                        />
                    ) : activity.type === "reward" ? (
                        <div className="w-5 h-5 rounded bg-pink-500/20 flex items-center justify-center">
                            <Gift className="h-3 w-3 text-pink-400" />
                        </div>
                    ) : providerIcon ? (
                        <Image
                            src={providerIcon}
                            alt={activity.provider || "Provider"}
                            width={20}
                            height={20}
                            className="rounded"
                        />
                    ) : (
                        <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center">
                            <Coins className="h-3 w-3 text-emerald-400" />
                        </div>
                    )}
                    <span className="text-white text-sm truncate">
                        {activity.offerName || activity.provider || "Activity"}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        activity.type === "earning" 
                            ? "bg-emerald-500/20 text-emerald-400" 
                            : activity.type === "payout"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-pink-500/20 text-pink-400"
                    }`}>
                        {getTypeIcon(activity.type)}
                        {getTypeLabel(activity.type)}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {activity.avatarUrl ? (
                        <Image
                            src={activity.avatarUrl}
                            alt={activity.username}
                            width={20}
                            height={20}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {activity.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="text-gray-300 text-sm truncate">{activity.username}</span>
                </div>
            </div>
        );
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
            <div className="flex gap-2 mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            activeTab === tab.key
                                ? "bg-purple-500 text-white"
                                : "bg-[#1A1D2E] text-gray-400 hover:text-white hover:bg-[#2A2D3E]"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {filteredActivities.length === 0 ? (
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
                <div className="bg-[#0D0F1A] rounded-xl border border-[#2A2D3E] overflow-hidden">
                    {renderTableHeader()}
                    <div className="max-h-[400px] overflow-y-auto">
                        {filteredActivities.map((activity, index) => renderActivityRow(activity, index))}
                    </div>
                </div>
            )}

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
