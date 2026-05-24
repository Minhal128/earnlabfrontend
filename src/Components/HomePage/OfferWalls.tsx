"use client";

import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { ArrowRight, Layers } from "lucide-react";
import ProviderCard from "../Shared/NewProviderCard";

type OfferWallSortBy = "rating_desc" | "rating_asc" | "name_asc" | "name_desc";

interface Offerwall {
  _id: string;
  name: string;
  displayName?: string;
  callbackUrl?: string;
  type?: string;
  category?: "survey" | "game" | "survey & game" | string;
  isActive?: boolean;
  status?: string;
  logoUrl?: string;
  color?: string;
  metadata?: {
    logoUrl?: string;
    description?: string;
    rating?: number;
    pointsMultiplier?: number;
    launchUrl?: string;
    offerUrl?: string;
    amount?: string;
  };
}

const sampleOfferwalls: Offerwall[] = [
  {
    _id: "sample-1",
    name: "Block Blast",
    color: "#3BF7B1",
    metadata: {
      logoUrl: "/game-mocks/block-blast.png",
      description: "Match blocks and clear lines for huge rewards",
      amount: "$1.20",
      rating: 4.8,
    },
  },
  {
    _id: "sample-2",
    name: "Quest Master",
    color: "#FFB800",
    metadata: {
      logoUrl: "/game-mocks/quest-master.png",
      description: "Embark on an epic adventure and earn points",
      amount: "$2.50",
      rating: 4.9,
    },
  },
  {
    _id: "sample-3",
    name: "Harvest Valley",
    color: "#00E0FF",
    metadata: {
      logoUrl: "/game-mocks/harvest-valley.png",
      description: "Build your dream farm and harvest daily cash",
      amount: "$0.75",
      rating: 4.5,
    },
  },
  {
    _id: "sample-4",
    name: "Turbo Drift",
    color: "#FF2E63",
    metadata: {
      logoUrl: "/game-mocks/turbo-drift.png",
      description: "Race through the city and collect nitro coins",
      amount: "$1.80",
      rating: 4.7,
    },
  },
  {
    _id: "sample-5",
    name: "Jackpot Spin",
    color: "#B656FF",
    metadata: {
      logoUrl: "/game-mocks/jackpot-spin.png",
      description: "Spin the premium reels for a chance to win big",
      amount: "$3.00",
      rating: 4.6,
    },
  },
  {
    _id: "sample-6",
    name: "Star Voyage",
    color: "#FF6B6B",
    metadata: {
      logoUrl: "/game-mocks/star-voyage.png",
      description: "Explore the galaxy and find hidden space treasures",
      amount: "$2.10",
      rating: 4.8,
    },
  },
  {
    _id: "sample-7",
    name: "Monster Squad",
    color: "#72E53E",
    metadata: {
      logoUrl: "/img22.png",
      description: "Collect rare monsters and battle for rewards",
      amount: "$0.90",
      rating: 4.4,
    },
  },
];

interface OfferWallsProps {
  title?: string;
  subtitle?: string;
  sortBy?: OfferWallSortBy;
  limit?: number;
  showViewAll?: boolean;
  viewAllLabel?: string;
  onViewAll?: () => void;
}

const useHorizontalSlider = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;

    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    setCanPrev(element.scrollLeft > 2);
    setCanNext(element.scrollLeft < maxScrollLeft - 2);
  }, []);

  const scrollPrev = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;
    element.scrollBy({ left: -Math.max(260, element.clientWidth * 0.7), behavior: "smooth" });
  }, []);

  const scrollNext = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;
    element.scrollBy({ left: Math.max(260, element.clientWidth * 0.7), behavior: "smooth" });
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    updateScrollState();
    element.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  return { containerRef, canPrev, canNext, scrollPrev, scrollNext, updateScrollState };
};

