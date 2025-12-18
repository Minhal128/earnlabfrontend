"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trophy, Medal, Crown, Users, Clock, TrendingUp } from "lucide-react";
import { toast } from "react-toastify";
import UserProfileModal from "../Shared/UserProfileModal";
import dotsBg from "../../../public/assets/drop.png";

interface LeaderboardUser {
    uuid: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    balanceCents: number;
    profilePrivacy?: 'public' | 'private';
}

const LeaderBoard = () => {
    const router = useRouter();
    
    const targetDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + 10);
        return date;
    }, []);

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((distance / (1000 * 60)) % 60),
                seconds: Math.floor((distance / 1000) % 60),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [currentUserUuid, setCurrentUserUuid] = useState<string | null>(null);

    // Fetch leaderboard data - Top 25
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const res = await fetch(`${api}/api/v1/games/leaderboard/monthly?limit=25`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.top && Array.isArray(data.top)) {
                        setLeaderboardData(data.top.slice(0, 25));
                    }
                }
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    // Get current user
    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            const fetchCurrentUser = async () => {
                try {
                    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                    const res = await fetch(`${api}/api/v1/user/profile`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.profile && data.profile.uuid) {
                            setCurrentUserUuid(data.profile.uuid);
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch current user:", err);
                }
            };
            fetchCurrentUser();
        }
    }, []);

    // Handle user click
    const handleUserClick = (userId: string) => {
        setSelectedUserId(userId);
        setShowProfileModal(true);
    };

    // Prepare top 3 winners (always in order: 1st, 2nd, 3rd)
    const topWinners = leaderboardData.slice(0, 3).map((user, idx) => {
        const rewards = [500, 250, 150];
        return {
            rank: idx + 1,
            uuid: user.uuid,
            name: user.displayName || user.username,
            points: user.balanceCents ?? 0,
            reward: rewards[idx],
            img: user.avatarUrl || "/assets/avatar.png",
        };
    });

    const otherPlayers = leaderboardData.slice(3).map((user, idx) => ({
        rank: idx + 4,
        uuid: user.uuid,
        name: user.displayName || user.username,
        points: user.balanceCents ?? 0,
        reward: Math.max(50, 200 - (idx * 20)),
        img: user.avatarUrl || "/assets/avatar.png",
    }));

    // Get rank colors
    const getRankStyles = (rank: number) => {
        switch (rank) {
            case 1:
                return {
                    bg: 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10',
                    border: 'border-yellow-500/30',
                    text: 'text-yellow-400',
                    badge: 'bg-yellow-500',
                    icon: '🥇',
                };
            case 2:
                return {
                    bg: 'bg-gradient-to-br from-gray-400/20 to-gray-500/10',
                    border: 'border-gray-400/30',
                    text: 'text-gray-300',
                    badge: 'bg-gray-400',
                    icon: '🥈',
                };
            case 3:
                return {
                    bg: 'bg-gradient-to-br from-orange-500/20 to-orange-600/10',
                    border: 'border-orange-500/30',
                    text: 'text-orange-400',
                    badge: 'bg-orange-500',
                    icon: '🥉',
                };
            default:
                return {
                    bg: 'bg-[#1A1D2E]',
                    border: 'border-[#2A2D3E]',
                    text: 'text-white',
                    badge: 'bg-[#252840]',
                    icon: '',
                };
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0A0C1A] text-white pb-20 sm:pb-6">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Image
                    src={dotsBg}
                    alt="background"
                    className="absolute object-cover opacity-10"
                    fill
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                        Leaderboard
                    </h1>
                    <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">
                        Compete with top earners and win rewards!
                    </p>
                </div>

                {/* Timer Card */}
                <div className="bg-[#1A1D2E]/80 border border-[#2A2D3E] rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                        <div>
                            <p className="text-[10px] sm:text-xs text-[#9CA3AF]">Competition ends in</p>
                            <p className="text-sm sm:text-base font-bold text-emerald-400">
                                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="bg-[#1A1D2E]/80 border border-[#2A2D3E] rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-400" />
                            <div>
                                <p className="text-[10px] sm:text-xs text-[#9CA3AF]">Top Earner</p>
                                <p className="text-xs sm:text-sm font-semibold text-white truncate">
                                    {topWinners[0]?.name || "---"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#1A1D2E]/80 border border-[#2A2D3E] rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-400" />
                            <div>
                                <p className="text-[10px] sm:text-xs text-[#9CA3AF]">Participants</p>
                                <p className="text-xs sm:text-sm font-semibold text-white">
                                    {leaderboardData.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top 3 Section */}
                <div className="mb-4 sm:mb-6">
                    <h2 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
                        <Medal className="w-4 h-4 text-yellow-400" />
                        Top 3 Winners
                    </h2>
                    
                    {loading ? (
                        <div className="text-center text-gray-400 py-8">Loading...</div>
                    ) : (
                        <div className="space-y-2 sm:space-y-3">
                            {topWinners.map((winner) => {
                                const styles = getRankStyles(winner.rank);
                                const isCurrentUser = winner.uuid === currentUserUuid;
                                
                                return (
                                    <div
                                        key={winner.rank}
                                        onClick={() => handleUserClick(winner.uuid)}
                                        className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01] ${styles.bg} border ${styles.border} ${isCurrentUser ? 'ring-2 ring-emerald-500/50' : ''}`}
                                    >
                                        {/* Rank Badge */}
                                        <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full ${styles.badge} flex items-center justify-center text-lg sm:text-xl shadow-lg`}>
                                            {styles.icon}
                                        </div>
                                        
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/20">
                                            <Image
                                                src={winner.img}
                                                alt={winner.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-bold text-sm sm:text-base truncate ${styles.text}`}>
                                                {winner.name}
                                                {isCurrentUser && <span className="ml-1 text-[10px] text-emerald-400">(You)</span>}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-[#9CA3AF]">
                                                {winner.points.toLocaleString()} points
                                            </p>
                                        </div>
                                        
                                        {/* Reward */}
                                        <div className="flex-shrink-0 bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                                            <span className="text-emerald-400 font-bold text-xs sm:text-sm">
                                                ${winner.reward}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Full Rankings */}
                {otherPlayers.length > 0 && (
                    <div>
                        <h2 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            Full Rankings
                        </h2>
                        
                        <div className="space-y-1.5 sm:space-y-2">
                            {otherPlayers.map((player) => {
                                const isCurrentUser = player.uuid === currentUserUuid;
                                
                                return (
                                    <div
                                        key={player.rank}
                                        onClick={() => handleUserClick(player.uuid)}
                                        className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#252840] ${
                                            isCurrentUser 
                                                ? 'bg-emerald-500/10 border border-emerald-500/30' 
                                                : 'bg-[#1A1D2E]/60 border border-[#2A2D3E]/50'
                                        }`}
                                    >
                                        {/* Rank */}
                                        <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-xs sm:text-sm font-bold ${
                                            isCurrentUser ? 'bg-emerald-500 text-white' : 'bg-[#252840] text-[#9CA3AF]'
                                        }`}>
                                            {player.rank}
                                        </div>
                                        
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#2A2D3E]">
                                            <Image
                                                src={player.img}
                                                alt={player.name}
                                                width={36}
                                                height={36}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        
                                        {/* Name & Points */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs sm:text-sm font-medium truncate ${isCurrentUser ? 'text-emerald-400' : 'text-white'}`}>
                                                {player.name}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-[#9CA3AF]">
                                                {player.points.toLocaleString()} pts
                                            </p>
                                        </div>
                                        
                                        {/* Reward */}
                                        <div className="flex-shrink-0">
                                            <span className="text-emerald-400 font-semibold text-xs sm:text-sm">
                                                ${player.reward}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* User Profile Modal */}
            {selectedUserId && (
                <UserProfileModal
                    userId={selectedUserId}
                    isOpen={showProfileModal}
                    onClose={() => {
                        setShowProfileModal(false);
                        setSelectedUserId(null);
                    }}
                />
            )}
        </div>
    );
};

export default LeaderBoard;
