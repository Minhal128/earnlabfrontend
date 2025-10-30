"use client";

import React from "react";
import { toast } from 'react-toastify';
import Image, { StaticImageData } from "next/image";
import { IoClose } from "react-icons/io5";
import { FaLaptop, FaApple, FaAndroid } from "react-icons/fa";
import CoinIcon from "../../../public/assets/bluedolar.png";

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

    return (
        <div className="fixed inset-0 z-50 flex px-5 items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1E2133] rounded-xl shadow-lg max-w-lg w-full p-6 text-white relative max-h-[90vh] overflow-y-auto custom-scrollbar">
              
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-md cursor-pointer bg-[#8C8FA8] text-2xl text-black"
                >
                    <IoClose />
                </button>

                <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-1/3">
                        {typeof task.image === "string" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={task.image} alt={task.title} style={{ width: 200, height: 200, objectFit: 'cover' }} className="rounded-md" />
                        ) : (
                            <Image src={task.image} alt={task.title} className="rounded-md object-cover" width={200} height={200} />
                        )}
                    </div>

                    <div className="flex-1 space-y-0">
                        <h2 className="text-xl font-semibold">{task.title}</h2>

                        <div className="flex items-center gap-2 text-blue-400 pt-1 font-medium">
                            <Image src={CoinIcon} alt="coin" width={14} height={20} />
                            <span>{task.reward}</span>
                        </div>

                        <div className="flex gap-2 mt-2">
                            <span className="w-5 h-5 flex items-center justify-center bg-[#30334A] rounded-full">
                                <FaLaptop className="text-[#03C4A4] text-sm" />
                            </span>
                            <span className="w-5 h-5 flex items-center justify-center bg-[#30334A] rounded-full">
                                <FaApple className="text-[#03C4A4] text-sm" />
                            </span>
                            <span className="w-5 h-5 flex items-center justify-center bg-[#30334A] rounded-full">
                                <FaAndroid className="text-[#03C4A4] text-sm" />
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-[#2B2F45] px-3 py-2 rounded-md border border-[#3A3E57]">
                        <p className="text-sm text-white">Not Started</p>
                        <p className="text-[#8C8FA8] pt-0.5 text-xs font-semibold">Status</p>
                    </div>
                    <div className="bg-[#2B2F45] px-3 py-2 rounded-md border border-[#3A3E57]">
                        <p className="text-sm text-gray-300">Purchase</p>
                        <p className="text-[#8C8FA8] text-xs pt-0.5 font-semibold">Category</p>
                    </div>
                    <div className="bg-[#2B2F45] px-3 py-2 rounded-md border border-[#3A3E57]">
                        <p className="text-sm text-gray-300">Torox</p>
                        <p className="text-[#8C8FA8] pt-0.5 text-xs font-semibold">Provider</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-sm font-semibold mb-1">Description</h3>
                </div>

                <div className="bg-[#2B2F45] p-3 rounded-md mt-2 border border-[#3A3E57] text-sm text-gray-300">
                    {task.description || "Play and complete all tasks within 30 days."}
                </div>

                <div className="mt-5">
                    <h3 className="text-sm font-semibold mb-2">Rewards</h3>
                    <div className="space-y-2">
                        {Array(5)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center bg-[#2B2F45] px-3 py-2 rounded-md text-sm"
                                >
                                    <span className="text-[#B3B6C7] text-sm">
                                        Subscribe the $24.99 Exclusive Privileges and boost your Mafia influence!
                                    </span>
                                    <span className="font-semibold text-xs">$23.89</span>
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
                    Start Tasks
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
