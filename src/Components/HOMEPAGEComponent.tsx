"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setProfile } from "@/store/userSlice";
import TopBar from "@/Components/Topbar";
import OfferWalls from "./HomePage/OfferWalls";
import FeaturedTask from "./HomePage/FeaturedTask";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ── Ticker bar item ── */
function TickerItem({ icon, label, value, amount }: { icon: React.ReactNode; label: string; value: string; amount: string }) {
  return (
    <div className="flex-shrink-0 flex flex-row items-center gap-[10px] bg-[#181A2C] px-3 py-2.5 rounded-[10px] h-[80px] min-w-[220px]">
      <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div className="flex flex-col justify-center gap-2">
        <p className="text-[13px] font-medium text-[#6B6E8A] leading-5 m-0">{label}</p>
        <span className="text-[15px] font-medium text-[#B3B6C7] leading-5">{value}</span>
      </div>
      <h2 className="text-[20px] font-bold tracking-[0.48px] text-[#0AC07D] ml-auto pl-2">{amount}</h2>
    </div>
  );
}

function WorldcoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="-2.1184 -1.2247 51.061 51.4991" preserveAspectRatio="none">
      <path d="M22.8623 17.5971C22.7213 17.7382 22.5522 17.8229 22.3548 17.8511C22.1292 17.8511 21.9037 17.7382 21.7345 17.5689C19.3661 14.4366 17.6462 1.48425 22.8059 0.157973C28.4731 -1.22474 30.8133 6.81758 31.9411 10.7118C32.0256 10.994 32.082 11.2197 32.1666 11.4455C29.6291 9.94986 26.6968 9.24439 23.7645 9.4137C23.4262 12.4613 23.2006 15.3961 23.0879 17.1174C23.0597 17.2867 22.9751 17.456 22.8623 17.5971ZM28.5859 18.9234C28.5013 18.8387 28.4449 18.7259 28.4167 18.613C28.3885 18.5001 28.3885 18.359 28.4167 18.2462C29.3189 14.4366 37.5237 4.33434 42.5705 8.14386C47.3073 11.7276 42.4578 18.6694 40.174 21.971C40.033 22.1968 39.892 22.3943 39.751 22.5636C39.2717 19.6571 37.9748 16.9481 36.0575 14.7188C33.9711 16.0451 32.0256 17.3714 30.6159 18.3308C30.2494 18.5848 29.911 18.8105 29.6009 19.0363L29.5727 19.0645C29.5163 19.0927 29.4881 19.1209 29.4317 19.1209L29.4035 19.1209C29.2907 19.1492 29.178 19.1774 29.0652 19.1774C29.037 19.1774 29.0088 19.1774 28.9806 19.1492L28.9524 19.1492C28.8114 19.0927 28.6986 19.0081 28.5859 18.9234ZM32.1102 23.9746L31.8001 24.2003L31.6309 24.5389C31.6309 24.5671 31.6309 24.5954 31.6309 24.6236L31.6309 24.68C31.6309 24.8211 31.6873 24.9622 31.7437 25.1033C31.8565 25.2726 32.0256 25.3855 32.223 25.4137L33.0407 25.6677L33.097 25.6959C34.7605 26.2038 37.1571 26.9375 39.5819 27.7841C39.0744 30.6624 37.7492 33.3432 35.7756 35.4878C35.9729 35.4878 36.1985 35.4596 36.424 35.4596C40.3995 35.2338 48.9426 34.7541 48.8016 28.7999C48.6324 23.4666 35.6064 22.3096 32.1102 23.9746ZM29.7419 30.352C29.7982 30.3802 29.8546 30.3802 29.8828 30.4084C33.4072 32.1015 41.4427 42.486 36.565 46.4931C31.9693 50.2744 26.3021 43.897 23.6518 40.934C23.5108 40.7647 23.3416 40.5954 23.2006 40.4261C26.1047 40.6236 29.0088 40.0028 31.5745 38.6201C30.6159 35.7982 29.6009 33.2303 28.9524 31.6218L28.8678 31.3961C28.7832 31.2268 28.7832 31.0292 28.8396 30.8317L28.8678 30.8035L28.896 30.7753L28.9242 30.747C29.0088 30.6059 29.1216 30.5213 29.2343 30.4649C29.3471 30.4084 29.4599 30.3802 29.5727 30.3802C29.6009 30.3238 29.6573 30.352 29.7419 30.352ZM23.4826 32.6941C23.4544 32.5813 23.398 32.4684 23.3134 32.3837C23.257 32.2991 23.1442 32.2144 23.0315 32.1862C22.8623 32.1015 22.6649 32.1015 22.4958 32.1862C22.3266 32.2426 22.1574 32.3555 22.0728 32.5248C21.227 33.9922 19.7609 36.5319 18.1256 39.1562C15.4188 38.0275 13.1351 36.1368 11.4998 33.71L11.4152 34.1333L11.387 34.3026C10.6821 38.225 9.18778 46.7188 15.0523 47.9322C20.2684 48.9481 24.272 36.4754 23.4826 32.6941ZM17.9 28.7999C17.8718 28.9128 17.8154 29.0257 17.7308 29.1104C15.2215 32.1298 2.9849 36.7294 0.560136 32.0169C-2.11838 26.6553 5.49424 22.479 8.93402 20.5883C9.10319 20.5037 9.27236 20.3908 9.44153 20.3061C8.59568 23.0998 8.56749 26.091 9.32875 28.9128C12.402 28.5742 15.2779 28.1227 17.026 27.8405C17.2233 27.8123 17.3925 27.8687 17.5617 27.9816C17.7308 28.0663 17.8436 28.2356 17.9 28.4049C17.9282 28.546 17.9282 28.6589 17.9 28.7999ZM16.9132 22.3661C17.026 22.3943 17.1669 22.3661 17.2797 22.3096C17.3925 22.2532 17.4771 22.1403 17.5335 22.0275C17.6462 21.8864 17.7026 21.6888 17.6744 21.5195C17.6462 21.322 17.5617 21.1527 17.4207 21.0116C16.1801 19.8828 14.0373 17.9075 11.8945 15.7065C13.5862 13.3079 15.9546 11.4737 18.6895 10.4296L18.1819 10.232C14.5448 8.6518 6.50926 5.23734 4.02811 10.7118C1.8571 15.5936 13.0223 22.3097 16.9132 22.3661Z" fill="rgb(255,255,255)" fillRule="evenodd" />
    </svg>
  );
}

function ToroxIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="8" fill="#3B2F6E" />
      <path d="M24 8L36 20L24 40L12 20L24 8Z" fill="#8B5CF6" />
      <path d="M12 20L24 28L36 20" stroke="#C4B5FD" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function OfferwallIcon() {
  return (
    <div className="w-9 h-10 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="40" viewBox="0 0 36 40" fill="none">
        <path d="M6 4L6 12L30 12L30 4L34.014 4C35.11 4 36 4.89 36 5.986L36 38.014C36 39.11 35.11 40 34.014 40L1.986 40C0.89 40 0 39.11 0 38.014L0 5.986C0 4.89 0.89 4 1.986 4L6 4ZM12 30L8 30L8 34L12 34L12 30ZM12 24L8 24L8 28L12 28L12 24ZM12 18L8 18L8 22L12 22L12 18ZM26 0L26 8L10 8L10 0L26 0Z" fill="white" />
      </svg>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex-1 min-w-[140px] flex flex-col gap-2 bg-[#151728] border border-[#30334A] px-3 py-3 rounded-[10px]">
      <p className="text-[13px] font-bold text-[#B3B6C7] leading-[18px] m-0">{label}</p>
      <div className="flex flex-row items-center gap-1">
        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">{icon}</div>
        <h2 className="text-[20px] font-semibold text-white leading-[18px] m-0 ml-1">{value}</h2>
      </div>
      <div className="mt-1 border-t border-[#24384C] pt-2">
        <p className="text-[12px] font-medium text-[#A5ADB1] leading-[18px] m-0">Slightly higher than average</p>
      </div>
    </div>
  );
}

function OfferCard({ title, img, subtitle, amount }: { title: string; img: string; subtitle: string; amount: string }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col bg-[#151728] border border-[#1E2133] rounded-[15px] overflow-hidden">
      <div className="relative w-full h-[220px] overflow-hidden">
        <img src={img} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#11132480] backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={img} alt={title} className="w-[120px] h-[120px] rounded-[10px] object-cover shadow-lg" />
        </div>
      </div>
      <div className="flex flex-col gap-4 px-4 py-4">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-1">
            <h3 className="text-[22px] font-semibold tracking-[-0.96px] text-white leading-tight m-0">{title}</h3>
            <p className="text-[13px] font-bold text-[#8C8FA8] leading-[18px] m-0">{subtitle}</p>
          </div>
          <div className="flex items-center justify-center bg-[#1E2133] px-3 py-2 rounded-full">
            <span className="text-[17px] font-bold tracking-[0.4px] text-[#0AC07D]">{amount}</span>
          </div>
        </div>
        <button className="w-full flex items-center justify-center py-3 rounded-full bg-[#0AC07D] hover:bg-[#08a86c] transition-colors shadow-[0px_9px_24px_rgba(20,169,144,0.3)]">
          <span className="text-[15px] font-bold text-white">Play and earn</span>
        </button>
      </div>
    </div>
  );
}

function TrustStars() {
  return (
    <div className="flex gap-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="w-[34px] h-[34px] bg-[#00B67A] flex items-center justify-center">
          <span className="text-white text-lg">★</span>
        </div>
      ))}
      <div className="relative w-[34px] h-[34px] flex items-center justify-center">
        <div className="absolute left-0 top-0 w-[17px] h-[34px] bg-[#00B67A]" />
        <div className="absolute right-0 top-0 w-[17px] h-[34px] bg-[#30334A]" />
        <span className="relative z-10 text-white text-lg">★</span>
      </div>
    </div>
  );
}

