"use client";
import React, { useState } from "react";
import { MessageCircle, HelpCircle } from "lucide-react";
import SupportChat from "@/Components/HomePage/SupportChat";
import { useRouter } from "next/navigation";

export default function ChatBubbles() {
  const router = useRouter();
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-3">
        <button
          onClick={() => router.push("/chat")}
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

      <SupportChat isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  );
}
