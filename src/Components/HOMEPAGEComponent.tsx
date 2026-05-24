"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setProfile } from "@/store/userSlice";
import TopBar from "@/Components/Topbar";
import PageNavigation from "@/Components/Shared/PageNavigation";
import TickerBar from "./Shared/TickerBar";
import OfferWalls from "@/Components/HomePage/OfferWalls";
import FeaturedTask from "@/Components/HomePage/FeaturedTask";
import Footer from "@/Components/Shared/Footer";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[#1E2F3F] bg-[#0C1320] p-5 shadow-[0_24px_80px_rgba(10,192,125,0.16)]">
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0CF69D]/10 to-transparent pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <p className="text-[#8C9DB6] text-xs uppercase tracking-[0.18em] font-semibold">{label}</p>
        <div className="h-10 w-10 rounded-2xl bg-[#071B16] border border-[#0E3B2D] flex items-center justify-center text-[#0AF07D] font-bold shadow-[0_10px_24px_rgba(10,192,125,0.18)]">
          •
        </div>
      </div>
      <p className="relative z-10 text-white text-3xl sm:text-4xl font-semibold mt-5">{value}</p>
      {hint && (
        <p className="relative z-10 mt-2 text-[#7EE6CA] text-sm">{hint}</p>
      )}
    </div>
  );
}

const HOMEPAGEComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const storeProfile = useSelector((s: RootState) => s.user.profile);
  const storeToken = useSelector((s: RootState) => s.user.token);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [streakDays, setStreakDays] = useState<number>(0);

  useEffect(() => {
    const token =
      storeToken ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    setIsAuthenticated(Boolean(token));

    if (!token) return;

    fetch(`${API}/api/v1/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.profile) {
          dispatch(setProfile(data.profile));
        }
        if (data?.stats) {
          setStats(data.stats);
        }
      })
      .catch(() => {
        // ignore profile hydration errors for homepage shell
      });

    fetch(`${API}/api/v1/rewards/streaks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data?.streakDays === "number") {
          setStreakDays(data.streakDays);
        }
      })
      .catch(() => {
        // ignore streak fetch failures
      });
  }, [dispatch, storeToken]);

  const balanceDollars =
    storeProfile?.balanceCents != null
      ? `$${(storeProfile.balanceCents / 100).toFixed(2)}`
      : "$0.00";

  const lifetimeEarned =
    stats?.lifetimeEarningsCents != null
      ? `$${(stats.lifetimeEarningsCents / 100).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "$0.00";

  const tasksCompleted = stats?.tasksCompleted ?? 0;

  return (
    <div className="min-h-screen bg-[#0D0F1E]">
      <TopBar />
      <PageNavigation />
      <TickerBar />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-5 sm:py-8">
        <section className="relative h-[128px] sm:h-[145px] md:h-[156px] overflow-hidden rounded-[10px]">
          <Image
            src="/hero.png"
            alt="Welcome back"
            fill
            priority
            className="absolute inset-0 h-full w-full object-cover object-[center_44%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,133,114,0.62)_0%,rgba(14,171,148,0.54)_100%)]" />

          <div className="relative z-10 h-full px-4 flex flex-col items-center justify-center text-center text-white">
            <h1 className="text-[28px] sm:text-[42px] md:text-[50px] font-bold leading-[1.02] tracking-[-0.02em]">
              Welcome back
            </h1>
            <p className="mt-1 max-w-[560px] text-[11px] sm:text-[13px] md:text-[14px] leading-[1.3] text-[#E7FFFA]">
              Track your progress, view recent activities and manage your rewards from your personal dashboards
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-5">
          <StatCard label="Wallet Balance" value={balanceDollars} hint="Available now" />
          <StatCard label="Daily Streak" value={`${streakDays}`} hint="Keep earning daily" />
          <StatCard label="Total Earned" value={lifetimeEarned} hint="All-time earnings" />
          <StatCard label="Tasks Completed" value={`${tasksCompleted}`} hint="Completed tasks" />
        </section>

        <FeaturedTask
          title="Featured Tasks"
          subtitle="Premium tasks managed separately in admin"
          surface="home"
        />
        <OfferWalls showViewAll onViewAll={() => router.push("/earn")} />
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
};

export default HOMEPAGEComponent;
