"use client";

import React from "react";
import { Sparkles, TrendingUp, Gift, Coins, Star } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-900 border border-indigo-500/30 p-4 sm:p-6 md:p-10 lg:p-12 mb-3 md:mb-5 flex items-center justify-center">
      {/* Animated Background Orbs - Smaller on mobile */}
      <div className="absolute -top-10 -left-10 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/4 -right-10 w-28 sm:w-40 md:w-60 h-28 sm:h-40 md:h-60 bg-purple-600/15 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute -bottom-10 -left-10 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-blue-600/15 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Starfield Effect */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-700" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-200 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-violet-300 rounded-full animate-pulse delay-500" />
        <div className="absolute top-40 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-200" />
      </div>
      
      {/* Main Content - Centered */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-6xl mx-auto space-y-3 sm:space-y-4 md:space-y-6 px-1">
        {/* Main Heading */}
        <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
          <span className="block mb-1 sm:mb-2 text-white">
            Turn Your Time Into
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
            Real Rewards
          </span>
        </h1>
        
        {/* Subheading */}
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed max-w-xl font-light px-1">
          Complete simple tasks, surveys, and offers to earn cash, crypto, or gift cards. 
          <span className="block mt-1 text-indigo-300 font-medium">Join thousands already getting paid daily.</span>
        </p>
        
        {/* CTA Button */}
        <button className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300 border border-indigo-400/50 overflow-hidden">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
          <span className="relative z-10">Get Started Free</span>
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
        </button>
        
        {/* Stats - Compact on mobile */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-5 pt-3 sm:pt-4 md:pt-6 w-full max-w-2xl">
          <div className="group p-1.5 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
              <p className="text-sm sm:text-lg md:text-xl font-bold text-white">$2M+</p>
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-emerald-300/80 mt-0.5">Total Paid Out</p>
          </div>
          
          <div className="group p-1.5 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 text-center">
            <div className="flex items-center justify-center gap-1">
              <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              <p className="text-sm sm:text-lg md:text-xl font-bold text-white">50K+</p>
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-blue-300/80 mt-0.5">Active Users</p>
          </div>
          
          <div className="group p-1.5 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 text-center">
            <div className="flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <p className="text-sm sm:text-lg md:text-xl font-bold text-white">1000+</p>
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-purple-300/80 mt-0.5">Tasks Available</p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.02);
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 4s ease-in-out infinite;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .drop-shadow-glow {
          filter: drop-shadow(0 0 20px currentColor);
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
