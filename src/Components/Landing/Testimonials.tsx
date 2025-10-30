"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import IconTop from "../../../public/assets/testi.png";
import ProileImge from '../../../public/assets/profiletest.png'

const testimonials = [
    {
        id: 1,
        text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast, simple, and legit — I’m hooked!",
        name: "Sarah .M",
        location: "United Kingdom",
        avatar: ProileImge,
    },
    {
        id: 2,
        text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast, simple, and legit — I’m hooked!",
        name: "Sarah .M",
        location: "United Kingdom",
        avatar: ProileImge,
    },
    {
        id: 3,
        text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast, simple, and legit — I’m hooked!",
        name: "Sarah .M",
        location: "United Kingdom",
        avatar: ProileImge,
    },
    {
        id: 4,
        text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast, simple, and legit — I’m hooked!",
        name: "Sarah .M",
        location: "United Kingdom",
        avatar: ProileImge,
    },
    {
        id: 5,
        text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast, simple, and legit — I’m hooked!",
        name: "Sarah .M",
        location: "United Kingdom",
        avatar: ProileImge,
    },
    {
        id: 6,
        text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast, simple, and legit — I’m hooked!",
        name: "Sarah .M",
        location: "United Kingdom",
        avatar: ProileImge,
    },
];

export default function Testimonials() {
    return (
        <section className="bg-[#0D0F1E] px-6">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <Image
                        src={IconTop}
                        alt="Why Choose Us Icon"
                        width={30}
                        height={24}
                        className="object-contain"
                    />
                    <span className="uppercase tracking-wide text-md font-medium text-white">
                        What Our Users Are Saying
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Real Stories. Real Earnings.
                </h2>
                <p className="text-[#B3B6C7] text-xl md:px-32">
                    Thousands of people are already turning their free time into real rewards.
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {testimonials.map((item) => (
                    <div
                        key={item.id}
                        className="bg-[#12212F] rounded-xl px-6 py-10 shadow-md hover:shadow-lg transition duration-300"
                    >
                        {/* Stars */}
                        <div className="flex mb-4 text-teal-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-teal-400" />
                            ))}
                        </div>

                        {/* Text */}
                        <p className="text-gray-300 mb-6">{item.text}</p>

                        {/* User */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700">
                                <Image
                                    src={item.avatar}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                />
                            </div>
                            <div className="text-sm flex gap-1">
                                <p className="text-white font-medium">{item.name},</p>
                                <p className="text-white">{item.location}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
