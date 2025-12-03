"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, ChevronDown, Image as ImageIcon, Users, Hash } from "lucide-react";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";
import { useSocket } from "@/contexts/SocketProvider";
import UserProfileModal from "@/Components/UserProfileModal";
import { toast } from "@/utils/toast";

interface ChatMessage {
  _id?: string;
  id?: string;
  text: string;
  userId?: string;
  username: string;
  avatar?: string;
  countryCode?: string;
  role?: "user" | "admin" | "moderator";
  timestamp: string | Date;
  room?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  icon?: string;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const defaultRooms: ChatRoom[] = [
  { id: "general", name: "General" },
  { id: "trading", name: "Trading" },
  { id: "help", name: "Help" },
  { id: "offtopic", name: "Off-Topic" },
];

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [onlineCount, setOnlineCount] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>(defaultRooms[0]);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages for the selected room
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/chat/messages?room=${selectedRoom.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.error("Failed to fetch chat messages", err);
    } finally {
      setLoading(false);
    }
  }, [selectedRoom.id]);

  // Fetch online count
  const fetchOnlineCount = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/v1/chat/online`);
      if (res.ok) {
        const data = await res.json();
        if (typeof data.count === "number") {
          setOnlineCount(data.count);
        }
      }
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchOnlineCount();
  }, [fetchMessages, fetchOnlineCount]);

  // Socket events for real-time chat
  useEffect(() => {
    if (!socket) return;

    const onChatMessage = (msg: ChatMessage) => {
      if (msg.room === selectedRoom.id || !msg.room) {
        setMessages((prev) => {
          const exists = msg._id ? prev.some((m) => m._id === msg._id) : false;
          if (exists) return prev;
          return [...prev, msg].slice(-100);
        });
      }
    };

    const onOnlineUpdate = (data: { count: number }) => {
      if (typeof data.count === "number") {
        setOnlineCount(data.count);
      }
    };

    socket.on("chat:message", onChatMessage);
    socket.on("chat:online", onOnlineUpdate);
    socket.emit("chat:join", { room: selectedRoom.id });

    return () => {
      socket.off("chat:message", onChatMessage);
      socket.off("chat:online", onOnlineUpdate);
      socket.emit("chat:leave", { room: selectedRoom.id });
    };
  }, [socket, selectedRoom.id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const token = getToken();
    if (!token) {
      toast.warn("Please sign in to send messages");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/chat/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: input.trim(),
          room: selectedRoom.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to send message");
      }

      setInput("");
    } catch (err) {
      console.error("Send message error", err);
      toast.error((err as Error)?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUserClick = (userId?: string) => {
    if (userId) {
      setSelectedUserId(userId);
      setShowProfileModal(true);
    }
  };

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded ml-1.5">
            Admin
          </span>
        );
      case "moderator":
        return (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded ml-1.5">
            Mod
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0C1A]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#0F1123] border-b border-[#1E2035]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-[#1A1D2E] hover:bg-[#252840] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-lg">💬</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Chat</h1>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Users size={12} />
                {onlineCount} User(s) online
              </p>
            </div>
          </div>
        </div>

        {/* Room Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoomDropdown(!showRoomDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1D2E] rounded-lg hover:bg-[#252840] transition-colors border border-[#2A2D3E]"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium text-white">{selectedRoom.name}</span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform ${showRoomDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {showRoomDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#1A1D2E] rounded-lg border border-[#2A2D3E] shadow-xl z-10">
              {defaultRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowRoomDropdown(false);
                    setMessages([]);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 w-full hover:bg-[#252840] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    selectedRoom.id === room.id ? "bg-[#252840]" : ""
                  }`}
                >
                  <Hash size={14} className="text-gray-400" />
                  <span className="text-sm text-white">{room.name}</span>
                  {selectedRoom.id === room.id && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-gray-400">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#1A1D2E] flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💭</span>
              </div>
              <p className="text-sm text-gray-400">No messages yet</p>
              <p className="text-xs text-gray-500 mt-1">Be the first to say hello!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={msg._id || msg.id || index} className="group">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  onClick={() => handleUserClick(msg.userId)}
                  className="relative cursor-pointer flex-shrink-0"
                >
                  {msg.avatar ? (
                    <Image
                      src={msg.avatar}
                      alt={msg.username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-sm font-bold uppercase">
                      {msg.username?.charAt(0) || "U"}
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  {/* Username, Badge, Flag, Time */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      onClick={() => handleUserClick(msg.userId)}
                      className="text-sm font-semibold text-white hover:underline cursor-pointer"
                    >
                      {msg.username}
                    </span>
                    {getRoleBadge(msg.role)}
                    {msg.countryCode && (
                      <ReactCountryFlag
                        countryCode={msg.countryCode}
                        svg
                        style={{ width: "16px", height: "12px" }}
                        className="ml-1"
                      />
                    )}
                    <span className="text-[11px] text-gray-500 ml-2">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>

                  {/* Message Text */}
                  <div className="bg-[#1A1D2E] rounded-xl px-4 py-2.5 inline-block max-w-full">
                    <p className="text-sm text-gray-200 break-words whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0F1123] border-t border-[#1E2035]">
        <div className="flex items-center gap-3">
          <button className="p-2.5 hover:bg-[#1A1D2E] rounded-lg transition-colors">
            <ImageIcon size={22} className="text-gray-400" />
          </button>
          <div className="flex-1 bg-[#1A1D2E] rounded-xl border border-[#2A2D3E] focus-within:border-emerald-500/50 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a message..."
              disabled={sending}
              className="w-full bg-transparent text-white text-sm placeholder-gray-500 px-4 py-3 rounded-xl outline-none"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="p-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-[#1A1D2E] disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        userId={selectedUserId}
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
}
