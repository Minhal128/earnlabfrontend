"use client";

import React, { useEffect, useState } from "react";
import { type StaticImageData } from "next/image";
import { Star, Crown, ExternalLink, Smartphone, Monitor, Gamepad2, AppWindow, FileQuestion, ClipboardList, AlertCircle, X } from "lucide-react";
import Link from "next/link";
import Fe1 from "../../../public/assets/fe1.png";
import Fe2 from "../../../public/assets/fe2.png";
import Fe3 from "../../../public/assets/fe3.png";
import Fe4 from "../../../public/assets/fe4.png";
import TaskModal from "../Tasks/TaskModal";
import StartTaskModal from "../Tasks/StartTaskModal";
import ModernSection from "../Shared/ModernSection";
import ModernCard from "../Shared/ModernCard";

// We'll load featured tasks from the backend. Backend supports `type` query.
type BackendTask = {
    _id?: string;
    title?: string;
    description?: string;
    rewardCents?: number;
    reward?: number;
    metadata?: Record<string, unknown>;
};

// Premium offer type
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
}

interface FeaturedTaskDisplay {
    image: string | StaticImageData;
    title: string;
    description: string;
    reward: number;
    raw: BackendTask;
}

// Premium Offer Modal Component
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

// Trending offer type from OfferWalls
interface TrendingOffer {
    _id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    rewardCents: number;
    provider?: string;
    trackingUrl?: string;
    platform?: string;
}

