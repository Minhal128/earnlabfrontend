"use client";

import React, { useState, useEffect } from "react";
import { useSocket } from '@/contexts/SocketProvider';
import { toast } from '@/utils/toast';
import Image from "next/image";

import LeftBottom from '../../../public/assets/back.png'
import RightTop from '../../../public/assets/bgright.png'
import BoxGradient from '../../../public/assets/box-gradient.svg'
import BoxNeon from '../../../public/assets/box-neon.svg'
import BoxPremium from '../../../public/assets/box-premium.svg'
import RewardModal from "./RewardModal";

// Mission icons - using gradient backgrounds with icons
const missionImages = [
    "https://img.icons8.com/3d-fluency/200/treasure-chest.png",
    "https://img.icons8.com/3d-fluency/200/goal.png",
    "https://img.icons8.com/3d-fluency/200/prize.png",
    "https://img.icons8.com/3d-fluency/200/rocket.png",
    "https://img.icons8.com/3d-fluency/200/star.png",
];
import RedOrBlackBonus from "./RedOrBlackBonus";

const TopSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dailyEligible, setDailyEligible] = useState<boolean | null>(null);
    const [lastClaimedAt, setLastClaimedAt] = useState<string | null>(null);
    const [claimLoading, setClaimLoading] = useState<boolean>(false);
    const [claimMessage, setClaimMessage] = useState<string | null>(null);

    // Centralized API URL helper (default to user's backend on 5000)
    const getApi = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const { socket } = useSocket();

    // fetch functions
    const fetchDaily = async () => {
        const api = getApi();
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            setDailyEligible(null);
            return;
        }
        try {
            const res = await fetch(`${api}/api/v1/user/daily-checkin`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                setDailyEligible(null);
                return;
            }
            const data = await res.json().catch(() => ({}));
            if (data && typeof data.eligible === "boolean") {
                setDailyEligible(data.eligible);
                setLastClaimedAt(data.lastClaimedAt || null);
            }
        } catch (err) {
            console.debug('daily-checkin eligibility fetch failed', err);
            setDailyEligible(null);
        }
    };

    const fetchStreaks = async () => {
        const api = getApi();
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;
        try {
            const res = await fetch(`${api}/api/v1/rewards/streaks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return;
            const body = await res.json().catch(() => ({}));
            if (Array.isArray(body.boxes)) setStreakBoxes(body.boxes);
        } catch (e) {
            console.debug('rewards/streaks fetch failed', e);
        }
    };

    useEffect(() => {
        fetchDaily();
        fetchStreaks();
    }, []);

    // subscribe to socket events to update UI in realtime (e.g., daily.checkin)
    useEffect(() => {
        if (!socket) return;
        const onNotif = (n: any) => {
            try {
                if (n && n.type === 'daily.checkin') {
                    // update local state to reflect claimed bonus
                    setDailyEligible(false);
                    setLastClaimedAt(n.claimedAt || new Date().toISOString());
                    setClaimMessage(n.message || 'Daily bonus claimed');
                    // update balance if provided
                    // refetch streaks to update claimable boxes
                    fetchStreaks();
                    toast.success(n.body || n.message || 'Daily bonus claimed');
                }
            } catch (e) {}
        };

        socket.on('notification', onNotif);
        return () => {
            try { socket.off('notification', onNotif); } catch {}
        };
    }, [socket]);

    const doDailyClaim = async () => {
        const api = getApi();
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            setClaimMessage("Please sign in to claim rewards.");
            return;
        }
        setClaimLoading(true);
        setClaimMessage(null);
        try {
            const res = await fetch(`${api}/api/v1/user/daily-checkin/claim`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) {
                const msg = body?.message || "Failed to claim";
                setClaimMessage(msg);
                // if server says already claimed, mark as claimed locally so button cannot be clicked again
                if (res.status === 400 || /already claimed/i.test(msg)) {
                    setDailyEligible(false);
                    // refresh streaks to update claimable state
                    fetchStreaks();
                }
                toast.error(msg);
            } else {
                setClaimMessage(body?.message || "Claim successful");
                // optimistic update
                setDailyEligible(false);
                setLastClaimedAt(body?.claimedAt || new Date().toISOString());
                // refetch streaks to update claimable boxes
                fetchStreaks();
                toast.success(body?.message || 'Claim successful');
            }
        } catch (err) {
            setClaimMessage("Failed to claim reward");
        } finally {
            setClaimLoading(false);
        }
    };

    // Fetch streak boxes, missions and free boxes from backend if endpoints exist.
    const [streakBoxes, setStreakBoxes] = useState<any[]>([]);
    const [missions, setMissions] = useState<any[]>([]);
    const [freeBoxes, setFreeBoxes] = useState<any[]>([]);

    useEffect(() => {
        const api = getApi();

        // streak boxes: try /api/v1/rewards/streaks
        (async () => {
            try {
                const res = await fetch(`${api}/api/v1/rewards/streaks`);
                if (res.ok) {
                    const body = await res.json().catch(() => ({}));
                    if (Array.isArray(body.boxes)) {
                        setStreakBoxes(body.boxes);
                    }
                }
            } catch (e) {
                console.debug('rewards/streaks fetch failed', e);
            }
        })();

        // missions: try /api/v1/rewards/missions then fall back to /api/v1/tasks?type=mission
        (async () => {
            try {
                const res = await fetch(`${api}/api/v1/rewards/missions`);
                if (res.ok) {
                    const body = await res.json().catch(() => ({}));
                    if (Array.isArray(body.missions)) {
                        setMissions(body.missions);
                        return;
                    }
                }
            } catch (e) {
                console.debug('rewards/missions fetch failed', e);
            }

            try {
                const r2 = await fetch(`${api}/api/v1/tasks?type=mission&limit=20`);
                if (r2.ok) {
                    const b2 = await r2.json().catch(() => ({}));
                    if (Array.isArray(b2.tasks)) setMissions(b2.tasks);
                }
            } catch (e) {
                console.debug('fallback missions fetch failed', e);
            }
        })();

        // free boxes: try /api/v1/rewards/free-boxes
        (async () => {
            try {
                const res = await fetch(`${api}/api/v1/rewards/free-boxes`);
                if (res.ok) {
                    const body = await res.json().catch(() => ({}));
                    if (Array.isArray(body.boxes)) setFreeBoxes(body.boxes);
                }
            } catch (e) {
                console.debug('rewards/free-boxes fetch failed', e);
            }
        })();
    }, []);
    return (
        <div className="w-full min-h-screen bg-[#0a0f1c] px-4 sm:px-6 text-white py-6">
            {/* Top Rewards Banner */}
            <section className="relative w-full flex justify-center items-center bg-gradient-to-r from-purple-600 to-pink-600 py-6 md:py-10 px-4 md:px-6 overflow-hidden rounded-lg mb-12">
                {/* Background Images */}
                <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 opacity-80 pointer-events-none">
                    <Image src={RightTop} alt="coin" fill className="object-contain" />
                </div>
                <div className="absolute bottom-[-60px] left-0 w-32 h-32 md:w-50 md:h-60 opacity-80 pointer-events-none">
                    <Image src={LeftBottom} alt="coin" fill className="object-contain" />
                </div>

                {/* Content */}
                <div className="relative text-center text-white max-w-xl z-10">
                    <h1 className="text-2xl md:text-7xl font-semibold mb-4">Rewards</h1>
                    <p className="text-sm md:text-lg mb-6">
                        Verify your email to claim $0.25 + 3 Free Boxes
                    </p>
                    <button
                        onClick={() => {
                            // primary claim: call backend claim endpoint
                            doDailyClaim();
                            setIsModalOpen(true);
                        }}
                        disabled={claimLoading || dailyEligible === false}
                        className="px-6 py-3 cursor-pointer bg-[#099F86] text-white font-semibold rounded-lg transition disabled:opacity-60"
                    >
                        {claimLoading ? "Claiming..." : (dailyEligible === false ? "Claimed" : "Claim $0.25")}
                    </button>
                    {claimMessage && (
                        <div className="mt-2 text-sm text-teal-200">{claimMessage}</div>
                    )}
                </div>
            </section>

            {/* Modal */}
            <RewardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Days Streak Boxes */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-2">7 days Streak boxes</h2>
                <p className="text-gray-400 mb-6">
                    Maintain your streak to earn rewards every day
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
                    {/* Render from API if available, otherwise fallback to 7 placeholders */}
                    {(streakBoxes.length > 0 ? streakBoxes : [1, 2, 3, 4, 5, 6, 7]).map((b: any, idx: number) => {
                        const day = b.day ?? idx + 1;
                        // Rotate through unique SVG box designs
                        const boxDesigns = [BoxGradient, BoxNeon, BoxPremium];
                        const image = b.imageUrl || boxDesigns[idx % 3];
                        const claimable = b.claimable !== undefined ? !!b.claimable : (dailyEligible ?? true);
                        return (
                            <div
                                key={b.id ?? idx}
                                className="flex flex-col justify-center items-center bg-[#151728] rounded-lg py-4 px-4 shadow-md hover:scale-105 transition"
                            >
                                <div className="bg-[#26293E] rounded-md w-full flex justify-center py-10">
                                    {typeof image === "string" ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={image} alt={`day-${day}`} style={{ width: 150, height: 60, objectFit: 'contain' }} />
                                    ) : (
                                        <Image src={image} alt={`day-${day}`} width={150} height={60} className="mb-4" />
                                    )}
                                </div>
                                <p className="text-md font-medium py-3">Day {day}</p>
                                <button
                                    onClick={() => doDailyClaim()}
                                    disabled={claimLoading || !claimable}
                                    className="mt-3 text-xs w-full bg-[#0D0F1E] px-3 py-3 rounded disabled:opacity-60"
                                >
                                    {claimable ? "Claim" : "Locked"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Missions Section */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6">Missions</h2>
                <p className="text-gray-400 mb-6">
                    Complete missions and reach milestones to earn additional rewards
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {(missions.length > 0 ? missions : [1, 2, 3, 4, 5]).map((m: any, idx: number) => {
                        const img = m.metadata?.logoUrl || missionImages[idx % missionImages.length];
                        const title = m.title || m.name || "Mission";
                        const description = m.description || m.metadata?.shortDescription || "Earn rewards by completing tasks";
                        const progress = m.progressPercent ?? 0;
                        const rewardCents = m.rewardCents ?? m.reward ?? 0;
                        const missionColors = [
                            "from-cyan-500/20 to-blue-600/20 border-cyan-500/30",
                            "from-purple-500/20 to-pink-600/20 border-purple-500/30",
                            "from-emerald-500/20 to-teal-600/20 border-emerald-500/30",
                            "from-orange-500/20 to-red-600/20 border-orange-500/30",
                            "from-yellow-500/20 to-amber-600/20 border-yellow-500/30",
                        ];
                        return (
                            <div key={m._id ?? idx} className={`group bg-gradient-to-br ${missionColors[idx % missionColors.length]} rounded-xl p-4 text-center shadow-lg border hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer`}>
                                <div className="bg-[#0D0F1E]/60 rounded-lg w-full flex justify-center py-4 mb-3 group-hover:bg-[#0D0F1E]/80 transition-colors">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img} alt={title} className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <p className="text-sm mb-3 text-gray-300 group-hover:text-white transition-colors">{description}</p>
                                <div className="w-full bg-[#30334A] rounded-full h-2 mb-3 overflow-hidden">
                                    <div style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} className="h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all duration-500" />
                                </div>
                                <div className="flex justify-between mb-3">
                                    <p className="text-xs text-[#8C8FA8]">Progress</p>
                                    <p className="text-xs text-emerald-400 font-semibold">${(rewardCents/100).toFixed(2)}</p>
                                </div>
                                <button className="text-xs w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-semibold px-3 py-2.5 rounded-lg transition-all duration-300">Claim</button>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Red or Black Daily Bonus Section */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-6">Daily Bonus</h2>
                <RedOrBlackBonus userBalance={0} />
            </section>

            {/* Unlock Free Boxes Section */}
            <section>
                <h2 className="text-xl font-semibold mb-2">Unlock Your Free Boxes</h2>
                <p className="text-gray-400 mb-6">Claim free boxes available to your account.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
                    {(freeBoxes.length > 0 ? freeBoxes : [1, 2, 3]).map((box: any, idx: number) => {
                        // Rotate through unique SVG box designs for free boxes
                        const boxDesigns = [BoxGradient, BoxNeon, BoxPremium];
                        const img = box.imageUrl || boxDesigns[idx % 3];
                        const title = box.title || `Box ${idx + 1}`;
                        const locked = box.locked === undefined ? false : !!box.locked;
                        return (
                            <div key={box.id ?? idx} className="bg-[#151728] rounded-lg p-3 text-center shadow-md hover:scale-105 transition">
                                <div>
                                    {typeof img === "string" ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={img} alt={title} style={{ width: 150, height: 80, objectFit: 'contain' }} className="mx-auto mb-4" />
                                    ) : (
                                        <Image src={img} alt={title} width={150} height={80} className="mx-auto mb-4" />
                                    )}
                                </div>
                                <p className="text-sm mb-3 py-3">{title}</p>
                                <button disabled={locked} className="text-xs w-full bg-[#0D0F1E] px-3 py-3 rounded disabled:opacity-60">
                                    {locked ? "Locked" : "Open"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default TopSection;
