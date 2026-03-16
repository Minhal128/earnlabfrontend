"use client";

import React, { useEffect, useState } from "react";
import { Layers } from "lucide-react";
import ProviderCard from "../Shared/NewProviderCard";

interface Offerwall {
  _id: string;
  name: string;
  category: "survey" | "game" | "survey & game";
  metadata?: {
    logoUrl?: string;
    description?: string;
    rating?: number;
    pointsMultiplier?: number;
  };
}

const OfferWalls: React.FC = () => {
    const [providers, setProviders] = useState<Offerwall[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOfferwalls = async () => {
            try {
                // Determine layout mode
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/offerwalls`);
                const data = await res.json();
                
                if (data.success && data.data) {
                    // Filter to strictly offerwalls or let all show, let's filter purely "game" out if wanted, but generally all go to offerwalls anyway, we can show ones without 'survey' as mainly offerwalls. But the design from images means all that aren't purely surveys.
                    const walls = data.data.filter((ow: Offerwall) => ow.category !== 'survey');
                    setProviders(walls.length > 0 ? walls : data.data);
                }
            } catch (err) {
                console.error("Failed to fetch offerwalls:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOfferwalls();
    }, []);

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
                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="w-full aspect-square bg-[#151728] animate-pulse rounded-[10px]" />
                    ))
                ) : (
                    providers.map((p, i) => {
                        const progress = p.metadata?.rating ? p.metadata.rating * 10 : 55;
                        const bonus = p.metadata?.pointsMultiplier && p.metadata.pointsMultiplier > 1 
                            ? ((p.metadata.pointsMultiplier - 1) * 100).toFixed(0) 
                            : undefined;

                        return (
                            <ProviderCard
                                key={p._id || i}
                                name={p.name}
                                logoUrl={p.metadata?.logoUrl}
                                progress={progress}
                                bonus={bonus}
                                onClick={() => {
                                   if (!localStorage.getItem("token")) {
                                       window.dispatchEvent(new CustomEvent("openSignIn"));
                                       return;
                                   }
                                   window.location.href = `/earn/?provider=${p._id}`;
                                }}
                            />
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default OfferWalls;
