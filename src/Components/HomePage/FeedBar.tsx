"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from '@/contexts/SocketProvider';
import Image from "next/image";
import UserProfileModal from "../UserProfileModal";

import PayPalImg from "../../../public/assets/paypal.png";
import SteamImg from "../../../public/assets/cb.png";
import VenmoImg from "../../../public/assets/v.png";
import AppleImg from "../../../public/assets/apple.png";

type FeedEvent = {
    _id?: string;
    type?: string;
    text?: string;
    amountCents?: number | null;
    createdAt?: string | Date;
    userId?: string;
    username?: string;
};

const FeedBar: React.FC = () => {
    const [events, setEvents] = useState<FeedEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const { socket } = useSocket();

    const handleUserClick = (userId?: string) => {
        if (userId) {
            setSelectedUserId(userId);
            setShowProfileModal(true);
        }
    };

    useEffect(() => {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        fetch(`${api}/api/v1/feed/activity`)
            .then((r) => r.json())
            .then((data) => {
                if (data && Array.isArray(data.events)) {
                    setEvents(data.events);
                } else {
                    setEvents([]);
                }
            })
            .catch((err) => {
                console.error("Failed to load feed activity", err);
                setEvents([]);
            })
            .finally(() => setLoading(false));
    }, []);

    // subscribe to real-time feed events
    useEffect(() => {
        if (!socket) return;

        const onFeed = (ev: any) => {
            // prepend new event
            setEvents((prev) => [ev, ...prev].slice(0, 50));
        };

        try {
            socket.on('feed:event', onFeed);
        } catch (err) {
            // noop
        }

        return () => {
            try { socket.off('feed:event', onFeed); } catch {}
        };
    }, [socket]);

    const pickIcon = (type?: string) => {
        switch (type) {
            case "earning":
                return PayPalImg;
            case "withdrawal":
                return VenmoImg;
            case "gift":
                return AppleImg;
            default:
                return SteamImg;
        }
    };

    return (
        <div className="rounded-xl md:rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-3 sm:p-4 md:p-5">
            <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Activity
            </h3>
            
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 sm:gap-3 md:min-w-max">
                    {loading && (
                        <div className="text-sm text-[#9CA3AF]">Loading activity...</div>
                    )}

                    {!loading && events.length === 0 && (
                        <div className="text-sm text-[#9CA3AF]">No recent activity</div>
                    )}

                    {!loading && events.map((ev, idx) => (
                        <div
                            key={ev._id || idx}
                            onClick={() => handleUserClick(ev.userId)}
                            className="flex items-center cursor-pointer gap-2 sm:gap-3 bg-[#252840] hover:bg-[#2A2D3E] border border-[#2A2D3E] text-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3 min-w-[180px] sm:min-w-[220px] transition-all duration-200 hover:scale-105 group"
                        >
                            <div className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                                <Image
                                    src={pickIcon(ev.type)}
                                    alt={ev.type || "event"}
                                    className="object-contain w-5 h-5 sm:w-6 sm:h-6"
                                />
                            </div>
                            <div className="flex flex-col space-y-0.5">
                                <span className="font-medium text-xs sm:text-sm leading-tight text-white">
                                    {ev.text}
                                </span>
                                <span className="text-[10px] sm:text-xs text-[#9CA3AF] leading-tight">
                                    {ev.createdAt ? new Date(ev.createdAt).toLocaleTimeString() : "now"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Profile Modal */}
            <UserProfileModal 
                userId={selectedUserId}
                isOpen={showProfileModal}
                onClose={() => {
                    setShowProfileModal(false);
                    setSelectedUserId(null);
                }}
            />
        </div>
    );
};

export default FeedBar;
