"use client";

import React from "react";
import { Zap, Clock, FileCheck, TrendingUp } from "lucide-react";

interface HoldTier {
  icon: React.ReactNode;
  amount: string;
  holdTime: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const PricingHoldTimes: React.FC = () => {
  const tiers: HoldTier[] = [
    {
      icon: <Zap className="w-5 h-5" />,
      amount: "Under $5",
      holdTime: "Instant Credit",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      amount: "$10 – $15",
      holdTime: "7 Days Hold",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      amount: "$15 – $25",
      holdTime: "25 Days Hold",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      amount: "$25+",
      holdTime: "35 Days Hold",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  ];

  return (
    <div className="rounded-xl md:rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-4 sm:p-6 md:p-8 mb-4 md:mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-500/10">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Pricing & Hold Times</h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF]">Understand when your rewards become available</p>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-lg sm:rounded-xl ${tier.bgColor} border ${tier.borderColor} p-3 sm:p-4 md:p-5 hover:scale-105 transition-all duration-200 group`}
          >
            {/* Background decoration */}
            <div className={`absolute -top-10 -right-10 w-24 h-24 ${tier.bgColor} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            
            <div className="relative z-10 space-y-2 sm:space-y-3 md:space-y-4">
              {/* Icon */}
              <div className={`inline-flex p-1.5 sm:p-2 rounded-lg ${tier.bgColor} ${tier.color}`}>
                <div className="w-4 h-4 sm:w-5 sm:h-5">{tier.icon}</div>
              </div>
              
              {/* Content */}
              <div>
                <p className={`text-sm sm:text-base md:text-lg font-bold ${tier.color} mb-0.5 sm:mb-1`}>{tier.amount}</p>
                <p className="text-xs sm:text-sm text-[#9CA3AF] font-medium">{tier.holdTime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Speed Up Notice */}
      <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-blue-500/5 border border-blue-500/20">
        <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
          <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-xs sm:text-sm text-white font-medium mb-0.5 sm:mb-1">Speed Up Your Approvals</p>
          <p className="text-xs sm:text-sm text-[#9CA3AF]">
            Submit proof for offers to get faster approval and reduce hold times. Verified submissions can be processed instantly!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingHoldTimes;
