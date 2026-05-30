"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setProfile } from "@/store/userSlice";
import TopBar from "@/Components/Topbar";
import TickerBar from "./Shared/TickerBar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ─── Stat card icons ─── */
const StreakIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C12 2 7 8 7 13a5 5 0 0 0 10 0C17 8 12 2 12 2z" fill="#FF6B35" />
    <path d="M12 15c0 0-2 1.5-2 3a2 2 0 0 0 4 0c0-1.5-2-3-2-3z" fill="#FFB800" />
  </svg>
);

const BonusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill="#0AC07D" opacity="0.15" />
    <circle cx="12" cy="12" r="7" stroke="#0AC07D" strokeWidth="1.5" fill="none" />
    <path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4.5" stroke="#0AC07D" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const EarnedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill="#14A990" opacity="0.15" />
    <circle cx="12" cy="12" r="7" stroke="#14A990" strokeWidth="1.5" fill="none" />
    <path d="M12 7v10M9 9.5h4.5a1.5 1.5 0 0 1 0 3H10a1.5 1.5 0 0 0 0 3H15" stroke="#14A990" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const RankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L14.5 8.5L21 9.3L16.5 13.6L17.75 20L12 16.9L6.25 20L7.5 13.6L3 9.3L9.5 8.5L12 3Z" fill="#A78BFA" opacity="0.9" />
  </svg>
);

const TaskIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="3" width="14" height="18" rx="2" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
    <path d="M9 8h6M9 12h6M9 16h3" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ─── Stat card ─── */
function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-[#1E2F3F] bg-[#0C1320] p-5 shadow-[0_24px_80px_rgba(10,192,125,0.10)]">
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0CF69D]/8 to-transparent pointer-events-none" />
      <p className="relative text-[#8C9DB6] text-xs font-semibold mb-4 tracking-wide">{label}</p>
      <div className="relative flex items-center gap-2">
        {icon}
        <p className="text-white text-[28px] sm:text-[34px] font-semibold leading-none">{value}</p>
      </div>
      {hint && <p className="relative mt-3 text-[#7EE6CA] text-sm">{hint}</p>}
    </div>
  );
}

interface HomepageOffer {
  id: string;
  title: string;
  img: string;
  amount: string;
  desc: string;
  trackingUrl?: string;
}

const FALLBACK_OFFERS: HomepageOffer[] = [
  { id: "o1", title: "Farm Lobby",   img: "/img3.png", amount: "$0.8", desc: "Play for 5 Mins and earn up to $3" },
  { id: "o2", title: "Turbo Charge", img: "/img4.png", amount: "$0.8", desc: "Play for 5 Mins and earn up to $3" },
  { id: "o3", title: "Pres mark",    img: "/img5.png", amount: "$0.8", desc: "Play for 5 Mins and earn up to $3" },
];

function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function OfferCard({ title, img, amount, desc, trackingUrl }: { title: string; img: string; amount: string; desc: string; trackingUrl?: string }) {
  const router = useRouter();
  const handleClick = () => {
    if (trackingUrl) {
      window.open(trackingUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push("/earn");
    }
  };
  return (
    <div className="rounded-[16px] overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-300 bg-[#0C1120] border border-[#1E2133]">
      {/* Card top — full bg image + centred square icon */}
      <div className="relative h-[200px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px] brightness-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={title}
            className="w-[100px] h-[100px] rounded-[18px] object-cover shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-white text-[17px] font-bold truncate flex-1">{title}</h3>
          <span className="flex-shrink-0 text-sm font-bold px-3 py-1 rounded-full bg-[#0D1E18] border border-[#1A3D2B] text-[#0AC07D]">
            {amount}
          </span>
        </div>
        <p className="text-[#8C9DB6] text-[13px] leading-relaxed">{desc}</p>
        <button
          onClick={handleClick}
          className="w-full py-[11px] rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #0AC07D 0%, #0BBFA0 100%)",
            boxShadow: "0 8px 24px rgba(10,192,125,0.35)",
          }}
        >
          Play and earn
        </button>
      </div>
    </div>
  );
}

/* ─── Main component ─── */
const HOMEPAGEComponent = () => {
  const dispatch = useDispatch();
  const storeProfile = useSelector((s: RootState) => s.user.profile);
  const storeToken = useSelector((s: RootState) => s.user.token);

  const [stats, setStats] = useState<any>(null);
  const [streakDays, setStreakDays] = useState(0);
  const [dailyBonusCents, setDailyBonusCents] = useState(0);
  const [rank, setRank] = useState<number | null>(null);
  const [offers, setOffers] = useState<HomepageOffer[]>(FALLBACK_OFFERS);

  useEffect(() => {
    const token = storeToken || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) return;

    fetch(`${API}/api/v1/user/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d?.profile) dispatch(setProfile(d.profile));
        if (d?.stats) setStats(d.stats);
      })
      .catch(() => {});

    fetch(`${API}/api/v1/rewards/streaks`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.streakDays === "number") setStreakDays(d.streakDays);
        if (typeof d?.dailyBonusCents === "number") setDailyBonusCents(d.dailyBonusCents);
      })
      .catch(() => {});

    fetch(`${API}/api/v1/leaderboard/rank`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (typeof d?.rank === "number") setRank(d.rank); })
      .catch(() => {});

    // Fetch homepage offers from backend (admin-managed)
    fetch(`${API}/api/v1/offerwalls/premium?surface=home&limit=3`)
      .then((r) => r.json())
      .then((d) => {
        const raw: any[] = d?.offers || [];
        if (raw.length > 0) {
          setOffers(raw.map((o: any, i: number) => ({
            id: o._id || `api-${i}`,
            title: o.title || "Offer",
            img: o.imageUrl || `/img${3 + i}.png`,
            amount: o.rewardCents != null ? `$${(o.rewardCents / 100).toFixed(2)}` : "$0.00",
            desc: o.description || "Complete this offer and earn rewards",
            trackingUrl: o.trackingUrl || undefined,
          })));
        }
      })
      .catch(() => {});
  }, [dispatch, storeToken]);

  const lifetimeEarned =
    stats?.lifetimeEarningsCents != null
      ? `$${(stats.lifetimeEarningsCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "$0.00";

  const tasksCompleted = stats?.tasksCompleted ?? 0;
  const rankText = rank != null ? getOrdinal(rank) : "—";
  const bonusText = `$${(dailyBonusCents / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-[#0D0F1E]">
      <TopBar />
      <TickerBar />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-5 sm:py-8">
        {/* ── Hero banner ── */}
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

        {/* ── Stat cards ── */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-4 sm:mt-5">
          <StatCard label="Daily Streak" value={String(streakDays)} hint="Slightly higher than average" icon={<StreakIcon />} />
          <StatCard label="Daily Bonus" value={bonusText} hint="Slightly higher than average" icon={<BonusIcon />} />
          <StatCard label="Total Earned" value={lifetimeEarned} hint="Slightly higher than average" icon={<EarnedIcon />} />
          <StatCard label="Your Current rank" value={rankText} hint="Slightly higher than average" icon={<RankIcon />} />
          <StatCard label="Number of tasks" value={String(tasksCompleted)} hint="Slightly higher than average" icon={<TaskIcon />} />
        </section>

        {/* ── Offers available ── */}
        <section className="mt-8 sm:mt-10">
          <h2 className="text-white text-[20px] sm:text-[22px] font-bold mb-4 sm:mb-6">Offers available</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {offers.map((o) => (
              <OfferCard key={o.id} title={o.title} img={o.img} amount={o.amount} desc={o.desc} trackingUrl={o.trackingUrl} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HOMEPAGEComponent;
