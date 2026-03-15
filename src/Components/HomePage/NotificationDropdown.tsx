"use client";

import React, { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketProvider";

const CATEGORIES = ["All", "Special", "Account", "Earnings", "Cashouts", "Competitions"] as const;
type Category = (typeof CATEGORIES)[number];

interface Notif {
  id: string;
  category: Category;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

function mapCategory(type: string): Category {
  const t = (type || "").toLowerCase();
  if (t.includes("earn") || t.includes("task") || t.includes("reward") || t.includes("balance")) return "Earnings";
  if (t.includes("cashout") || t.includes("withdraw") || t.includes("payout")) return "Cashouts";
  if (t.includes("account") || t.includes("profile") || t.includes("login") || t.includes("signup")) return "Account";
  if (t.includes("special") || t.includes("promo") || t.includes("bonus") || t.includes("code")) return "Special";
  if (t.includes("tournament") || t.includes("competition") || t.includes("leaderboard") || t.includes("contest")) return "Competitions";
  return "All";
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2.5C7.23858 2.5 5 4.73858 5 7.5V12.5L3.5 14H16.5L15 12.5V7.5C15 4.73858 12.7614 2.5 10 2.5Z" fill="white" />
      <path d="M8.5 14.5C8.5 15.3284 9.17157 16 10 16C10.8284 16 11.5 15.3284 11.5 14.5" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1 1L11 11M1 11L11 1" stroke="#1E2133" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface Props {
  onClose: () => void;
}

const NotificationDropdown: React.FC<Props> = ({ onClose }) => {
  const { socket } = useSocket();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [notifications, setNotifications] = useState<Notif[]>([]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${api}/api/v1/user/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.notifications)) {
          setNotifications(
            data.notifications.map((n: any, i: number) => ({
              id: n._id || String(i),
              category: mapCategory(n.type || ""),
              title: n.title || n.type || "Notification",
              message: n.body || n.text || "",
              time: new Date(n.createdAt || Date.now()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              read: !!n.read,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNotif = (n: any) => {
      setNotifications((prev) => [
        {
          id: n._id || String(Date.now()),
          category: mapCategory(n.type || ""),
          title: n.title || n.type || "Notification",
          message: n.body || n.text || "",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          read: false,
        },
        ...prev,
      ]);
    };
    const onRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    socket.on("notification", onNotif);
    socket.on("notifications:read", onRead);
    return () => {
      try {
        socket.off("notification", onNotif);
        socket.off("notifications:read", onRead);
      } catch {}
    };
  }, [socket]);

  const filtered =
    activeCategory === "All" ? notifications : notifications.filter((n) => n.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className="relative flex flex-col overflow-hidden"
        style={{ width: "100%", maxWidth: 380, height: "100%", background: "#0D0F1E" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 shrink-0"
          style={{ height: 68, borderBottom: "1px solid #1E2133" }}
        >
          <div
            className="flex items-center justify-center rounded-[8px] bg-[#14A28A] shrink-0"
            style={{ width: 36, height: 36 }}
          >
            <BellIcon />
          </div>
          <span
            className="font-bold text-[20px] text-white flex-1 tracking-[0.02em]"
            style={{ fontFamily: "'Manrope', sans-serif", lineHeight: "34px" }}
          >
            Notifications
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-[5px] bg-[#8C8FA8] shrink-0 hover:bg-[#a0a3bb] transition-colors"
            style={{ width: 24, height: 24 }}
            aria-label="Close"
          >
            <XIcon />
          </button>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 px-4 py-4 shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="rounded-[8px] px-3 py-1.5 text-[13px] font-medium transition-colors"
              style={{
                fontFamily: "'Inter', sans-serif",
                background: activeCategory === cat ? "#14A28A" : "#151728",
                color: "white",
                border: activeCategory === cat ? "none" : "1px solid #1E2133",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ height: 1, background: "#1E2133", margin: "0 16px" }} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {filtered.length === 0 ? (
            <div className="flex-1 flex items-end justify-center pb-16">
              <p
                className="text-[#8C8FA8] text-sm"
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.03em" }}
              >
                No new notifications
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-4 py-4">
              {filtered.map((n) => (
                <div
                  key={n.id}
                  className="rounded-[8px] p-3 flex gap-3"
                  style={{ background: "#151728", border: "1px solid #1E2133" }}
                >
                  <div
                    className="flex items-center justify-center rounded-[6px] bg-[#14A28A] shrink-0"
                    style={{ width: 32, height: 32 }}
                  >
                    <BellIcon />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{n.title}</p>
                    <p className="text-[#8C8FA8] text-xs mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                  <span
                    className="text-[#8C8FA8] text-[11px] shrink-0 mt-0.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {n.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
