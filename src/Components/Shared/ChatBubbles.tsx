"use client";
import React, { useEffect, useState } from "react";
import { Headset } from "lucide-react";
import SupportChat from "@/Components/HomePage/SupportChat";
import { LIVE_CHAT_OPEN_EVENT } from "@/utils/liveChat";

export default function ChatBubbles() {
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
    const openLiveChat = () => setSupportOpen(true);

    window.addEventListener(LIVE_CHAT_OPEN_EVENT, openLiveChat);
    return () => {
      window.removeEventListener(LIVE_CHAT_OPEN_EVENT, openLiveChat);
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-[86px] md:bottom-6 right-4 z-50 flex">
        <button
          type="button"
          onClick={() => setSupportOpen(true)}
          className="h-12 rounded-full pl-3 pr-4 bg-gradient-to-r from-emerald-500 to-[#099F86] hover:from-emerald-400 hover:to-[#14A28A] flex items-center justify-center gap-2 shadow-[0px_10px_24px_rgba(20,169,144,0.35)] transition-transform hover:scale-[1.02] border border-emerald-300/20"
          title="Live Chat"
          aria-label="Open live chat"
        >
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Headset className="w-4 h-4 text-white" />
          </span>
          <span className="text-white text-sm font-semibold tracking-[0.01em]">Live Chat</span>
        </button>
      </div>

      <SupportChat isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  );
}
