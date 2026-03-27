"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import TopBar from "@/Components/Topbar";
import TickerBar from "@/Components/Shared/TickerBar";
import FeedBar from "@/Components/HomePage/FeedBar";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface UserProfile {
  uuid: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  emoji?: string;
  countryCode?: string;
  balanceCents: number;
  createdAt: string;
}

interface ProfileStats {
  offersCompleted: number;
  totalEarningsCents: number;
  last30DaysCents: number;
  referralCount: number;
}

interface ProgressionData {
  activityScore: number;
  currentLevel: string;
  currentRangeStart: number;
  currentRangeEnd: number;
  nextLevelThreshold: number | null;
  progressPercent: number;
  progressCurrent: number;
  progressTarget: number | null;
  nextLevel: string | null;
}

interface BadgeView {
  key: string;
  label: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

interface RecentOffer {
  _id: string;
  title: string;
  rewardCents: number;
  completedAt: string;
  provider?: string;
  imageUrl?: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) !== 1 ? "s" : ""} ago`;
}

function joinedAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 30) return `Joined ${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Joined ${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `Joined ${years} year${years !== 1 ? "s" : ""} ago`;
}

function getAvatarColor(name: string): string {
  const colors = ["#6155F5", "#14A28A", "#E05A5A", "#F5A623", "#5A8AF5", "#A355F5"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitial(name: string): string {
  return (name || "U").charAt(0).toUpperCase();
}

function countryFlagEmoji(code: string): string {
  if (!code || code.length !== 2) return "";
  const offset = 127397;
  return String.fromCodePoint(...Array.from(code.toUpperCase()).map((c) => c.charCodeAt(0) + offset));
}

const ProfileFillIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect width="20" height="20" rx="4" fill="#14A28A" fillOpacity="0.15" />
    <path d="M10 10a3 3 0 100-6 3 3 0 000 6zm-5 6c0-2.761 2.239-5 5-5s5 2.239 5 5H5z" fill="#14A28A" />
  </svg>
);

const ChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 14h2V8H2v6zm4 0h2V4H6v10zm4 0h2v-4h-2v4zm4 0h2v-8h-2v8z" fill="#8C8FA8" />
  </svg>
);

const OfferIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="8" stroke="#14A28A" strokeWidth="1.5" />
    <path d="M6 9l2 2 4-4" stroke="#14A28A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect width="20" height="20" rx="4" fill="#14A28A" fillOpacity="0.15" />
    <path d="M5 10l4 4 6-6" stroke="#14A28A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect width="20" height="20" rx="4" fill="#14A28A" fillOpacity="0.15" />
    <path d="M3 7h14v9H3V7zm0 0V5a1 1 0 011-1h12a1 1 0 011 1v2" stroke="#14A28A" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="14" cy="12" r="1.5" fill="#14A28A" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect width="20" height="20" rx="4" fill="#14A28A" fillOpacity="0.15" />
    <path d="M8 10a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-4 5c0-2.209 1.791-4 4-4s4 1.791 4 4" stroke="#14A28A" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M14 8a2 2 0 110-4 2 2 0 010 4zm2 7c0-1.5-1-2.8-2.4-3.3" stroke="#14A28A" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  wide?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, wide }) => (
  <div
    className="flex flex-col gap-2 rounded-[10px] p-4"
    style={{
      background: "#151728",
      border: "1px solid #1E2133",
      flex: wide ? "1 1 160px" : "1 1 120px",
      minWidth: wide ? 160 : 120,
    }}
  >
    {icon}
    <span className="font-bold text-[20px] text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {value}
    </span>
    <span className="text-[12px] text-[#8C8FA8]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {label}
    </span>
  </div>
);

const defaultProgression: ProgressionData = {
  activityScore: 0,
  currentLevel: "Beginner",
  currentRangeStart: 0,
  currentRangeEnd: 30,
  nextLevelThreshold: 30,
  progressPercent: 0,
  progressCurrent: 0,
  progressTarget: 30,
  nextLevel: "Amateur",
};

const OwnProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    offersCompleted: 0,
    totalEarningsCents: 0,
    last30DaysCents: 0,
    referralCount: 0,
  });
  const [recentOffers, setRecentOffers] = useState<RecentOffer[]>([]);
  const [progression, setProgression] = useState<ProgressionData>(defaultProgression);
  const [badges, setBadges] = useState<BadgeView[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "badges">("all");

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchProfile = useCallback(async () => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const p = data.user || data.profile || data;
        setProfile({
          uuid: p._id || p.uuid || "",
          username: p.username || "",
          displayName: p.displayName || p.username || "",
          avatarUrl: p.avatarUrl || undefined,
          emoji: p.emoji || undefined,
          countryCode: p.countryCode || undefined,
          balanceCents: p.balanceCents || 0,
          createdAt: p.createdAt || new Date().toISOString(),
        });
        if (data.stats) {
          setStats({
            offersCompleted: data.stats.offersCompleted || data.stats.tasksCompleted || 0,
            totalEarningsCents: data.stats.totalEarningsCents || p.balanceCents || 0,
            last30DaysCents: data.stats.last30DaysCents || data.stats.last30DaysEarningsCents || 0,
            referralCount: data.stats.referralCount || data.stats.successfulReferrals || 0,
          });
        }
        setProgression(data.progression || defaultProgression);
        setBadges(Array.isArray(data.badges) ? data.badges : []);
      }

      // Also fetch recent offers
      const uid = (() => {
        try { const r = localStorage.getItem("user"); return r ? (JSON.parse(r)._id || JSON.parse(r).id || null) : null; } catch { return null; }
      })();
      if (uid) {
        const offersRes = await fetch(`${apiBase}/api/v1/games/user/${uid}`);
        if (offersRes.ok) {
          const offersData = await offersRes.json();
          if (offersData.recentOffers) setRecentOffers(offersData.recentOffers);
          if (offersData.stats && !stats.offersCompleted) {
            setStats(offersData.stats);
          }
        }
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const displayName = profile?.displayName || profile?.username || "User";
  const initial = getInitial(displayName);
  const avatarColor = getAvatarColor(displayName);
  const joinedText = profile?.createdAt ? joinedAgo(profile.createdAt) : "—";
  const flag = profile?.countryCode ? countryFlagEmoji(profile.countryCode) : "";

  const progressPct = Math.min(100, Math.max(0, progression.progressPercent || 0));
  const nextLevelName = progression.nextLevel || "MAX";

  return (
    <div className="min-h-screen bg-[#0D0F1E] flex flex-col" style={{ background: "#0D0F1E" }}>
        <TopBar />      <TickerBar />
      <div className="px-[12px] sm:px-4 md:px-6 mt-4">
        <FeedBar />
      </div>
        {/* Loading */}
        {loading && (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-[#14A28A] border-t-transparent animate-spin" />
          </div>
        )}

        {/* Content */}
        {!loading && profile && (
          <>
            {/* Profile Info */}
            <div className="flex flex-col gap-4 px-6 md:px-10 py-6 shrink-0" style={{ borderBottom: "1px solid #151728" }}>
              <div className="flex flex-col gap-2">
                {/* Avatar */}
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt={displayName} className="rounded-[10px] object-cover" style={{ width: 92, height: 76 }} />
                ) : (
                  <div
                    className="flex items-center justify-center rounded-[10px] shrink-0"
                    style={{ width: 92, height: 76, background: avatarColor }}
                  >
                    <span className="font-bold text-white" style={{ fontFamily: "'Inter', sans-serif", fontSize: 48, lineHeight: "21px", letterSpacing: "-0.03em" }}>
                      {initial}
                    </span>
                  </div>
                )}

                {/* Name row */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[18px] text-white tracking-[0.02em]" style={{ fontFamily: "'Manrope', sans-serif", lineHeight: "34px" }}>
                    {displayName}
                  </span>
                  {flag && <span className="text-sm">{flag}</span>}
                </div>

                {/* Joined */}
                <div className="flex items-center gap-1">
                  <div className="rounded-full" style={{ width: 4, height: 4, background: "#8C8FA8", opacity: 0.4 }} />
                  <span className="font-medium text-[10px] text-[#8C8FA8] tracking-[-0.03em]" style={{ fontFamily: "'Inter', sans-serif", lineHeight: "21px" }}>
                    {joinedText}
                  </span>
                </div>
              </div>

              {/* Level progress */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="rounded" style={{ width: 16, height: 16, background: "transparent", border: "1px solid #0088FF" }} />
                    <span className="font-medium text-[13px] text-[#0088FF]" style={{ fontFamily: "'Inter', sans-serif" }}>{progression.currentLevel}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="rounded" style={{ width: 16, height: 16, background: "transparent", border: "1px solid #00C8B3" }} />
                    <span className="font-medium text-[13px] text-[#00C8B3]" style={{ fontFamily: "'Inter', sans-serif" }}>{nextLevelName}</span>
                  </div>
                </div>
                <div className="relative rounded-[20px] w-full" style={{ height: 6, background: "#1E2133" }}>
                  <div className="absolute left-0 top-0 h-full rounded-[20px]" style={{ width: `${progressPct}%`, background: "#0088FF" }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[12px] text-[#6B6E8A]" style={{ fontFamily: "'Inter', sans-serif" }}>{progression.progressCurrent.toLocaleString()}</span>
                  <span className="font-medium text-[12px] text-[#6B6E8A]" style={{ fontFamily: "'Inter', sans-serif" }}>{(progression.progressTarget ?? progression.activityScore).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-col gap-3 shrink-0">
              <div className="flex items-start px-6 md:px-10 pt-4">
                <div className="flex items-center gap-2 rounded-[20px] p-1" style={{ background: "#151728" }}>
                  {(["all", "badges"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="flex items-center justify-center rounded-[15px] transition-colors"
                      style={{ padding: "8px 20px", background: activeTab === tab ? "#14A28A" : "#151728", minWidth: 95 }}
                    >
                      <span className="font-semibold text-[14px] text-white tracking-[0.02em]" style={{ fontFamily: "'Manrope', sans-serif", lineHeight: "34px" }}>
                        {tab === "all" ? "All" : "Badges"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "all" && (
                <>
                  {/* Statistics */}
                  <div className="flex flex-col gap-4 px-6 md:px-10 py-4" style={{ borderBottom: "1px solid #1E2133" }}>
                    <div className="flex items-center gap-2">
                      <ChartIcon />
                      <span className="font-bold text-[16px] text-white tracking-[0.02em] flex-1" style={{ fontFamily: "'Manrope', sans-serif", lineHeight: "34px" }}>
                        Statistics
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <StatCard icon={<CheckIcon />} value={stats.offersCompleted.toLocaleString()} label="Offers completed" />
                      <StatCard wide icon={<WalletIcon />} value={`$${(stats.totalEarningsCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`} label="Total Earnings" />
                      <StatCard icon={<UsersIcon />} value={stats.referralCount.toLocaleString()} label="Users Referred" />
                      <StatCard wide icon={<WalletIcon />} value={`$${(stats.last30DaysCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`} label="Last 30D Earnings" />
                    </div>
                  </div>

                  {/* Offers table */}
                  <div className="flex flex-col gap-3 px-6 md:px-10 pb-10">
                    <div className="flex items-center gap-2">
                      <OfferIcon />
                      <span className="font-bold text-[16px] text-white tracking-[0.02em] flex-1" style={{ fontFamily: "'Manrope', sans-serif", lineHeight: "34px" }}>
                        Offers
                      </span>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex items-center px-2 gap-4" style={{ height: 37, borderBottom: "1px solid #1E2133" }}>
                        {["Name", "Reward", "Time"].map((col, i) => (
                          <span
                            key={col}
                            className="font-medium text-[14px] text-[#8C8FA8] tracking-[-0.03em]"
                            style={{ fontFamily: "'Inter', sans-serif", lineHeight: "21px", flex: 1, textAlign: i === 0 ? "left" : i === 1 ? "center" : "right" }}
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                      {recentOffers.length === 0 ? (
                        <div className="py-8 text-center text-[#8C8FA8] text-sm">No offers to display</div>
                      ) : (
                        recentOffers.map((offer, idx) => (
                          <div
                            key={offer._id}
                            className="flex items-center px-2 gap-4"
                            style={{ height: 47, background: idx % 2 === 1 ? "#151728" : "transparent" }}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {offer.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={offer.imageUrl} alt={offer.title} className="rounded shrink-0" style={{ width: 23, height: 23 }} />
                              ) : (
                                <div className="shrink-0 rounded flex items-center justify-center" style={{ width: 23, height: 23, background: "#26293E" }}>
                                  <span className="text-[#8C8FA8] text-[8px] font-bold">{offer.provider?.charAt(0)?.toUpperCase() || "O"}</span>
                                </div>
                              )}
                              <span className="font-medium text-[13px] text-white tracking-[-0.03em] truncate" style={{ fontFamily: "'Inter', sans-serif", lineHeight: "21px" }}>
                                {offer.title}
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-1 flex-1">
                              <div className="w-3 h-3 rounded-full bg-[#14A28A]" />
                              <span className="font-medium text-[13px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {(offer.rewardCents / 100).toFixed(2)}
                              </span>
                            </div>
                            <span className="font-medium text-[12px] text-[#8C8FA8] text-right flex-1 tracking-[-0.03em]" style={{ fontFamily: "'Inter', sans-serif", lineHeight: "21px" }}>
                              {timeAgo(offer.completedAt)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "badges" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-6 md:px-10 pb-10">
                  {badges.map((badge) => (
                    <div
                      key={badge.key}
                      className="rounded-[10px] p-3 border"
                      style={{
                        background: badge.unlocked ? "#151728" : "#121424",
                        borderColor: badge.unlocked ? "#2A9D8F" : "#2A2D44",
                        opacity: badge.unlocked ? 1 : 0.5,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-[6px] flex items-center justify-center rotate-45"
                          style={{ background: badge.unlocked ? "#14A28A" : "#50536F" }}
                        >
                          <span className="-rotate-45 text-sm">{badge.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{badge.label || (badge as any).title}</p>
                          <p className="text-[#8C8FA8] text-xs">{badge.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {!loading && !profile && (
          <div className="flex flex-1 items-center justify-center py-20">
            <p className="text-[#8C8FA8]">Could not load profile. Please sign in.</p>
          </div>
        )}
    </div>
  );
};

export default OwnProfilePage;

