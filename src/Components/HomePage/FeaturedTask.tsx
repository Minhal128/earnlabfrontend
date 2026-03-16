"use client";

import React, { useEffect, useState } from "react";
import { Gamepad2, Layers } from "lucide-react";
import NewGameCard from "../Shared/NewGameCard";

const FeaturedTask: React.FC = () => {
    const [premiumOffers, setPremiumOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeatured = async () => {
        setLoading(true);
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${api}/api/v1/offerwalls/premium?limit=10`);
            const data = await res.json();
            if (data && Array.isArray(data.offers)) {
                setPremiumOffers(data.offers);
            }
        } catch (err) {
            console.error("Failed to load featured tasks", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatured();
    }, []);

    return (
        <section className="w-full mt-6 sm:mt-8 md:mt-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 px-3 sm:px-6 md:px-10 lg:px-16 gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-2.5 bg-[#151728] border border-[#30334A] rounded-[8px] sm:rounded-[10px] text-white flex-shrink-0">
                        <Gamepad2 size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h2 className="text-white text-[20px] sm:text-[24px] md:text-[28px] font-bold leading-tight" style={{ fontFamily: "var(--font-manrope)" }}>
                            Featured Games
                        </h2>
                        <p className="text-[#6B6E8A] text-xs sm:text-sm md:text-base font-medium leading-tight sm:leading-[24px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            Hand-picked offers with boosted rewards
                        </p>
                    </div>
                </div>
                <button className="hidden sm:flex items-center gap-2 text-[#8C8FA8] hover:text-white transition-colors">
                    <span className="text-sm md:text-base font-medium">View all</span>
                    <Layers size={18} />
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-[25px] px-3 sm:px-6 md:px-10 lg:px-16">
                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="w-full aspect-[286/211] bg-[#181A2C] animate-pulse rounded-[10px]" />
                    ))
                ) : (
                    premiumOffers.map((offer) => (
                        <NewGameCard
                            key={offer._id}
                            title={offer.title}
                            image={offer.imageUrl || "/assets/fe1.png"}
                            reward={`${(offer.rewardCents / 100).toFixed(1)}`}
                            platforms={offer.platform === "all" ? ["ios", "android", "desktop"] : [offer.platform]}
                            isNew={offer.status === "new"}
                            onClick={() => {
                                if (!localStorage.getItem("token")) {
                                    window.dispatchEvent(new CustomEvent("openSignIn"));
                                    return;
                                }
                                window.location.href = `/earn/?provider=${offer.providerId || offer.offerwallId || ''}`;
                            }}
                        />
                    ))
                )}
            </div>
        </section>
    );
};

export default FeaturedTask;