const HOMEPAGEComponent = () => {
  const storeProfile = useSelector((s: RootState) => s.user.profile);
  const storeToken = useSelector((s: RootState) => s.user.token);
  const dispatch = useDispatch();

  const [stats, setStats] = useState<any>(null);
  const [feedEvents, setFeedEvents] = useState<any[]>([]);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [premiumOffers, setPremiumOffers] = useState<any[]>([]);

  useEffect(() => {
    // Public: fetch live feed events (no auth required)
    fetch(`${API}/api/v1/feed/activity`)
      .then((r) => r.json())
      .then((data) => { if (data?.events) setFeedEvents(data.events); })
      .catch(() => {});

    // Public: fetch premium offers for the offers section
    fetch(`${API}/api/v1/offerwalls/premium?limit=3`)
      .then((r) => r.json())
      .then((data) => { if (data?.offers) setPremiumOffers(data.offers); })
      .catch(() => {});

    // Auth-required data
    const token =
      storeToken ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) return;

    // Profile + stats
    fetch(`${API}/api/v1/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.profile) {
          dispatch(setProfile(data.profile));
        }
        if (data?.stats) setStats(data.stats);
      })
      .catch(() => {});

    // Streak data
    fetch(`${API}/api/v1/rewards/streaks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data?.streakDays === "number") setStreakDays(data.streakDays);
      })
      .catch(() => {});
  }, [storeToken]);

  // Derive display values
  const profile = storeProfile;
  const balanceDollars =
    profile?.balanceCents != null
      ? (profile.balanceCents / 100).toFixed(2)
      : "0.00";
  const userInitial = (
    profile?.displayName ||
    profile?.username ||
    "U"
  )[0].toUpperCase();
  const welcomeName = profile?.displayName || profile?.username;

  const lifetimeEarned =
    stats?.lifetimeEarningsCents != null
      ? `$${(stats.lifetimeEarningsCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      : "$0";
  const tasksCompleted: number = stats?.tasksCompleted ?? 0;

  // Build ticker items from live feed events (fall back to static if none)
  const STATIC_TICKER = [
    { icon: <WorldcoinIcon />, label: "User withdrew", value: "Worldcoin", amount: "$3.50" },
    { icon: <OfferwallIcon />, label: "User earned", value: "Netflix", amount: "$15.00" },
    { icon: <ToroxIcon />, label: "User earned", value: "Tapjoy", amount: "$2.20" },
    { icon: <WorldcoinIcon />, label: "User withdrew", value: "PayPal", amount: "$10.00" },
    { icon: <OfferwallIcon />, label: "User earned", value: "Ayestudios", amount: "$8.40" },
    { icon: <ToroxIcon />, label: "User earned", value: "RevU", amount: "$1.15" },
    { icon: <WorldcoinIcon />, label: "User withdrew", value: "Bitcoin", amount: "$42.50" },
    { icon: <WorldcoinIcon />, label: "User withdrew", value: "Ethereum", amount: "$20.00" },
    { icon: <OfferwallIcon />, label: "User earned", value: "Monopoly", amount: "$5.80" },
    { icon: <ToroxIcon />, label: "User earned", value: "Coin Master", amount: "$12.50" },
  ];
let baseTickerItems =
      feedEvents.length > 0
        ? feedEvents.slice(0, 8).map((ev: any) => {
            const isWithdrawal = ev.type === "withdrawal";
            const amountStr = `$${((ev.amountCents || 0) / 100).toFixed(2)}`;
            // Try to extract the platform/source from the text
            const fromMatch = ev.text?.match(/from (.+)$/i);
            const value = fromMatch
              ? fromMatch[1]
              : isWithdrawal
              ? "Withdrawal"
              : "Offer";
            return {
              icon: isWithdrawal ? <WorldcoinIcon /> : <OfferwallIcon />,
              label: isWithdrawal ? "User withdrew" : "User earned",
              value,
              amount: amountStr,
            };
          })
        : STATIC_TICKER;

    if (baseTickerItems.length < 6) {
      baseTickerItems = [...baseTickerItems, ...STATIC_TICKER];
    }
    const tickerItems = [...baseTickerItems, ...baseTickerItems, ...baseTickerItems, ...baseTickerItems];

  // Build offers — use live premium offers if available, else static fallback
  const STATIC_OFFERS = [
    { title: "Farm Lobby", img: "/img3.png", subtitle: "Play for 5 Mins and earn up to $3", amount: "$0.80" },
    { title: "Turbo Charge", img: "/img4.png", subtitle: "Play for 5 Mins and earn up to $3", amount: "$0.80" },
    { title: "Pres mark", img: "/img5.png", subtitle: "Play for 5 Mins and earn up to $3", amount: "$0.80" },
  ];
  const offerCards =
    premiumOffers.length > 0
      ? premiumOffers.slice(0, 3).map((o: any) => ({
          title: o.title || "Offer",
          img: o.imageUrl || "/img3.png",
          subtitle: o.description || "Complete offer and earn",
          amount: `$${((o.rewardCents || 0) / 100).toFixed(2)}`,
        }))
      : STATIC_OFFERS;

  return (
    <div className="w-full min-h-screen bg-[#0D0F1E]">
      <TopBar />

      {/* Ticker bar */}
        <div className="w-full bg-[#0D0F1E] overflow-hidden border-b border-[#1E2133] pointer-events-none">
          <div className="flex animate-scroll-left flex-row gap-[15px] px-4 py-2 sm:py-3 w-max">
            {tickerItems.map((item, i) => (
              <TickerItem key={i} icon={item.icon} label={item.label} value={item.value} amount={item.amount} />
            ))}
        </div>
      </div>

      {/* Hero banner */}
      <div className="mx-3 sm:mx-4 md:mx-8 lg:mx-16 my-3 sm:my-4 relative overflow-hidden rounded-[12px] sm:rounded-[15px] min-h-[180px] sm:min-h-[220px]">
        <img src="/img2.png" alt="hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(137,247,229,0.43), rgba(0,122,102,0.85))" }} />
        <div className="relative z-10 flex flex-col items-center justify-center py-8 sm:py-10 md:py-14 px-4 sm:px-6 text-center">
          <h1 className="text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] font-semibold tracking-[-1.2px] sm:tracking-[-1.8px] text-white leading-tight m-0">
            Welcome back{welcomeName ? `, ${welcomeName}` : ""}
          </h1>
          <p className="mt-2 sm:mt-3 text-[14px] sm:text-[16px] md:text-[18px] font-medium text-[#F0F4F8] max-w-[520px] leading-5 sm:leading-6 m-0">
            Track your progress, view recent activities and manage your rewards from your personal dashboards
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="mx-3 sm:mx-4 md:mx-8 lg:mx-16 my-3 sm:my-4 flex flex-row flex-wrap gap-2 sm:gap-3">
        <StatCard label="Daily Streak" value={streakDays.toLocaleString()} icon={
          <svg width="17" height="20" viewBox="0 0 17 19.4465" fill="none"><path d="M12 15.8905C12 16.269 13.4367 17.7912 13.7414 17.5666C15.5638 16.2229 17 14.0238 17 10.5575C17 5.26646 13.127 1.74246 10.342 0.123464C9.723 -0.236536 9 0.236464 9 0.951464L9 2.77946C9 4.22146 8.394 6.85346 6.71 7.94846C5.85 8.50746 4.92 7.67046 4.816 6.65046L4.73 5.81246C4.63 4.83846 3.638 4.24746 2.86 4.84146C1.461 5.90646 0 7.77646 0 10.5565C0 17.6675 5.289 19.4465 7.933 19.4465C7.9764 19.4465 7.98069 19.372 7.9381 19.3636C6.65268 19.1098 5 18.2087 5 15.8905C5 13.8405 6.495 12.4555 7.631 11.7805C7.937 11.6005 8.294 11.8355 8.294 12.1905L8.294 12.7805C8.294 13.2305 8.469 13.9355 8.884 14.4175C9.354 14.9635 10.043 14.3915 10.098 13.6735C10.116 13.4475 10.344 13.3035 10.54 13.4175C11.181 13.7925 12 14.5925 12 15.8905Z" fill="#099F86"/></svg>
        } />
        <StatCard label="Daily Bonus" value="$0.10" icon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9.25 0C5.031 0.004 2.849 0.08 1.464 1.464C0.08 2.85 0.004 5.031 0 9.25L4.914 9.25C4.555 8.801 4.297 8.28 4.157 7.722C3.62 5.57 5.57 3.62 7.722 4.157C8.294 4.3 8.812 4.563 9.25 4.914L9.25 0ZM0 10.75C0.004 14.968 0.08 17.15 1.464 18.535C2.85 19.92 5.031 19.995 9.25 20L9.25 12.123C8.856 12.913 8.249 13.576 7.498 14.04C6.748 14.504 5.883 14.75 5 14.75C4.801 14.75 4.61 14.671 4.47 14.53C4.329 14.39 4.25 14.199 4.25 14C4.25 13.801 4.329 13.61 4.47 13.47C4.61 13.329 4.801 13.25 5 13.25C5.732 13.25 6.442 13.003 7.016 12.55C7.59 12.096 7.994 11.462 8.163 10.75L0 10.75ZM10.75 20C14.968 19.995 17.15 19.92 18.535 18.535C19.92 17.151 19.995 14.968 20 10.75L11.837 10.75C12.006 11.462 12.41 12.096 12.984 12.55C13.558 13.003 14.268 13.25 15 13.25C15.199 13.25 15.39 13.329 15.53 13.47C15.671 13.61 15.75 13.801 15.75 14C15.75 14.199 15.671 14.39 15.53 14.53C15.39 14.671 15.199 14.75 15 14.75C14.118 14.75 13.252 14.504 12.502 14.04C11.751 13.576 11.144 12.913 10.75 12.123L10.75 20ZM20 9.25C19.995 5.031 19.92 2.849 18.535 1.464C17.151 0.08 14.968 0.004 10.75 0L10.75 4.914C11.199 4.555 11.72 4.297 12.277 4.157C14.43 3.619 16.381 5.569 15.842 7.722C15.703 8.28 15.445 8.801 15.086 9.25L20 9.25Z" fill="#099F86"/></svg>
        } />
        <StatCard label="Total Earned" value={lifetimeEarned} icon={
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 13C8.45 13 7.979 12.804 7.588 12.413C7.197 12.022 7.001 11.551 7 11C6.999 10.449 7.195 9.979 7.588 9.588C7.981 9.197 8.451 9.001 9 9C9.549 8.999 10.02 9.195 10.413 9.588C10.806 9.981 11.002 10.452 11 11C10.998 11.548 10.802 12.019 10.413 12.413C10.024 12.807 9.553 13.003 9 13ZM4.375 4L13.625 4L14.9 1.45C15.067 1.117 15.054 0.792 14.862 0.475C14.67 0.158 14.383 0 14 0L4 0C3.617 0 3.329 0.158 3.138 0.475C2.947 0.792 2.934 1.117 3.1 1.45L4.375 4ZM5.4 18L12.6 18C14.1 18 15.375 17.479 16.425 16.438C17.475 15.397 18 14.117 18 12.6C18 11.967 17.892 11.35 17.675 10.75C17.458 10.15 17.15 9.608 16.75 9.125L14.15 6L3.85 6L1.25 9.125C0.85 9.608 0.542 10.15 0.325 10.75C0.108 11.35 0 11.967 0 12.6C0 14.117 0.521 15.396 1.563 16.438C2.605 17.48 3.884 18 5.4 18Z" fill="#099F86"/></svg>
        } />
        <StatCard label="Your Current rank" value="—" icon={
          <svg width="24" height="20" viewBox="0 0 24 19.2014" fill="none"><path d="M13.2709 2.03017C13.2688 2.03017 13.2669 2.02901 13.266 2.02716L12.3825 0.237675C12.2363 -0.073575 11.7788 -0.084825 11.6175 0.237675C11.0685 1.34963 9.99879 2.13539 8.77125 2.31142C8.4225 2.36392 8.2725 2.79518 8.53125 3.05393C9.42035 3.91963 9.82999 5.17234 9.61875 6.39517C9.56625 6.74392 9.92625 7.01392 10.2487 6.85267C11.3403 6.27547 12.6611 6.2649 13.755 6.83767C14.0775 6.99892 14.4413 6.72892 14.385 6.38017C14.1744 5.16086 14.5813 3.91231 15.4725 3.05393C15.7275 2.79892 15.5813 2.36767 15.2325 2.31142L13.2716 2.03023C13.2714 2.03019 13.2711 2.03017 13.2709 2.03017ZM9.6 9.60142C8.93625 9.60142 8.4 10.1377 8.4 10.8014L8.4 18.0014C8.4 18.6652 8.93625 19.2014 9.6 19.2014L14.4 19.2014C15.0638 19.2014 15.6 18.6652 15.6 18.0014L15.6 10.8014C15.6 10.1377 15.0638 9.60142 14.4 9.60142L9.6 9.60142ZM1.2 12.0014C0.53625 12.0014 0 12.5377 0 13.2014L0 18.0014C0 18.6652 0.53625 19.2014 1.2 19.2014L6 19.2014C6.66375 19.2014 7.2 18.6652 7.2 18.0014L7.2 13.2014C7.2 12.5377 6.66375 12.0014 6 12.0014L1.2 12.0014ZM16.8 15.6014L16.8 18.0014C16.8 18.6652 17.3363 19.2014 18 19.2014L22.8 19.2014C23.4638 19.2014 24 18.6652 24 18.0014L24 15.6014C24 14.9377 23.4638 14.4014 22.8 14.4014L18 14.4014C17.3363 14.4014 16.8 14.9377 16.8 15.6014Z" fill="#099F86"/></svg>
        } />
        <StatCard label="Number of tasks" value={tasksCompleted.toString()} icon={
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none"><path d="M3.416 1C3.141 1.631 3 2.312 3 3C3 3.53 3.211 4.039 3.586 4.414C3.961 4.789 4.47 5 5 5L11 5C11.53 5 12.039 4.789 12.414 4.414C12.789 4.039 13 3.53 13 3C13 2.289 12.852 1.612 12.584 1L14 1C14.53 1 15.039 1.211 15.414 1.586C15.789 1.961 16 2.47 16 3L16 18C16 18.53 15.789 19.039 15.414 19.414C15.039 19.789 14.53 20 14 20L2 20C1.47 20 0.961 19.789 0.586 19.414C0.211 19.039 0 18.53 0 18L0 3C0 2.47 0.211 1.961 0.586 1.586C0.961 1.211 1.47 1 2 1L3.416 1ZM8 12L5 12C4.735 12 4.48 12.105 4.293 12.293C4.105 12.48 4 12.735 4 13C4 13.265 4.105 13.52 4.293 13.707C4.48 13.895 4.735 14 5 14L8 14C8.265 14 8.52 13.895 8.707 13.707C8.895 13.52 9 13.265 9 13C9 12.735 8.895 12.48 8.707 12.293C8.52 12.105 8.265 12 8 12ZM11 8L5 8C4.735 8 4.48 8.105 4.293 8.293C4.105 8.48 4 8.735 4 9C4 9.265 4.105 9.52 4.293 9.707C4.48 9.895 4.735 10 5 10L11 10C11.265 10 11.52 9.895 11.707 9.707C11.895 9.52 12 9.265 12 9C12 8.735 11.895 8.48 11.707 8.293C11.52 8.105 11.265 8 11 8ZM8 0C8.422 0 8.839 0.089 9.225 0.261C9.61 0.434 9.955 0.685 10.236 1C10.664 1.478 10.94 2.093 10.991 2.772L11 3L5 3C5 2.275 5.257 1.61 5.685 1.092L5.764 1C6.314 0.386 7.112 0 8 0Z" fill="#099F86" fillRule="evenodd"/></svg>
        } />
      </div>

      {/* Featured Games */}
      <FeaturedTask />

      {/* Offer Walls */}
      <OfferWalls />

      {/* Footer */}
      <footer className="mx-3 sm:mx-4 md:mx-8 lg:mx-16 mt-8 sm:mt-10 md:mt-12 mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row gap-10 pb-8">
          <div className="flex flex-col gap-5 flex-shrink-0 max-w-[420px]">
            <img src="/img1.png" alt="Lab Wards" className="h-12 w-auto object-contain object-left" />
            <div className="flex flex-col gap-1">
              <TrustStars />
              <p className="text-[12px] sm:text-[14px] font-bold text-[#B3B6C7] leading-6 mt-1 m-0 break-words whitespace-normal">TrustScore 4.5  |  200 reviews</p>
            </div>
            <p className="text-[16px] font-semibold text-white leading-7 m-0">
              Sign up today and grab your instant bonus. Every task completed puts money in your pocket.
            </p>
          </div>
          <div className="flex flex-row flex-wrap gap-10 lg:gap-16 flex-1 lg:justify-end">
            <div className="flex flex-col gap-4">
              <span className="text-[17px] font-bold text-white leading-[30px]">Support</span>
              <span className="text-[15px] font-medium text-[#B3B6C7] leading-[27px]">Contact Us</span>
              <span className="text-[15px] font-medium text-[#B3B6C7] leading-[27px]">FAQ</span>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[17px] font-bold text-white leading-[30px]">Features</span>
              <span className="text-[15px] font-medium text-[#B3B6C7] leading-[27px]">Games</span>
              <span className="text-[15px] font-medium text-[#B3B6C7] leading-[27px]">Rewards</span>
              <span className="text-[15px] font-medium text-[#B3B6C7] leading-[27px]">Tasks</span>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[17px] font-bold text-white leading-[30px]">Connect With Us</span>
              <div className="flex flex-row gap-3">
                <button className="w-[52px] h-[52px] flex items-center justify-center bg-[#1E2133] rounded-[8px]">
                  <svg width="24" height="23" viewBox="0 0 24 22.823" fill="none"><path d="M17.227 16.081L19.417 22.823L12.004 17.435L17.227 16.081ZM24 8.721L14.835 8.721L12.005 0L9.165 8.723L0 8.711L7.422 14.108L4.582 22.822L12.004 17.435L16.587 14.108L24 8.721Z" fill="white"/></svg>
                </button>
                <button className="w-[52px] h-[52px] flex items-center justify-center bg-[#1E2133] rounded-[8px]">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 0C4.477 0 0 4.477 0 10C0 15.523 4.477 20 10 20C15.523 20 20 15.523 20 10C20 4.477 15.523 0 10 0ZM13.18 15.152L12.178 15.504L9.463 13.394L7.721 15.002C7.68 15.032 7.633 15.051 7.583 15.058C7.534 15.065 7.483 15.059 7.436 15.041L7.77 12.052L12.672 7.554L6.172 11.299L3.477 10.381C3.063 10.233 3.024 9.582 3.49 9.406L14.207 5.148C14.673 4.916 15.088 5.406 15.088 5.406L13.18 15.152Z" fill="white"/></svg>
                </button>
                <button className="w-[52px] h-[52px] flex items-center justify-center bg-[#1E2133] rounded-[8px]">
                  <svg width="20" height="15" viewBox="0 0 20 15" fill="none"><path d="M17.8875 2.926C16.544 0.558 13.868 0.07 12.7195 0C12.5302 0.336 12.3608 0.682 12.2115 1.038C10.7004 0.806 9.16261 0.806 7.65149 1.038C7.49688 0.683 7.32364 0.337 7.13249 0C5.984 0.07 3.309 0.558 1.965 2.926C-0.285 6.805 -0.284 10.998 0.11 12.654C1.61581 13.772 3.29964 14.627 5.09049 15.182C5.59789 14.689 5.9769 14.079 6.19449 13.405C5.65449 13.202 5.13549 12.956 4.63749 12.665C4.725 12.457 5.001 12.311 5.001 12.311C6.572 13.047 8.285 13.428 10.02 13.428C11.755 13.428 13.468 13.047 15.039 12.311C15.139 12.311 15.415 12.457 15.403 12.665C14.962 12.956 13.979 13.202 13.813 13.405C14.102 14.079 14.474 14.689 14.918 15.182C16.712 14.628 18.399 13.773 19.908 12.653C20.267 10.998 20.268 6.805 17.8875 2.926ZM6.66849 10.291C5.618 10.279 4.769 9.398 4.74849 8.336C4.748 7.264 5.618 6.398 6.66849 6.426C7.719 6.454 8.569 7.333 8.60149 8.391C8.574 9.463 7.704 10.303 6.66849 10.291ZM13.2935 10.291C12.243 10.279 11.393 9.398 11.3615 8.347C11.33 7.275 12.2 6.409 13.293 6.432C14.386 6.455 15.236 7.334 15.265 8.381C15.237 9.453 14.367 10.303 13.2935 10.28L13.2935 10.291Z" fill="white"/></svg>
                </button>
              </div>
              <div className="flex flex-row items-center gap-2">
                <button className="flex flex-row items-center gap-1.5 border border-[#26293E] px-3 py-1.5 rounded-full">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0C3.134 0 0 3.134 0 7C0 10.866 3.134 14 7 14C10.866 14 14 10.866 14 7C14 3.134 10.866 0 7 0ZM7 12.6C3.906 12.6 1.4 10.094 1.4 7C1.4 3.906 3.906 1.4 7 1.4C10.094 1.4 12.6 3.906 12.6 7C12.6 10.094 10.094 12.6 7 12.6Z" fill="white"/></svg>
                  <span className="text-[13px] font-medium text-white">English</span>
                </button>
                <button className="flex flex-row items-center gap-1.5 border border-[#26293E] px-3 py-1.5 rounded-full">
                  <svg width="11" height="12" viewBox="0 0 11 12" fill="none"><path d="M10.454 10C8.234 12.46 4.441 12.667 1.968 10.427C-0.479 8.207 -0.672 4.413 1.548 1.953C2.567 0.831 3.971 0.134 5.481 0C3.274 2.467 3.481 6.26 5.968 8.473C7.054 9.46 8.488 10 9.968 10L10.454 10Z" fill="white"/></svg>
                  <span className="text-[13px] font-medium text-white">Light</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#243B46] my-5" />
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 pb-4 text-center sm:text-left">
            <span className="text-[14px] font-normal text-[#B3B6C7]">@2026 Lab Wards, All Rights Reserved</span>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
              <span className="text-[14px] font-normal text-[#B3B6C7] cursor-pointer hover:text-white transition-colors">Terms of Use</span>
              <span className="text-[#50536F] hidden sm:block">|</span>
              <span className="text-[14px] font-normal text-[#B3B6C7] cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
              <span className="text-[#50536F] hidden sm:block">|</span>
              <span className="text-[14px] font-normal text-[#B3B6C7] cursor-pointer hover:text-white transition-colors">Cookie Policy</span>
          </div>
        </div>
        <div className="text-center pb-2 overflow-hidden">
          <span className="text-[clamp(56px,11vw,130px)] font-extrabold tracking-[1px] text-[#16192E] select-none leading-none">LAB WARDS</span>
        </div>
      </footer>
    </div>
  );
};

export default HOMEPAGEComponent;