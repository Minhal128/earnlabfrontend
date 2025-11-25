"use client";

import React, { useState, useEffect } from "react";
import { Zap, RotateCw } from "lucide-react";

interface RedOrBlackBonusProps {
  userBalance: number;
  onBonusWon?: (amount: number) => void;
}

const RedOrBlackBonus: React.FC<RedOrBlackBonusProps> = ({ userBalance, onBonusWon }) => {
  const [isEligible, setIsEligible] = useState(false);
  const [currentBet, setCurrentBet] = useState(0.1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<"red" | "black" | null>(null);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);
  const [nextAvailableTime, setNextAvailableTime] = useState<Date | null>(null);
  const [earnedToday, setEarnedToday] = useState(0);

  const MAX_BET = 10;

  // Check eligibility
  useEffect(() => {
    checkEligibility();
  }, []);

  const checkEligibility = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${api}/api/v1/user/daily-bonus-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setIsEligible(data.eligible);
        setHasClaimedToday(data.claimed);
        setEarnedToday(data.earnedToday || 0);
        if (data.nextAvailableTime) {
          setNextAvailableTime(new Date(data.nextAvailableTime));
        }
      }
    } catch (err) {
      console.error("Failed to check bonus eligibility:", err);
    }
  };

  const handleSpin = async (color: "red" | "black") => {
    if (!isEligible || isSpinning || currentBet > MAX_BET) return;

    setIsSpinning(true);
    setLastResult(null);

    // Simulate spin animation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 50% chance to win
    const won = Math.random() < 0.5;
    const result = won ? color : color === "red" ? "black" : "red";
    setLastResult(result);

    if (won) {
      const newBet = Math.min(currentBet * 2, MAX_BET);
      setCurrentBet(newBet);
      setTotalWinnings(totalWinnings + currentBet);

      if (onBonusWon) {
        onBonusWon(currentBet);
      }

      // If reached max, claim automatically
      if (newBet === MAX_BET) {
        await claimBonus(totalWinnings + currentBet);
      }
    } else {
      // Lost, reset
      await claimBonus(totalWinnings);
    }

    setIsSpinning(false);
  };

  const claimBonus = async (amount: number) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${api}/api/v1/user/claim-daily-bonus`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: Math.round(amount * 100) }),
      });

      if (res.ok) {
        setIsEligible(false);
        setHasClaimedToday(true);
        setCurrentBet(0.1);
        setTotalWinnings(0);
        setLastResult(null);
        checkEligibility();
      }
    } catch (err) {
      console.error("Failed to claim bonus:", err);
    }
  };

  if (!isEligible && hasClaimedToday) {
    return (
      <div className="bg-gradient-to-br from-[#1A1D2E] to-[#151728] rounded-2xl p-8 border border-[#2A2D3E] text-center">
        <div className="text-gray-400 mb-4">
          <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
        </div>
        <h3 className="text-white font-bold mb-2">Daily Bonus Claimed</h3>
        <p className="text-sm text-[#9CA3AF] mb-4">
          You've already claimed your daily bonus today. Come back tomorrow to play again!
        </p>
        {nextAvailableTime && (
          <p className="text-xs text-emerald-400">
            Available again: {new Date(nextAvailableTime).toLocaleTimeString()}
          </p>
        )}
      </div>
    );
  }

  if (!isEligible && earnedToday < 1) {
    return (
      <div className="bg-gradient-to-br from-[#1A1D2E] to-[#151728] rounded-2xl p-8 border border-[#2A2D3E] text-center">
        <div className="text-gray-400 mb-4">
          <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
        </div>
        <h3 className="text-white font-bold mb-2">Daily Bonus Locked</h3>
        <p className="text-sm text-[#9CA3AF]">
          Earn at least $1 today to unlock the daily bonus game!
        </p>
        <div className="mt-4 bg-[#0A0C1A] rounded-lg p-3">
          <p className="text-xs text-[#9CA3AF]">
            Earned today: <span className="text-emerald-400 font-bold">${earnedToday.toFixed(2)}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#1A1D2E] to-[#151728] rounded-2xl p-8 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-500/20">
            <Zap className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Red or Black</h3>
            <p className="text-xs text-[#9CA3AF]">Daily Bonus Game</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald-400">${totalWinnings.toFixed(2)}</p>
          <p className="text-xs text-[#9CA3AF]">Current Winnings</p>
        </div>
      </div>

      {/* Current Bet Display */}
      <div className="bg-[#0A0C1A] rounded-lg p-4 mb-6 border border-[#2A2D3E]">
        <p className="text-xs text-[#9CA3AF] mb-2">Current Bet</p>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-white">${currentBet.toFixed(2)}</p>
          <p className="text-xs text-[#9CA3AF]">Max: ${MAX_BET.toFixed(2)}</p>
        </div>
        <div className="w-full bg-[#1A1D2E] rounded-full h-2 mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full transition-all duration-300"
            style={{ width: `${(currentBet / MAX_BET) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Last Result */}
      {lastResult && (
        <div className={`rounded-lg p-4 mb-6 text-center border ${
          lastResult === "red"
            ? "bg-red-500/20 border-red-500/50"
            : "bg-black/20 border-gray-500/50"
        }`}>
          <p className="text-sm font-semibold text-white mb-1">
            {lastResult === "red" ? "🔴 RED" : "⚫ BLACK"}
          </p>
          <p className="text-xs text-[#9CA3AF]">
            {lastResult === "red" ? "You won! 🎉" : "You lost. Try again!"}
          </p>
        </div>
      )}

      {/* Game Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleSpin("red")}
          disabled={isSpinning || !isEligible || currentBet > MAX_BET}
          className="relative group overflow-hidden rounded-lg py-4 font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 group-hover:from-red-700 group-hover:to-red-800 transition-all"></div>
          <div className="relative flex items-center justify-center gap-2">
            <span className="text-xl">🔴</span>
            <span>Play Red</span>
          </div>
        </button>

        <button
          onClick={() => handleSpin("black")}
          disabled={isSpinning || !isEligible || currentBet > MAX_BET}
          className="relative group overflow-hidden rounded-lg py-4 font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 group-hover:from-gray-900 group-hover:to-black transition-all"></div>
          <div className="relative flex items-center justify-center gap-2">
            <span className="text-xl">⚫</span>
            <span>Play Black</span>
          </div>
        </button>
      </div>

      {/* Info */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-xs text-blue-400">
          💡 <strong>How it works:</strong> Start with $0.10. Win to double your bet up to $10. Lose and your winnings are claimed. Each day you earn $1+, you get one free spin!
        </p>
      </div>

      {/* Claim Button */}
      {totalWinnings > 0 && (
        <button
          onClick={() => claimBonus(totalWinnings)}
          className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          <RotateCw className="w-4 h-4" />
          Claim ${totalWinnings.toFixed(2)}
        </button>
      )}
    </div>
  );
};

export default RedOrBlackBonus;
