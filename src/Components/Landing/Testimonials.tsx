"use client";

import Image from "next/image";
import { Star, Zap, MessageCircle } from "lucide-react";
import IconTop from "../../../public/assets/testi.png";
import ProileImge from '../../../public/assets/profiletest.png'

const testimonials = [
    {
        id: 1,
        text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast, simple, and legit — I'm hooked!",
        name: "Sarah .M",
        location: "United Kingdom",
        avatar: ProileImge,
    },
    {
        id: 2,
        text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast, simple, and legit — I'm hooked!",
        name: "Sarah .M",
        location: "United Kingdom",
        avatar: ProileImge,
    },
    {
        id: 3,
        text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast, simple, and legit — I'm hooked!",
        name: "Sarah .M",
        location: "United Kingdom",
        avatar: ProileImge,
    },
    {
        id: 4,
        text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast, simple, and legit — I'm hooked!",
        name: "Sarah .M",
        location: "United Kingdom",
        avatar: ProileImge,
    },
    {
        id: 5,
        text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast, simple, and legit — I'm hooked!",
        name: "Sarah .M",
        location: "United Kingdom",
        avatar: ProileImge,
    },
    {
        id: 6,
        text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast, simple, and legit — I'm hooked!",
        name: "Sarah .M",
        location: "United Kingdom",
        avatar: ProileImge,
    },
];

export default function Testimonials() {
    return (
        <section className="w-full bg-gradient-to-b from-[#0A0C1A] via-[#0D0F1E] to-[#0A0C1A] text-white py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="flex justify-center items-center gap-3 mb-6">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 animate-bounce">
                            <MessageCircle className="w-6 h-6 text-cyan-400" />
                        </div>
                        <span className="uppercase tracking-widest text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                            Real Stories. Real Earnings.
                        </span>
                    </div>
                    <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent leading-tight">
                        What Our Users Are Saying
                    </h2>
                    <p className="text-lg md:text-xl text-[#9CA3AF] leading-relaxed">
                        Thousands of people are already turning their free time into real rewards. Join the movement.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {testimonials.map((item, index) => (
                        <div
                            key={item.id}
                            className="group relative"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Gradient glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-emerald-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Card */}
                            <div className="relative bg-gradient-to-br from-[#1A1D2E] to-[#151728] rounded-2xl p-8 border border-[#2A2D3E] group-hover:border-cyan-500/50 transition-all duration-300 h-full flex flex-col overflow-hidden">
                                {/* Top accent line */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Stars */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }} />
                                    ))}
                                </div>

                                {/* Quote icon */}
                                <div className="mb-4 text-cyan-400/30 group-hover:text-cyan-400/50 transition-colors">
                                    <MessageCircle className="w-8 h-8" />
                                </div>

                                {/* Text */}
                                <p className="text-[#9CA3AF] mb-8 flex-1 leading-relaxed group-hover:text-white transition-colors text-base">
                                    "{item.text}"
                                </p>

                                {/* User */}
                                <div className="flex items-center gap-4 pt-6 border-t border-[#2A2D3E]">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0C1A]">
                                            <Image
                                                src={item.avatar}
                                                alt={item.name}
                                                width={48}
                                                height={48}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{item.name}</p>
                                        <p className="text-[#9CA3AF] text-xs">{item.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
