"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from '@/contexts/SocketProvider';
import Image from "next/image";
import UserProfileModal from "@/Components/UserProfileModal";

import PayPalImg from "../../../public/assets/paypal.png";
import SteamImg from "../../../public/assets/cb.png";
import AmazonImg from "../../../public/assets/amazon.png";
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
    const [showUserProfile, setShowUserProfile] = useState(false);

    const { socket } = useSocket();

    const handleUserClick = (userId?: string) => {
        if (userId) {
            setSelectedUserId(userId);
            setShowUserProfile(true);
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
            // prepend new event if not already exists
            setEvents((prev) => {
                if (ev._id && prev.some(p => p._id === ev._id)) return prev;
                // If there's no _id, we can compare other properties like timestamp + text
                if (!ev._id && prev.some(p => p.createdAt === ev.createdAt && p.text === ev.text)) return prev;
                return [ev, ...prev].slice(0, 50);
            });
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
                return AmazonImg;
            case "gift":
                return AppleImg;
            default:
                return SteamImg;
        }
    };

    return (
        <>
            <div className="rounded-xl md:rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-3 sm:p-4 md:p-5">
                <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Activity
                </h3>
                
                <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
                    <div className="flex gap-2 sm:gap-3 pb-1">
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
                                className="flex items-center cursor-pointer gap-2 bg-[#252840] hover:bg-[#2A2D3E] border border-[#2A2D3E] text-white rounded-lg px-2.5 sm:px-3 py-2 min-w-[160px] sm:min-w-[180px] flex-shrink-0 transition-colors duration-200 group"
                            >
                                <div className="flex-shrink-0 p-1.5 rounded-lg bg-emerald-500/10">
                                    <Image
                                        src={pickIcon(ev.type)}
                                        alt={ev.type || "event"}
                                        className="object-contain w-4 h-4 sm:w-5 sm:h-5"
                                    />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-medium text-[11px] sm:text-xs leading-tight text-white truncate">
                                        {ev.text}
                                    </span>
                                    <span className="text-[9px] sm:text-[10px] text-[#9CA3AF] leading-tight">
                                        {ev.createdAt ? new Date(ev.createdAt).toLocaleTimeString() : "now"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <UserProfileModal
                userId={selectedUserId}
                isOpen={showUserProfile}
                onClose={() => {
                    setShowUserProfile(false);
                    setSelectedUserId(null);
                }}
            />
        </>
    );
};

export default FeedBar;