const FeaturedTask: React.FC = () => {
    const [selectedTask, setSelectedTask] = useState<FeaturedTaskDisplay | null>(null);
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [items, setItems] = useState<BackendTask[]>([]);
    const [premiumOffers, setPremiumOffers] = useState<PremiumOffer[]>([]);
    const [trendingOffers, setTrendingOffers] = useState<TrendingOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeClaimedTask, setActiveClaimedTask] = useState<BackendTask | null>(null);
    const [selectedPremiumOffer, setSelectedPremiumOffer] = useState<PremiumOffer | null>(null);
    const [userPlatform, setUserPlatform] = useState<string>("desktop");

    // Detect user platform
    useEffect(() => {
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
    }, []);

    const fetchFeatured = async () => {
        setLoading(true);
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            
            // Fetch featured tasks, premium offers, and trending offers from OfferWalls in parallel
            const [tasksRes, premiumRes, trendingRes] = await Promise.all([
                fetch(`${api}/api/v1/tasks?type=featured&limit=10`).catch(() => null),
                fetch(`${api}/api/v1/offerwalls/premium?limit=10`).catch(() => null),
                fetch(`${api}/api/v1/offerwalls/trending?limit=15`).catch(() => null)
            ]);

            // Process featured tasks
            if (tasksRes) {
                const tasksData = await tasksRes.json().catch(() => ({}));
                if (tasksData && Array.isArray(tasksData.tasks)) {
                    setItems(tasksData.tasks as BackendTask[]);
                } else {
                    setItems([]);
                }
            } else {
                setItems([]);
            }

            // Process premium offers
            if (premiumRes) {
                const premiumData = await premiumRes.json().catch(() => ({}));
                if (premiumData && Array.isArray(premiumData.offers)) {
                    setPremiumOffers(premiumData.offers as PremiumOffer[]);
                } else {
                    setPremiumOffers([]);
                }
            } else {
                setPremiumOffers([]);
            }

            // Process trending offers from OfferWalls
            if (trendingRes) {
                const trendingData = await trendingRes.json().catch(() => ({}));
                if (trendingData && Array.isArray(trendingData.offers)) {
                    setTrendingOffers(trendingData.offers as TrendingOffer[]);
                } else {
                    setTrendingOffers([]);
                }
            } else {
                setTrendingOffers([]);
            }
        } catch (err) {
            console.error("Failed to load featured tasks", err);
            setItems([]);
            setPremiumOffers([]);
            setTrendingOffers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatured();
    }, []);

    const openStartWithClaim = (claimed?: BackendTask) => {
        setIsStartOpen(true);
        setActiveClaimedTask(claimed ?? null);
    };

    const handleSeeMore = () => {
        // Navigate to tasks page
        window.location.href = "/tasks";
    };

    // Combine items: show featured tasks first, then premium offers, then trending offers from OfferWalls
    const hasContent = items.length > 0 || premiumOffers.length > 0 || trendingOffers.length > 0;

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

    return (
        <ModernSection
            title="Featured Tasks"
            description="Hand-picked offers with boosted rewards. Complete these for maximum earnings."
            onSeeMore={hasContent ? handleSeeMore : undefined}
            icon={<Star className="text-yellow-400" size={20} />}
        >
            {loading && <div className="text-sm text-gray-400">Loading featured tasks...</div>}
            {!loading && !hasContent && (
                <div className="text-sm text-gray-400">No featured tasks available</div>
            )}

            {/* Scrollable horizontal container - Premium Offers FIRST, then Featured Tasks, then Trending */}
            {hasContent && (
                <div className="relative">
                    <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {/* PREMIUM OFFERS - Always displayed FIRST (2-3 visible initially) */}
                        {premiumOffers.map((offer) => (
                            <div
                                key={offer._id}
                                onClick={() => setSelectedPremiumOffer(offer)}
                                className="flex-shrink-0 w-[160px] md:w-[180px] group relative overflow-hidden rounded-xl bg-[#1A1D2E] border border-yellow-500/30 hover:border-yellow-400/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20"
                            >
                                {/* PREMIUM Badge */}
                                <div className="absolute top-2 left-2 z-20">
                                    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-md text-[10px] font-bold text-black shadow-lg">
                                        ⭐ PREMIUM
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
                                    <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-yellow-400 transition-colors leading-tight">
                                        {offer.title}
                                    </h3>
                                    
                                    {offer.description && (
                                        <p className="text-xs text-gray-500 line-clamp-1">
                                            {offer.description}
                                        </p>
                                    )}

                                    {/* Reward */}
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-yellow-400 font-bold text-sm">
                                            ${(offer.rewardCents / 100).toFixed(2)}
                                        </span>
                                        <div className="flex items-center gap-1 text-gray-500">
                                            {offer.platform === "all" ? (
                                                <>
                                                    <Smartphone className="h-3 w-3" />
                                                    <Monitor className="h-3 w-3" />
                                                </>
                                            ) : (
                                                getPlatformIcon(offer.platform)
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Regular Featured Tasks - After Premium Offers */}
                        {items.map((task, index) => {
                            const img = (task.metadata?.logoUrl || task.metadata?.imageUrl) as string | undefined || [Fe1, Fe2, Fe3, Fe4][index % 4];
                            const title = task.title || "Untitled";
                            const desc = task.description || task.metadata?.shortDescription as string || "";
                            const reward = typeof task.rewardCents === "number" ? task.rewardCents : (task.reward || 0);
                            return (
                                <div key={task._id || `task-${index}`} className="flex-shrink-0 w-[160px] md:w-[180px]">
                                    <ModernCard
                                        image={img}
                                        title={title}
                                        description={desc}
                                        reward={reward}
                                        onClick={() => setSelectedTask({ image: img, title, description: desc, reward, raw: task })}
                                        variant="featured"
                                        showPlatforms={true}
                                        platforms={["web", "ios", "android"]}
                                    />
                                </div>
                            );
                        })}

                        {/* Trending Offers from OfferWalls - After Featured Tasks */}
                        {trendingOffers.map((offer, index) => (
                            <div
                                key={offer._id || `trending-${index}`}
                                onClick={() => {
                                    if (offer.trackingUrl) {
                                        window.open(offer.trackingUrl, "_blank");
                                    }
                                }}
                                className="flex-shrink-0 w-[160px] md:w-[180px] group relative overflow-hidden rounded-xl bg-[#1A1D2E] border border-blue-500/20 hover:border-blue-400/40 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/10"
                            >
                                {/* TRENDING Badge */}
                                <div className="absolute top-2 left-2 z-20">
                                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-500 rounded-md text-[10px] font-bold text-white shadow-lg">
                                        TRENDING
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
                                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/200x128?text=Offer";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                                            <Star className="h-12 w-12 text-blue-400/50" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-3 space-y-2">
                                    <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors leading-tight">
                                        {offer.title}
                                    </h3>
                                    
                                    {/* Provider */}
                                    {offer.provider && (
                                        <p className="text-xs text-gray-500 line-clamp-1">
                                            {offer.provider}
                                        </p>
                                    )}

                                    {/* Reward */}
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-blue-400 font-bold text-sm">
                                            ${(offer.rewardCents / 100).toFixed(2)}
                                        </span>
                                        <ExternalLink className="h-3 w-3 text-gray-500" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Scroll indicator/gradient on right */}
                    {(items.length + premiumOffers.length + trendingOffers.length) > 4 && (
                        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#0A0C1A] to-transparent pointer-events-none" />
                    )}
                </div>
            )}

            {/* Link to view all tasks */}
            {hasContent && (
                <div className="flex justify-end mt-2">
                    <Link 
                        href="/tasks"
                        className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                    >
                        View all tasks
                        <ExternalLink className="h-3 w-3" />
                    </Link>
                </div>
            )}

            {/* Task Modals */}
            <TaskModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                onStart={(claimedTask?: BackendTask) => openStartWithClaim(claimedTask)}
                task={selectedTask}
            />

            <StartTaskModal
                isOpen={isStartOpen}
                onClose={() => setIsStartOpen(false)}
                task={activeClaimedTask}
                onComplete={() => {
                    fetchFeatured();
                    setActiveClaimedTask(null);
                }}
            />

            {/* Premium Offer Modal */}
            <PremiumOfferModal
                offer={selectedPremiumOffer}
                onClose={() => setSelectedPremiumOffer(null)}
                userPlatform={userPlatform}
            />
        </ModernSection>
    );
};

export default FeaturedTask;