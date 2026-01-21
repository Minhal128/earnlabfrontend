"use client";

import React, { useState, useEffect } from "react";
import { Crown, ExternalLink, Smartphone, Monitor, Gamepad2, AppWindow, FileQuestion, ClipboardList, AlertCircle, X } from "lucide-react";
import ModernSection from "../Shared/ModernSection";

interface PremiumOffer {
    _id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    type: "game" | "app" | "survey" | "other";
    rewardCents: number;
    platform: "ios" | "android" | "desktop" | "all";
    status: string;
    requirements?: string[];
    provider?: string;
    country?: string[];
}

interface PremiumOfferModalProps {
    offer: PremiumOffer | null;
    onClose: () => void;
    userPlatform: string;
}

const PremiumOfferModal: React.FC<PremiumOfferModalProps> = ({ offer, onClose, userPlatform }) => {
    if (!offer) return null;

    const isPlatformSupported = offer.platform === "all" || offer.platform === userPlatform;

    const handleStartOffer = async () => {
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const response = await fetch(`${api}/api/v1/offerwalls/premium/${offer._id}`);
            const data = await response.json();

            if (data.offer?.trackingUrl) {
                window.open(data.offer.trackingUrl, "_blank");
            }
        } catch (error) {
            console.error("Failed to start offer:", error);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "game":
                return <Gamepad2 className="h-5 w-5 text-purple-400" />;
            case "app":
                return <AppWindow className="h-5 w-5 text-blue-400" />;
            case "survey":
                return <ClipboardList className="h-5 w-5 text-green-400" />;
            default:
                return <FileQuestion className="h-5 w-5 text-gray-400" />;
        }
    };

    const getPlatformLabel = (platform: string) => {
        switch (platform) {
            case "ios":
                return "iOS";
            case "android":
                return "Android";
            case "desktop":
                return "Desktop";
            default:
                return "All Platforms";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#1A1D2E] rounded-2xl border border-[#2A2D3E] w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative p-6 border-b border-[#2A2D3E]">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#2A2D3E] transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                    <h2 className="text-xl font-bold text-white pr-8">Task Details</h2>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Offer Info */}
                    <div className="flex items-start gap-4">
                        {offer.imageUrl ? (
                            <img
                                src={offer.imageUrl}
                                alt={offer.title}
                                className="w-16 h-16 rounded-xl object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/64?text=?";
                                }}
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                                <Crown className="h-8 w-8 text-yellow-400" />
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-bold text-white">{offer.title}</h3>
                            <p className="text-emerald-400 font-bold text-lg">
                                ${(offer.rewardCents / 100).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Status, Category, Provider */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-[#0A0C1A] rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <p className="text-white font-medium text-sm">Not Started</p>
                        </div>
                        <div className="bg-[#0A0C1A] rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">Category</p>
                            <p className="text-emerald-400 font-medium text-sm capitalize flex items-center justify-center gap-1">
                                {getTypeIcon(offer.type)}
                                {offer.type}
                            </p>
                        </div>
                        <div className="bg-[#0A0C1A] rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500 mb-1">Provider</p>
                            <p className="text-white font-medium text-sm">{offer.provider || "Premium"}</p>
                        </div>
                    </div>

                    {/* Description */}
                    {offer.description && (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Description</h4>
                            <p className="text-gray-300 text-sm">{offer.description}</p>
                        </div>
                    )}

                    {/* Requirements */}
                    {offer.requirements && offer.requirements.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                                🎁 Rewards <span className="text-xs text-gray-500">({offer.requirements.length})</span>
                            </h4>
                            <div className="space-y-2">
                                {offer.requirements.map((req, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-[#0A0C1A] rounded-lg"
                                    >
                                        <span className="text-gray-300 text-sm">{req}</span>
                                        <span className="text-emerald-400 font-medium text-sm">
                                            ${(offer.rewardCents / 100 / (offer.requirements?.length || 1)).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Platform Warning */}
                    {!isPlatformSupported && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-red-400 font-medium text-sm">Device Not Supported</p>
                                    <p className="text-gray-400 text-xs mt-1">
                                        This offer is only available for: {getPlatformLabel(offer.platform)}
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        Your device: {getPlatformLabel(userPlatform)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className="p-6 border-t border-[#2A2D3E]">
                    {isPlatformSupported ? (
                        <button
                            onClick={handleStartOffer}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <ExternalLink className="h-5 w-5" />
                            Start Task
                        </button>
                    ) : (
                        <button
                            disabled
                            className="w-full py-4 rounded-xl bg-gray-700 text-gray-400 font-bold text-lg cursor-not-allowed"
                        >
                            Not available for your device
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const PremiumOfferwall: React.FC = () => {
    const [offers, setOffers] = useState<PremiumOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOffer, setSelectedOffer] = useState<PremiumOffer | null>(null);
    const [userPlatform, setUserPlatform] = useState<string>("desktop");
    const [userCountry, setUserCountry] = useState<string | null>(null);

    useEffect(() => {
        // Detect user platform
        const detectPlatform = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(userAgent)) {
                return "ios";
            } else if (/android/.test(userAgent)) {
                return "android";
            }
            return "desktop";
        };
        setUserPlatform(detectPlatform());

        // Detect user country and then fetch offers
        detectCountry();
    }, []);

    const detectCountry = async () => {
        try {
            // Using a simple public API for country detection
            const response = await fetch("https://api.country.is");
            const data = await response.json();
            if (data.country) {
                setUserCountry(data.country);
                fetchPremiumOffers(data.country);
            } else {
                fetchPremiumOffers(null);
            }
        } catch (error) {
            console.error("Failed to detect country:", error);
            fetchPremiumOffers(null); // Fallback to fetching without country filter
        }
    };

    const fetchPremiumOffers = async (country: string | null) => {
        try {
            setLoading(true);
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

            // Construct URL with country query param if available
            let url = `${api}/api/v1/offerwalls/premium`;
            if (country) {
                url += `?country=${country}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            setOffers(data.offers || []);
        } catch (error) {
            console.error("Failed to fetch premium offers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSeeMore = () => {
        // Navigate to dedicated premium offers page if needed
        console.log("See more premium offers");
    };

    const handleOfferClick = (offer: PremiumOffer) => {
        setSelectedOffer(offer);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "game":
                return <Gamepad2 className="h-3 w-3" />;
            case "app":
                return <AppWindow className="h-3 w-3" />;
            case "survey":
                return <ClipboardList className="h-3 w-3" />;
            default:
                return <FileQuestion className="h-3 w-3" />;
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case "ios":
            case "android":
                return <Smartphone className="h-3 w-3" />;
            case "desktop":
                return <Monitor className="h-3 w-3" />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <ModernSection
                title="Premium Offers"
                description="Exclusive high-reward offers"
                icon={<Crown className="text-yellow-400" size={20} />}
            >
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full" />
                </div>
            </ModernSection>
        );
    }

    return (
        <>
            <ModernSection
                title="Premium Offers"
                description="Exclusive high-reward offers"
                onSeeMore={offers.length > 0 ? handleSeeMore : undefined}
                icon={<Crown className="text-yellow-400" size={20} />}
            >
                {offers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Crown className="h-12 w-12 text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-400 mb-2">
                            No premium offers available
                        </h3>
                        <p className="text-gray-500 text-sm max-w-md">
                            Premium offers are coming soon! Check back later for exclusive high-reward opportunities.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                        {offers.map((offer) => (
                            <div
                                key={offer._id}
                                onClick={() => handleOfferClick(offer)}
                                className="group relative overflow-hidden rounded-xl bg-[#1A1D2E] border border-yellow-500/20 hover:border-yellow-400/40 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/10"
                            >
                                {/* Premium Badge */}
                                <div className="absolute top-2 left-2 z-20">
                                    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-md text-[10px] font-bold text-white shadow-lg">
                                        <Crown className="h-3 w-3" />
                                        PREMIUM
                                    </div>
                                </div>

                                {/* Image */}
                                <div className="relative h-28 md:h-32 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1D2E] via-transparent to-transparent z-10" />
                                    {offer.imageUrl ? (
                                        <img
                                            src={offer.imageUrl}
                                            alt={offer.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x128?text=Premium";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                                            <Crown className="h-12 w-12 text-yellow-400/50" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-3 space-y-2">
                                    <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-yellow-400 transition-colors">
                                        {offer.title}
                                    </h3>

                                    {/* Meta Info */}
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1 capitalize">
                                            {getTypeIcon(offer.type)}
                                            {offer.type}
                                        </span>
                                        {offer.platform !== "all" && (
                                            <>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 capitalize">
                                                    {getPlatformIcon(offer.platform)}
                                                    {offer.platform}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Reward */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-emerald-400 font-bold text-sm">
                                            ${(offer.rewardCents / 100).toFixed(2)}
                                        </span>
                                        <span className="text-[10px] text-gray-500">
                                            {offer.provider || "Premium"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ModernSection>

            {/* Offer Detail Modal */}
            {selectedOffer && (
                <PremiumOfferModal
                    offer={selectedOffer}
                    onClose={() => setSelectedOffer(null)}
                    userPlatform={userPlatform}
                />
            )}
        </>
    );
};

export default PremiumOfferwall;
