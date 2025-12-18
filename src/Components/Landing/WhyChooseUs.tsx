
"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Users, Zap, TrendingUp, Gamepad2, ClipboardList, Trophy, Smartphone, Wallet, ChevronRight } from "lucide-react";

import IconTop from "../../../public/assets/why.png";
import TaskImg from "../../../public/assets/1.png";
import LifetimeImg from "../../../public/assets/2.png";
import WithdrawImg from "../../../public/assets/3.png";
import ProofImg from "../../../public/assets/4.png";

// Game images for the mobile games section
import Game1 from "../../../public/assets/fe1.png";
import Game2 from "../../../public/assets/fe2.png";
import Game3 from "../../../public/assets/fe3.png";

// App testing images
import App1 from "../../../public/assets/af1.png";
import App2 from "../../../public/assets/af2.png";
import App3 from "../../../public/assets/af3.png";

export default function WhyChooseUs() {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const completedDays = [true, true, true, true, true, true, false]; // Sunday not completed yet

    return (
        <section className="w-full bg-gradient-to-b from-[#0A0C1A] via-[#0D0F1E] to-[#0A0C1A] text-white py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-40 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <div className="flex justify-center items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                            <Sparkles className="w-6 h-6 text-emerald-400" />
                        </div>
                        <span className="uppercase tracking-widest text-sm font-semibold text-emerald-400">
                            Why Choose Us
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                        Everything You Need to Earn
                    </h2>
                    <p className="text-lg md:text-xl text-[#9CA3AF] leading-relaxed">
                        Our platform is built to make earning simple, fun, and secure. Start your journey today.
                    </p>
                </div>

                {/* Modern Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    
                    {/* Mobile Games Card - Larger */}
                    <div className="md:col-span-1 lg:row-span-2 group relative">
                        <div className="relative bg-gradient-to-br from-[#1A1D2E] to-[#151728] rounded-2xl p-6 border border-[#2A2D3E] group-hover:border-pink-500/50 transition-all duration-300 h-full overflow-hidden">
                            {/* Hot Badge */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">HOT</span>
                                <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">$15-25</span>
                            </div>
                            
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                                <Gamepad2 className="w-6 h-6 text-pink-400" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-2">Mobile Games</h3>
                            <p className="text-[#9CA3AF] text-sm mb-6">Play top-rated games and earn real money. New high-paying games added daily!</p>
                            
                            {/* Stats Row */}
                            <div className="flex gap-4 mb-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">127</div>
                                    <div className="text-xs text-[#9CA3AF]">GAMES</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">$25</div>
                                    <div className="text-xs text-[#9CA3AF]">AVG PAY</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">10min</div>
                                    <div className="text-xs text-[#9CA3AF]">START</div>
                                </div>
                            </div>
                            
                            {/* Game Images */}
                            <div className="flex gap-3 mb-6">
                                <div className="flex-1 relative">
                                    <Image src={Game1} alt="Game 1" className="rounded-xl w-full h-20 object-cover" />
                                    <div className="absolute bottom-1 left-1 right-1 text-center">
                                        <div className="text-[10px] font-semibold text-white bg-black/50 rounded px-1">Sea of Conquest</div>
                                        <div className="text-[10px] text-emerald-400 font-bold">$115.55</div>
                                    </div>
                                </div>
                                <div className="flex-1 relative">
                                    <Image src={Game2} alt="Game 2" className="rounded-xl w-full h-20 object-cover" />
                                    <div className="absolute bottom-1 left-1 right-1 text-center">
                                        <div className="text-[10px] font-semibold text-white bg-black/50 rounded px-1">Farming Game</div>
                                        <div className="text-[10px] text-emerald-400 font-bold">$141.95</div>
                                    </div>
                                </div>
                                <div className="flex-1 relative">
                                    <Image src={Game3} alt="Game 3" className="rounded-xl w-full h-20 object-cover" />
                                    <div className="absolute bottom-1 left-1 right-1 text-center">
                                        <div className="text-[10px] font-semibold text-white bg-black/50 rounded px-1">SpongeBob</div>
                                        <div className="text-[10px] text-emerald-400 font-bold">$82.55</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* CTA */}
                            <button className="flex items-center text-pink-400 font-semibold text-sm group-hover:text-pink-300 transition-colors">
                                Browse Games <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Surveys Card */}
                    <div className="group relative">
                        <div className="relative bg-gradient-to-br from-[#1A1D2E] to-[#151728] rounded-2xl p-6 border border-[#2A2D3E] group-hover:border-blue-500/50 transition-all duration-300 h-full overflow-hidden">
                            {/* Badge */}
                            <div className="absolute top-4 right-4">
                                <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">5 MIN</span>
                            </div>
                            
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
                                <ClipboardList className="w-6 h-6 text-blue-400" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-2">Quick Surveys</h3>
                            <p className="text-[#9CA3AF] text-sm mb-4">Share your opinions and get paid $2-10 per survey.</p>
                            
                            {/* Survey Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-emerald-400">✓</span>
                                    <span className="text-[#9CA3AF]">$2-10 per survey</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-emerald-400">✓</span>
                                    <span className="text-[#9CA3AF]">3-10 minutes each</span>
                                </div>
                            </div>
                            
                            {/* CTA */}
                            <button className="flex items-center text-blue-400 font-semibold text-sm group-hover:text-blue-300 transition-colors">
                                Take Surveys <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* Daily Challenges Card */}
                    <div className="group relative">
                        <div className="relative bg-gradient-to-br from-[#1A1D2E] to-[#151728] rounded-2xl p-6 border border-[#2A2D3E] group-hover:border-yellow-500/50 transition-all duration-300 h-full overflow-hidden">
                            {/* Badge */}
                            <div className="absolute top-4 right-4">
                                <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">+BONUS</span>
                            </div>
                            
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mb-4">
                                <Trophy className="w-6 h-6 text-yellow-400" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-2">Daily Challenges</h3>
                            <p className="text-[#9CA3AF] text-sm mb-4">Complete daily goals for streak bonuses up to $50!</p>
                            
                            {/* Weekly Streak */}
                            <div className="flex gap-2 mb-4">
                                {days.map((day, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${
                                            completedDays[i] 
                                                ? 'bg-emerald-500 text-white' 
                                                : i === 6 
                                                    ? 'bg-yellow-500 text-black' 
                                                    : 'bg-[#2A2D3E] text-[#9CA3AF]'
                                        }`}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                            
                            {/* CTA */}
                            <button className="flex items-center text-yellow-400 font-semibold text-sm group-hover:text-yellow-300 transition-colors">
                                View Challenges <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* App Testing Card */}
                    <div className="group relative">
                        <div className="relative bg-gradient-to-br from-[#1A1D2E] to-[#151728] rounded-2xl p-6 border border-[#2A2D3E] group-hover:border-purple-500/50 transition-all duration-300 h-full overflow-hidden">
                            {/* Badge */}
                            <div className="absolute top-4 right-4">
                                <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">HIGH PAY</span>
                            </div>
                            
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
                                <Smartphone className="w-6 h-6 text-purple-400" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-2">App Testing</h3>
                            <p className="text-[#9CA3AF] text-sm mb-4">Test new apps and earn $10-75 per completed test!</p>
                            
                            {/* App Icons with earnings */}
                            <div className="flex gap-3 mb-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-xl bg-[#2A2D3E] border border-purple-500/30 flex items-center justify-center mb-1 overflow-hidden">
                                        <Image src={App1} alt="App 1" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xs text-emerald-400 font-bold">+$8.50</span>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-xl bg-[#2A2D3E] border border-purple-500/30 flex items-center justify-center mb-1 overflow-hidden">
                                        <Image src={App2} alt="App 2" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xs text-emerald-400 font-bold">+$25</span>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-xl bg-[#2A2D3E] border border-purple-500/30 flex items-center justify-center mb-1 overflow-hidden">
                                        <Image src={App3} alt="App 3" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xs text-emerald-400 font-bold">+$12</span>
                                </div>
                            </div>
                            
                            {/* CTA */}
                            <button className="flex items-center text-purple-400 font-semibold text-sm group-hover:text-purple-300 transition-colors">
                                Browse Apps <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>

                    {/* Cashout Options Card */}
                    <div className="group relative">
                        <div className="relative bg-gradient-to-br from-[#1A1D2E] to-[#151728] rounded-2xl p-6 border border-[#2A2D3E] group-hover:border-emerald-500/50 transition-all duration-300 h-full overflow-hidden">
                            {/* Badge */}
                            <div className="absolute top-4 right-4">
                                <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">INSTANT</span>
                            </div>
                            
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4">
                                <Wallet className="w-6 h-6 text-emerald-400" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-2">12+ Cashout Options</h3>
                            <p className="text-[#9CA3AF] text-sm mb-4">Get paid your way — instantly!</p>
                            
                            {/* Payment method icons */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#003087] flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">PP</span>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-[#F7931A] flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">₿</span>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-[#FF9900] flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">A</span>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-[#627EEA] flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">Ξ</span>
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-[#2A2D3E] flex items-center justify-center border border-[#3A3D4E]">
                                    <span className="text-white font-bold text-xs">+8</span>
                                </div>
                            </div>
                            
                            {/* CTA */}
                            <button className="flex items-center text-emerald-400 font-semibold text-sm group-hover:text-emerald-300 transition-colors">
                                Cash Out Now <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
