"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Gamepad2, Star, Clock, DollarSign, Users, Zap, Trophy, Target, ChevronRight } from "lucide-react";
import TopBar from "@/Components/Topbar";

// Game images
import Game1 from "../../../public/assets/fe1.png";
import Game2 from "../../../public/assets/fe2.png";
import Game3 from "../../../public/assets/fe3.png";

const gamesData = [
    {
        id: 1,
        name: "Sea of Conquest",
        image: Game1,
        reward: "$115.55",
        time: "7 days",
        difficulty: "Medium",
        rating: 4.8,
        players: "12K+",
    },
    {
        id: 2,
        name: "Farming Simulator",
        image: Game2,
        reward: "$141.95",
        time: "10 days",
        difficulty: "Easy",
        rating: 4.9,
        players: "8K+",
    },
    {
        id: 3,
        name: "SpongeBob Adventures",
        image: Game3,
        reward: "$82.55",
        time: "5 days",
        difficulty: "Easy",
        rating: 4.7,
        players: "15K+",
    },
];

const features = [
    {
        icon: <DollarSign className="w-6 h-6" />,
        title: "High Payouts",
        description: "Earn up to $150 per game. Our games offer the highest rewards in the industry.",
    },
    {
        icon: <Clock className="w-6 h-6" />,
        title: "Flexible Timeframes",
        description: "Complete games at your own pace. Most games take 5-14 days to complete.",
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Instant Credit",
        description: "Get credited immediately after completing game milestones.",
    },
    {
        icon: <Trophy className="w-6 h-6" />,
        title: "Daily Bonuses",
        description: "Earn extra rewards for daily logins and completing special challenges.",
    },
];

export default function GamesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A0C1A] via-[#0D0F1E] to-[#0A0C1A] text-white">
            <TopBar />

            {/* Hero Section */}
            <section className="py-16 px-4 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
                            <Gamepad2 className="w-4 h-4 text-pink-400" />
                            <span className="text-sm font-medium text-pink-400">Play & Earn</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                            Turn Gaming Into Real Money
                        </h2>
                        <p className="text-lg text-[#9CA3AF] leading-relaxed">
                            Play popular mobile games and earn real cash rewards. Download games, reach milestones, 
                            and get paid. It&apos;s that simple!
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">127+</div>
                            <div className="text-sm text-[#9CA3AF]">Available Games</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">$25</div>
                            <div className="text-sm text-[#9CA3AF]">Average Payout</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">50K+</div>
                            <div className="text-sm text-[#9CA3AF]">Active Players</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">$500K+</div>
                            <div className="text-sm text-[#9CA3AF]">Paid Out</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Games */}
            <section className="py-16 px-4 bg-[#0D0F1E]/50">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-400" />
                        Featured Games
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        {gamesData.map((game) => (
                            <div key={game.id} className="group rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] overflow-hidden hover:border-pink-500/50 transition-all duration-300">
                                <div className="relative h-48">
                                    <Image src={game.image} alt={game.name} className="object-cover w-full h-full" />
                                    <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 text-white text-sm font-bold rounded-full">
                                        {game.reward}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h4 className="text-xl font-bold mb-3">{game.name}</h4>
                                    <div className="flex flex-wrap gap-3 mb-4 text-sm">
                                        <div className="flex items-center gap-1 text-[#9CA3AF]">
                                            <Clock className="w-4 h-4" />
                                            {game.time}
                                        </div>
                                        <div className="flex items-center gap-1 text-[#9CA3AF]">
                                            <Star className="w-4 h-4 text-yellow-400" />
                                            {game.rating}
                                        </div>
                                        <div className="flex items-center gap-1 text-[#9CA3AF]">
                                            <Users className="w-4 h-4" />
                                            {game.players}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            game.difficulty === "Easy" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                                        }`}>
                                            {game.difficulty}
                                        </span>
                                        <Link href="/sign-up" className="flex items-center gap-1 text-pink-400 font-semibold text-sm group-hover:text-pink-300">
                                            Play Now <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 text-center">How It Works</h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { step: "1", title: "Browse Games", desc: "Explore our collection of high-paying mobile games" },
                            { step: "2", title: "Download & Play", desc: "Install the game and start playing on your device" },
                            { step: "3", title: "Reach Milestones", desc: "Complete in-game objectives to unlock rewards" },
                            { step: "4", title: "Get Paid", desc: "Receive instant payments to your account" },
                        ].map((item, idx) => (
                            <div key={idx} className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                    {item.step}
                                </div>
                                <h4 className="font-bold mb-2">{item.title}</h4>
                                <p className="text-sm text-[#9CA3AF]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 px-4 bg-[#0D0F1E]/50">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 text-center">Why Play With Us?</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E] hover:border-pink-500/50 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 text-pink-400">
                                    {feature.icon}
                                </div>
                                <h4 className="font-bold mb-2">{feature.title}</h4>
                                <p className="text-sm text-[#9CA3AF]">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
