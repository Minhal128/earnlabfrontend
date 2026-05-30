"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import TopBar from "@/Components/Topbar";
import TickerBar from "@/Components/Shared/TickerBar";

const REWARDS = [
  { id: 1, amount: "$0.50", color: "text-[#14A990]" },
  { id: 2, amount: "$0.50", color: "text-[#14A990]" },
  { id: 3, amount: "$500", color: "text-[#F59E0B]", highlight: true },
  { id: 4, amount: "$0.10", color: "text-[#14A990]" },
  { id: 5, amount: "$0.50", color: "text-[#14A990]" },
  { id: 6, amount: "$0.50", color: "text-[#14A990]" },
];

export default function StreakPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("24h 45m 23s");

  return (
    <div className="min-h-screen bg-[#0D0F1E] text-white flex flex-col">
      <TopBar />
      <TickerBar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-10 py-8">
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-[#15242C] border border-[#23353E] flex items-center justify-center text-white hover:bg-[#1E2F3F] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">7 days Streak</h1>
        </div>

        <div className="flex flex-col items-center">
          {/* Timer Badge */}
          <div className="bg-[#151828] border border-[#1E2F3F] rounded-lg px-4 py-2 text-sm mb-8">
            <span className="text-[#8C9DB6]">Streak resets in </span>
            <span className="text-[#0AC07D] font-bold">{timeLeft}</span>
          </div>

          {/* Reward Carousel Section */}
          <div className="relative w-full max-w-[900px] flex flex-col items-center mb-12">
            {/* Top Pointer */}
            <div className="mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 21l-12-18h24z" transform="rotate(180 12 12)" />
              </svg>
            </div>

            {/* Carousel */}
            <div className="flex gap-4 overflow-hidden w-full justify-center py-4">
              {REWARDS.map((reward) => (
                <div 
                  key={reward.id}
                  className={`min-w-[130px] h-[160px] rounded-2xl bg-[#151828] border ${reward.highlight ? 'border-[#F59E0B]' : 'border-[#1E2F3F]'} flex flex-col items-center justify-center gap-4 transition-all hover:scale-[1.02] shadow-xl`}
                  style={{ boxShadow: reward.highlight ? '0 0 20px rgba(245, 158, 11, 0.1)' : 'none' }}
                >
                  <div className="w-16 h-16 rounded-full bg-[#1E2F3F]/50 flex items-center justify-center text-[#0AC07D]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>
                  </div>
                  <span className={`text-xl font-black ${reward.color}`}>{reward.amount}</span>
                </div>
              ))}
            </div>

            {/* Bottom Pointer */}
            <div className="mt-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 21l-12-18h24z" />
              </svg>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-[900px] mb-8">
            <div className="relative h-2 bg-[#151828] rounded-full overflow-hidden border border-[#1E2F3F]">
              <div className="absolute left-0 top-0 h-full w-[60%] bg-[#14A990] shadow-[0_0_10px_#14A990]" />
            </div>
            <div className="flex justify-between mt-3">
              <span className="px-3 py-1 bg-[#14A990] rounded-full text-[10px] font-bold">$0</span>
              <span className="px-3 py-1 bg-[#14A990] rounded-full text-[10px] font-bold">$10</span>
            </div>
          </div>

          <p className="text-[#8C9DB6] text-center font-bold text-sm sm:text-base mb-8">
            Complete at least one task daily to maintain your streak and receive <span className="text-[#0AC07D]">Free Cases</span>
          </p>

          <button
            onClick={() => router.push("/earn")}
            className="px-10 py-4 rounded-xl text-white font-bold text-lg transition-all hover:brightness-110 active:scale-[0.95] flex items-center gap-3 shadow-2xl shadow-[#14A990]/40"
            style={{ 
              background: "linear-gradient(135deg, #0AC07D 0%, #14A290 100%)",
            }}
          >
            Go to Tasks
          </button>
        </div>
      </main>


      {/* Floating Support Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button className="w-16 h-16 rounded-full bg-[#14A990] flex items-center justify-center text-white shadow-2xl shadow-[#14A990]/40 hover:scale-110 transition-transform">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><circle cx="12" cy="11" r="3"></circle><path d="M7 16c0-2 2-3 5-3s5 1 5 3"></path></svg>
        </button>
      </div>
    </div>
  );
}
