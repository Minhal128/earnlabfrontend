"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Twitter, Disc } from "lucide-react";
import TopBar from "@/Components/Topbar";
import TickerBar from "@/Components/Shared/TickerBar";
import Footer from "@/Components/Shared/Footer";

interface VerificationCardProps {
  title: string;
  subtitle: string;
  reward: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick?: () => void;
}

const VerificationCard: React.FC<VerificationCardProps> = ({ title, subtitle, reward, icon, buttonText, onClick }) => (
  <div className="relative overflow-hidden rounded-[24px] border border-[#1E2F3F] bg-[#0C1320] p-7 flex items-center justify-between group transition-all hover:translate-y-[-2px]">
    {/* Subtle Pattern Overlay */}
    <div 
      className="absolute inset-0 opacity-[0.05] pointer-events-none" 
      style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
    />
    
    <div className="relative z-10 flex items-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-[#15242C] border border-[#23353E] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="text-white text-[20px] font-bold leading-tight">{title}</h3>
        <p className="text-[#8C9DB6] text-[13px] font-medium mt-1.5">
          {subtitle} and earn <span className="text-[#0AC07D] font-bold">{reward}</span>
        </p>
      </div>
    </div>

    <button
      onClick={onClick}
      className="relative z-10 px-7 py-3 rounded-xl text-white font-bold text-[15px] leading-none transition-all hover:brightness-110 active:scale-[0.98]"
      style={{ 
        background: "linear-gradient(135deg, #0AC07D 0%, #14A290 100%)",
        boxShadow: "0 8px 24px rgba(20, 169, 144, 0.25)"
      }}
    >
      {buttonText}
    </button>
  </div>
);

export default function VerificationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0D0F1E] text-white flex flex-col">
      <TopBar />
      <TickerBar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-10 py-10">
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-[#15242C] border border-[#23353E] flex items-center justify-center text-white hover:bg-[#1E2F3F] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Verification</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <VerificationCard
            title="Telegram"
            subtitle="Join our Telegram"
            reward="$0.05"
            buttonText="Join Now"
            icon={<Send size={32} className="fill-white stroke-none" />}
          />
          <VerificationCard
            title="Follow on X"
            subtitle="Follow us on X"
            reward="$0.05"
            buttonText="Follow"
            icon={<Twitter size={32} className="fill-white stroke-none" />}
          />
          <VerificationCard
            title="Discord"
            subtitle="Join us on Discord"
            reward="$0.05"
            buttonText="Join"
            icon={<Disc size={32} className="fill-white stroke-none" />}
          />
        </div>
      </main>

      <Footer />

      {/* Floating Support Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button className="w-16 h-16 rounded-full bg-[#14A990] flex items-center justify-center text-white shadow-2xl shadow-[#14A990]/40 hover:scale-110 transition-transform">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><circle cx="12" cy="11" r="3"></circle><path d="M7 16c0-2 2-3 5-3s5 1 5 3"></path></svg>
        </button>
      </div>
    </div>
  );
}
