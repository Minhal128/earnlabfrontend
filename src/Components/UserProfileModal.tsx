"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Award, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

interface UserProfile {
    uuid: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    balanceCents: number;
    createdAt: string;
    lastActive?: string;
    tasksCompleted?: number;
    lifetimeEarningsCents?: number;
}

interface CompletedOffer {
    _id: string;
    title: string;
    rewardCents: number;
    completedAt: string;
    provider?: string;
}

interface Withdrawal {
    _id: string;
    amountCents: number;
    method: string;
    status: string;
    destination?: string;
    giftCardType?: string;
    createdAt: string;
    completedAt?: string;
}

interface UserProfileModalProps {
    userId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ userId, isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [completedOffers, setCompletedOffers] = useState<CompletedOffer[]>([]);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [isPrivate, setIsPrivate] = useState(false);
    const [activeTab, setActiveTab] = useState<"overview" | "offers" | "withdrawals">("overview");

    const getApi = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    useEffect(() => {
        if (isOpen && userId) {
            fetchUserProfile();
        } else {
            // Reset state when modal closes
            setProfile(null);
            setCompletedOffers([]);
            setWithdrawals([]);
            setIsPrivate(false);
            setActiveTab("overview");
        }
    }, [isOpen, userId]);

    const fetchUserProfile = async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const api = getApi();
            const res = await fetch(`${api}/api/v1/games/user/${userId}`);
            
