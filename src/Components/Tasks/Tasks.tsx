"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Image, { StaticImageData } from "next/image";
import { FaLaptop, FaApple, FaAndroid, FaChevronDown, FaSearch } from "react-icons/fa";
import TaskModal from "./TaskModal";
import StartTaskModal from "./StartTaskModal";

import Fe1 from "../../../public/assets/fe1.png";
import Fe2 from "../../../public/assets/fe2.png";
import Fe3 from "../../../public/assets/fe3.png";
import Fe4 from "../../../public/assets/fe4.png";
import CoinIcon from "../../../public/assets/bluedolar.png";
import filterImg from "../../../public/assets/filter.png";

type TaskUI = {
    id: string;
    title: string;
    description?: string | null;
    reward: number; // in cents
    image: string | StaticImageData;
    raw?: any;
};

const Tasks: React.FC = () => {
    const searchParams = useSearchParams();
    const [tasks, setTasks] = useState<TaskUI[]>([]);
    const [selectedTask, setSelectedTask] = useState<TaskUI | null>(null);
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [activeClaimedTask, setActiveClaimedTask] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const offerwallId = searchParams.get("offerwallId");
            const offerwall = searchParams.get("offerwall");

            const query = new URLSearchParams({ limit: "50" });
            if (offerwallId) query.set("offerwallId", offerwallId);
            if (offerwall) query.set("offerwall", offerwall);

            const r = await fetch(`${api}/api/v1/tasks?${query.toString()}`);
            const data = await r.json().catch(() => ({}));
            if (data && Array.isArray(data.tasks)) {
                const imgs = [Fe1, Fe2, Fe3, Fe4];
                const mapped = data.tasks.map((t: any, i: number) => ({
                    id: t._id || t.id || String(i),
                    title: t.title || "Untitled",
                    description: t.description || "",
                    reward: typeof t.rewardCents === "number" ? t.rewardCents : (t.reward || 0),
                    image: t.metadata?.logoUrl || t.metadata?.imageUrl || imgs[i % imgs.length],
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
    }, [searchParams]);

    return (
        <div className="w-full bg-[#0f172a] mt-5 md:p-6 px-3 py-5 rounded-lg text-white border border-[0.1px] border-[#50536F]">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="md:text-lg text-sm font-semibold">Tasks</h2>
                        <p className="md:text-sm text-[10px] md:hidden block text-[#8C8FA8]">
                            Complete the featured task to earn bigger rewards
                        </p>
                    </div>


                </div>

                {/* Filter/Search Row */}
                <div className="flex flex-col md:flex-row items-center gap-3 md:mt-4 mt-3">
                    {/* Box 1 */}
                    <div className="md:flex items-center hidden gap-2 bg-[#1E2133] px-3 py-3 rounded-md cursor-pointer">
                        <span className="text-sm text-[#8C8FA8]">Popularity</span>
                        <FaChevronDown className="text-xs" />
                    </div>

                    {/* Box 2 */}
                    <div className="md:flex items-center hidden gap-2 bg-[#1E2133] px-3 py-3 rounded-md cursor-pointer">
                        <span className="text-sm text-[#8C8FA8]">Devices</span>
                        <FaChevronDown className="text-xs" />
                    </div>

                    {/* Search Input */}
                    <div className="flex gap-3 w-full">
                        <div className="flex items-center bg-[#1E2133] rounded-md px-3 py-3 w-full">
                            <FaSearch className="text-[#B3B6C7] mr-2 text-lg" />
                            <input
                                type="text"
                                placeholder="Search tasks"
                                className="bg-transparent outline-none flex-1 text-sm text-white placeholder-[#8C8FA8]"
                            />
                        </div>
                        <div className="flex items-center md:hidden gap-2 bg-[#fff] px-4 py-3 rounded-md cursor-pointer">
                            <Image src={filterImg} alt="filter image" className="object-contain w-3.5 h-3.5" />
                            <span className="text-[15px] text-[#151728] mr-3">Filter</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {loading && <div className="text-sm text-[#8C8FA8]">Loading tasks...</div>}
                {!loading && tasks.length === 0 && (
                    <div className="text-sm text-[#8C8FA8]">No tasks available</div>
                )}

                {tasks.map((task, index) => (
                    <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="bg-[#1E2133] rounded-lg px-2.5 pt-2.5 overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                    >
                        <div className="relative w-full md:h-40 h-25 flex items-center justify-center bg-[#11131a] rounded-md overflow-hidden">
                            {typeof task.image === "string" ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={task.image} alt={task.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                    <span className="py-0.5 rounded-full text-white text-xs">{task.reward}</span>
                                </span>

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
