"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSocket } from "@/contexts/SocketProvider";
import UserProfileModal from "@/Components/UserProfileModal";
import NotificationDropdown from "@/Components/HomePage/NotificationDropdown";
import SupportChat from "@/Components/HomePage/SupportChat";
import { toast } from "@/utils/toast";
import TopBar from "@/Components/Topbar";

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
}

interface StoredUser {
  id?: string;
  _id?: string;
  email?: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getChatTailKey = (items: ChatMessage[]): string => {
  if (items.length === 0) return "";
  const last = items[items.length - 1];
  return `${last._id || last.id || ""}|${String(last.timestamp || "")}|${last.text || ""}`;
};

const isContainerNearBottom = (container: HTMLDivElement, threshold = 72): boolean => {
  const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
  return distanceFromBottom <= threshold;
};

const defaultRooms: ChatRoom[] = [
  { id: "general", name: "General" },
  { id: "support", name: "Support" },
];

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "th", name: "แปลไทย", flag: "🇹🇭" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", name: "Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Melayu", flag: "🇲🇾" },
  { code: "cs", name: "Čeština", flag: "🇨🇿" },
  { code: "ro", name: "Română", flag: "🇷🇴" },
  { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
  { code: "hu", name: "Magyar", flag: "🇭🇺" },
  { code: "fi", name: "Suomi", flag: "🇫🇮" },
  { code: "da", name: "Dansk", flag: "🇩🇰" },
  { code: "no", name: "Norsk", flag: "🇳🇴" },
  { code: "he", name: "עברית", flag: "🇮🇱" },
  { code: "fa", name: "فارسی", flag: "🇮🇷" },
];

const tickerItems = [
  { img: "/img6.png", user: "User XY withdrew", label: "Slots", amount: "$0.5" },
  { img: "/img7.png", user: "User YZ earned", label: "Worldcoin", amount: "$10" },
  { img: "/img8.png", user: "User AB earned", label: "Offer walls", amount: "$2" },
  { img: "/img9.png", user: "User CD withdrew", label: "Torox", amount: "$1.5" },
];

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" fill="#14A28A" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26.25 1.75L1.75 11.0833L11.0833 14.9167M26.25 1.75L16.9167 26.25L11.0833 14.9167M26.25 1.75L11.0833 14.9167" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function EmojiIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#50536F" strokeWidth="1.8"/>
      <path d="M8.5 14C8.5 14 9.5 16 12 16C14.5 16 15.5 14 15.5 14" stroke="#50536F" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="10.5" r="1.2" fill="#50536F"/>
      <circle cx="15" cy="10.5" r="1.2" fill="#50536F"/>
    </svg>
  );
}

