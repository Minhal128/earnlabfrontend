"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Mail, HelpCircle, Send } from "lucide-react";
import TopBar from "@/Components/Topbar";

export default function SupportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"chat" | "email" | "faq">("chat");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const faqs = [
    {
      question: "How do I withdraw my earnings?",
      answer: "Go to your Wallet, select a withdrawal method, and follow the instructions. Minimum withdrawal is $5.",
    },
    {
      question: "How long do withdrawals take?",
      answer: "Withdrawals are processed based on the amount: Under $5 is instant, $10-$15 takes 7 days, $15-$25 takes 25 days, and $25+ takes 35 days.",
    },
    {
      question: "Why is my task pending?",
      answer: "Tasks may take 24-48 hours to verify. Make sure you completed all requirements and submitted proof if requested.",
    },
    {
      question: "How do I increase my daily streak?",
      answer: "Log in daily and complete at least one task or survey to maintain your streak.",
    },
  ];

  const handleEmailSubmit = () => {
    if (!emailSubject.trim() || !emailMessage.trim()) return;
    // Handle email submission
    alert("Support ticket submitted!");
    setEmailSubject("");
    setEmailMessage("");
  };

  return (
    <>
      <TopBar />
      <div className="min-h-screen bg-[#0A0C1A] pb-20 lg:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="lg:hidden p-2 rounded-lg bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Support Center</h1>
              <p className="text-sm text-[#9CA3AF]">We're here to help you</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === "chat"
                  ? "bg-emerald-500 text-white"
                  : "bg-[#1A1D2E] text-[#9CA3AF] hover:text-white border border-[#2A2D3E]"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Live Chat
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === "email"
                  ? "bg-emerald-500 text-white"
                  : "bg-[#1A1D2E] text-[#9CA3AF] hover:text-white border border-[#2A2D3E]"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email Support
            </button>
            <button
              onClick={() => setActiveTab("faq")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === "faq"
                  ? "bg-emerald-500 text-white"
                  : "bg-[#1A1D2E] text-[#9CA3AF] hover:text-white border border-[#2A2D3E]"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </button>
          </div>

          {/* Content */}
          <div className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6">
            {/* Live Chat Tab */}
            {activeTab === "chat" && (
              <div className="space-y-4">
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Start a Live Chat</h3>
                  <p className="text-[#9CA3AF] mb-6">Get instant help from our support team</p>
                  <button
                    onClick={() => router.push("/chat")}
                    className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
                  >
                    Open Chat
                  </button>
                </div>
              </div>
            )}

            {/* Email Support Tab */}
            {activeTab === "email" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-4">Send us an email</h3>
                
                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="What do you need help with?"
                    className="w-full px-4 py-3 rounded-lg bg-[#252840] border border-[#2A2D3E] text-white placeholder-[#9CA3AF] focus:outline-none focus:border-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                    Message
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-[#252840] border border-[#2A2D3E] text-white placeholder-[#9CA3AF] focus:outline-none focus:border-emerald-500/50 resize-none"
                  />
                </div>

                <button
                  onClick={handleEmailSubmit}
                  disabled={!emailSubject.trim() || !emailMessage.trim()}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-[#252840] disabled:cursor-not-allowed text-white font-semibold transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === "faq" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-4">Frequently Asked Questions</h3>
                
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-[#252840] border border-[#2A2D3E]"
                  >
                    <h4 className="font-semibold text-white mb-2">{faq.question}</h4>
                    <p className="text-sm text-[#9CA3AF]">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
