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
        <div className="fixed inset-0 z-50 flex px-5 items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#0F1D24] rounded-2xl border border-[#23353E] shadow-2xl max-w-lg w-full p-6 text-white relative max-h-[90vh] overflow-y-auto custom-scrollbar">
              
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#14A990]/20 flex items-center justify-center text-[#14A990]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <h3 className="text-white text-lg font-bold">Task details</h3>
                  </div>
                  <button onClick={onClose} className="text-[#8C8FA8] hover:text-white transition-colors">
                    <IoClose size={24} />
                  </button>
                </div>

                {/* Provider & Reward Section */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#15242C] border border-[#23353E] flex items-center justify-center overflow-hidden">
                            {providerLogoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={providerLogoUrl} alt={providerName} className="w-10 h-10 object-contain" />
                            ) : (
                                <div className="text-[#14A990] font-bold text-xl">{providerName.charAt(0)}</div>
                            )}
                        </div>
                        <div>
                            <p className="text-[#14A990] text-xs font-bold uppercase tracking-wider">{providerName}</p>
                            <h4 className="text-white font-bold text-base leading-tight mt-0.5 truncate max-w-[200px]">{task.title}</h4>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="bg-[#1C2036] px-3 py-1.5 rounded-full text-[#14A990] text-sm font-bold border border-[#2D3142]">
                            {formatPrimaryReward(task.reward)}
                        </div>
                        <div className="flex gap-1.5 mt-1">
                            <FaApple className="text-[#8C8FA8] text-xs" />
                            <FaAndroid className="text-[#8C8FA8] text-xs" />
                            <FaLaptop className="text-[#8C8FA8] text-xs" />
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-6 border border-[#23353E]">
                    {typeof task.image === "string" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={task.image} alt={task.title} className="w-full h-full object-cover" />
                    ) : (
                        <Image src={task.image} alt={task.title} className="w-full h-full object-cover" width={500} height={180} />
                    )}
                </div>

                {/* Task Content */}
                <div className="flex flex-col gap-2 mb-6">
                    <h5 className="text-[#8C8FA8] text-xs font-bold uppercase tracking-wider">Task Details</h5>
                    <div className="bg-[#15242C]/50 border border-[#23353E] rounded-xl p-4">
                        <p className="text-white/80 text-sm leading-relaxed">
                            {task.description || "Complete milestones in order to unlock each reward. Progress is tracked automatically once the task starts."}
                        </p>
                    </div>
                </div>

                {/* Milestones / Steps */}
                <div className="flex flex-col gap-3">
                    {MOCK_TASK_DETAIL_STEPS.map((detailStep, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between items-center bg-[#15242C] border border-[#23353E] px-4 py-3 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#14A990]/20 flex items-center justify-center text-[#14A990] text-[10px] font-bold">
                                    {idx + 1}
                                </div>
                                <p className="text-white text-sm font-semibold">{detailStep.step}</p>
                            </div>
                            <span className="font-bold text-sm text-[#14A990]">
                                {detailStep.reward}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Start Button */}
                <button
                    onClick={async () => {
                        try {
                            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                            if (!task.raw || !task.raw._id) {
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
                            const body = await res.json().catch(() => ({}));
                            const claimed = body?.task ?? null;
                            onClose();
                            onStart(claimed ?? task.raw ?? null);
                        } catch (err) {
                            console.error(err);
                            toast.error("Failed to start task. Try again later.");
                        }
                    }}
                    className="mt-8 w-full h-12 rounded-xl bg-gradient-to-r from-[#0AC07D] to-[#14A990] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0AC07D]/10 hover:shadow-[#0AC07D]/20 transition-all active:scale-[0.98]"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Start Task
                </button>

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
        </div>
    );
};

export default TaskModal;
