
"use client";

import React from "react";
import Image from "next/image";

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
}

const features: Feature[] = [
    {
        id: 1,
        title: "Simple Tasks, Real Rewards",
        description:
            "Earn money by completing surveys, playing games, signing up for offers, and more.",
        image: TaskImg.src,
    },
    {
        id: 2,
        title: "Lifetime Earnings",
        description:
            "Invite friends and keep earning 10% of everything they make, forever.",
        image: LifetimeImg.src,
    },
    {
        id: 3,
        title: "Fast and Flexible withdrawal",
        description:
            "Get paid your way — crypto, PayPal, or gift cards — quickly and securely.",
        image: WithdrawImg.src,
    },
    {
        id: 4,
        title: "Proof You Can Trust",
        description:
            "Watch live updates of users earning and cashing out in real-time.",
        image: ProofImg.src,
    },
];

export default function WhyChooseUs() {
    return (
        <section className="bg-[#0D0F1E] text-white py-20 px-6">
            <div className="max-w-6xl mx-auto text-center">
                {/* Top Heading */}
                <div className="flex justify-center items-center gap-2 mb-4">
                    <Image
                        src={IconTop}
                        alt="Why Choose Us Icon"
                        width={30}
                        height={24}
                        className="object-contain"
                    />
                    <span className="uppercase tracking-wide text-md font-medium text-white">
                        Why Choose Us
                    </span>
                </div>

                <h2 className="text-3xl md:text-5xl md:px-64 font-bold mb-4">
                    Everything You Need to Earn, All in One Place
                </h2>
                <p className="text-xl text-[#B3B6C7] md:px-32 max-w-2xl mx-auto mb-12">
                    Our platform is built to make earning simple, fun, and secure
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="bg-[#1E2133] relative rounded-xl p-6 flex flex-col justify-between items-center text-center hover:shadow-lg transition w-full"
                        >
                            {/* Text First */}
                            <div>
                                <h3 className="text-3xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-[#B3B6C7] text-lg md:px-10 mb-10">{feature.description}</p>
                            </div>

                            {/* Image at Bottom */}
                            <Image
                                src={feature.image}
                                alt={feature.title}
                                width={350}
                                height={300}
                                className="object-contain mt-auto"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
