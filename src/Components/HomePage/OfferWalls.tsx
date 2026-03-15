"use client";

import React from "react";
import { Layers } from "lucide-react";
import ProviderCard from "../Shared/ProviderCard";

const OfferWalls: React.FC = () => {
    const providers = [
        { name: "Lootably", logo: "/assets/lootably.png", rating: 0.94, bonus: "15" },
        { name: "Torox", logo: "/assets/torox_logo.png", rating: 0.88 },
        { name: "Ayetstudios", logo: "/assets/ayet.png", rating: 0.96 },
        { name: "Revlum", logo: "/assets/revlum.png", rating: 0.92, bonus: "5" },
        { name: "Adgate", logo: "/assets/adgate.png", rating: 0.85 },
    ];

    return (
        <section className="w-full mt-8 sm:mt-10 md:mt-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 px-3 sm:px-6 md:px-10 lg:px-16 gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-2.5 bg-[#151728] border border-[#30334A] rounded-[8px] sm:rounded-[10px] text-white flex-shrink-0">
                        <Layers size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h2 className="text-white text-[20px] sm:text-[24px] md:text-[28px] font-bold leading-tight" style={{ fontFamily: "var(--font-manrope)" }}>
                            Offer Walls
                        </h2>
                        <p className="text-[#6B6E8A] text-xs sm:text-sm md:text-base font-medium leading-tight sm:leading-[24px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            Complete offers to earn bigger rewards
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-[25px] px-3 sm:px-6 md:px-10 lg:px-16">
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

export default OfferWalls;
