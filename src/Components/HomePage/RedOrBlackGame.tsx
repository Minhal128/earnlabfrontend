"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

// Import icons or images if needed
import { Loader2 } from "lucide-react";

interface GameStats {
    minStakeCents: number;
    maxStakeCents: number;
    houseEdgePercent: number;
    description: string;
}

interface GameResult {
    outcome: "red" | "black";
    choice: "red" | "black";
    won: boolean;
    rewardCents: number;
    newBalanceCents: number;
    playedAt: string;
}

const RedOrBlackGame: React.FC = () => {
    const [gameStats, setGameStats] = useState<GameStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [stakeCents, setStakeCents] = useState(10); // Default $0.10
    const [selectedChoice, setSelectedChoice] = useState<"red" | "black" | null>(null);
    const [lastResult, setLastResult] = useState<GameResult | null>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [spinning, setSpinning] = useState(false);
    const [dailyEarnings, setDailyEarnings] = useState<number>(0);
    const [hasPlayedToday, setHasPlayedToday] = useState(false);
    const [canPlay, setCanPlay] = useState(false);

    const getApi = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Fetch game stats on mount
    useEffect(() => {
        const fetchGameStats = async () => {
            try {
                const api = getApi();
                const res = await fetch(`${api}/api/v1/games/red-or-black`);
                if (res.ok) {
                    const data = await res.json();
                    setGameStats(data.stats);
                }
            } catch (err) {
                console.error("Failed to load game stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchGameStats();
    }, []);

    // Fetch user balance and daily earnings
    useEffect(() => {
        const fetchUserData = async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) return;

            try {
                const api = getApi();
                const res = await fetch(`${api}/api/v1/user/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.profile && typeof data.profile.balanceCents === "number") {
                        setBalance(data.profile.balanceCents);
                    }
                }

                // Check daily earnings and game eligibility
                const dailyRes = await fetch(`${api}/api/v1/user/daily-earnings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (dailyRes.ok) {
                    const dailyData = await dailyRes.json();
                    const todayEarnings = dailyData.todayEarningsCents || 0;
                    setDailyEarnings(todayEarnings);
                    
                    // User can play if they've earned at least $1 today and haven't played yet
                    setCanPlay(todayEarnings >= 100);
                    
                    // Check if user has already played today
                    const lastPlayDate = localStorage.getItem("lastRedBlackPlay");
                    const today = new Date().toDateString();
                    setHasPlayedToday(lastPlayDate === today);
                }
            } catch (err) {
                console.error("Failed to fetch user data", err);
            }
        };

        fetchUserData();
    }, [lastResult]);

    const playGame = async (choice: "red" | "black") => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            toast.error("Please sign in to play");
            return;
        }

        if (hasPlayedToday) {
            toast.error("You can only play once per day!");
            return;
        }

        if (!canPlay) {
            toast.error("You need to earn at least $1.00 today to play the daily bonus!");
            return;
        }

        setPlaying(true);
        setSpinning(true);
        setSelectedChoice(choice);

        try {
            const api = getApi();
            const res = await fetch(`${api}/api/v1/games/red-or-black/play`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ stakeCents, choice }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to play game");
                setSpinning(false);
                setPlaying(false);
                return;
            }

            // Simulate spinning animation
            setTimeout(() => {
                setLastResult(data);
                setBalance(data.newBalanceCents);
                setSpinning(false);
                
                // Mark that user has played today
                const today = new Date().toDateString();
                localStorage.setItem("lastRedBlackPlay", today);
                setHasPlayedToday(true);

                if (data.won) {
                    toast.success(`🎉 You won $${(data.rewardCents / 100).toFixed(2)}!`);
                } else {
                    toast.error(`Better luck next time! Come back tomorrow for another chance.`);
                }
            }, 2000); // 2 second spin animation
        } catch (err) {
            console.error("Game play error", err);
            toast.error("Failed to play game");
            setSpinning(false);
        } finally {
            setPlaying(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#26293E] rounded-lg p-6 text-white text-center">
                <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                <p className="text-sm text-gray-400">Loading game...</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-[#26293E] to-[#1E2133] rounded-lg p-6 text-white shadow-lg mb-6">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">🎰 Daily Red or Black Bonus</h2>
                <p className="text-sm text-gray-400 mb-3">
                    Earn at least $1.00 today to unlock your daily bonus spin!
                </p>
                
                {/* Daily Status */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-blue-400">
                            Today's Earnings: ${(dailyEarnings / 100).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">
                            Need: ${Math.max(0, (100 - dailyEarnings) / 100).toFixed(2)} more
                        </div>
                    </div>
                    
                    {balance !== null && (
                        <div className="text-center">
                            <div className="text-lg font-semibold text-green-400">
                                Balance: ${(balance / 100).toFixed(2)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Indicator */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    hasPlayedToday 
                        ? "bg-gray-500/20 text-gray-400" 
                        : canPlay 
                            ? "bg-emerald-500/20 text-emerald-400" 
                            : "bg-red-500/20 text-red-400"
                }`}>
                    {hasPlayedToday 
                        ? "✅ Played Today - Come Back Tomorrow!" 
                        : canPlay 
                            ? "🎯 Ready to Play!" 
                            : "💰 Earn $1.00 to Unlock"}
                </div>
            </div>

            {/* Roulette Wheel Visual */}
            <div className="flex justify-center mb-6">
                <div
                    className={`relative w-48 h-48 rounded-full border-8 border-yellow-500 shadow-2xl ${
                        spinning ? "animate-spin" : ""
                    }`}
                    style={{
                        background: "conic-gradient(from 0deg, #DC2626 0deg 180deg, #1F2937 180deg 360deg)",
                        animationDuration: spinning ? "2s" : "0s",
                    }}
                >
                    {/* Center indicator */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full border-4 border-white flex items-center justify-center">
                            {spinning ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : lastResult ? (
                                <span className="text-2xl font-bold">
                                    {lastResult.outcome === "red" ? "🔴" : "⚫"}
                                </span>
                            ) : (
                                <span className="text-xl">?</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Last Result */}
            {lastResult && !spinning && (
                <div
                    className={`text-center mb-4 p-3 rounded-lg ${
                        lastResult.won
                            ? "bg-green-900/30 border border-green-500"
                            : "bg-red-900/30 border border-red-500"
                    }`}
                >
                    <p className="font-semibold">
                        {lastResult.won ? "🎉 You Won!" : "😔 You Lost"}
                    </p>
                    <p className="text-sm text-gray-300">
                        Result: <span className="font-bold uppercase">{lastResult.outcome}</span>
                    </p>
                </div>
            )}

            {/* Daily Bonus Info */}
            <div className="mb-6 text-center">
                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-emerald-400 mb-2">🎁 Daily Bonus Rewards</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-300">Minimum Win: <span className="text-emerald-400 font-semibold">$0.10</span></div>
                        <div className="text-gray-300">Maximum Win: <span className="text-emerald-400 font-semibold">$10.00</span></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Free daily spin - no stake required! Win amounts are randomly generated.
                    </p>
                </div>
            </div>

            {/* Choice Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => playGame("red")}
                    disabled={playing || spinning || !canPlay || hasPlayedToday}
                    className={`py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedChoice === "red" && spinning
                            ? "bg-red-700 ring-4 ring-red-400"
                            : (!canPlay || hasPlayedToday)
                                ? "bg-gray-600"
                                : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                    {spinning && selectedChoice === "red" ? (
                        <Loader2 className="animate-spin mx-auto" size={24} />
                    ) : (
                        "🔴 RED"
                    )}
                </button>
                <button
                    onClick={() => playGame("black")}
                    disabled={playing || spinning || !canPlay || hasPlayedToday}
                    className={`py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedChoice === "black" && spinning
                            ? "bg-gray-900 ring-4 ring-gray-600"
                            : (!canPlay || hasPlayedToday)
                                ? "bg-gray-600"
                                : "bg-gray-800 hover:bg-gray-900"
                    }`}
                >
                    {spinning && selectedChoice === "black" ? (
                        <Loader2 className="animate-spin mx-auto" size={24} />
                    ) : (
                        "⚫ BLACK"
                    )}
                </button>
            </div>

            {/* Game Info */}
            <div className="mt-6 text-center text-xs text-gray-500">
                <p>🎯 Daily Bonus Game - One Free Spin Per Day</p>
                <p className="mt-1">💰 Earn at least $1.00 today to unlock your spin</p>
                <p className="mt-1">🎁 Win between $0.10 - $10.00 instantly!</p>
            </div>
        </div>
    );
};

export default RedOrBlackGame;
