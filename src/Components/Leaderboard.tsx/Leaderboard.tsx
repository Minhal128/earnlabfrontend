"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import dotsBg from "../../../public/assets/drop.png";
import leaderTop from "../../../public/assets/leadertop.png";
import Avatar from "../../../public/assets/avatar.png";

interface LeaderboardUser {
    uuid: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    balanceCents: number;
    profilePrivacy?: 'public' | 'private';
}

const LeaderBoard = () => {
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
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    // Fetch leaderboard data - Top 25
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const res = await fetch(`${api}/api/v1/games/leaderboard/monthly?limit=25`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.top && Array.isArray(data.top)) {
                        setLeaderboardData(data.top.slice(0, 25)); // Ensure max 25
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

    // Handle user click
    const handleUserClick = async (userId: string) => {
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${api}/api/v1/games/user/${userId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.isPrivate) {
                    toast.info(data.message || "This profile is private");
                } else {
                    setSelectedUser(data.profile);
                    setShowProfileModal(true);
                }
            }
        } catch (err) {
            console.error("Failed to fetch user profile:", err);
            toast.error("Failed to load user profile");
        }
    };

    // Prepare top 3 winners
    const topWinners = leaderboardData.slice(0, 3).map((user, idx) => {
        const rewards = [500, 250, 350]; // 1st, 2nd, 3rd place rewards
        const cardImgs = ["/assets/second.png", "/assets/first.png", "/assets/third.png"];
        const gradients = [
            "from-[#FFB255] via-yellow-300 to-transparent",
            "from-[#30CFFF] via-blue-300 to-transparent",
            "from-[#30CFFF] via-blue-300 to-transparent",
        ];
        
        return {
            id: idx + 1,
            uuid: user.uuid,
            name: user.displayName || user.username,
            points: user.balanceCents ?? 0,
            reward: rewards[idx],
            img: user.avatarUrl || "/assets/avatar.png",
            badgeImg: "/assets/bluedolar.png",
            cardImg: cardImgs[idx],
            gradient: gradients[idx],
        };
    });

    // Reorder for podium display (2nd, 1st, 3rd)
    const podiumOrder = topWinners.length >= 3 
        ? [topWinners[1], topWinners[0], topWinners[2]]
        : topWinners;

    const otherPlayers = leaderboardData.slice(3).map((user, idx) => ({
        id: idx + 4,
        uuid: user.uuid,
        name: user.displayName || user.username,
        points: user.balanceCents ?? 0,
        reward: Math.max(50, 200 - (idx * 20)), // Decreasing rewards
        img: user.avatarUrl || "/assets/avatar.png",
    }));

    // Get current user's rank (if logged in)
    const [currentUserUuid, setCurrentUserUuid] = useState<string | null>(null);
    
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

    return (
        <div className="relative min-h-screen bg-[#0A0C1A] text-white flex flex-col items-center justify-start overflow-hidden">
            <Image
                src={dotsBg}
                alt="background dots"
                className="absolute object-cover opacity-20"
            />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-7xl px-2 sm:px-4 md:px-6 py-6 md:py-10">
                {/* Header */}
                <div className="flex flex-col items-center gap-3 mb-6">
                    <div className="flex items-center justify-center bg-[#1A1D2E] rounded-full p-4">
                        <Image
                            src={leaderTop}
                            alt="Leaderboard"
                            width={80}
                            height={80}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">$150</h1>
                    <p className="text-[#9CA3AF] text-base sm:text-lg md:text-xl">Monthly Race</p>
                </div>

                {/* Countdown */}
                <div className="flex gap-2 sm:gap-3 mt-4">
                    {[
                        { label: "Days", value: timeLeft.days },
                        { label: "Hours", value: timeLeft.hours },
                        { label: "Minutes", value: timeLeft.minutes },
                        { label: "Seconds", value: timeLeft.seconds },
                    ].map((t, i) => (
                        <div
                            key={i}
                            className="bg-[#1A1D2E] border border-[#2A2D3E] px-3 sm:px-4 py-2 sm:py-3 rounded-xl flex flex-col items-center min-w-[60px] sm:min-w-[70px]"
                        >
                            <span className="text-xl sm:text-2xl rounded-lg bg-[#252840] py-1.5 sm:py-2 px-2 sm:px-3 mb-1 sm:mb-2 font-bold text-emerald-400">
                                {t.value.toString().padStart(2, "0")}
                            </span>
                            <span className="text-[10px] sm:text-xs text-[#9CA3AF]">{t.label}</span>
                        </div>
                    ))}
                </div>

                {/* Podium */}
                <div className="relative w-full mt-12 px-2 sm:px-6 py-8 sm:py-12 rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="text-center text-gray-400">Loading leaderboard...</div>
                    ) : (
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-center gap-4 sm:gap-6 w-full">
                        {podiumOrder.map((winner) => {
                            const isCenter = winner.id === 1;
                            const isSecond = winner.id === 2;
                            const isThird = winner.id === 3;
                            
                            // Custom colors for each position
                            const borderColor = isCenter ? 'border-yellow-500/50' : isSecond ? 'border-gray-400/50' : 'border-orange-500/50';
                            const glowColor = isCenter ? 'shadow-yellow-500/20' : isSecond ? 'shadow-gray-400/20' : 'shadow-orange-500/20';
                            const badgeColor = isCenter ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : isSecond ? 'bg-gradient-to-br from-gray-300 to-gray-500' : 'bg-gradient-to-br from-orange-400 to-orange-600';
                            
                            return (
                                <div
                                    key={winner.id}
                                    onClick={() => handleUserClick(winner.uuid)}
                                    className={`relative rounded-2xl flex items-center justify-center w-full cursor-pointer hover:scale-105 transition-all duration-300 border-2 ${borderColor} ${glowColor} shadow-xl ${
                                        isCenter
                                            ? "md:w-80 md:h-[470px] h-[400px] bg-gradient-to-br from-yellow-500/10 via-[#1A1D2E] to-yellow-500/5"
                                            : "md:w-64 md:h-[360px] h-[300px] bg-gradient-to-br from-[#1A1D2E] to-[#151728]"
                                        }`}
                                >

                                    {/* Position Badge */}
                                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full ${badgeColor} flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg border-4 border-[#0A0C1A]`}>
                                        {winner.id === 1 ? '🥇' : winner.id === 2 ? '🥈' : '🥉'}
                                    </div>
                                    
                                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-xl h-full w-full">
                                        {/* Avatar with glow */}
                                        <div className="relative mb-4">
                                            <div className={`absolute inset-0 rounded-full blur-xl ${isCenter ? 'bg-yellow-500/30' : isSecond ? 'bg-gray-400/20' : 'bg-orange-500/20'}`}></div>
                                            <div
                                                className={`relative ${
                                                    isCenter
                                                        ? "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
                                                        : "w-20 h-20 sm:w-24 sm:h-24"
                                                    } rounded-full overflow-hidden border-4 ${isCenter ? 'border-yellow-500/50' : isSecond ? 'border-gray-400/50' : 'border-orange-500/50'}`}
                                            >
                                                <Image
                                                    src={winner.img}
                                                    alt={winner.name}
                                                    width={200}
                                                    height={200}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        <h3 className={`${isCenter ? "text-lg sm:text-xl md:text-2xl" : "text-base sm:text-lg md:text-xl"} font-bold mb-2 ${isCenter ? 'text-yellow-400' : isSecond ? 'text-gray-300' : 'text-orange-400'}`}>
                                            {winner.name}
                                        </h3>

                                        {/* Trophy/Medal Icon */}
                                        <div className={`${isCenter ? "w-16 h-16 sm:w-20 sm:h-20" : "w-12 h-12 sm:w-14 sm:h-14"} mb-3`}>
                                            <Image
                                                src={winner.cardImg}
                                                alt="medal"
                                                width={80}
                                                height={80}
                                                className="object-contain mx-auto"
                                            />
                                        </div>
                                        
                                        <p className={`${isCenter ? "text-base sm:text-lg" : "text-sm"} text-[#9CA3AF] mb-4`}>
                                            {winner.points.toLocaleString()} pts
                                        </p>

                                        {/* Reward Button */}
                                        <div
                                            className={`${isCenter ? "px-5 sm:px-6 py-2.5 sm:py-3 text-base" : "px-4 py-2.5 text-sm"} flex w-full justify-center items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 font-semibold`}
                                        >
                                            <span className="text-emerald-400 text-lg sm:text-xl">💰</span>
                                            <span className="text-emerald-400">${winner.reward}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    )}
                </div>

                {/* Other Players - Top 4-25 */}
                <div className="w-full mt-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-emerald-400 rounded-full"></span>
                        Top 25 Rankings
                    </h2>
                    
                    <div className="space-y-2">
                        {otherPlayers.map((player, idx) => {
                            const isCurrentUser = player.uuid === currentUserUuid;
                            const rank = idx + 4;
                            const isEvenRow = idx % 2 === 0;
                            
                            return (
                                <div 
                                    key={player.id} 
                                    onClick={() => handleUserClick(player.uuid)}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                    className={`group flex items-center justify-between px-4 sm:px-6 py-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-fade-in ${
                                        isCurrentUser 
                                            ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
                                            : isEvenRow 
                                                ? 'bg-[#1A1D2E] border border-[#2A2D3E] hover:border-emerald-500/30' 
                                                : 'bg-[#151728] border border-[#1A1D2E] hover:border-emerald-500/30'
                                    }`}
                                >
                                    {/* Left: Rank & User Info */}
                                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                        {/* Rank Badge */}
                                        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base ${
                                            isCurrentUser 
                                                ? 'bg-emerald-500 text-white' 
                                                : 'bg-[#252840] text-[#9CA3AF] group-hover:bg-emerald-500/20 group-hover:text-emerald-400'
                                        }`}>
                                            #{rank}
                                        </div>
                                        
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#2A2D3E] group-hover:border-emerald-500/50 transition-colors">
                                            <Image 
                                                src={player.img} 
                                                alt={player.name} 
                                                width={48} 
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        
                                        {/* Name */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-semibold text-sm sm:text-base truncate ${
                                                isCurrentUser ? 'text-emerald-400' : 'text-white'
                                            }`}>
                                                {player.name}
                                                {isCurrentUser && <span className="ml-2 text-xs text-emerald-400">(You)</span>}
                                            </p>
                                            <p className="text-xs sm:text-sm text-[#9CA3AF] hidden sm:block">
                                                {player.points.toLocaleString()} points
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Right: Points & Reward */}
                                    <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                                        {/* Points (mobile only) */}
                                        <div className="sm:hidden text-right">
                                            <p className="text-xs text-[#9CA3AF]">{player.points.toLocaleString()}</p>
                                        </div>
                                        
                                        {/* Reward */}
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                            <span className="text-emerald-400 font-bold text-sm sm:text-base">${player.reward}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            {showProfileModal && selectedUser && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowProfileModal(false)}
                >
                    <div 
                        className="bg-[#1E2133] rounded-xl p-8 max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">User Profile</h2>
                            <button 
                                onClick={() => setShowProfileModal(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="flex flex-col items-center gap-4">
                            {selectedUser.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                    src={selectedUser.avatarUrl} 
                                    alt={selectedUser.username}
                                    className="w-24 h-24 rounded-full"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-[#2A2D44] flex items-center justify-center text-3xl">
                                    {(selectedUser.displayName || selectedUser.username).charAt(0).toUpperCase()}
                                </div>
                            )}
                            
                            <div className="text-center">
                                <h3 className="text-xl font-semibold mb-1">
                                    {selectedUser.displayName || selectedUser.username}
                                </h3>
                                <p className="text-gray-400 text-sm">@{selectedUser.username}</p>
                            </div>

                            <div className="w-full bg-[#26293E] rounded-lg p-4 mt-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-400">Total Earned</span>
                                    <span className="text-xl font-bold text-green-400">
                                        ${(selectedUser.balanceCents / 100).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Joined</span>
                                    <span className="text-sm">
                                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="w-full mt-4 py-3 bg-gradient-to-r from-[#099F86] to-[#0EA88F] rounded-lg font-semibold hover:opacity-90 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaderBoard;
