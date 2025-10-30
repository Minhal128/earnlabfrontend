"use client";

import React from "react";
import { X, Send } from "lucide-react";
import Image from "next/image";
import { toast } from "@/utils/toast";
import AnaImg from "../../../public/assets/anna.png";
import { useSocket } from "@/contexts/SocketProvider";

interface ChatRoom {
  _id: string;
  participants: string[];
  subject?: string | null;
  status: "open" | "closed" | "archived";
  lastMessageAt?: string | null;
  createdAt?: string;
}

interface Message {
  _id?: string;
  id?: number;
  room: string;
  senderUser?: string | null;
  senderRole: "user" | "support" | "system";
  text: string;
  meta?: unknown;
  createdAt?: string;
}

interface SupportMessagePayload {
  room: string;
  message: Message;
}

interface RoomUpdatedPayload {
  room: ChatRoom;
}

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SupportChat: React.FC<SupportChatProps> = ({ isOpen, onClose }) => {
  const [rooms, setRooms] = React.useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Record<string, Message[]>>({});
  const [input, setInput] = React.useState("");
  const [loadingRooms, setLoadingRooms] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const { socket } = useSocket();

  // helper: get token
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch user's chat rooms
  const fetchRooms = React.useCallback(async () => {
    const token = getToken();
    if (!token) {
      // no auth -> don't show chat
      return;
    }
    setLoadingRooms(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/support/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.message || "Failed to load chat rooms");
      }
      const data = await res.json();
      if (data && Array.isArray(data.rooms)) {
        setRooms(data.rooms);
        // choose active room if not set
        if (!activeRoomId && data.rooms.length > 0) {
          setActiveRoomId(String(data.rooms[0]._id));
        }
      }
    } catch (err: unknown) {
      console.error("fetchRooms error", err);
      // be quiet in UI but show toast if meaningful
      // toast.error((err as Error).message || "Could not load support chat");
    } finally {
      setLoadingRooms(false);
    }
  }, [activeRoomId]);

  // Fetch messages for a room
  const fetchMessagesForRoom = React.useCallback(async (roomId: string) => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(`${apiBase}/api/v1/support/chat/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b?.message || "Failed to load messages");
      }
      const data = await res.json();
      if (data && Array.isArray(data.messages)) {
        setMessages((prev) => ({ ...prev, [roomId]: data.messages }));
      }
    } catch (err: unknown) {
      console.error("fetchMessagesForRoom error", err);
    }
  }, []);

  // Load rooms on open
  React.useEffect(() => {
    if (!isOpen) return;
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Load messages when active room changes
  React.useEffect(() => {
    if (!activeRoomId) return;
    // If we already have messages, skip initial fetch (but still attempt to refresh)
    fetchMessagesForRoom(activeRoomId);
  }, [activeRoomId, fetchMessagesForRoom]);

  // Socket handling for real-time updates
  React.useEffect(() => {
    if (!socket) return;
    // Expected events (best-effort): 'support:message' { room, message }, 'support:room' { room }
    const onSupportMessage = (payload: SupportMessagePayload) => {
      try {
        const { room, message } = payload || {};
        if (!room || !message) return;
        setMessages((prev) => {
          const cur = prev[room] || [];
          // Avoid duplicates if message has _id
          const exists = message._id
            ? cur.some((m) => m._id === message._id)
            : false;
          if (exists) return prev;
          const next = { ...prev, [room]: [...cur, message] };
          return next;
        });
        // If the incoming message belongs to a room we don't have, add it
        if (
          !rooms.some((r) => String(r._id) === String(room)) &&
          message?.room
        ) {
          // try to fetch rooms to sync state
          fetchRooms();
        }
      } catch {
        // ignore
      }
    };

    const onRoomUpdated = (payload: RoomUpdatedPayload) => {
      try {
        const { room } = payload || {};
        if (!room) return;
        setRooms((prev) => {
          // replace or prepend
          const idx = prev.findIndex((r) => String(r._id) === String(room._id));
          if (idx !== -1) {
            const copy = [...prev];
            copy[idx] = room;
            return copy;
          }
          return [room, ...prev];
        });
      } catch {}
    };

    const onConnect = () => {
      // When socket reconnects, refetch to ensure we haven't missed events
      if (isOpen) {
        fetchRooms();
        if (activeRoomId) {
          fetchMessagesForRoom(activeRoomId);
        }
      }
    };

    socket.on("support:message", onSupportMessage);
    socket.on("support:room", onRoomUpdated);
    socket.on("connect", onConnect);

    return () => {
      try {
        socket.off("support:message", onSupportMessage);
        socket.off("support:room", onRoomUpdated);
        socket.off("connect", onConnect);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, rooms, activeRoomId, isOpen]);

  // Send message (POST /api/v1/support/chat)
  const handleSend = React.useCallback(async () => {
    if (!input || input.trim().length === 0) return;
    const token = getToken();
    if (!token) {
      toast.warn("Please sign in to send messages to support.");
      return;
    }
    setSending(true);
    try {
      const body: { text: string; roomId?: string; subject?: string } = { text: input.trim() };
      if (activeRoomId) body.roomId = activeRoomId;
      // subject only when creating a new room and one doesn't exist
      if (!activeRoomId) {
        body.subject = "User initiated chat";
      }
      const res = await fetch(`${apiBase}/api/v1/support/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.message || "Failed to send message");
      }

      // Backend returns { roomId, messageId, sentAt }
      const newRoomId = payload?.roomId ? String(payload.roomId) : activeRoomId;
      const sentAt = payload?.sentAt || new Date().toISOString();
      const newMsg: Message = {
        room: newRoomId || "",
        senderUser: null, // server stores user; we represent as 'user' role below
        senderRole: "user",
        text: input.trim(),
        createdAt: sentAt,
      };

      // Update rooms and messages locally
      if (
        newRoomId &&
        !rooms.some((r) => String(r._id) === String(newRoomId))
      ) {
        const created: ChatRoom = {
          _id: newRoomId,
          participants: [],
          subject: body.subject || null,
          status: "open",
          lastMessageAt: sentAt,
        };
        setRooms((prev) => [created, ...prev]);
      }
      setMessages((prev) => {
        if (!newRoomId) return prev;
        const cur = prev[newRoomId] || [];
        return { ...prev, [newRoomId]: [...cur, newMsg] };
      });

      // switch active room if a new room was created
      if (!activeRoomId && newRoomId) {
        setActiveRoomId(newRoomId);
      }

      setInput("");
    } catch (err: unknown) {
      console.error("send message error", err);
      toast.error((err as Error)?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  }, [input, activeRoomId, rooms]);

  // Basic UI: side list of rooms + message area
  if (!isOpen) return null;

  const activeMessages = activeRoomId ? messages[activeRoomId] || [] : [];

  return (
    <div className="fixed top-11 right-4 z-50">
      <div className="w-[360px] h-[520px] bg-[#121428] text-white rounded-xl shadow-2xl flex">
        {/* Left: rooms */}
        <div className="w-36 border-r border-[#30334A] flex flex-col">
          <div className="px-3 py-2 flex items-center justify-between border-b border-[#30334A]">
            <span className="text-xs font-semibold">Support</span>
            <button
              onClick={onClose}
              className="bg-[#8C8FA8] text-black rounded-md p-0.5"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <button
              onClick={() => {
                // create new conversation (set activeRoomId null and clear messages preview)
                setActiveRoomId(null);
              }}
              className={`w-full text-left px-3 py-2 text-xs border-b border-[#26293E] ${activeRoomId === null ? "bg-[#26293E]" : ""}`}
            >
              + New
            </button>

            {loadingRooms ? (
              <div className="p-3 text-xs text-gray-400">Loading...</div>
            ) : rooms.length === 0 ? (
              <div className="p-3 text-xs text-gray-400">
                No conversations yet
              </div>
            ) : (
              rooms.map((r) => (
                <div
                  key={r._id}
                  onClick={() => setActiveRoomId(String(r._id))}
                  className={`px-3 py-2 text-xs cursor-pointer border-b border-[#26293E] ${activeRoomId === String(r._id) ? "bg-[#26293E]" : "hover:bg-[#1C1F33]"}`}
                >
                  <div className="font-medium truncate">
                    {r.subject || "Conversation"}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    {r.lastMessageAt
                      ? new Date(r.lastMessageAt).toLocaleString()
                      : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: messages */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#30334A]">
            <div className="flex items-center gap-3">
              <Image
                src={AnaImg}
                alt="Agent"
                width={28}
                height={28}
                className="rounded-full"
              />
              <div>
                <div className="text-sm font-semibold">Live Support</div>
                <div className="text-xs text-gray-400">
                  {activeRoomId
                    ? rooms.find((r) => String(r._id) === String(activeRoomId))
                        ?.subject || "Support"
                    : "New conversation"}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {activeMessages.length} messages
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-3 py-4 space-y-5 text-sm"
            id="support-messages"
          >
            {activeMessages.length === 0 ? (
              <div className="text-xs text-gray-400">
                {activeRoomId
                  ? "No messages in this conversation yet."
                  : "Start a new conversation. Describe your issue and our team will respond."}
              </div>
            ) : (
              activeMessages.map((msg, idx) => {
                if (msg.senderRole === "system") {
                  return (
                    <p
                      key={msg._id || idx}
                      className="text-gray-400 text-xs bg-[#26293E] p-2 rounded-md"
                    >
                      {msg.text}
                    </p>
                  );
                }
                if (msg.senderRole === "support") {
                  return (
                    <div
                      key={msg._id || idx}
                      className="flex flex-col items-start"
                    >
                      <div className="flex items-center gap-2 mb-2">
                          <Image
                            src={AnaImg}
                            alt="Agent"
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          <span className="text-xs text-gray-300">Support</span>
                        </div>
                      <div className="bg-[#26293E] px-3 py-2 rounded-lg max-w-[80%]">
                        <p className="text-[13px] leading-snug">{msg.text}</p>
                        <div className="text-[10px] text-gray-400 mt-1">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleString()
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                }
                // user message
                return (
                  <div key={msg._id || idx} className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-2">
                      {/* removed default profile image — neutral placeholder */}
                      <div className="h-5 w-5 rounded-full bg-[#2A2D44]" />
                      <span className="text-xs text-gray-300">You</span>
                    </div>
                    <div className="bg-[#3A3E57] px-3 py-2 rounded-lg max-w-[80%]">
                      <p className="text-[13px] leading-snug">{msg.text}</p>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleString()
                          : ""}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <div className="flex items-center bg-[#121428] p-3 border-t border-[#30334A]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your message..."
              className="flex-1 px-3 py-2 bg-[#26293E] text-white text-sm rounded-md outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={sending}
            />
            <button
              onClick={() => handleSend()}
              className={`ml-2 p-2 rounded-md hover:opacity-90 transition ${sending ? "bg-gray-600" : "bg-[#099F86]"}`}
              disabled={sending}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;