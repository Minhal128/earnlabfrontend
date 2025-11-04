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

    // Fetch leaderboard data
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const res = await fetch(`${api}/api/v1/games/leaderboard/monthly`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.top && Array.isArray(data.top)) {
                        setLeaderboardData(data.top);
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
            points: user.balanceCents,
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
        points: user.balanceCents,
        reward: Math.max(50, 200 - (idx * 20)), // Decreasing rewards
        img: user.avatarUrl || "/assets/avatar.png",
    }));

    return (
        <div className="relative min-h-screen bg-[#1E2133] text-white flex flex-col items-center justify-start overflow-hidden">
            <Image
                src={dotsBg}
                alt="background dots"
                className="absolute object-cover"
            />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center w-full md:max-w-7xl md:px-4 py-10">
                {/* Header */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center bg-[#1e2133] rounded-full">
                        <Image
                            src={leaderTop}
                            alt="background dots"
                            width={110}
                            height={110}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-3xl md:text-8xl font-semibold">$150</h1>
                    <p className="text-[#8C8FA8] text-xl">Monthly Race</p>
                </div>

                {/* Countdown */}
                <div className="flex gap-3 mt-6">
                    {[
                        { label: "Days", value: timeLeft.days },
                        { label: "Hours", value: timeLeft.hours },
                        { label: "Minutes", value: timeLeft.minutes },
                        { label: "Seconds", value: timeLeft.seconds },
                    ].map((t, i) => (
                        <div
                            key={i}
                            className="bg-[#1e2133] px-4 py-3 rounded-lg flex flex-col items-center"
                        >
                            <span className="text-2xl rounded-md bg-[#363B5B] py-2 px-3 mb-2 font-bold">
                                {t.value.toString().padStart(2, "0")}
                            </span>
                            <span className="text-xs text-[#B3B6C7]">{t.label}</span>
                        </div>
                    ))}
                </div>

                {/* Podium */}
                <div className="relative w-full mt-12 px-6 py-12 rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="text-center text-gray-400">Loading leaderboard...</div>
                    ) : (
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-center gap-6 w-full">
                        {podiumOrder.map((winner) => {
                            const isCenter = winner.id === 1;
                            return (
                                <div
                                    key={winner.id}
                                    onClick={() => handleUserClick(winner.uuid)}
                                    className={`relative bg-[#3A3E57] rounded-xl flex items-center justify-center w-full cursor-pointer hover:scale-105 transition-transform ${isCenter
                                        ? "md:w-80 md:h-[470px] h-[400px]"
                                        : "md:w-64 md:h-[360px] h-[300px]"
                                        }`}
                                >
                                    <div
                                        className={`absolute inset-0 rounded-xl p-[2px] bg-gradient-to-b ${winner.gradient} [mask-image:linear-gradient(to_bottom,black_0%,transparent_80%)]`}
                                    >
                                        <div className="w-full h-full rounded-xl bg-[#1e2133]"></div>
                                    </div>

                                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-5 rounded-xl h-full w-full">
                                    
                                        <div
                                            className={`${isCenter
                                                ? "w-28 h-28 md:w-32 md:h-[130px]"
                                                : "w-20 h-20 md:w-24 md:h-24"
                                                } rounded-full mb-3`}
                                        >
                                            <Image
                                                src={winner.img}
                                                alt={winner.name}
                                                width={200}
                                                height={200}
                                            />
                                        </div>

                                        <h3 className={`${isCenter ? "text-lg md:text-2xl" : "text-sm md:text-xl"} font-semibold mb-2`}>
                                            {winner.name}
                                        </h3>

                                        <div className={`${isCenter ? "w-18 h-18" : "w-12 h-12"} mb-3`}>
                                            <Image
                                                src={winner.cardImg}
                                                alt="card img"
                                                width={80}
                                                height={80}
                                                className="object-contain mx-auto"
                                            />
                                        </div>
                                        <p className={`${isCenter ? "text-lg" : "text-sm mt-3"} text-[#B3B6C7] mb-3`}>
                                            {winner.points.toLocaleString()} pts
                                        </p>

                                        <button
                                            className={`${isCenter ? "px-6 py-3 text-base" : "px-4 py-3 text-sm"} flex w-full justify-center items-center gap-2 rounded-lg bg-[#38426C] font-semibold cursor-pointer`}
                                        >
                                            <Image
                                                src={winner.badgeImg}
                                                alt="badge"
                                                width={20}
                                                height={20}
                                            />
                                            {winner.reward}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    )}
                </div>

                {/* Other Players */}
                <div className="w-full mt-10 space-y-3">
                    {otherPlayers.map((player, idx) => (
                        <div 
                            key={player.id} 
                            onClick={() => handleUserClick(player.uuid)}
                            className="flex items-center md:gap-40 gap-5 px-4 py-4 bg-[#26293E] rounded-lg cursor-pointer hover:bg-[#2f3247] transition-colors"
                        >
                            <span className="text-sm text-[#B3B6C7]">#{idx + 4}</span>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 flex items-center justify-center text-sm">
                                    <Image src={Avatar} alt="badge" width={30} height={30} />
                                </div> <span>{player.name}</span>
                            </div>
                            <div className="md:gap-100 gap-8 flex">
                                <div className="md:pl-12">
                                    <span className="text-md">{player.points.toLocaleString()} points</span>
                                </div>
                                <span className="text-[#73DFCE] font-semibold">${player.reward}</span>
                            </div>
                        </div>
                    ))}
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
