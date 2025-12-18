"use client";

import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import Image from "next/image";

type Offerwall = {
    _id?: string;
    name?: string;
    type?: string;
    metadata?: any;
};

// Helper to replace EarnLab with Labwards in display names
const formatName = (name?: string) => 
    name?.replace(/EarnLab/gi, "Labwards") ?? "Offerwall";

const ServeyWalls: React.FC = () => {
    const [offerwalls, setOfferwalls] = useState<Offerwall[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        // Fetch public offerwalls
        const fetchPublic = fetch(`${api}/api/v1/offerwalls`).then((r) => r.json());

        // If token exists, also fetch custom personalized offerwall
        const fetchCustom = token
            ? fetch(`${api}/api/v1/offerwalls/custom`, {
                  headers: { Authorization: `Bearer ${token}` },
              }).then((r) => r.json()).catch(() => null)
            : Promise.resolve(null);

        Promise.all([fetchPublic, fetchCustom])
            .then(([publicRes, customRes]) => {
                const list: Offerwall[] = Array.isArray(publicRes?.offerwalls)
                    ? publicRes.offerwalls
                    : [];
                // If we got a custom offerwall, put it first
                if (customRes && customRes.offerwall) {
                    setOfferwalls([customRes.offerwall, ...list]);
                } else {
                    setOfferwalls(list);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load offerwalls", err);
                setError("Failed to load surveys");
                setLoading(false);
            });
    }, []);

    const openOffer = (o: Offerwall) => {
        // Prefer explicit URL if present in metadata
        const url = o.metadata?.url || o.metadata?.landingUrl || o.metadata?.referralUrl;
        if (url) {
            window.open(url, "_blank");
            return;
        }

        // If metadata has sampleOffers, open a small details modal (simple fallback: alert)
        if (o.metadata?.sampleOffers) {
            const titles = (o.metadata.sampleOffers as any[]).map((s) => s.title).join("\n");
            toast.info(`Offers:\n${titles}`, { autoClose: 8000 });
            return;
        }

        // final fallback: show name
        toast.info(o.name || "Open offerwall");
    };

    return (
        <div className="w-full bg-[#0f172a] mt-5 md:px-6 md:py-6 px-3 py-5 rounded-lg text-white border border-[0.1px] border-[#50536F]">
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <h2 className="md:text-lg text-sm font-semibold">Survey Walls</h2>
                    <p className="md:text-sm text-[10px] text-[#8C8FA8]">
                        Complete the featured task to earn bigger rewards
                    </p>
                </div>
            </div>

            {loading && <div className="text-sm text-[#8C8FA8]">Loading surveys...</div>}
            {error && <div className="text-sm text-red-400">{error}</div>}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {offerwalls.map((offer, index) => (
                    <div
                        key={offer._id ?? index}
                        className="overflow-hidden space-y-2 shadow hover:shadow-lg transition flex flex-col items-center"
                    >
                        <div className="relative w-full h-24 rounded-md flex items-center justify-center bg-[#1E2133]">
                            {/* If metadata.logoUrl provided, show it; else show a simple placeholder */}
                            {offer.metadata?.logoUrl ? (
                                // use plain img to avoid Next.js external image config issues
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={offer.metadata.logoUrl}
                                    alt={offer.name || "offer"}
                                    style={{ maxWidth: 150, maxHeight: 80 }}
                                    className="object-contain"
                                />
                            ) : (
                                <div className="h-16 w-36 rounded bg-[#11131a] flex items-center justify-center text-xs text-[#8C8FA8]">
                                    {formatName(offer.name)}
                                </div>
                            )}
                        </div>

                        <div className="w-full text-center py-2 rounded-md border-t border-[#2C2F44] bg-[#1E2133]">
                            <p className="text-xs font-medium">{formatName(offer.name)}</p>
                            <div className="mt-2">
                                <button
                                    onClick={() => openOffer(offer)}
                                    className="px-3 py-1 text-xs bg-[#094D47] rounded-md"
                                >
                                    Open
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServeyWalls;
