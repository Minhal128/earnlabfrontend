"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import Image, { StaticImageData } from "next/image";
import { FaLaptop, FaApple, FaAndroid, FaSearch } from "react-icons/fa";
import TaskModal from "./TaskModal";
import StartTaskModal from "./StartTaskModal";

import Fe1 from "../../../public/assets/fe1.png";
import Fe2 from "../../../public/assets/fe2.png";
import Fe3 from "../../../public/assets/fe3.png";
import Fe4 from "../../../public/assets/fe4.png";
import CoinIcon from "../../../public/assets/bluedolar.png";

type PlatformFilter = "all" | "desktop" | "ios" | "android";
type SortOption = "reward_desc" | "reward_asc" | "title_asc";

type RawTask = {
    _id?: string;
    id?: string;
    title?: string;
    description?: string | null;
    rewardCents?: number;
    reward?: number;
    platform?: string;
    metadata?: {
        logoUrl?: string;
        imageUrl?: string;
        platform?: string;
        platforms?: string[];
        providerName?: string;
        offerwall?: string;
        offerwallName?: string;
    };
};

type TaskUI = {
    id: string;
    title: string;
    description?: string | null;
    reward: number; // in cents
    image: string | StaticImageData;
    platforms: Exclude<PlatformFilter, "all">[];
    providerName?: string;
    raw?: RawTask;
};

const normalizePlatforms = (task: RawTask): Exclude<PlatformFilter, "all">[] => {
    const candidates: string[] = [];

    if (typeof task.platform === "string") {
        candidates.push(task.platform);
    }

    if (typeof task.metadata?.platform === "string") {
        candidates.push(task.metadata.platform);
    }

    if (Array.isArray(task.metadata?.platforms)) {
        candidates.push(...task.metadata.platforms);
    }

    const normalized = candidates.join(" ").toLowerCase();
    const platforms: Exclude<PlatformFilter, "all">[] = [];

    if (/desktop|web|pc|laptop/.test(normalized)) {
        platforms.push("desktop");
    }

    if (/ios|iphone|ipad|apple/.test(normalized)) {
        platforms.push("ios");
    }

    if (/android/.test(normalized)) {
        platforms.push("android");
    }

    if (platforms.length === 0) {
        return ["desktop", "ios", "android"];
    }

    return Array.from(new Set(platforms));
};

const formatReward = (rewardCents: number): string => {
    const safeValue = Number.isFinite(rewardCents) ? rewardCents : 0;
    return `$${(safeValue / 100).toFixed(2)}`;
};

const isPartnerLogoAsset = (image: string | StaticImageData): boolean =>
    typeof image === "string" && /logo|provider|offerwall|mylead|monlix|gemiad|nortik/i.test(image);

