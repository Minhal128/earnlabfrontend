"use client";

import React from "react";
import { toast } from 'react-toastify';
import { IoClose } from "react-icons/io5";
import ProfileImg from '../../../public/assets/avatar.png'
import BottomImg from '../../../public/assets/fe1.png'
import Image, { StaticImageData } from "next/image";

interface StartTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  // claimed task object returned by the claim endpoint (or raw task)
  task?: any | null;
  // called after successful completion to allow parent to refresh
  onComplete?: () => void;
}

const StartTaskModal: React.FC<StartTaskModalProps> = ({ isOpen, onClose, task = null, onComplete }) => {
  if (!isOpen) return null;

  const [loading, setLoading] = React.useState(false);

  return (
    <div className="fixed inset-0 z-50 flex px-4 items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1E2133] rounded-xl shadow-lg w-full max-w-2xl p-6 text-white relative">
       
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold">Profile</h2>
          <button
            onClick={onClose}
            className="rounded-md cursor-pointer bg-[#8C8FA8] text-black p-0.5"
          >
            <IoClose size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src={ProfileImg}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold">{task?.title ?? "Anonymous"}</h2>
            <p className="text-xs text-gray-400">{task?.metadata?.providerName ?? "Task provider"}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Silver</span>
            <span>Gold</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div className="h-2 bg-orange-400 rounded-full w-1/2"></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0 XP</span>
            <span>100,000 XP</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-[#2B2F45] p-3 rounded-md text-center">
            <p className="text-lg font-semibold">$465.86</p>
            <p className="text-xs text-gray-400">Total Earned</p>
          </div>
          <div className="bg-[#2B2F45] p-3 rounded-md text-center">
            <p className="text-lg font-semibold">456</p>
            <p className="text-xs text-gray-400">Completed Tasks</p>
          </div>
          <div className="bg-[#2B2F45] p-3 rounded-md text-center">
            <p className="text-lg font-semibold">0</p>
            <p className="text-xs text-gray-400">Affiliated Friends</p>
          </div>
        </div>

        <div className="mt-6 border-b border-[#3A3E57] pb-2">
          <h3 className="font-semibold">Tasks</h3>
        </div>

        <div className="grid grid-cols-3 text-xs text-gray-400 mt-3 mb-2 px-1">
          <span>Tasks</span>
          <span className="md:ml-37 ml-20">Date</span>
          <span className="text-right">Reward</span>
        </div>

        <div className="space-y-3">
          {/* If a real task is provided show actionable controls */}
          {task ? (
            <div className="space-y-3">
              <div className="bg-[#2B2F45] p-3 rounded-md">
                <p className="text-sm font-semibold">{task.title}</p>
                <p className="text-xs text-gray-400 mt-1">{task.description ?? task.metadata?.description ?? ""}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const possible = task.metadata?.landingUrl || task.metadata?.url || task.metadata?.redirectUrl || task.url || task.metadata?.externalUrl;
                    if (!possible) {
                      toast.info("No external link available for this task.");
                      return;
                    }
                    // open in new tab
                    window.open(possible, "_blank");
                  }}
                  className="flex-1 py-3 rounded-md bg-[#0ea287] text-white font-semibold"
                >
                  Open Task
                </button>

                <button
                  onClick={async () => {
                    if (!task || !task._id && !task.id) {
                      toast.error("Missing task id to complete");
                      return;
                    }
                    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                    if (!token) {
                      toast.warn("Please sign in to complete tasks and claim rewards.");
                      return;
                    }
                    try {
                      setLoading(true);
                      const id = task._id || task.id;
                      const res = await fetch(`${api}/api/v1/tasks/${id}/complete`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                      });
                      if (!res.ok) {
                        const body = await res.json().catch(() => ({}));
                        toast.error(body?.message || "Failed to complete task");
                        return;
                      }
                      const body = await res.json().catch(() => ({}));
                      toast.success(body?.message || "Task completed — reward credited");
                      // notify parent to refresh tasks list
                      onComplete?.();
                      onClose();
                    } catch (err) {
                      console.error(err);
                      toast.error("Failed to complete task. Try again later.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="flex-1 py-3 rounded-md bg-[#225c8a] text-white font-semibold"
                >
                  {loading ? "Completing..." : "Mark as Complete"}
                </button>
              </div>
            </div>
          ) : (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 items-center bg-[#2B2F45] px-3 py-2 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={BottomImg}
                      alt="task"
                      className="w-8 h-8 rounded object-cover"
                    />
                    <span className="md:text-sm text-[10px]">Vegaz Craze</span>
                  </div>
                  <span className="md:text-sm text-[7px] text-gray-400 ml-8">
                    10 Sep, 2025 | 9:15AM
                  </span>
                  <span className="font-semibold md:text-sm text-xs text-right">$23.89</span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StartTaskModal;
