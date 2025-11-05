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
      icon: <Flame className="w-6 h-6" />,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    {
      id: "bonus",
      title: "Daily Bonus",
      value: `$${(dailyBonus / 100).toFixed(2)}`,
      icon: <Gift className="w-6 h-6" />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      id: "earned",
      title: "Total Earned",
      value: `$${(totalEarned / 100).toFixed(2)}`,
      icon: <Trophy className="w-6 h-6" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      id: "rank",
      title: "Your Rank",
      value: rank,
      icon: <Award className="w-6 h-6" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-6">
      {boxes.map((box) => (
        <div
          key={box.id}
          className={`relative overflow-hidden rounded-lg sm:rounded-xl ${box.bgColor} border ${box.borderColor} p-3 sm:p-4 md:p-5 hover:scale-105 transition-transform duration-200 cursor-pointer group`}
        >
          {/* Background glow effect */}
          <div className={`absolute top-0 right-0 w-20 h-20 ${box.bgColor} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
          
          <div className="relative z-10 space-y-2 sm:space-y-3">
            {/* Icon */}
            <div className={`inline-flex p-1.5 sm:p-2 md:p-2.5 rounded-lg ${box.bgColor} ${box.color}`}>
              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">{box.icon}</div>
            </div>
            
            {/* Content */}
            <div>
              <p className="text-[10px] sm:text-xs text-[#9CA3AF] font-medium mb-0.5 sm:mb-1">{box.title}</p>
              <p className={`text-base sm:text-xl md:text-2xl font-bold ${box.color}`}>{box.value}</p>
            </div>
          </div>
          
          {/* Decorative corner */}
          <div className={`absolute -bottom-2 -right-2 w-16 h-16 ${box.bgColor} rounded-full blur-xl opacity-50`} />
        </div>
      ))}
    </div>
  );
};

export default RewardStreakBoxes;
