"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useSocket } from "@/contexts/SocketProvider";
import { toast } from "@/utils/toast";
import LogoImg from "../../../public/assets/logo.png";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const WELCOME_MESSAGE =
  "Before contacting our live support, kindly check the help desk link. You might find an immediate answer to your issue or question there!";

interface Message {
  _id?: string;
  room: string;
  senderRole: "user" | "support" | "system";
  text: string;
  createdAt?: string;
}

interface ChatRoom {
  _id: string;
  subject?: string | null;
  status: string;
  lastMessageAt?: string | null;
}

interface SupportMessagePayload {
  room: string;
  message: Message;
}

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

function HeadsetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10V15C17 15.5523 16.5523 16 16 16H14C13.4477 16 13 15.5523 13 15V12C13 11.4477 13.4477 11 14 11H15.5V10C15.5 6.96243 13.0376 4.5 10 4.5C6.96243 4.5 4.5 6.96243 4.5 10V11H6C6.55228 11 7 11.4477 7 12V15C7 15.5523 6.55228 16 6 16H4C3.44772 16 3 15.5523 3 15V10Z"
        fill="white"
      />
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

function FAQIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="#8C8FA8" strokeWidth="1.5" />
      <path
        d="M6.5 6C6.5 5.17157 7.17157 4.5 8 4.5C8.82843 4.5 9.5 5.17157 9.5 6C9.5 6.82843 8.82843 7.5 8 7.5V9"
        stroke="#8C8FA8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11" r="0.75" fill="#8C8FA8" />
    </svg>
  );
}

function EmojiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8.5" stroke="#50536F" strokeWidth="1.5" />
      <path d="M7 12C7 12 8 14 10 14C12 14 13 12 13 12" stroke="#50536F" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="7.5" cy="8.5" r="1" fill="#50536F" />
      <circle cx="12.5" cy="8.5" r="1" fill="#50536F" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M17 9.5L10 16.5C8.34315 18.1569 5.65685 18.1569 4 16.5C2.34315 14.8431 2.34315 12.1569 4 10.5L10.5 4C11.6046 2.89543 13.3954 2.89543 14.5 4C15.6046 5.10457 15.6046 6.89543 14.5 8L8.5 14C7.94772 14.5523 7.05228 14.5523 6.5 14C5.94772 13.4477 5.94772 12.5523 6.5 12L12 6.5"
        stroke="#50536F"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIconSmall() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M18.5 1.5L1.5 8.5L8 10.5M18.5 1.5L11.5 18.5L8 10.5M18.5 1.5L8 10.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SupportChat: React.FC<SupportChatProps> = ({ isOpen, onClose }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const { socket } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchRooms = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${apiBase}/api/v1/support/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data && Array.isArray(data.rooms)) {
        setRooms(data.rooms);
        if (data.rooms.length > 0 && !activeRoomId) {
          const rid = String(data.rooms[0]._id);
          setActiveRoomId(rid);
          fetchRoomMessages(rid, token);
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoomId]);

  const fetchRoomMessages = async (roomId: string, token: string) => {
    try {
      const res = await fetch(`${apiBase}/api/v1/support/chat/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data && Array.isArray(data.messages)) setMessages(data.messages);
    } catch {}
  };

  useEffect(() => {
    if (isOpen) fetchRooms();
    else {
      setRooms([]);
      setActiveRoomId(null);
      setMessages([]);
    }
  }, [isOpen, fetchRooms]);

  useEffect(() => {
    if (!socket) return;
    const onSupportMsg = (payload: SupportMessagePayload) => {
      const { room, message } = payload || {};
      if (!room || !message) return;
      if (room === activeRoomId) {
        setMessages((prev) => {
          const exists = message._id ? prev.some((m) => m._id === message._id) : false;
          if (exists) return prev;
          return [...prev, message];
        });
      }
    };
    socket.on("support:message", onSupportMsg);
    return () => {
      try { socket.off("support:message", onSupportMsg); } catch {}
    };
  }, [socket, activeRoomId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const token = getToken();
    if (!token) { toast.warn("Please sign in to contact support."); return; }
    setSending(true);
    try {
      const body: any = { text: input.trim() };
      if (activeRoomId) body.roomId = activeRoomId;
      else body.subject = "User support request";
      const res = await fetch(`${apiBase}/api/v1/support/chat`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to send");
      const newRoomId = data.roomId ? String(data.roomId) : activeRoomId;
      const newMsg: Message = {
        room: newRoomId || "",
        senderRole: "user",
        text: input.trim(),
        createdAt: data.sentAt || new Date().toISOString(),
      };
      if (newRoomId && !rooms.some((r) => String(r._id) === newRoomId)) {
        setRooms((prev) => [{ _id: newRoomId, subject: "Support", status: "open", lastMessageAt: newMsg.createdAt || null }, ...prev]);
      }
      setMessages((prev) => [...prev, newMsg]);
      if (!activeRoomId && newRoomId) setActiveRoomId(newRoomId);
      setInput("");
    } catch (err) {
      toast.error((err as Error).message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!isOpen) return null;

  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="fixed inset-0 z-[10000] flex justify-end bg-black/50" onClick={onClose} style={{ height: "100dvh" }}>
      <div
        className="flex flex-col overflow-hidden"
        style={{ width: "100%", maxWidth: 380, height: "100dvh", background: "#0D0F1E" }}
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
            <HeadsetIcon />
          </div>
          <span
            className="font-bold text-[20px] text-white flex-1 tracking-[0.02em]"
            style={{ fontFamily: "'Manrope', sans-serif", lineHeight: "34px" }}
          >
            Support
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

        {/* In need of help section */}
        <div
          className="flex flex-col items-center gap-3 px-4 py-6 shrink-0"
          style={{ borderBottom: "1px solid #1E2133" }}
        >
          <p
            className="font-bold text-[18px] text-white"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            In need of help?
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#14A28A]" />
            <span
              className="text-[#14A28A] text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Our support is online
            </span>
          </div>
          <a
            href="/faq"
            className="flex items-center gap-2 rounded-[8px] px-5 py-2 transition-colors hover:bg-[#1E2133]"
            style={{ background: "#151728", border: "1px solid #26293E" }}
            onClick={onClose}
          >
            <FAQIcon />
            <span
              className="text-white text-sm font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              FAQ
            </span>
          </a>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {/* Static welcome message from LabWards */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-[6px] overflow-hidden shrink-0"
                style={{ width: 32, height: 32, background: "#151728" }}
              >
                <Image src={LogoImg} alt="LabWards" width={24} height={24} className="object-contain" />
              </div>
              <span
                className="text-white text-sm font-semibold"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                LabWards
              </span>
              <div className="w-1 h-1 rounded-full bg-[#8C8FA8] opacity-50" />
              <span className="text-[#8C8FA8] text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                {now}
              </span>
            </div>
            <div
              className="rounded-[10px_10px_10px_0px] p-3 ml-2"
              style={{ background: "#151728", maxWidth: "90%" }}
            >
              <p
                className="text-white text-[13px] leading-[1.6]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {WELCOME_MESSAGE}
              </p>
            </div>
          </div>

          {/* Dynamic messages */}
          {messages.map((msg, idx) => {
            const isUser = msg.senderRole === "user";
            const isSystem = msg.senderRole === "system";
            if (isSystem) {
              return (
                <p key={msg._id || idx} className="text-[#8C8FA8] text-xs text-center">
                  {msg.text}
                </p>
              );
            }
            return (
              <div key={msg._id || idx} className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
                {!isUser && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center rounded-[6px] overflow-hidden shrink-0" style={{ width: 24, height: 24, background: "#151728" }}>
                      <Image src={LogoImg} alt="Support" width={18} height={18} className="object-contain" />
                    </div>
                    <span className="text-[#8C8FA8] text-xs">Support</span>
                    {msg.createdAt && (
                      <span className="text-[#8C8FA8] text-xs">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </div>
                )}
                <div
                  className="rounded-[10px] p-3"
                  style={{
                    background: isUser ? "#14A28A" : "#151728",
                    maxWidth: "80%",
                    borderRadius: isUser ? "10px 10px 0px 10px" : "10px 10px 10px 0px",
                  }}
                >
                  <p className="text-white text-[13px] leading-[1.6]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="flex items-center gap-2 px-4 py-4 shrink-0"
          style={{ borderTop: "1px solid #1E2133", background: "#0D0F1E" }}
        >
          <button className="shrink-0">
            <EmojiIcon />
          </button>
          <button className="shrink-0">
            <AttachIcon />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your message...."
            disabled={sending}
            className="flex-1 bg-transparent outline-none text-white placeholder-[#50536F] text-[14px]"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="flex items-center justify-center rounded-[10px] shrink-0 disabled:opacity-40 transition-opacity"
            style={{
              width: 44,
              height: 44,
              background: "linear-gradient(12.07deg, rgba(255,255,255,0) 16.27%, rgba(255,255,255,0.7) 93.68%), #099F86",
              boxShadow: "0px 6px 16px rgba(20,169,144,0.3)",
            }}
          >
            <SendIconSmall />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;
