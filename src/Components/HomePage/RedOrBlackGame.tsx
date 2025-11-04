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

    // Fetch user balance
    useEffect(() => {
        const fetchBalance = async () => {
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
            } catch (err) {
                console.error("Failed to fetch balance", err);
            }
        };

        fetchBalance();
    }, [lastResult]);

    const playGame = async (choice: "red" | "black") => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            toast.error("Please sign in to play");
            return;
        }

        if (balance !== null && balance < stakeCents) {
            toast.error("Insufficient balance");
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

                if (data.won) {
                    toast.success(`🎉 You won $${(data.rewardCents / 100).toFixed(2)}!`);
                } else {
                    toast.error(`You lost $${(stakeCents / 100).toFixed(2)}`);
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
                <h2 className="text-2xl md:text-3xl font-bold mb-2">🎰 Red or Black</h2>
                <p className="text-sm text-gray-400">
                    {gameStats?.description || "Pick red or black to win!"}
                </p>
                {balance !== null && (
                    <div className="mt-3 text-lg font-semibold text-green-400">
                        Balance: ${(balance / 100).toFixed(2)}
                    </div>
                )}
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

            {/* Stake Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Stake Amount</label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={stakeCents}
                        onChange={(e) => setStakeCents(Math.max(gameStats?.minStakeCents || 10, parseInt(e.target.value) || 10))}
                        min={gameStats?.minStakeCents || 10}
                        max={gameStats?.maxStakeCents || 10000}
                        className="flex-1 bg-[#1E2133] border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                        disabled={playing || spinning}
                    />
                    <span className="text-sm text-gray-400">
                        ${(stakeCents / 100).toFixed(2)}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Min: ${((gameStats?.minStakeCents || 10) / 100).toFixed(2)} | Max: ${((gameStats?.maxStakeCents || 10000) / 100).toFixed(2)}
                </p>
            </div>

            {/* Choice Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => playGame("red")}
                    disabled={playing || spinning}
                    className={`py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedChoice === "red" && spinning
                            ? "bg-red-700 ring-4 ring-red-400"
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
                    disabled={playing || spinning}
                    className={`py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedChoice === "black" && spinning
                            ? "bg-gray-900 ring-4 ring-gray-600"
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
            {gameStats && (
                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>House Edge: {gameStats.houseEdgePercent}%</p>
                    <p className="mt-1">Win = 2x your stake (minus house edge)</p>
                </div>
            )}
        </div>
    );
};

export default RedOrBlackGame;
