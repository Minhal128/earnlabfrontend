"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  metadata?: {
    logoUrl?: string;
    description?: string;
    rating?: number;
    pointsMultiplier?: number;
    launchUrl?: string;
    offerUrl?: string;
  };
}

interface OfferWallsProps {
  title?: string;
  subtitle?: string;
  sortBy?: OfferWallSortBy;
  limit?: number;
  showViewAll?: boolean;
  viewAllLabel?: string;
  onViewAll?: () => void;
}

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

  return (
    <section className="w-full mt-8 sm:mt-10 md:mt-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 px-3 sm:px-6 md:px-10 lg:px-16 gap-3">
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

        {showViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="hidden sm:flex items-center gap-2 text-[#8C8FA8] hover:text-white transition-colors"
          >
            <span className="text-sm md:text-base font-medium">{viewAllLabel}</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-[25px] px-3 sm:px-6 md:px-10 lg:px-16">
        {loading ? (
          Array(skeletonCount)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="w-full aspect-square bg-[#151728] animate-pulse rounded-[10px]" />
            ))
        ) : providers.length === 0 ? (
          <div className="col-span-full text-center text-sm text-[#8C8FA8] py-4">
            No offer walls available right now.
          </div>
        ) : (
          visibleProviders.map((p, i) => {
            const rating = getOfferwallRating(p);
            const progress = rating * 20;
            const bonus =
              p.metadata?.pointsMultiplier && p.metadata.pointsMultiplier > 1
                ? ((p.metadata.pointsMultiplier - 1) * 100).toFixed(0)
                : undefined;

            return (
              <ProviderCard
                key={p._id || i}
                name={p.displayName || p.name}
                logoUrl={p.metadata?.logoUrl || p.logoUrl}
                progress={progress}
                bonus={bonus}
                rating={rating}
                reviews={Math.max(18, Math.round(progress * 2.2))}
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
