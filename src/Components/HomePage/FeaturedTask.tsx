"use client";

import React, { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { FaLaptop, FaApple, FaAndroid } from "react-icons/fa";

import Fe1 from "../../../public/assets/fe1.png";
import Fe2 from "../../../public/assets/fe2.png";
import Fe3 from "../../../public/assets/fe3.png";
import Fe4 from "../../../public/assets/fe4.png";
import CoinIcon from "../../../public/assets/bluedolar.png";
import TaskModal from "../Tasks/TaskModal";
import StartTaskModal from "../Tasks/StartTaskModal";

// We'll load featured tasks from the backend. Backend supports `type` query.
type BackendTask = {
    _id?: string;
    title?: string;
    description?: string;
    rewardCents?: number;
    reward?: number;
    metadata?: Record<string, unknown>;
};

interface FeaturedTaskDisplay {
    image: string | StaticImageData;
    title: string;
    description: string;
    reward: number;
    raw: BackendTask;
}

const FeaturedTask: React.FC = () => {
    const [selectedTask, setSelectedTask] = useState<FeaturedTaskDisplay | null>(null);
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [items, setItems] = useState<BackendTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeClaimedTask, setActiveClaimedTask] = useState<BackendTask | null>(null);

    const fetchFeatured = async () => {
        setLoading(true);
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${api}/api/v1/tasks?type=featured&limit=4`);
            const data = await res.json().catch(() => ({}));
            if (data && Array.isArray(data.tasks)) {
                setItems(data.tasks as BackendTask[]);
            } else {
                setItems([]);
            }
        } catch (err) {
            console.error("Failed to load featured tasks", err);
            setItems([]);
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

    return (
        <div className="w-full bg-[#0f172a] mt-5 md:p-6 px-3 py-5 rounded-lg text-white border border-[0.1px] border-[#50536F]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <h2 className="md:text-lg text-sm font-semibold">Featured Tasks</h2>
                    <p className="md:text-sm text-[10px] text-[#8C8FA8]">
                        Complete the featured task to earn bigger rewards
                    </p>
                </div>
                <button className="md:text-sm text-xs text-[#4DD6C1] cursor-pointer font-semibold">
                    See More
                </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {loading && <div className="text-sm text-[#8C8FA8]">Loading featured tasks...</div>}
                {!loading && items.length === 0 && (
                    <div className="text-sm text-[#8C8FA8]">No featured tasks</div>
                )}

                {items.map((task, index) => {
                    const img = (task.metadata?.logoUrl || task.metadata?.imageUrl) as string | undefined || [Fe1, Fe2, Fe3, Fe4][index % 4];
                    const title = task.title || "Untitled";
                    const desc = task.description || task.metadata?.shortDescription as string || "";
                    const reward = typeof task.rewardCents === "number" ? task.rewardCents : (task.reward || 0);
                    return (
                        <div
                            key={task._id || index}
                            onClick={() => setSelectedTask({ image: img, title, description: desc, reward, raw: task })}
                            className="bg-[#1E2133] rounded-lg px-2.5 cursor-pointer pt-2.5 overflow-hidden shadow hover:shadow-lg transition"
                        >
                            <div className="relative w-full md:h-40 h-25">
                                {typeof img === "string" ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Image src={img as StaticImageData} alt={title} fill className="object-cover" />
                                )}
                            </div>
                            <div className="pt-2.5 md:pb-4 pb-3">
                                <h3 className="md:text-md text-[12px] font-semibold">{title}</h3>
                                <p className="md:text-sm text-[8px] text-[#B3B6C7]">{desc}</p>

                                <div className="flex items-center justify-between mt-3">
                                    {/* Reward with coin icon */}
                                    <span className="text-blue-400 font-medium flex items-center gap-1">
                                        <Image
                                            src={CoinIcon}
                                            alt="Coin"
                                            width={18}
                                            height={18}
                                            className="inline-block mt-0.5"
                                        />
                                        <span className="py-0.5 rounded-full text-white text-xs">
                                            {reward}
                                        </span>
                                    </span>

                                    {/* Platform Icons */}
                                    <div className="flex gap-1">
                                        <span className="md:w-6 md:h-6 w-4 h-4 cursor-pointer flex items-center justify-center bg-[#30334A] rounded-full">
                                            <FaLaptop className="text-[#03C4A4] text-xs" />
                                        </span>
                                        <span className="md:w-6 md:h-6 w-4 h-4 flex cursor-pointer items-center justify-center bg-[#30334A] rounded-full">
                                            <FaApple className="text-[#03C4A4] text-xs" />
                                        </span>
                                        <span className="md:w-6 md:h-6 w-4 h-4 flex cursor-pointer items-center justify-center bg-[#30334A] rounded-full">
                                            <FaAndroid className="text-[#03C4A4] text-xs" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Modal */}
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
            </div>
        </div>
    );
};

export default FeaturedTask;