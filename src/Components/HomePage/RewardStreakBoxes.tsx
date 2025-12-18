"use client";

import React, { useEffect, useState } from "react";
import { Flame, Gift, Trophy, Zap, Star, Award } from "lucide-react";

interface RewardBox {
  id: string;
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const RewardStreakBoxes: React.FC = () => {
  const [streak, setStreak] = useState(0);
  const [dailyBonus, setDailyBonus] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [rank, setRank] = useState("Bronze");

  useEffect(() => {
    // Fetch user stats
    const fetchStats = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;

      try {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${api}/api/v1/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setStreak(data.profile.streak || 0);
            setDailyBonus(data.profile.dailyBonus || 0);
            setTotalEarned(data.profile.totalEarnedCents || 0);
            setRank(data.profile.rank || "Bronze");
          }
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
  }, []);

  const boxes: RewardBox[] = [
    {
      id: "streak",
      title: "Daily Streak",
      value: `${streak} Days`,
      icon: <Flame className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      id: "bonus",
      title: "Daily Bonus",
      value: `$${(dailyBonus / 100).toFixed(2)}`,
      icon: <Gift className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      id: "earned",
      title: "Total Earned",
      value: `$${(totalEarned / 100).toFixed(2)}`,
      icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      id: "rank",
      title: "Your Rank",
      value: rank,
      icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 md:gap-3 mb-3 md:mb-5">
      {boxes.map((box) => (
        <div
          key={box.id}
          className={`relative overflow-hidden rounded-lg ${box.bgColor} border ${box.borderColor} p-2 sm:p-3 md:p-4 hover:scale-[1.02] transition-transform duration-200 cursor-pointer group`}
        >
          <div className="relative z-10 flex items-start gap-2">
            {/* Icon */}
            <div className={`flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${box.bgColor} ${box.color}`}>
              {box.icon}
            </div>
            
            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] text-[#9CA3AF] font-medium truncate">{box.title}</p>
              <p className={`text-sm sm:text-base md:text-lg font-bold ${box.color} truncate`}>{box.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RewardStreakBoxes;
