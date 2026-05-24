"use client";

import React from "react";
import TopBar from "@/Components/Topbar";
import OffersSurveysRewardsDisclaimer from "@/Components/Shared/OffersSurveysRewardsDisclaimer";
import TickerBar from "../../Components/Shared/TickerBar";
import BonusSection from "@/Components/HomePage/BonusSection";
import Footer from "@/Components/Shared/Footer";

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-[#0D0F1E] flex flex-col">
      <TopBar />
      <TickerBar />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-10 w-full">
        <BonusSection />
        <OffersSurveysRewardsDisclaimer className="mt-6" />
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
