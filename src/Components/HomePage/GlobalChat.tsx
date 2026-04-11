"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Send, ChevronDown, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";
import { useSocket } from "@/contexts/SocketProvider";
import UserProfileModal from "../UserProfileModal";
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
  isActive?: boolean;
}

interface GlobalChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const defaultRooms: ChatRoom[] = [
  { id: "general", name: "General", isActive: true },
  { id: "trading", name: "Trading" },
  { id: "help", name: "Help" },
];

const getChatTailKey = (items: ChatMessage[]): string => {
  if (items.length === 0) return "";
  const last = items[items.length - 1];
  return `${last._id || last.id || ""}|${String(last.timestamp || "")}|${last.text || ""}`;
};

const isContainerNearBottom = (container: HTMLDivElement, threshold = 72): boolean => {
  const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
  return distanceFromBottom <= threshold;
};

const GlobalChat: React.FC<GlobalChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [onlineCount, setOnlineCount] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>(defaultRooms[0]);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldStickToBottomRef = useRef(true);
  const lastMessageTailKeyRef = useRef("");
  const { socket } = useSocket();

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({ top: container.scrollHeight, behavior });
    shouldStickToBottomRef.current = true;
  };

  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    shouldStickToBottomRef.current = isContainerNearBottom(container);
  };

  useEffect(() => {
    const nextTailKey = getChatTailKey(messages);
    const hasTailChanged = nextTailKey !== lastMessageTailKeyRef.current;
    const isInitialLoad = lastMessageTailKeyRef.current === "" && messages.length > 0;

    if (isInitialLoad) {
      scrollToBottom("auto");
    } else if (hasTailChanged && shouldStickToBottomRef.current) {
      scrollToBottom("smooth");
    }

    lastMessageTailKeyRef.current = nextTailKey;
  }, [messages]);

  // Fetch messages for the selected room
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/chat/messages?room=${selectedRoom.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.messages)) {
          setMessages((prev) => {
            const incoming = data.messages as ChatMessage[];
            if (
              prev.length === incoming.length
              && getChatTailKey(prev) === getChatTailKey(incoming)
            ) {
              return prev;
            }

            return incoming;
          });
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
    if (isOpen) {
      fetchMessages();
      fetchOnlineCount();
    }
  }, [isOpen, fetchMessages, fetchOnlineCount]);

  // Socket events for real-time chat
  useEffect(() => {
    if (!socket || !isOpen) return;

    const onChatMessage = (msg: ChatMessage) => {
      if (msg.room === selectedRoom.id || !msg.room) {
        setMessages((prev) => {
          // Avoid duplicates
          const exists = msg._id
            ? prev.some((m) => m._id === msg._id)
            : false;
          if (exists) return prev;
          return [...prev, msg].slice(-100); // Keep last 100 messages
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

    // Join room
    socket.emit("chat:join", { room: selectedRoom.id });

    return () => {
      socket.off("chat:message", onChatMessage);
      socket.off("chat:online", onOnlineUpdate);
      socket.emit("chat:leave", { room: selectedRoom.id });
    };
  }, [socket, isOpen, selectedRoom.id]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const token = getToken();
    if (!token) {
      toast.warn("Please sign in to send messages");
      return;
    }

    shouldStickToBottomRef.current = true;
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 top-14 sm:top-16 sm:bottom-auto sm:left-auto sm:right-4 z-[9999] p-2 sm:p-0 pointer-events-none flex flex-col justify-end sm:block">
        <div className="w-full h-[calc(100dvh-5rem)] sm:w-[400px] sm:h-[600px] pointer-events-auto bg-[#0F1123] text-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#1E2035]">
          {/* Header */}
          <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[#1E2035]">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-xs sm:text-sm font-bold">💬</span>
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold">Chat</h2>
                <p className="text-[10px] sm:text-xs text-gray-400">{onlineCount} User(s) online</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#1E2035] rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-400 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Room Selector */}
          <div className="px-3 sm:px-4 py-2 border-b border-[#1E2035]">
            <div className="relative">
              <button
                onClick={() => setShowRoomDropdown(!showRoomDropdown)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#1A1D2E] rounded-lg hover:bg-[#252840] transition-colors w-full"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs sm:text-sm font-medium flex-1 text-left">{selectedRoom.name}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform sm:w-4 sm:h-4 ${showRoomDropdown ? "rotate-180" : ""}`} />
              </button>

              {showRoomDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1A1D2E] rounded-lg border border-[#2A2D3E] shadow-xl z-10">
                  {defaultRooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowRoomDropdown(false);
                        setMessages([]);
                        shouldStickToBottomRef.current = true;
                        lastMessageTailKeyRef.current = "";
                      }}
                      className={`flex items-center gap-2 px-3 py-2 w-full hover:bg-[#252840] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        selectedRoom.id === room.id ? "bg-[#252840]" : ""
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${selectedRoom.id === room.id ? "bg-emerald-400" : "bg-gray-500"}`} />
                      <span className="text-sm">{room.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleMessagesScroll}
            className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 sm:py-3 space-y-3 sm:space-y-4"
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-xs sm:text-sm text-gray-400">Loading messages...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-400">No messages yet</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Be the first to say hello!</p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={msg._id || msg.id || index} className="group">
                  <div className="flex items-start gap-2 sm:gap-3">
                    {/* Avatar */}
                    <div
                      onClick={() => handleUserClick(msg.userId)}
                      className="relative cursor-pointer flex-shrink-0"
                    >
                      {msg.avatar ? (
                        <Image
                          src={msg.avatar}
                          alt={msg.username}
                          width={32}
                          height={32}
                          className="rounded-full sm:w-9 sm:h-9"
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs sm:text-sm font-bold uppercase">
                          {msg.username?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      {/* Username, Badge, Flag, Time */}
                      <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
                        <span
                          onClick={() => handleUserClick(msg.userId)}
                          className="text-xs sm:text-sm font-semibold text-white hover:underline cursor-pointer truncate"
                        >
                          {msg.username}
                        </span>
                        {getRoleBadge(msg.role)}
                        {msg.countryCode && (
                          <ReactCountryFlag
                            countryCode={msg.countryCode}
                            svg
                            style={{ width: "12px", height: "9px" }}
                            className="ml-1 sm:w-[14px] sm:h-[10px]"
                          />
                        )}
                        <span className="text-[10px] sm:text-[11px] text-gray-500 ml-auto flex-shrink-0">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>

                      {/* Message Text */}
                      <div className="bg-[#1A1D2E] rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2">
                        <p className="text-xs sm:text-sm text-gray-200 break-words">{msg.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="p-2 sm:p-3 border-t border-[#1E2035]">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button className="p-1.5 sm:p-2 hover:bg-[#1A1D2E] rounded-lg transition-colors">
                <ImageIcon size={18} className="text-gray-400 sm:w-5 sm:h-5" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a message..."
                disabled={sending}
                className="flex-1 bg-[#1A1D2E] text-white text-xs sm:text-sm placeholder-gray-500 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="p-2 sm:p-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <Send size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>
          </div>
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
    </>
  );
};

export default GlobalChat;
