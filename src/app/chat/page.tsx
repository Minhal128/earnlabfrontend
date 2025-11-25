"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Paperclip, Smile } from "lucide-react";
import Image from "next/image";
import UserProfileModal from "@/Components/UserProfileModal";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  avatarUrl?: string;
  userId?: string;
  username?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to the General Chat — be kind and follow the rules!",
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Simulate support response
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message. Our support team will respond shortly.",
        sender: "support",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportMessage]);
    }, 1000);
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

  return (
    <div className="flex flex-col h-screen bg-[#0A0C1A]">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-[#1A1D2E] border-b border-[#2A2D3E]">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg bg-[#252840] hover:bg-[#2A2D3E] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-400 font-bold">G</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">General Chat</h1>
            <p className="text-xs text-[#9CA3AF]">Community chat — public messages from users</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              onClick={() => handleUserClick(message.userId)}
              className={`max-w-[80%] rounded-2xl p-4 cursor-pointer transition-all ${
                message.sender === "user"
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-[#1A1D2E] text-white border border-[#2A2D3E] hover:border-emerald-500/50"
              } ${message.userId ? "hover:shadow-lg" : ""}`}
            >
              {message.username && message.sender !== "support" && (
                <p className="text-xs font-semibold mb-1 opacity-75">
                  {message.username}
                </p>
              )}
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === "user" ? "text-emerald-100" : "text-[#9CA3AF]"
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#1A1D2E] border-t border-[#2A2D3E]">
        <div className="flex items-end gap-2">
          <button className="p-2 rounded-lg bg-[#252840] hover:bg-[#2A2D3E] transition-colors">
            <Paperclip className="w-5 h-5 text-[#9CA3AF]" />
          </button>
          
          <div className="flex-1 bg-[#252840] rounded-xl border border-[#2A2D3E] focus-within:border-emerald-500/50 transition-colors">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="w-full bg-transparent text-white placeholder-[#9CA3AF] px-4 py-3 resize-none focus:outline-none"
            />
          </div>

          <button className="p-2 rounded-lg bg-[#252840] hover:bg-[#2A2D3E] transition-colors">
            <Smile className="w-5 h-5 text-[#9CA3AF]" />
          </button>

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-[#252840] disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
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