function UserAvatar({ avatar, username, role }: { avatar?: string; username: string; role?: string }) {
  const initial = username?.charAt(0)?.toUpperCase() || "U";
  const color = role === "admin" ? "text-red-400" : role === "moderator" ? "text-blue-400" : "text-[#14A28A]";
  return (
    <div className="w-10 h-10 rounded-[5px] bg-[#151728] flex-shrink-0 flex items-center justify-center overflow-hidden">
      {avatar ? (
        <Image src={avatar} alt={username} width={40} height={40} className="w-full h-full object-cover rounded-full" />
      ) : (
        <span className={`text-[18px] font-bold ${color}`}>{initial}</span>
      )}
    </div>
  );
}

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
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldStickToBottomRef = useRef(true);
  const lastMessageTailKeyRef = useRef("");
  const { socket } = useSocket();

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const token = getToken();
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (token) {
      setAuthToken(token);
      if (userStr) {
        try {
          const u: StoredUser = JSON.parse(userStr);
          setCurrentUserId(u._id || u.id || null);
        } catch {}
      }
    }
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
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

  const fetchOnlineCount = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/v1/chat/online`);
      if (res.ok) {
        const data = await res.json();
        if (typeof data.count === "number") setOnlineCount(data.count);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchOnlineCount();
  }, [fetchMessages, fetchOnlineCount]);

  useEffect(() => {
    const pollInterval = setInterval(fetchMessages, 3000);
    const onlineInterval = setInterval(fetchOnlineCount, 30000);
    return () => { clearInterval(pollInterval); clearInterval(onlineInterval); };
  }, [fetchMessages, fetchOnlineCount]);

  useEffect(() => {
    const token = getToken() || authToken;
    if (!token) return;
    const sendHeartbeat = async () => {
      try {
        await fetch(`${apiBase}/api/v1/chat/heartbeat`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}
    };
    sendHeartbeat();
    const heartbeatInterval = setInterval(sendHeartbeat, 60000);
    return () => clearInterval(heartbeatInterval);
  }, [authToken]);

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
      if (typeof data.count === "number") setOnlineCount(data.count);
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
    const token = getToken() || authToken;
    if (!token) {
      toast.warn("Please sign in to send messages");
      router.push("/sign-in");
      return;
    }
    shouldStickToBottomRef.current = true;
    setSending(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/chat/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.trim(), room: selectedRoom.id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to send message");
      }
      setInput("");
    } catch (err) {
      toast.error((err as Error)?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

  const formatTime = (timestamp: string | Date) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const isImageUrl = (text: string) =>
    /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(text.trim());

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-[#0D0F1E] pb-20 lg:pb-0">
      <TopBar />

      {/* ── Sub-header: language / room selector ── */}
      <div className="flex flex-row items-center px-4 gap-[10px] h-[48px] bg-[#0D0F1E] border-b border-[#1E2133] flex-shrink-0">
        <div className="flex flex-row items-center gap-2 flex-1">
          <ChatIcon />
          <span
            className="font-bold text-[16px] leading-[24px] tracking-[0.02em] text-white"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Chat room
          </span>
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoomDropdown(!showRoomDropdown)}
            className="flex flex-row items-center gap-1 bg-[#151728] border border-[#1E2133] rounded-[5px] px-[4px] py-[5px] h-[34px]"
          >
            <div className="w-6 h-6 rounded-[3px] bg-[#1E2133] flex items-center justify-center text-[14px]">
              {selectedLanguage.flag}
            </div>
            <div className="flex flex-col items-start pl-1 pr-0.5">
              <span
                className="font-medium text-[12px] leading-[14px] tracking-[0.02em] text-[#B3B6C7]"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                {selectedLanguage.name}
              </span>
            </div>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mx-1">
              <path d="M2 8L6 4L10 8" stroke="#50536F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {showRoomDropdown && (
            <div
              className="absolute top-full right-0 mt-1 bg-[#151728] border border-[#1E2133] rounded-[8px] shadow-xl z-20 overflow-hidden"
              style={{ width: 180, maxHeight: 320, overflowY: "auto" }}
            >
              {/* Languages */}
              <div className="px-2 pt-2 pb-1">
                <p className="text-[10px] font-semibold text-[#50536F] uppercase tracking-wider px-1 pb-1">Language</p>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setSelectedLanguage(lang); setShowRoomDropdown(false); }}
                    className={`flex items-center gap-2 px-2 py-1.5 w-full text-left hover:bg-[#1E2133] rounded-[5px] transition-colors ${
                      selectedLanguage.code === lang.code ? "bg-[#1E2133]" : ""
                    }`}
                  >
                    <span className="text-[15px]">{lang.flag}</span>
                    <span className="text-[12px] text-[#B3B6C7]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                      {lang.name}
                    </span>
                    {selectedLanguage.code === lang.code && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#14A28A] ml-auto" />
                    )}
                  </button>
                ))}
              </div>
              {/* Rooms */}
              <div className="px-2 pt-1 pb-2" style={{ borderTop: "1px solid #1E2133" }}>
                <p className="text-[10px] font-semibold text-[#50536F] uppercase tracking-wider px-1 py-1">Rooms</p>
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
                    className={`flex items-center gap-2 px-2 py-1.5 w-full text-left hover:bg-[#1E2133] rounded-[5px] transition-colors ${
                      selectedRoom.id === room.id ? "bg-[#1E2133]" : ""
                    }`}
                  >
                    <span className="text-[12px] text-[#B3B6C7]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                      {room.name}
                    </span>
                    {selectedRoom.id === room.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#14A28A] ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Close / back */}
        <button onClick={() => router.back()} className="w-7 h-7 flex items-center justify-center flex-shrink-0">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M7.5 7.5L20.5 20.5M7.5 20.5L20.5 7.5" stroke="#8C8FA8" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── Activity ticker ── */}
      <div className="flex flex-row overflow-x-auto gap-[10px] px-4 py-2 border-b border-[#1E2133] flex-shrink-0">
        {tickerItems.map((item, i) => (
          <div key={i} className="flex-shrink-0 flex flex-row items-center gap-2 bg-[#151728] rounded-[8px] px-3 py-1.5 min-w-[160px] h-[48px]">
            <div className="w-8 h-8 rounded-[5px] overflow-hidden flex-shrink-0 bg-[#1E2133]">
              <Image src={item.img} alt={item.label} width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-medium text-[#8C8FA8] leading-[14px]">{item.user}</span>
              <span className="text-[11px] font-medium text-[#B3B6C7] leading-[14px]">{item.label}</span>
            </div>
            <span className="text-[14px] font-bold text-[#0AC07D] ml-auto pl-2">{item.amount}</span>
          </div>
        ))}
      </div>

      {/* ── Messages area ── */}
      <div
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-[21px]"
      >
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center flex-1 h-full">
            <p className="text-sm text-[#8C8FA8]">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center flex-1 h-full">
            <div className="text-center">
              <p className="text-sm text-[#8C8FA8]">No messages yet</p>
              <p className="text-xs text-[#50536F] mt-1">Be the first to say hello!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMention = msg.text?.startsWith("@");
            const isImg = isImageUrl(msg.text || "");
            return (
              <div key={msg._id || msg.id || idx} className="flex flex-row items-end gap-2">
                {/* Avatar */}
                <div className="cursor-pointer flex-shrink-0" onClick={() => handleUserClick(msg.userId)}>
                  <UserAvatar avatar={msg.avatar} username={msg.username} role={msg.role} />
                </div>

                {/* Content column */}
                <div className="flex flex-col gap-[6px] flex-1 min-w-0">
                  {/* Name row */}
                  <div className="flex flex-row items-center gap-1">
                    <div className="w-4 h-4 rounded-[4px] border border-[#0088FF] bg-[#0D0F1E] flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {msg.avatar ? (
                        <Image src={msg.avatar} alt={msg.username} width={16} height={16} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] font-bold text-[#0088FF]">{msg.username?.charAt(0)?.toUpperCase()}</span>
                      )}
                    </div>
                    <span
                      className="text-[13px] font-medium text-[#8C8FA8] leading-[21px] tracking-[-0.03em] cursor-pointer hover:text-white"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      onClick={() => handleUserClick(msg.userId)}
                    >
                      {msg.username}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#B3B6C7] opacity-40 flex-shrink-0" />
                    <span
                      className="text-[10px] font-medium text-[#8C8FA8] leading-[21px] tracking-[-0.03em] flex-shrink-0"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>

                  {/* Bubble */}
                  {isImg ? (
                    <div className="rounded-[10px_10px_10px_0px] overflow-hidden w-[133px] h-[109px]">
                      <Image src={msg.text} alt="image" width={133} height={109} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="bg-[#151728] rounded-[10px_10px_10px_0px] px-2 py-3 max-w-lg w-fit">
                      <p
                        className={`text-[13px] leading-[21px] tracking-[-0.03em] break-words whitespace-pre-wrap ${isMention ? "font-semibold text-[#8C8FA8]" : "font-medium text-white"}`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {msg.text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Input area ── */}
      <div className="flex flex-row items-center gap-2 px-4 py-4 flex-shrink-0 bg-[#0D0F1E]">
        <div className="flex-1 flex flex-row items-center gap-[10px] bg-[#151728] border border-[#26293E] rounded-[10px] h-14 px-[10px]">
          <button className="flex-shrink-0">
            <EmojiIcon />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your message...."
            disabled={sending}
            className="flex-1 bg-transparent outline-none font-medium text-[14px] leading-[14px] tracking-[0.02em] text-white placeholder-[#50536F] min-w-0"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="w-[78px] h-14 flex items-center justify-center rounded-[10px] flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          style={{
            background: "linear-gradient(12.07deg, rgba(255,255,255,0) 16.27%, rgba(255,255,255,0.7) 93.68%), #099F86",
            boxShadow: "0px 11px 29px rgba(20,169,144,0.3)",
          }}
        >
          <SendIcon />
        </button>
      </div>

      <UserProfileModal
        userId={selectedUserId}
        isOpen={showProfileModal}
        onClose={() => { setShowProfileModal(false); setSelectedUserId(null); }}
      />

      {showNotifications && (
        <NotificationDropdown onClose={() => setShowNotifications(false)} />
      )}

      <SupportChat isOpen={showSupport} onClose={() => setShowSupport(false)} />
    </div>
  );
}