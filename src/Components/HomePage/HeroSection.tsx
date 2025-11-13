"use client";

import React from "react";
import { Sparkles, TrendingUp, Gift, Coins, Star } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-900 border border-indigo-500/30 p-8 sm:p-12 md:p-16 lg:p-24 mb-4 md:mb-6 min-h-[600px] md:min-h-[700px] flex items-center justify-center">
      {/* Animated Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-600/25 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl animate-pulse delay-500" />
      
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
      <div className="relative z-10 flex flex-col items-center text-center max-w-6xl mx-auto space-y-6 sm:space-y-8 md:space-y-12">
        {/* Main Heading - MASSIVE & CENTERED */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[1.1] tracking-tight">
          <span className="block mb-3 sm:mb-4 md:mb-6 text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.3)] animate-pulse-subtle">
            Turn Your Time Into
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x drop-shadow-[0_0_60px_rgba(139,92,246,0.8)] scale-110 inline-block">
            Real Rewards
          </span>
        </h1>
        
        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-3xl font-light">
          Complete simple tasks, surveys, and offers to earn cash, crypto, or gift cards. 
          <span className="block mt-2 text-indigo-300 font-medium">Join thousands already getting paid daily.</span>
        </p>
        
        {/* CTA Button */}
        <button className="group relative inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/80 hover:scale-105 transition-all duration-300 border border-indigo-400/50 overflow-hidden">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Coins className="w-5 h-5 md:w-6 md:h-6 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
          <span className="relative z-10">Get Started Free</span>
          <Star className="w-5 h-5 md:w-6 md:h-6 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
        </button>
        
        {/* Stats - Centered & Enhanced */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 pt-6 sm:pt-8 md:pt-12 w-full max-w-4xl">
          <div className="group space-y-2 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 group-hover:animate-bounce" />
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-glow">$2M+</p>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-emerald-300/80 font-medium">Total Paid Out</p>
          </div>
          
          <div className="group space-y-2 p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:animate-bounce delay-100" />
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-glow">50K+</p>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-blue-300/80 font-medium">Active Users</p>
          </div>
          
          <div className="group space-y-2 p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 group-hover:animate-bounce delay-200" />
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-glow">1000+</p>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-purple-300/80 font-medium">Tasks Available</p>
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
