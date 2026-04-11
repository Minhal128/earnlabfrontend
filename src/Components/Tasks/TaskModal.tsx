"use client";

import React from "react";
import { toast } from 'react-toastify';
import Image, { StaticImageData } from "next/image";
import { IoClose } from "react-icons/io5";
import { FaLaptop, FaApple, FaAndroid } from "react-icons/fa";
import CoinIcon from "../../../public/assets/bluedolar.png";

interface TaskDetailStep {
    step: string;
    reward: string;
    note?: string;
}

const MOCK_TASK_DETAIL_STEPS: TaskDetailStep[] = [
    { step: "Reach Level 1", reward: "€0.10", note: "Complete the tutorial" },
    { step: "Reach Level 5", reward: "€0.20", note: "Stay active for 1 day" },
    { step: "Reach Level 10", reward: "€0.30", note: "Finish beginner quests" },
    { step: "Reach Level 20", reward: "€0.50", note: "Unlock advanced missions" },
    { step: "Reach Level 30", reward: "€1.00", note: "Final progression milestone" },
];

const formatPrimaryReward = (rewardValue: number): string => {
    const safeValue = Number.isFinite(rewardValue) ? rewardValue : 0;
    return `€${(safeValue / 100).toFixed(2)}`;
};

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    // onStart receives the claimed task (if returned by API)
    onStart: (claimedTask?: any) => void;
    task: {
        image: string | StaticImageData;
        title: string;
        description: string;
        reward: number;
        raw?: any;
    } | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onStart, task }) => {
    if (!isOpen || !task) return null;

    const providerName =
        task.raw?.metadata?.providerName ||
        task.raw?.metadata?.offerwallName ||
        task.raw?.metadata?.offerwall ||
        "MyLead";

    const providerLogoUrl = task.raw?.metadata?.logoUrl || null;
    const categoryLabel = task.raw?.metadata?.category || "App";
    const statusLabel = task.raw?.status ? String(task.raw.status) : "Not started";

    return (
        <div className="fixed inset-0 z-50 flex px-5 items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1E2133] rounded-xl shadow-lg max-w-lg w-full p-6 text-white relative max-h-[90vh] overflow-y-auto custom-scrollbar">
              
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-md cursor-pointer bg-[#8C8FA8] text-2xl text-black"
                >
                    <IoClose />
                </button>

                <div className="rounded-xl border border-[#3A3E57] bg-[#151728] p-4">
                    <h2 className="text-xl font-bold">Task details</h2>

                    <p className="text-[11px] uppercase tracking-wide text-[#8C8FA8] mt-3">Provider</p>
                    <p className="text-lg font-semibold text-[#18C3A7]">{providerName}</p>
                    <p className="text-sm text-white/95 mt-1">{task.title}</p>

                    <div className="mt-4 flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-[45%]">
                            {typeof task.image === "string" ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={task.image}
                                    alt={task.title}
                                    className="w-full h-40 rounded-lg object-cover border border-[#262A3A]"
                                />
                            ) : (
                                <Image
                                    src={task.image}
                                    alt={task.title}
                                    className="w-full h-40 rounded-lg object-cover border border-[#262A3A]"
                                    width={300}
                                    height={160}
                                />
                            )}
                        </div>

                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3 bg-[#1E2133] border border-[#30334A] rounded-lg px-3 py-2">
                                <div className="w-14 h-14 rounded-md bg-[#11131a] border border-[#30334A] overflow-hidden flex items-center justify-center">
                                    {providerLogoUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={providerLogoUrl}
                                            alt={providerName}
                                            className="w-12 h-12 object-contain"
                                        />
                                    ) : (
                                        <span className="text-sm font-bold text-[#18C3A7]">
                                            {providerName.slice(0, 2).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[11px] text-[#8C8FA8] uppercase">Partner / Provider</p>
                                    <p className="text-sm font-semibold text-white">{providerName}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-[#18C3A7] font-semibold">
                                <Image src={CoinIcon} alt="coin" width={16} height={16} />
                                <span>{formatPrimaryReward(task.reward)}</span>
                            </div>

                            <div className="flex gap-2 mt-1">
                                <span className="w-7 h-7 flex items-center justify-center bg-[#30334A] rounded-full">
                                    <FaLaptop className="text-[#03C4A4] text-sm" />
                                </span>
                                <span className="w-7 h-7 flex items-center justify-center bg-[#30334A] rounded-full">
                                    <FaApple className="text-[#03C4A4] text-sm" />
                                </span>
                                <span className="w-7 h-7 flex items-center justify-center bg-[#30334A] rounded-full">
                                    <FaAndroid className="text-[#03C4A4] text-sm" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-[#2B2F45] px-3 py-2 rounded-md border border-[#3A3E57]">
                        <p className="text-sm text-white capitalize">{statusLabel}</p>
                        <p className="text-[#8C8FA8] pt-0.5 text-xs font-semibold">Status</p>
                    </div>
                    <div className="bg-[#2B2F45] px-3 py-2 rounded-md border border-[#3A3E57]">
                        <p className="text-sm text-gray-300">{categoryLabel}</p>
                        <p className="text-[#8C8FA8] text-xs pt-0.5 font-semibold">Category</p>
                    </div>
                    <div className="bg-[#2B2F45] px-3 py-2 rounded-md border border-[#3A3E57]">
                        <p className="text-sm text-gray-300">{providerName}</p>
                        <p className="text-[#8C8FA8] pt-0.5 text-xs font-semibold">Provider</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-sm font-semibold mb-1">Task Details</h3>
                </div>

                <div className="bg-[#2B2F45] p-3 rounded-md mt-2 border border-[#3A3E57]">
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {task.description || "Complete milestones in order to unlock each reward. Progress is tracked automatically once the task starts."}
                    </p>

                    <div className="mt-4 space-y-2">
                        {MOCK_TASK_DETAIL_STEPS.map((detailStep) => (
                            <div
                                key={detailStep.step}
                                className="flex justify-between gap-4 items-start bg-[#1E2133] px-3 py-2 rounded-md border border-[#30334A]"
                            >
                                <div className="min-w-0">
                                    <p className="text-[#E5E7EB] text-sm font-medium">{detailStep.step}</p>
                                    <p className="text-[#8C8FA8] text-xs mt-0.5">{detailStep.note}</p>
                                </div>
                                <span className="font-semibold text-sm text-[#18C3A7] whitespace-nowrap">
                                    {detailStep.reward}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={async () => {
                        // Try to claim the task via API, then open start modal
                        try {
                            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                            if (!task.raw || !task.raw._id) {
                                // fallback: just open
                                onClose();
                                onStart(task.raw ?? null);
                                return;
                            }

                            const headers: any = { "Content-Type": "application/json" };
                            if (token) headers.Authorization = `Bearer ${token}`;

                            const res = await fetch(`${api}/api/v1/tasks/${task.raw._id}/claim`, {
                                method: "POST",
                                headers,
                            });

                            if (res.status === 401) {
                                toast.warn("Please sign in to claim this task.");
                                return;
                            }

                            if (!res.ok) {
                                const body = await res.json().catch(() => ({}));
                                toast.error(body?.message || "Failed to claim task");
                                return;
                            }

                            // success: parse claimed task, close and open start modal
                            const body = await res.json().catch(() => ({}));
                            const claimed = body?.task ?? null;
                            onClose();
                            onStart(claimed ?? task.raw ?? null);
                        } catch (err) {
                            console.error(err);
                            toast.error("Failed to start task. Try again later.");
                        }
                    }}
                    className="mt-6 w-full bg-gradient-to-t cursor-pointer from-[#099F86] to-[#099F86] py-3 rounded-md font-semibold text-white"
                >
                    Start Task
                </button>
            </div>

            {/* Custom Scrollbar */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1e2133;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #3a3e57;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
};

export default TaskModal;
