"use client";

import Image from "next/image";
import { Star, Zap, MessageCircle } from "lucide-react";
import IconTop from "../../../public/assets/testi.png";

const testimonials = [
    {
        id: 1,
        text: "Made my first $50 within a week just playing games on my phone. The instant PayPal cashout is amazing!",
        name: "James R.",
        location: "United States",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
    },
    {
        id: 2,
        text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast and legit!",
        name: "Sarah M.",
        location: "United Kingdom",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
    },
    {
        id: 3,
        text: "Best earning platform I've used. The daily challenges keep me motivated and the Bitcoin payouts are instant.",
        name: "David K.",
        location: "Canada",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        rating: 5,
    },
    {
        id: 4,
        text: "Love how many ways there are to earn! Between games and surveys, I easily make $200+ monthly as a side income.",
        name: "Emily C.",
        location: "Australia",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
    },
    {
        id: 5,
        text: "The referral program is incredible. I've earned over $500 just from inviting friends. Highly recommend!",
        name: "Michael T.",
        location: "Germany",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
        rating: 5,
    },
    {
        id: 6,
        text: "Finally a legit platform that actually pays! Cashed out to Amazon gift cards for my shopping. Super easy!",
        name: "Jessica L.",
        location: "Netherlands",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        rating: 5,
    },
];

export default function Testimonials() {
    return (
        <section className="w-full bg-gradient-to-b from-[#0A0C1A] via-[#0D0F1E] to-[#0A0C1A] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20">
                            <MessageCircle className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="uppercase tracking-widest text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                            Real Stories
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
                        What Our Users Say
                    </h2>
                    <p className="text-sm md:text-base text-[#9CA3AF] leading-relaxed">
                        Join thousands of happy earners who trust our platform.
                    </p>
                </div>

                {/* Compact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {testimonials.map((item, index) => (
                        <div
                            key={item.id}
                            className="group relative"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Card */}
                            <div className="relative bg-gradient-to-br from-[#1A1D2E]/80 to-[#151728]/80 backdrop-blur-sm rounded-xl p-4 border border-[#2A2D3E] group-hover:border-cyan-500/30 transition-all duration-300 h-full flex flex-col">
                                {/* Stars - Compact */}
                                <div className="flex gap-0.5 mb-3">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>

                                {/* Text - Smaller */}
                                <p className="text-[#B3B6C7] mb-4 flex-1 leading-relaxed text-sm line-clamp-3">
                                    "{item.text}"
                                </p>

                                {/* User - Compact */}
                                <div className="flex items-center gap-3 pt-3 border-t border-[#2A2D3E]/50">
                                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 flex-shrink-0">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0C1A]">
                                            <img
                                                src={item.avatar}
                                                alt={item.name}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white font-semibold text-sm truncate">{item.name}</p>
                                        <p className="text-[#9CA3AF] text-xs truncate">{item.location}</p>
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
