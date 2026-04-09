"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Gamepad2, Layers } from "lucide-react";
import NewGameCard from "../Shared/NewGameCard";

type PremiumSurface = "home" | "earn";
type PremiumPlatformFilter = "all" | "ios" | "android" | "desktop";
type PremiumSortBy = "priority" | "reward_desc" | "reward_asc" | "newest" | "title_asc";

interface PremiumOfferItem {
    _id: string;
    title: string;
    imageUrl?: string;
    rewardCents: number;
    platform: "ios" | "android" | "desktop" | "all";
    status?: string;
    priority?: number;
    createdAt?: string;
}

interface FeaturedTaskProps {
    title?: string;
    subtitle?: string;
    surface?: PremiumSurface;
    platformFilter?: PremiumPlatformFilter;
    sortBy?: PremiumSortBy;
    limit?: number;
    showViewAll?: boolean;
    viewAllLabel?: string;
    onViewAll?: () => void;
}

const FeaturedTask: React.FC<FeaturedTaskProps> = ({
    title = "Featured Premium Tasks",
    subtitle = "Hand-picked offers with boosted rewards",
    surface,
    platformFilter = "all",
    sortBy = "priority",
    limit = 10,
    showViewAll = true,
    viewAllLabel = "View all",
    onViewAll,
}) => {
    const [premiumOffers, setPremiumOffers] = useState<PremiumOfferItem[]>([]);
    const [loading, setLoading] = useState(true);

    const startPremiumOffer = async (offerId?: string) => {
        if (!offerId) {
            window.location.href = "/earn";
            return;
        }

        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${api}/api/v1/offerwalls/premium/${offerId}`);
            const data = await res.json();
            const trackingUrl = data?.offer?.trackingUrl;

            if (trackingUrl && /^https?:\/\//i.test(trackingUrl)) {
                window.open(trackingUrl, "_blank", "noopener,noreferrer");
                return;
            }

            window.location.href = "/earn";
        } catch (error) {
            console.error("Failed to start premium offer:", error);
            window.location.href = "/earn";
        }
    };

    const fetchFeatured = async () => {
        setLoading(true);
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const query = new URLSearchParams({ limit: String(limit) });
            if (surface) {
                query.set("surface", surface);
            }
            if (platformFilter !== "all") {
                query.set("platform", platformFilter);
            }

            const res = await fetch(`${api}/api/v1/offerwalls/premium?${query.toString()}`);
            const data = await res.json();
            if (data && Array.isArray(data.offers)) {
                setPremiumOffers(data.offers);
            } else {
                setPremiumOffers([]);
            }
        } catch (err) {
            console.error("Failed to load featured tasks", err);
            setPremiumOffers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatured();
    }, [surface, platformFilter, limit]);

    const sortedPremiumOffers = useMemo(() => {
        const offers = [...premiumOffers];

        switch (sortBy) {
            case "reward_desc":
                return offers.sort((a, b) => (b.rewardCents || 0) - (a.rewardCents || 0));
            case "reward_asc":
                return offers.sort((a, b) => (a.rewardCents || 0) - (b.rewardCents || 0));
            case "newest":
                return offers.sort(
                    (a, b) =>
                        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                );
            case "title_asc":
                return offers.sort((a, b) => a.title.localeCompare(b.title));
            case "priority":
            default:
                return offers.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        }
    }, [premiumOffers, sortBy]);

    return (
        <section className="w-full mt-6 sm:mt-8 md:mt-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 px-3 sm:px-6 md:px-10 lg:px-16 gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 sm:p-2.5 bg-[#151728] border border-[#30334A] rounded-[8px] sm:rounded-[10px] text-white flex-shrink-0">
                        <Gamepad2 size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h2 className="text-white text-[20px] sm:text-[24px] md:text-[28px] font-bold leading-tight" style={{ fontFamily: "var(--font-manrope)" }}>
                            {title}
                        </h2>
                        <p className="text-[#6B6E8A] text-xs sm:text-sm md:text-base font-medium leading-tight sm:leading-[24px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                            {subtitle}
                        </p>
                    </div>
                </div>
                {showViewAll && (
                    <button
                        type="button"
                        onClick={onViewAll}
                        className="hidden sm:flex items-center gap-2 text-[#8C8FA8] hover:text-white transition-colors"
                    >
                        <span className="text-sm md:text-base font-medium">{viewAllLabel}</span>
                        {onViewAll ? <ArrowRight size={18} /> : <Layers size={18} />}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-[25px] px-3 sm:px-6 md:px-10 lg:px-16">
                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="w-full aspect-[286/211] bg-[#181A2C] animate-pulse rounded-[10px]" />
                    ))
                ) : sortedPremiumOffers.length === 0 ? (
                    <div className="col-span-full rounded-[10px] border border-[#30334A] bg-[#151728] p-4 text-center text-[#8C8FA8] text-sm">
                        No premium offers available for the selected filters.
                    </div>
                ) : (
                    sortedPremiumOffers.map((offer) => (
                        <NewGameCard
                            key={offer._id}
                            title={offer.title}
                            image={offer.imageUrl || "/assets/fe1.png"}
                            reward={`$${(offer.rewardCents / 100).toFixed(2)}`}
                            platforms={offer.platform === "all" ? ["ios", "android", "desktop"] : [offer.platform]}
                            isNew={offer.status === "new"}
                            onClick={() => {
                                if (!localStorage.getItem("token")) {
                                    window.dispatchEvent(new CustomEvent("openSignIn"));
                                    return;
                                }
                                startPremiumOffer(offer._id);
                            }}
                        />
                    ))
                )}
            </div>
        </section>
    );
};

export default FeaturedTask;
