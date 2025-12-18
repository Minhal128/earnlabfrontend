"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList, Clock, DollarSign, Shield, Star, TrendingUp, Users, CheckCircle, Target, MessageSquare } from "lucide-react";

const surveyProviders = [
    { name: "BitLabs", avgPay: "$1.50", surveys: "50+", time: "5-15 min" },
    { name: "CPX Research", avgPay: "$2.00", surveys: "40+", time: "10-20 min" },
    { name: "Theorem Reach", avgPay: "$1.25", surveys: "60+", time: "5-10 min" },
    { name: "Pollfish", avgPay: "$0.75", surveys: "100+", time: "2-8 min" },
];

const benefits = [
    {
        icon: <DollarSign className="w-6 h-6" />,
        title: "Earn $2-10 Per Survey",
        description: "Get paid for sharing your honest opinions. Higher rewards for longer surveys.",
    },
    {
        icon: <Clock className="w-6 h-6" />,
        title: "Quick Completion",
        description: "Most surveys take only 5-15 minutes. Complete them during your free time.",
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Privacy Protected",
        description: "Your personal information is always protected. We never share your data without consent.",
    },
    {
        icon: <Target className="w-6 h-6" />,
        title: "Matched Surveys",
        description: "Get surveys matched to your profile for higher qualification rates.",
    },
];

const tips = [
    "Complete your profile fully for better survey matching",
    "Answer honestly - inconsistent answers lead to disqualification",
    "Check for new surveys multiple times daily",
    "Enable notifications to never miss high-paying surveys",
    "Be patient - qualification rates improve over time",
];

export default function SurveysInfoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A0C1A] via-[#0D0F1E] to-[#0A0C1A] text-white">
            {/* Header */}
            <div className="bg-[#0A0C1A] border-b border-[#2A2D3E] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/landing" className="p-2 rounded-lg bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <ClipboardList className="w-6 h-6 text-blue-400" />
                            <h1 className="text-xl font-bold">Surveys</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-16 px-4 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                            <ClipboardList className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-blue-400">Share Your Opinion</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Get Paid For Your Opinions
                        </h2>
                        <p className="text-lg text-[#9CA3AF] leading-relaxed">
                            Complete surveys from top research companies and earn real cash. 
                            Your opinions matter and brands are willing to pay for them!
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">200+</div>
                            <div className="text-sm text-[#9CA3AF]">Daily Surveys</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">$5</div>
                            <div className="text-sm text-[#9CA3AF]">Avg. Per Survey</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">30K+</div>
                            <div className="text-sm text-[#9CA3AF]">Survey Takers</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">$750K+</div>
                            <div className="text-sm text-[#9CA3AF]">Paid Out</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Survey Providers */}
            <section className="py-16 px-4 bg-[#0D0F1E]/50">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <Star className="w-6 h-6 text-yellow-400" />
                        Our Survey Partners
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {surveyProviders.map((provider, idx) => (
                            <div key={idx} className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6 hover:border-blue-500/50 transition-all duration-300">
                                <h4 className="text-xl font-bold mb-4">{provider.name}</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#9CA3AF]">Avg. Pay:</span>
                                        <span className="text-emerald-400 font-bold">{provider.avgPay}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#9CA3AF]">Surveys:</span>
                                        <span className="text-white">{provider.surveys}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#9CA3AF]">Duration:</span>
                                        <span className="text-white">{provider.time}</span>
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
                            { step: "1", title: "Complete Profile", desc: "Fill in your demographics for better survey matching" },
                            { step: "2", title: "Browse Surveys", desc: "View available surveys sorted by reward and duration" },
                            { step: "3", title: "Answer Questions", desc: "Share your honest opinions on various topics" },
                            { step: "4", title: "Earn Rewards", desc: "Get paid instantly after survey completion" },
                        ].map((item, idx) => (
                            <div key={idx} className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                    {item.step}
                                </div>
                                <h4 className="font-bold mb-2">{item.title}</h4>
                                <p className="text-sm text-[#9CA3AF]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="py-16 px-4 bg-[#0D0F1E]/50">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 text-center">Tips For Success</h3>
                    <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-2xl p-8">
                        <ul className="space-y-4">
                            {tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                    <span className="text-[#9CA3AF]">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 text-center">Why Take Surveys With Us?</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E] hover:border-blue-500/50 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400">
                                    {benefit.icon}
                                </div>
                                <h4 className="font-bold mb-2">{benefit.title}</h4>
                                <p className="text-sm text-[#9CA3AF]">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
