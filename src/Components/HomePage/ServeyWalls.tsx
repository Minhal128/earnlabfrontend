"use client";

import React from "react";
import { ClipboardList } from "lucide-react";
import ProviderCard from "../Shared/ProviderCard";

const ServeyWalls: React.FC = () => {
    const providers = [
        { name: "Bitlab", logo: "/assets/bit.png", rating: 0.94 },
        { name: "CPX Research", logo: "/assets/cpx.png", rating: 0.88 },
        { name: "Pollfish", logo: "/assets/pol.png", rating: 0.96, bonus: "10" },
        { name: "Inbrain", logo: "/assets/i.png", rating: 0.92 },
        { name: "TheoremReach", logo: "/assets/tet.png", rating: 0.85 },
    ];

    return (
        <section className="w-full mt-12 mb-20 max-w-[1440px] mx-auto">
            <div className="flex items-center justify-between mb-6 px-4 sm:px-6 md:px-10 lg:px-12">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#151728] border border-[#30334A] rounded-[10px] text-white">
                        <ClipboardList size={24} />
                    </div>
                    <div>
                        <h2 className="text-white text-[28px] font-bold leading-[34px]" style={{ fontFamily: "var(--font-manrope)" }}>
                            Survey Walls
                        </h2>
                        <p className="text-[#6B6E8A] text-base font-medium leading-[24px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            Share your opinion and earn rewards
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6 px-4 sm:px-6 md:px-10 lg:px-12">
                {providers.map((p, i) => (
                    <ProviderCard
                        key={i}
                        name={p.name}
                        logo={p.logo}
                        rating={p.rating}
                        bonus={p.bonus}
                    />
                ))}
            </div>
        </section>
    );
};

export default ServeyWalls;