const OfferWalls: React.FC<OfferWallsProps> = ({
  title = "Offer Walls",
  subtitle = "Complete offers to earn bigger rewards",
  sortBy = "rating_desc",
  limit = 10,
  showViewAll = false,
  viewAllLabel = "View all",
  onViewAll,
}) => {
  const [providers, setProviders] = useState<Offerwall[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const getOfferwallRating = (offerwall: Offerwall) => {
    const rating = Number(offerwall.metadata?.rating || 0);
    if (!Number.isNaN(rating) && rating > 0) {
      return Math.min(5, Math.max(1, rating));
    }
    return 4.2;
  };

  useEffect(() => {
    const fetchOfferwalls = async () => {
      try {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${api}/api/v1/offerwalls`, { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`Offerwalls API failed with status ${res.status}`);
        }

        const data = await res.json();

        // Support both response formats:
        // 1) { success: true, data: [...] }
        // 2) { offerwalls: [...] }
        const rawWalls: Offerwall[] = Array.isArray(data?.offerwalls)
          ? data.offerwalls
          : Array.isArray(data?.data)
            ? data.data
            : [];

        // Show only active entries if available
        const activeWalls = rawWalls.filter(
          (ow) => ow.isActive !== false && ow.status !== "inactive" && ow.status !== "paused",
        );

        // Prefer non-survey categories on home offer-walls section
        const walls = activeWalls.filter((ow) => {
          const kind = String(ow.category || ow.type || "").toLowerCase();
          return kind !== "survey" && kind !== "surveys";
        });

        const finalWalls = walls.length > 0 ? walls : activeWalls;
        setProviders(finalWalls);
        setLoadError(false);
      } catch (err) {
        console.error("Failed to fetch offerwalls:", err);
        setProviders([]);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferwalls();
  }, []);

  const sortedProviders = useMemo(() => {
    const next = [...providers];

    switch (sortBy) {
      case "rating_asc":
        return next.sort((a, b) => getOfferwallRating(a) - getOfferwallRating(b));
      case "name_asc":
        return next.sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name));
      case "name_desc":
        return next.sort((a, b) => (b.displayName || b.name).localeCompare(a.displayName || a.name));
      case "rating_desc":
      default:
        return next.sort((a, b) => getOfferwallRating(b) - getOfferwallRating(a));
    }
  }, [providers, sortBy]);

  const visibleProviders = sortedProviders.slice(0, Math.max(limit, 1));
  const skeletonCount = Math.max(5, Math.min(limit, 10));

  const { containerRef, canPrev, canNext, scrollPrev, scrollNext, updateScrollState } = useHorizontalSlider();

  useEffect(() => {
    updateScrollState();
  }, [visibleProviders.length, updateScrollState]);

  return (
    <section className="w-full mt-8 sm:mt-10 md:mt-12 max-w-[1440px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 px-4 sm:px-6 md:px-10 lg:px-12 gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 bg-[#151728] border border-[#30334A] rounded-[8px] sm:rounded-[10px] text-white flex-shrink-0">
            <Layers size={20} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-white text-[20px] sm:text-[24px] md:text-[28px] font-bold leading-tight" style={{ fontFamily: "var(--font-manrope)" }}>
              {title}
            </h2>
            <p className="text-[#6B6E8A] text-xs sm:text-sm md:text-base font-medium leading-tight sm:leading-[24px]" style={{ fontFamily: "var(--font-dm-sans)" }}>
              {subtitle}
            </p>
            {loadError && (
              <p className="text-[#8C8FA8] text-[11px] sm:text-xs mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
                We couldn't load offerwalls right now. Please try again in a moment.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-end">
          <div className="flex items-center gap-[8px] bg-[#1E2133] border border-[#262F3E] px-2.5 py-[8px] rounded-[9px]">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canPrev}
              className="w-5 h-5 flex items-center justify-center disabled:opacity-35 text-[#8C8FA8] hover:text-white transition-colors"
              aria-label="Previous"
            >
              <ArrowRight size={16} className="rotate-180" />
            </button>
            <div className="w-px h-[16px] bg-[#30334A]" />
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canNext}
              className="w-5 h-5 flex items-center justify-center disabled:opacity-35 text-[#8C8FA8] hover:text-white transition-colors"
              aria-label="Next"
            >
              <ArrowRight size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={onViewAll}
            className="w-full sm:w-auto px-6 py-[10px] rounded-[10px] text-white font-bold text-[14px] leading-none transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              background: "linear-gradient(135deg, #0AC07D 0%, #14A290 100%)",
              boxShadow: "0 8px 20px rgba(10, 192, 125, 0.25)"
            }}
          >
            {viewAllLabel}
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex gap-4 sm:gap-5 md:gap-6 px-4 sm:px-6 md:px-10 lg:px-12 overflow-x-auto scrollbar-hide pb-4"
      >
        {loading ? (
          Array(skeletonCount)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="w-full aspect-square bg-[#151728] animate-pulse rounded-[18px]" />
            ))
        ) : (
          (visibleProviders.length > 0 ? visibleProviders : sampleOfferwalls.slice(0, Math.max(limit, 1))).map((p, i) => {
            const rating = getOfferwallRating(p);
            const progress = rating * 20;
            const bonus =
              p.metadata?.pointsMultiplier && p.metadata.pointsMultiplier > 1
                ? ((p.metadata.pointsMultiplier - 1) * 100).toFixed(0)
                : undefined;
            const description = p.metadata?.description || "Play for 5 mins and earn rewards";

            return (
              <ProviderCard
                key={p._id || i}
                name={p.displayName || p.name}
                logoUrl={p.metadata?.logoUrl || p.logoUrl}
                progress={progress}
                bonus={bonus}
                rating={rating}
                reviews={Math.max(18, Math.round(progress * 2.2))}
                description={description}
                amount={p.metadata?.amount}
                color={p.color}
                onClick={() => {
                  if (!localStorage.getItem("token")) {
                    window.dispatchEvent(new CustomEvent("openSignIn"));
                    return;
                  }

                  const launchUrl =
                    p.callbackUrl ||
                    p.metadata?.launchUrl ||
                    p.metadata?.offerUrl;

                  if (launchUrl && /^https?:\/\//i.test(launchUrl)) {
                    window.open(launchUrl, "_blank", "noopener,noreferrer");
                    return;
                  }

                  const label = encodeURIComponent(p.displayName || p.name || "offerwall");
                  window.location.href = `/tasks?offerwallId=${encodeURIComponent(p._id)}&offerwall=${label}`;
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