            if (res.ok) {
                const data = await res.json();
                
                if (data.isPrivate) {
                    setIsPrivate(true);
                    toast.info(data.message || "This profile is private");
                } else {
                    setProfile(data.profile);
                    setIsPrivate(false);
                    
                    // Fetch completed offers and withdrawals if profile is public
                    if (data.profile) {
                        fetchCompletedOffers(userId);
                        fetchWithdrawals(userId);
                    }
                }
            } else {
                toast.error("Failed to load user profile");
            }
        } catch (err) {
            console.error("Error fetching user profile:", err);
            toast.error("Failed to load user profile");
        } finally {
            setLoading(false);
        }
    };

    const fetchCompletedOffers = async (uid: string) => {
        try {
            const api = getApi();
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            
            const headers: HeadersInit = {};
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const res = await fetch(`${api}/api/v1/user/${uid}/completed-offers`, { headers });
            
            if (res.ok) {
                const data = await res.json();
                if (data.offers && Array.isArray(data.offers)) {
                    setCompletedOffers(data.offers);
                }
            }
        } catch (err) {
            console.error("Error fetching completed offers:", err);
        }
    };

    const fetchWithdrawals = async (uid: string) => {
        try {
            const api = getApi();
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            
            const headers: HeadersInit = {};
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const res = await fetch(`${api}/api/v1/user/${uid}/withdrawals`, { headers });
            
            if (res.ok) {
                const data = await res.json();
                if (data.withdrawals && Array.isArray(data.withdrawals)) {
                    setWithdrawals(data.withdrawals);
                }
            }
        } catch (err) {
            console.error("Error fetching withdrawals:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[#1E2133] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-[#1E2133] border-b border-gray-700 p-6 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-white">User Profile</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="animate-spin mb-4 text-teal-400" size={48} />
                            <p className="text-gray-400">Loading profile...</p>
                        </div>
                    ) : isPrivate ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-24 h-24 rounded-full bg-[#2A2D44] flex items-center justify-center mb-4">
                                <span className="text-4xl">🔒</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Private Profile</h3>
                            <p className="text-gray-400 text-center">
                                This user has set their profile to private.
                            </p>
                        </div>
                    ) : profile ? (
                        <>
                            {/* Profile Header */}
                            <div className="flex flex-col items-center mb-6">
                                {profile.avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img 
                                        src={profile.avatarUrl} 
                                        alt={profile.username}
                                        className="w-24 h-24 rounded-full mb-4 border-4 border-teal-500"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-3xl font-bold mb-4 border-4 border-teal-500">
                                        {(profile.displayName || profile.username).charAt(0).toUpperCase()}
                                    </div>
                                )}
                                
                                <h3 className="text-2xl font-bold text-white mb-1">
                                    {profile.displayName || profile.username}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">@{profile.username}</p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
                                    <div className="bg-[#26293E] rounded-lg p-4 text-center">
                                        <DollarSign className="mx-auto mb-2 text-green-400" size={24} />
                                        <p className="text-2xl font-bold text-white">
                                            ${(profile.balanceCents / 100).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-400">Current Balance</p>
                                    </div>
                                    
                                    <div className="bg-[#26293E] rounded-lg p-4 text-center">
                                        <TrendingUp className="mx-auto mb-2 text-teal-400" size={24} />
                                        <p className="text-2xl font-bold text-white">
                                            ${((profile.lifetimeEarningsCents || profile.balanceCents) / 100).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-400">Lifetime Earned</p>
                                    </div>
                                    
                                    <div className="bg-[#26293E] rounded-lg p-4 text-center">
                                        <Award className="mx-auto mb-2 text-yellow-400" size={24} />
                                        <p className="text-2xl font-bold text-white">
                                            {profile.tasksCompleted || 0}
                                        </p>
                                        <p className="text-xs text-gray-400">Tasks Done</p>
                                    </div>
                                    
                                    <div className="bg-[#26293E] rounded-lg p-4 text-center">
                                        <Calendar className="mx-auto mb-2 text-blue-400" size={24} />
                                        <p className="text-sm font-bold text-white">
                                            {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </p>
                                        <p className="text-xs text-gray-400">Joined</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="border-b border-gray-700 mb-6">
                                <div className="flex gap-6 overflow-x-auto">
                                    <button
                                        onClick={() => setActiveTab("overview")}
                                        className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
                                            activeTab === "overview"
                                                ? "text-teal-400 border-b-2 border-teal-400"
                                                : "text-gray-400 hover:text-gray-300"
                                        }`}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("offers")}
                                        className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
                                            activeTab === "offers"
                                                ? "text-teal-400 border-b-2 border-teal-400"
                                                : "text-gray-400 hover:text-gray-300"
                                        }`}
                                    >
                                        Earnings ({completedOffers.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("withdrawals")}
                                        className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
                                            activeTab === "withdrawals"
                                                ? "text-teal-400 border-b-2 border-teal-400"
                                                : "text-gray-400 hover:text-gray-300"
                                        }`}
                                    >
                                        Withdrawals ({withdrawals.length})
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content */}
                            {activeTab === "overview" ? (
                                <div className="space-y-4">
                                    <div className="bg-[#26293E] rounded-lg p-4">
                                        <h4 className="text-lg font-semibold text-white mb-3">Profile Information</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Username</span>
                                                <span className="text-white font-medium">@{profile.username}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Display Name</span>
                                                <span className="text-white font-medium">
                                                    {profile.displayName || "Not set"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Member Since</span>
                                                <span className="text-white font-medium">
                                                    {new Date(profile.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {profile.lastActive && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400">Last Active</span>
                                                    <span className="text-white font-medium">
                                                        {new Date(profile.lastActive).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-[#26293E] rounded-lg p-4">
                                        <h4 className="text-lg font-semibold text-white mb-3">Latest Earnings</h4>
                                        {completedOffers.length > 0 ? (
                                            <div className="space-y-2">
                                                {completedOffers.slice(0, 3).map((offer) => (
                                                    <div 
                                                        key={offer._id}
                                                        className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0"
                                                    >
                                                        <div>
                                                            <p className="text-white text-sm font-medium">
                                                                {offer.title}
                                                            </p>
                                                            <p className="text-gray-400 text-xs">
                                                                {new Date(offer.completedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <span className="text-green-400 font-semibold">
                                                            +${(offer.rewardCents / 100).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-sm text-center py-4">
                                                No recent earnings to display
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : activeTab === "offers" ? (
                                <div className="space-y-3">
                                    {completedOffers.length > 0 ? (
                                        completedOffers.map((offer) => (
                                            <div 
                                                key={offer._id}
                                                className="bg-[#26293E] rounded-lg p-4 hover:bg-[#2f3247] transition-colors"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <h5 className="text-white font-semibold mb-1">
                                                            {offer.title}
                                                        </h5>
                                                        {offer.provider && (
                                                            <p className="text-gray-400 text-xs">
                                                                Provider: {offer.provider}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="text-green-400 font-bold text-lg ml-4">
                                                        +${(offer.rewardCents / 100).toFixed(2)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-xs">
                                                    Completed: {new Date(offer.completedAt).toLocaleString()}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <Award className="mx-auto mb-4 text-gray-600" size={48} />
                                            <p className="text-gray-400">No completed offers yet</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {withdrawals.length > 0 ? (
                                        withdrawals.map((withdrawal) => {
                                            const statusColors: { [key: string]: string } = {
                                                'Pending': 'text-yellow-400 bg-yellow-500/10',
                                                'Approved': 'text-blue-400 bg-blue-500/10',
                                                'Completed': 'text-green-400 bg-green-500/10',
                                                'Rejected': 'text-red-400 bg-red-500/10',
                                                'Cancelled': 'text-gray-400 bg-gray-500/10',
                                            };
                                            const statusColor = statusColors[withdrawal.status] || 'text-gray-400 bg-gray-500/10';
                                            
                                            return (
                                                <div 
                                                    key={withdrawal._id}
                                                    className="bg-[#26293E] rounded-lg p-4 hover:bg-[#2f3247] transition-colors"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1">
                                                            <h5 className="text-white font-semibold mb-1">
                                                                {withdrawal.method === 'crypto' ? '₿ Crypto' : 
                                                                 withdrawal.method === 'paypal' ? '🅿️ PayPal' :
                                                                 withdrawal.method === 'giftcard' ? '🎁 Gift Card' : 'Bank Transfer'}
                                                                {withdrawal.giftCardType && ` (${withdrawal.giftCardType})`}
                                                            </h5>
                                                            <p className="text-gray-400 text-xs">
                                                                To: {withdrawal.destination?.substring(0, 30)}...
                                                            </p>
                                                        </div>
                                                        <span className="text-green-400 font-bold text-lg ml-4">
                                                            -${(withdrawal.amountCents / 100).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-gray-400 text-xs">
                                                            {new Date(withdrawal.createdAt).toLocaleString()}
                                                        </p>
                                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColor}`}>
                                                            {withdrawal.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-12">
                                            <Award className="mx-auto mb-4 text-gray-600" size={48} />
                                            <p className="text-gray-400">No withdrawals yet</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400">Failed to load profile</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && !isPrivate && profile && (
                    <div className="sticky bottom-0 bg-[#1E2133] border-t border-gray-700 p-6">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-gradient-to-r from-[#099F86] to-[#0EA88F] rounded-lg font-semibold hover:opacity-90 transition text-white"
                        >
                            Close Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileModal;
