"use client";

import React, { useEffect, useState } from "react";
import { Layers } from "lucide-react";
import ProviderCard from "../Shared/NewProviderCard";

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

const OfferWalls: React.FC = () => {
  const [providers, setProviders] = useState<Offerwall[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

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
            {loadError && (
              <p className="text-[#8C8FA8] text-[11px] sm:text-xs mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
                We couldn't load offerwalls right now. Please try again in a moment.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-[25px] px-3 sm:px-6 md:px-10 lg:px-16">
        {loading ? (
          Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="w-full aspect-square bg-[#151728] animate-pulse rounded-[10px]" />
            ))
        ) : providers.length === 0 ? (
          <div className="col-span-full text-center text-sm text-[#8C8FA8] py-4">
            No offer walls available right now.
          </div>
        ) : (
          providers.map((p, i) => {
            const progress = p.metadata?.rating ? p.metadata.rating * 10 : 55;
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
