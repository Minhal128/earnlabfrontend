"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, TrendingUp, Gift } from "lucide-react";
import HeroIcon from "../../../public/assets/top.png";

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-500/10 via-[#1A1D2E] to-blue-500/10 border border-emerald-500/20 p-4 sm:p-6 md:p-12 mb-4 md:mb-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center">
        {/* Left Content */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Start Earning Today</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Turn Your Time Into
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Real Rewards
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-[#9CA3AF] leading-relaxed">
            Complete simple tasks, surveys, and offers to earn cash, crypto, or gift cards. Join thousands already getting paid daily.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 sm:pt-4">
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">$2M+</p>
              </div>
              <p className="text-[10px] sm:text-xs text-[#6B7280]">Total Paid</p>
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">50K+</p>
              </div>
              <p className="text-[10px] sm:text-xs text-[#6B7280]">Users</p>
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">1000+</p>
              </div>
              <p className="text-[10px] sm:text-xs text-[#6B7280]">Tasks</p>
            </div>
          </div>
        </div>
        
        {/* Right Image */}
        <div className="relative hidden md:block">
          <div className="relative w-full h-80 rounded-2xl overflow-hidden">
            <Image
              src={HeroIcon}
              alt="Earn Rewards"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
