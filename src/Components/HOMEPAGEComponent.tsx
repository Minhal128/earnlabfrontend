"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setProfile } from "@/store/userSlice";
import TopBar from "@/Components/Topbar";
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

  const [stats, setStats] = useState<any>(null);
  const [streakDays, setStreakDays] = useState<number>(0);

  useEffect(() => {
    const token =
      storeToken ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

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

  const welcomeName = storeProfile?.displayName || storeProfile?.username;
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
      <TickerBar />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-5 sm:py-8">
        <section className="relative overflow-hidden rounded-2xl border border-[#26304A] min-h-[170px] sm:min-h-[220px]">
          <img src="/assets/bg.png" alt="Dashboard background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#19D3B1]/35 via-[#0EA5E9]/20 to-[#0D0F1E]/70" />

          <div className="relative z-10 p-5 sm:p-8 md:p-10 text-white">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Welcome Back{welcomeName ? `, ${welcomeName}` : ""}
            </h1>
            <p className="text-[#D1D5DB] mt-2 text-sm sm:text-base max-w-[620px]">
              Track your progress, check your latest activity, and continue earning from premium tasks and offerwalls.
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
