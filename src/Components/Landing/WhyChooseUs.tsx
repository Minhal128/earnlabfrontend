
"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Users, Zap, TrendingUp } from "lucide-react";

import IconTop from "../../../public/assets/why.png";
import TaskImg from "../../../public/assets/1.png";
import LifetimeImg from "../../../public/assets/2.png";
import WithdrawImg from "../../../public/assets/3.png";
import ProofImg from "../../../public/assets/4.png";

interface Feature {
    id: number;
    title: string;
    description: string;
    image: string;
    icon: React.ReactNode;
    gradient: string;
}

const features: Feature[] = [
    {
        id: 1,
        title: "Simple Tasks, Real Rewards",
        description:
            "Earn money by completing surveys, playing games, signing up for offers, and more.",
        image: TaskImg.src,
        icon: <Sparkles className="w-6 h-6" />,
        gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
        id: 2,
        title: "Lifetime Earnings",
        description:
            "Invite friends and keep earning 10% of everything they make, forever.",
        image: LifetimeImg.src,
        icon: <Users className="w-6 h-6" />,
        gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
        id: 3,
        title: "Fast and Flexible withdrawal",
        description:
            "Get paid your way — crypto, PayPal, or gift cards — quickly and securely.",
        image: WithdrawImg.src,
        icon: <Zap className="w-6 h-6" />,
        gradient: "from-yellow-500/20 to-orange-500/20",
    },
    {
        id: 4,
        title: "Proof You Can Trust",
        description:
            "Watch live updates of users earning and cashing out in real-time.",
        image: ProofImg.src,
        icon: <TrendingUp className="w-6 h-6" />,
        gradient: "from-purple-500/20 to-pink-500/20",
    },
];

export default function WhyChooseUs() {
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

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            className="group relative"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Gradient background on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            
                            {/* Card */}
                            <div className="relative bg-gradient-to-br from-[#1A1D2E] to-[#151728] rounded-2xl p-8 md:p-10 border border-[#2A2D3E] group-hover:border-emerald-500/50 transition-all duration-300 h-full flex flex-col overflow-hidden">
                                {/* Decorative corner accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-300"></div>
                                
                                {/* Bottom accent line */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Icon */}
                                <div className="relative z-10 flex items-center gap-4 mb-6">
                                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 transition-colors">
                                        {feature.icon}
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="relative z-10 flex-1 flex flex-col">
                                    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[#9CA3AF] text-base md:text-lg leading-relaxed mb-8 flex-1">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Image at Bottom */}
                                <div className="relative z-10 mt-auto">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        width={400}
                                        height={300}
                                        className="object-contain w-full h-auto group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
