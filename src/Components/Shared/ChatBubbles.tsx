"use client";
import React, { useState } from "react";
import { MessageCircle, HelpCircle } from "lucide-react";
import GlobalChat from "@/Components/HomePage/GlobalChat";
import SupportChat from "@/Components/HomePage/SupportChat";

export default function ChatBubbles() {
  const [globalOpen, setGlobalOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-3">
        <button
          onClick={() => setGlobalOpen(true)}
          className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          title="Global Chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => setSupportOpen(true)}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          title="Support Chat"
        >
          <HelpCircle className="w-6 h-6 text-white" />
        </button>
      </div>

      <GlobalChat isOpen={globalOpen} onClose={() => setGlobalOpen(false)} />
      <SupportChat isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  );
}
