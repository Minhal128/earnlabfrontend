"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Book, Video, FileText, MessageCircle } from "lucide-react";
import TopBar from "@/Components/Topbar";

export default function HelpPage() {
  const router = useRouter();

  const helpCategories = [
    {
      title: "Getting Started",
      icon: <Book className="w-6 h-6" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      articles: [
        "How to create an account",
        "Completing your first task",
        "Understanding rewards",
        "Setting up payment methods",
      ],
    },
    {
      title: "Video Tutorials",
      icon: <Video className="w-6 h-6" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      articles: [
        "Platform walkthrough",
        "Maximizing your earnings",
        "Withdrawal process explained",
        "Tips and tricks",
      ],
    },
    {
      title: "Account & Billing",
      icon: <FileText className="w-6 h-6" />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      articles: [
        "Managing your account",
        "Payment methods",
        "Withdrawal limits",
        "Account verification",
      ],
    },
    {
      title: "Contact Support",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      articles: [
        "Live chat support",
        "Email support",
        "Report an issue",
        "Feature requests",
      ],
    },
  ];

  return (
    <>
      <TopBar />
      <div className="min-h-screen bg-[#0A0C1A] pb-20 lg:pb-0">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="lg:hidden p-2 rounded-lg bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Help Center</h1>
              <p className="text-sm text-[#9CA3AF]">Find answers and get support</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full px-6 py-4 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E] text-white placeholder-[#9CA3AF] focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Help Categories */}
          <div className="grid md:grid-cols-2 gap-6">
            {helpCategories.map((category, index) => (
              <div key={index} className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${category.bgColor}`}>
                    <div className={category.color}>{category.icon}</div>
                  </div>
                  <h2 className="text-xl font-bold text-white">{category.title}</h2>
                </div>

                <div className="space-y-2">
                  {category.articles.map((article, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-4 py-3 rounded-lg bg-[#252840] hover:bg-[#2A2D3E] text-sm text-[#9CA3AF] hover:text-white transition-colors"
                    >
                      {article}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push("/chat")}
              className="flex items-center justify-center gap-3 p-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-white" />
              <span className="text-white font-semibold">Start Live Chat</span>
            </button>
            <button
              onClick={() => router.push("/support")}
              className="flex items-center justify-center gap-3 p-6 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors"
            >
              <FileText className="w-6 h-6 text-emerald-400" />
              <span className="text-white font-semibold">Browse All Articles</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
