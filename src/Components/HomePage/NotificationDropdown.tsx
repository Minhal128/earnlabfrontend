"use client";

import React, { useState } from "react";
import { toast } from 'react-toastify';
import { useSocket } from "@/contexts/SocketProvider";
import { X } from "lucide-react";
import { RiNotificationFill } from "react-icons/ri";
import Image, { type StaticImageData } from "next/image";

type Notification = {
    id: number;
    type: "general" | "task";
    title: string;
    message: string;
    icon: StaticImageData;
    time: string;
};

import newimg from "../../../public/assets/new.png";
import Old from "../../../public/assets/lock.png";

// we will fetch notifications from the backend and keep them in state

interface Props {
    onClose: () => void;
}

const NotificationDropdown: React.FC<Props> = ({ onClose }) => {
    const { socket } = useSocket();
    const [activeTab, setActiveTab] = useState<"general" | "task">("general");
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // fetch notifications from backend
    React.useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/user/notifications`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => {
                if (data && Array.isArray(data.notifications)) {
                    // map incoming documents to local structure (time formatting simplified)
                    const mapped = data.notifications.map((n: any, idx: number) => ({
                        id: idx + 1 + Math.floor(Math.random() * 1000),
                        type: n.type === "task.completed" ? "task" : "general",
                        title: n.title || n.type,
                        message: n.body || n.text || "",
                        icon: newimg,
                        time: new Date(n.createdAt || Date.now()).toLocaleString(),
                    }));
                    setNotifications(mapped);
                }
            })
            .catch(() => {
                // ignore errors for now
            });
    }, []);

    // subscribe to incoming socket notifications using shared SocketProvider
    React.useEffect(() => {
        const socketInstance: any = socket;

        if (!socketInstance) return;

        const onNotif = (n: any) => {
            const mapped = {
                id: Math.floor(Math.random() * 1000000),
                type: n.type === "task.completed" ? "task" : "general",
                title: n.title || n.type,
                message: n.body || n.text || "",
                icon: newimg,
                time: new Date(n.createdAt || Date.now()).toLocaleString(),
            } as Notification;
            setNotifications((prev) => [mapped, ...prev]);
        };

        const onRead = () => {
            setNotifications([]);
        };
        socketInstance.on("notification", onNotif);
        socketInstance.on("notifications:read", onRead);

        return () => {
            try {
                socketInstance.off("notification", onNotif);
                socketInstance.off("notifications:read", onRead);
            } catch {}
        };
    }, [socket]);

    return (
        <div
            className="
                fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                sm:absolute sm:translate-x-0 sm:translate-y-0 sm:left-auto sm:top-auto
                sm:right-[28%] sm:mt-[33%]
                md:w-100 w-90 h-[60%] sm:w-96 
                bg-[#1E2133] text-white rounded-xl shadow-lg overflow-hidden z-50
            "
        >
            <div className="flex items-end justify-end px-4 py-3">
                <button
                    onClick={onClose}
                    className="text-[#26293E] border p-1 cursor-pointer rounded-md bg-[#8C8FA8] hover:text-gray-200 transition"
                >
                    <X size={12} />
                </button>
            </div>

            <div className="flex items-center gap-2 mx-4 py-2 mb-3 border-b border-[#30334A]">
                <RiNotificationFill size={22} className="text-white" />
                <span className="text-lg">Notifications</span>
            </div>

            <div className="flex mx-4 rounded-md bg-[#26293E]">
                <button
                    onClick={() => setActiveTab("general")}
                    className={`flex-1 py-2 cursor-pointer text-center text-sm font-medium ${activeTab === "general"
                            ? "bg-[#3A3E57] m-[6px] rounded-md text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    General
                </button>
                <button
                    onClick={() => setActiveTab("task")}
                    className={`flex-1 py-2 cursor-pointer text-center text-sm font-medium ${activeTab === "task"
                            ? "bg-[#3A3E57] m-[6px] rounded-md text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    Tasks
                </button>
            </div>

            <div className="flex items-center justify-between mx-4 my-2 py-2 text-xs">
                <span className="text-[#B3B6C7]">{notifications.length} notifications</span>
                <button
                    disabled={notifications.length === 0}
                    onClick={async () => {
                        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                        if (!token) {
                            toast.warn("Please sign in to mark notifications as read.");
                            return;
                        }
                        try {
                            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                            const res = await fetch(`${api}/api/v1/user/notifications/read`, {
                                method: "POST",
                                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                                body: JSON.stringify({}),
                            });
                            if (!res.ok) {
                                const b = await res.json().catch(() => ({}));
                                toast.error(b?.message || "Failed to mark notifications read");
                                return;
                            }
                            // clear local list immediately; backend also emits notifications:read
                            setNotifications([]);
                        } catch (err) {
                            console.error(err);
                            toast.error("Failed to mark notifications read");
                        }
                    }}
                    className={`px-3 py-1 rounded text-sm ${notifications.length === 0 ? "text-gray-600 cursor-not-allowed" : "text-[#B3B6C7] hover:bg-[#30334A] hover:text-white"}`}
                >
                    Mark all as read
                </button>
            </div>

            <div className="max-h-100 overflow-y-auto">
                {notifications
                    .filter((n) => n.type === activeTab)
                    .map((n) => (
                        <div
                            key={n.id}
                            className="flex items-center gap-3 px-4 py-3 mx-4 mb-2 bg-[#26293E] border border-gray-700 rounded-md cursor-pointer transition"
                        >
                            <div className="flex-shrink-0 w-8 bg-[#30334A] rounded-md h-8 flex items-center justify-center">
                                <Image
                                    src={n.icon}
                                    alt={n.title}
                                    width={14}
                                    height={14}
                                    className="rounded-sm"
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                <p className="text-sm text-[#fff] font-medium leading-tight">
                                    {n.title}
                                </p>
                                <p className="text-[12px] text-[#B3B6C7] leading-tight">
                                    {n.message}
                                </p>
                            </div>

                            <span className="text-[11px] text-white whitespace-nowrap self-start">
                                {n.time}
                            </span>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default NotificationDropdown;
