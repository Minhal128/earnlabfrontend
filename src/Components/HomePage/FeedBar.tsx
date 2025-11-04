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
        <div className="overflow-x-auto scrollbar-hide mb-4">
            <div className="flex gap-4 md:min-w-max">
                {loading && (
                    <div className="text-sm text-[#8C8FA8]">Loading activity...</div>
                )}

                {!loading && events.length === 0 && (
                    <div className="text-sm text-[#8C8FA8]">No recent activity</div>
                )}

                {!loading && events.map((ev, idx) => (
                    <div
                        key={ev._id || idx}
                        onClick={() => handleUserClick(ev.userId)}
                        className="flex items-center cursor-pointer gap-3 bg-[#26293E] text-white rounded-lg md:px-6 md:py-4 px-4 py-3 md:min-w-[250px] min-w-[200px] shadow-md hover:bg-[#2f3247] transition-colors"
                    >
                        <div className="flex-shrink-0">
                            <Image
                                src={pickIcon(ev.type)}
                                alt={ev.type || "event"}
                                className="object-contain md:w-8 md:h-8 w-6 h-6"
                            />
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="font-semibold md:text-sm text-xs leading-tight">
                                {ev.text}
                            </span>
                            <span className="text-xs text-gray-400 leading-tight">
                                {ev.createdAt ? new Date(ev.createdAt).toLocaleTimeString() : "now"}
                            </span>
                        </div>
                    </div>
                ))}
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
