"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckSquare, Clock, DollarSign, Zap, Shield, Star, TrendingUp, ChevronRight, Smartphone, Gift, Users } from "lucide-react";

const taskTypes = [
    {
        icon: <Smartphone className="w-8 h-8" />,
        title: "App Testing",
        description: "Download and test new mobile applications",
        reward: "$2-15",
        time: "5-20 min",
        color: "emerald",
    },
    {
        icon: <CheckSquare className="w-8 h-8" />,
        title: "Simple Tasks",
        description: "Complete easy online tasks and actions",
        reward: "$0.50-5",
        time: "2-10 min",
        color: "blue",
    },
    {
        icon: <Star className="w-8 h-8" />,
        title: "Review & Rate",
        description: "Write reviews and rate products or services",
        reward: "$1-10",
        time: "5-15 min",
        color: "yellow",
    },
    {
        icon: <Gift className="w-8 h-8" />,
        title: "Sign-up Offers",
        description: "Register for services and earn bonuses",
        reward: "$5-50",
        time: "5-30 min",
        color: "purple",
    },
];

const benefits = [
    {
        icon: <DollarSign className="w-6 h-6" />,
        title: "Competitive Payouts",
        description: "Earn more per task than any other platform. We partner directly with advertisers to offer the best rates.",
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Instant Approval",
        description: "Most tasks are approved instantly. Get your earnings credited to your account within minutes.",
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "100% Legitimate",
        description: "All our tasks are from verified partners. No scams, no spam - just real earning opportunities.",
    },
    {
        icon: <Clock className="w-6 h-6" />,
        title: "Flexible Schedule",
        description: "Work whenever you want. Complete tasks on your own schedule from anywhere in the world.",
    },
];

export default function TasksInfoPage() {
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
                            <CheckSquare className="w-6 h-6 text-emerald-400" />
                            <h1 className="text-xl font-bold">Tasks</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-16 px-4 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-400">Simple Tasks, Real Rewards</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Complete Tasks, Earn Cash
                        </h2>
                        <p className="text-lg text-[#9CA3AF] leading-relaxed">
                            Choose from hundreds of simple tasks. Download apps, sign up for services, 
                            complete offers, and get paid instantly. No experience required!
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">500+</div>
                            <div className="text-sm text-[#9CA3AF]">Available Tasks</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">$8</div>
                            <div className="text-sm text-[#9CA3AF]">Avg. Per Task</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">25K+</div>
                            <div className="text-sm text-[#9CA3AF]">Active Users</div>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-3xl font-bold text-white mb-1">$1M+</div>
                            <div className="text-sm text-[#9CA3AF]">Paid Out</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Task Types */}
            <section className="py-16 px-4 bg-[#0D0F1E]/50">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-emerald-400" />
                        Types of Tasks
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {taskTypes.map((task, idx) => (
                            <div key={idx} className="group rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6 hover:border-emerald-500/50 transition-all duration-300">
                                <div className={`w-16 h-16 rounded-xl bg-${task.color}-500/10 flex items-center justify-center mb-4 text-${task.color}-400`}>
                                    {task.icon}
                                </div>
                                <h4 className="text-xl font-bold mb-2">{task.title}</h4>
                                <p className="text-sm text-[#9CA3AF] mb-4">{task.description}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-emerald-400 font-bold">{task.reward}</span>
                                    <span className="text-[#9CA3AF] flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {task.time}
                                    </span>
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
                            { step: "1", title: "Browse Tasks", desc: "Explore available tasks filtered by reward and time" },
                            { step: "2", title: "Complete Task", desc: "Follow simple instructions to complete the task" },
                            { step: "3", title: "Submit Proof", desc: "Upload screenshots or verification if required" },
                            { step: "4", title: "Get Paid", desc: "Receive instant payment to your account" },
                        ].map((item, idx) => (
                            <div key={idx} className="text-center p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                    {item.step}
                                </div>
                                <h4 className="font-bold mb-2">{item.title}</h4>
                                <p className="text-sm text-[#9CA3AF]">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 px-4 bg-[#0D0F1E]/50">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 text-center">Why Complete Tasks With Us?</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E] hover:border-emerald-500/50 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400">
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