const Tasks: React.FC = () => {
    const searchParams = useSearchParams();
    const offerwallId = searchParams.get("offerwallId") || "";
    const offerwallName = searchParams.get("offerwall") || "";

    const [tasks, setTasks] = useState<TaskUI[]>([]);
    const [selectedTask, setSelectedTask] = useState<TaskUI | null>(null);
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [activeClaimedTask, setActiveClaimedTask] = useState<RawTask | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
    const [sortBy, setSortBy] = useState<SortOption>("reward_desc");

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

            const query = new URLSearchParams({ limit: "50" });
            if (offerwallId) query.set("offerwallId", offerwallId);
            if (offerwallName) query.set("offerwall", offerwallName);

            const r = await fetch(`${api}/api/v1/tasks?${query.toString()}`);
            const data = await r.json().catch(() => ({}));
            if (data && Array.isArray(data.tasks)) {
                const imgs = [Fe1, Fe2, Fe3, Fe4];
                const mapped = data.tasks.map((t: RawTask, i: number) => ({
                    id: t._id || t.id || String(i),
                    title: t.title || "Untitled",
                    description: t.description || "",
                    reward: typeof t.rewardCents === "number" ? t.rewardCents : (t.reward || 0),
                    image: t.metadata?.imageUrl || t.metadata?.logoUrl || imgs[i % imgs.length],
                    platforms: normalizePlatforms(t),
                    providerName: t.metadata?.providerName || t.metadata?.offerwallName || t.metadata?.offerwall,
                    raw: t,
                })) as TaskUI[];
                setTasks(mapped);
            } else {
                setTasks([]);
            }
        } catch (err) {
            console.error("Failed to load tasks", err);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [offerwallId, offerwallName]);

    const filteredTasks = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        let nextTasks = tasks.filter((task) => {
            const matchesSearch =
                normalizedSearch.length === 0 ||
                task.title.toLowerCase().includes(normalizedSearch) ||
                (task.description || "").toLowerCase().includes(normalizedSearch) ||
                (task.providerName || "").toLowerCase().includes(normalizedSearch);

            const matchesPlatform =
                platformFilter === "all" || task.platforms.includes(platformFilter);

            return matchesSearch && matchesPlatform;
        });

        if (sortBy === "reward_desc") {
            nextTasks = nextTasks.sort((a, b) => b.reward - a.reward);
        } else if (sortBy === "reward_asc") {
            nextTasks = nextTasks.sort((a, b) => a.reward - b.reward);
        } else {
            nextTasks = nextTasks.sort((a, b) => a.title.localeCompare(b.title));
        }

        return nextTasks;
    }, [platformFilter, searchTerm, sortBy, tasks]);

    const totalRewardsCents = useMemo(
        () => filteredTasks.reduce((sum, task) => sum + task.reward, 0),
        [filteredTasks],
    );

    const activeOfferwallLabel = offerwallName ? decodeURIComponent(offerwallName) : "";

    return (
        <div className="w-full bg-[#0f172a] mt-5 md:p-6 px-3 py-5 rounded-lg text-white border border-[0.1px] border-[#50536F]">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="md:text-lg text-sm font-semibold">Task Marketplace</h2>
                        <p className="md:text-sm text-[10px] text-[#8C8FA8]">
                            {activeOfferwallLabel
                                ? `Showing tasks from ${activeOfferwallLabel}`
                                : "Browse and complete independent tasks with direct rewards."}
                        </p>
                    </div>

                    <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md border border-[#30334A] bg-[#1E2133]">
                        <span className="text-xs text-[#8C8FA8]">Tasks:</span>
                        <span className="text-sm font-semibold text-white">{filteredTasks.length}</span>
                        <span className="w-px h-3 bg-[#30334A]" />
                        <span className="text-xs text-[#8C8FA8]">Potential:</span>
                        <span className="text-sm font-semibold text-emerald-400">{formatReward(totalRewardsCents)}</span>
                    </div>
                </div>

                {/* Filter/Search Row */}
                <div className="flex flex-col md:flex-row items-center gap-3 md:mt-4 mt-3">
                    <div className="md:flex items-center hidden gap-2 bg-[#1E2133] px-3 py-3 rounded-md">
                        <span className="text-sm text-[#8C8FA8]">Platform</span>
                        <select
                            value={platformFilter}
                            onChange={(event) => setPlatformFilter(event.target.value as PlatformFilter)}
                            className="bg-transparent text-sm text-white outline-none"
                        >
                            <option value="all" className="text-black">All</option>
                            <option value="desktop" className="text-black">Desktop</option>
                            <option value="ios" className="text-black">iOS</option>
                            <option value="android" className="text-black">Android</option>
                        </select>
                    </div>

                    <div className="md:flex items-center hidden gap-2 bg-[#1E2133] px-3 py-3 rounded-md">
                        <span className="text-sm text-[#8C8FA8]">Sort</span>
                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value as SortOption)}
                            className="bg-transparent text-sm text-white outline-none"
                        >
                            <option value="reward_desc" className="text-black">Highest reward</option>
                            <option value="reward_asc" className="text-black">Lowest reward</option>
                            <option value="title_asc" className="text-black">A-Z</option>
                        </select>
                    </div>

                    {/* Search Input */}
                    <div className="flex gap-3 w-full">
                        <div className="flex items-center bg-[#1E2133] rounded-md px-3 py-3 w-full">
                            <FaSearch className="text-[#B3B6C7] mr-2 text-lg" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search tasks"
                                className="bg-transparent outline-none flex-1 text-sm text-white placeholder-[#8C8FA8]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {loading && <div className="text-sm text-[#8C8FA8]">Loading tasks...</div>}
                {!loading && filteredTasks.length === 0 && (
                    <div className="text-sm text-[#8C8FA8]">No tasks available</div>
                )}

                {filteredTasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="bg-[#1E2133] rounded-lg px-2.5 pt-2.5 overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                    >
                        <div className="relative w-full md:h-44 h-28 flex items-center justify-center bg-[#11131a] rounded-md overflow-hidden">
                            {typeof task.image === "string" ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={task.image}
                                    alt={task.title}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: isPartnerLogoAsset(task.image) ? "contain" : "cover",
                                        padding: isPartnerLogoAsset(task.image) ? "10px" : "0px",
                                    }}
                                />
                            ) : (
                                <Image src={task.image} alt={task.title} fill className="object-cover" />
                            )}
                        </div>
                        <div className="pt-2.5 md:pb-4 pb-3">
                            <h3 className="md:text-md text-[12px] font-semibold">{task.title}</h3>
                            <p className="md:text-sm text-[8px] text-[#B3B6C7]">{task.description}</p>

                            <div className="flex items-center justify-between mt-3">
                                <span className="text-blue-400 font-medium flex items-center gap-1">
                                    <Image src={CoinIcon} alt="Coin" width={18} height={18} className="inline-block mt-0.5" />
                                    <span className="py-0.5 rounded-full text-white text-xs">{formatReward(task.reward)}</span>
                                </span>

                                <div className="flex gap-1">
                                    {task.platforms.includes("desktop") && (
                                        <span className="md:w-6 md:h-6 w-4 h-4 cursor-pointer flex items-center justify-center bg-[#30334A] rounded-full">
                                            <FaLaptop className="text-[#03C4A4] text-xs" />
                                        </span>
                                    )}
                                    {task.platforms.includes("ios") && (
                                        <span className="md:w-6 md:h-6 w-4 h-4 flex cursor-pointer items-center justify-center bg-[#30334A] rounded-full">
                                            <FaApple className="text-[#03C4A4] text-xs" />
                                        </span>
                                    )}
                                    {task.platforms.includes("android") && (
                                        <span className="md:w-6 md:h-6 w-4 h-4 flex cursor-pointer items-center justify-center bg-[#30334A] rounded-full">
                                            <FaAndroid className="text-[#03C4A4] text-xs" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {/* Task Modal */}
            <TaskModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                onStart={(claimedTask?: any) => {
                    setIsStartOpen(true);
                    setActiveClaimedTask(claimedTask ?? selectedTask?.raw ?? null);
                }}
                task={
                    selectedTask
                        ? {
                            ...selectedTask,
                            description: selectedTask.description ?? "",
                        }
                        : null
                }
            />

            {/* Start Task Modal */}
            <StartTaskModal
                isOpen={isStartOpen}
                onClose={() => setIsStartOpen(false)}
                task={activeClaimedTask}
                onComplete={() => {
                    // refresh tasks after completion
                    fetchTasks();
                    setActiveClaimedTask(null);
                }}
            />
        </div>
    );
};

export default Tasks;
