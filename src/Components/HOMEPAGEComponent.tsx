"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setProfile } from "@/store/userSlice";
import TopBar from "@/Components/Topbar";
import PageNavigation from "@/Components/Shared/PageNavigation";
import TickerBar from "./Shared/TickerBar";
import OfferWalls from "@/Components/HomePage/OfferWalls";
import FeaturedTask from "@/Components/HomePage/FeaturedTask";

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
    <div className="rounded-xl border border-[#30334A] bg-[#151728] p-3 sm:p-4 min-h-[110px]">
      <p className="text-[#8C8FA8] text-xs sm:text-sm font-medium">{label}</p>
      <p className="text-white text-xl sm:text-2xl font-bold mt-1">{value}</p>
      {hint && <p className="text-[#6B6E8A] text-xs mt-2">{hint}</p>}
    </div>
  );
}

const HOMEPAGEComponent = () => {
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
        {isAuthenticated && (
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
        )}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-5">
          <StatCard label="Wallet Balance" value={balanceDollars} hint="Available now" />
          <StatCard label="Daily Streak" value={`${streakDays}`} hint="Keep earning daily" />
          <StatCard label="Total Earned" value={lifetimeEarned} hint="All-time earnings" />
          <StatCard label="Tasks Completed" value={`${tasksCompleted}`} hint="Completed tasks" />
        </section>

        <FeaturedTask
          title="Offers available"
          subtitle="Premium tasks managed separately in admin"
          surface="home"
        />
        <OfferWalls />
      </main>
    </div>
  );
};

export default HOMEPAGEComponent;
