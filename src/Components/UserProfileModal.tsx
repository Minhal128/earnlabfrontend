"use client";

import React, { useState, useEffect, useCallback } from "react";

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

interface UserProfileModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
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

// ─── Stat Card ──────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  wide?: boolean;
}
const StatCard: React.FC<StatCardProps> = ({ icon, value, label, wide }) => (
  <div
    className="flex flex-col items-start gap-2 rounded-[10px] bg-[#151728] p-3"
    style={{ minWidth: wide ? 142 : 126, flex: wide ? "0 0 142px" : "0 0 126px" }}
  >
    <div className="flex items-center justify-center rounded-[4px] bg-[#14A28A]" style={{ width: 30, height: 28 }}>
      {icon}
    </div>
    <div className="flex flex-col gap-1">
      <span className="font-[Manrope] font-bold text-[16px] leading-[34px] text-white tracking-[0.02em]">
        {value}
      </span>
      <span className="font-[Inter] font-medium text-[12px] leading-[21px] text-[#6B6E8A] tracking-[-0.03em]">
        {label}
      </span>
    </div>
  </div>
);

// ─── Icons ───────────────────────────────────────────────────────────────────
const ProfileFillIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10Z" fill="#14A28A" />
    <path d="M10 11.5C6.13401 11.5 3 14.634 3 18.5H17C17 14.634 13.866 11.5 10 11.5Z" fill="#14A28A" />
  </svg>
);

const CloseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M21 7L7 21M7 7L21 21" stroke="#8C8FA8" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7L5.5 10.5L12 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WalletIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="3" width="12" height="9" rx="1.5" stroke="white" strokeWidth="1.5" />
    <path d="M1 6H13" stroke="white" strokeWidth="1.5" />
    <circle cx="10" cy="9" r="1" fill="white" />
  </svg>
);

const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="5" cy="4" r="2.5" stroke="white" strokeWidth="1.5" />
    <path d="M1 12C1 9.79086 2.79086 8 5 8C7.20914 8 9 9.79086 9 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 6C11.1046 6 12 5.10457 12 4C12 2.89543 11.1046 2 10 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 9C12.8284 9.45948 13.5 10.1716 13.5 11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const DollarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <circle cx="6" cy="6" r="5.5" fill="#18C3A7" />
    <text x="6" y="9.5" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">$</text>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="10" width="3" height="8" rx="1" fill="#8C8FA8" />
    <rect x="7" y="6" width="3" height="12" rx="1" fill="#8C8FA8" />
    <rect x="12" y="2" width="3" height="16" rx="1" fill="#8C8FA8" />
  </svg>
);

const OfferIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2L12.39 7.26L18 8.27L14 12.14L15.18 18L10 15.27L4.82 18L6 12.14L2 8.27L7.61 7.26L10 2Z" fill="#8C8FA8" />
  </svg>
);

const MuteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M11 5L5 11M5 5L11 11" stroke="#50536F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 2a6 6 0 100 12A6 6 0 008 2z" stroke="#50536F" strokeWidth="1.5" />
  </svg>
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

// ─── Main Modal ─────────────────────────────────────────────────────────────
const UserProfileModal: React.FC<UserProfileModalProps> = ({ userId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
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
  const [isPrivate, setIsPrivate] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "badges">("all");

  const getApi = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const api = getApi();
      if (userId) {
        // Public profile for another user
        const res = await fetch(`${api}/api/v1/games/user/${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.isPrivate) {
            setIsPrivate(true);
          } else {
            setProfile(data.profile);
            setStats(data.stats ?? { offersCompleted: 0, totalEarningsCents: 0, last30DaysCents: 0, referralCount: 0 });
            setRecentOffers(data.recentOffers ?? []);
            setProgression(data.progression ?? defaultProgression);
            setBadges(Array.isArray(data.badges) ? data.badges : []);
            setIsPrivate(false);
          }
        }
      } else {
        // Own profile — use authenticated endpoint
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${api}/api/v1/user/profile`, {
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
          setStats({
            offersCompleted: data?.stats?.offersCompleted || data?.stats?.tasksCompleted || 0,
            totalEarningsCents: data?.stats?.totalEarningsCents || p.balanceCents || 0,
            last30DaysCents: data?.stats?.last30DaysCents || data?.stats?.last30DaysEarningsCents || 0,
            referralCount: data?.stats?.referralCount || data?.stats?.successfulReferrals || 0,
          });
          setProgression(data.progression ?? defaultProgression);
          setBadges(Array.isArray(data.badges) ? data.badges : []);
          setIsPrivate(false);
        }
      }
    } catch {
      // silently ignore fetch errors for modal
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    } else {
      setProfile(null);
      setStats({ offersCompleted: 0, totalEarningsCents: 0, last30DaysCents: 0, referralCount: 0 });
      setRecentOffers([]);
      setProgression(defaultProgression);
      setBadges([]);
      setIsPrivate(false);
      setActiveTab("all");
    }
  }, [isOpen, userId, fetchProfile]);

  if (!isOpen) return null;

  const displayName = profile?.displayName || profile?.username || "User";
  const initial = getInitial(displayName);
  const avatarColor = getAvatarColor(displayName);
  const joinedText = profile?.createdAt ? joinedAgo(profile.createdAt) : "—";
  const flag = profile?.countryCode ? countryFlagEmoji(profile.countryCode) : "";
  const progressPct = Math.min(100, Math.max(0, progression.progressPercent || 0));
  const nextLevelName = progression.nextLevel || "MAX";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/70"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative flex flex-col overflow-y-auto"
        style={{
          width: "100%",
          maxWidth: 604,
          height: "100%",
          background: "#0D0F1E",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div
          className="flex items-center gap-[10px] px-4 shrink-0"
          style={{ height: 68, borderBottom: "1px solid #1E2133" }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <ProfileFillIcon />
            <span
              className="font-[Manrope] font-bold text-[20px] text-white tracking-[0.02em] truncate"
              style={{ lineHeight: "34px" }}
            >
              User profile
            </span>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 flex items-center justify-center rounded hover:opacity-70 transition"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-1 items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-[#14A28A] border-t-transparent animate-spin" />
          </div>
        )}

        {/* Private */}
        {!loading && isPrivate && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
            <div className="text-5xl">🔒</div>
            <p className="text-white font-semibold text-lg">Private Profile</p>
            <p className="text-[#8C8FA8] text-sm text-center px-8">
              This user has set their profile to private.
            </p>
          </div>
        )}

        {/* Content */}
        {!loading && !isPrivate && profile && (
          <>
            {/* ── Profile Info ──────────────────────────── */}
            <div
              className="flex flex-col gap-4 px-4 py-4 shrink-0"
              style={{ borderBottom: "1px solid #151728" }}
            >
              {/* Avatar + name + meta */}
              <div className="flex flex-col gap-2">
                {/* Avatar */}
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt={displayName}
                    className="rounded-[10px] object-cover"
                    style={{ width: 92, height: 76 }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center rounded-[10px] shrink-0"
                    style={{ width: 92, height: 76, background: avatarColor }}
                  >
                    <span
                      className="font-[Inter] font-bold text-white"
                      style={{ fontSize: 48, lineHeight: "21px", letterSpacing: "-0.03em" }}
                    >
                      {initial}
                    </span>
                  </div>
                )}

                {/* Name row */}
                <div className="flex items-center gap-1">
                  <span
                    className="font-[Manrope] font-bold text-[18px] text-white tracking-[0.02em]"
                    style={{ lineHeight: "34px" }}
                  >
                    {displayName}
                  </span>
                  {flag && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{flag}</span>
                    </div>
                  )}
                </div>

                {/* Joined */}
                <div className="flex items-center gap-1">
                  <div
                    className="rounded-full"
                    style={{ width: 4, height: 4, background: "#8C8FA8", opacity: 0.4 }}
                  />
                  <span
                    className="font-[Inter] font-medium text-[10px] text-[#8C8FA8] tracking-[-0.03em]"
                    style={{ lineHeight: "21px" }}
                  >
                    {joinedText}
                  </span>
                </div>
              </div>

              {/* Level progress */}
              <div className="flex flex-col gap-3">
                {/* Labels row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div
                      className="rounded"
                      style={{ width: 16, height: 16, background: "transparent", border: "1px solid #0088FF" }}
                    />
                    <span
                      className="font-[Inter] font-medium text-[13px] text-[#0088FF] tracking-[-0.03em]"
                      style={{ lineHeight: "21px" }}
                    >
                      {progression.currentLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="rounded"
                      style={{ width: 16, height: 16, background: "transparent", border: "1px solid #00C8B3" }}
                    />
                    <span
                      className="font-[Inter] font-medium text-[13px] text-[#00C8B3] tracking-[-0.03em]"
                      style={{ lineHeight: "21px" }}
                    >
                      {nextLevelName}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  className="relative rounded-[20px] w-full"
                  style={{ height: 6, background: "#1E2133" }}
                >
                  <div
                    className="absolute left-0 top-0 h-full rounded-[20px]"
                    style={{ width: `${progressPct}%`, background: "#0088FF" }}
                  />
                </div>

                {/* XP numbers */}
                <div className="flex items-center justify-between">
                  <span
                    className="font-[Inter] font-medium text-[12px] text-[#6B6E8A] tracking-[-0.03em]"
                    style={{ lineHeight: "21px" }}
                  >
                    {progression.progressCurrent.toLocaleString()}
                  </span>
                  <span
                    className="font-[Inter] font-medium text-[12px] text-[#6B6E8A] tracking-[-0.03em]"
                    style={{ lineHeight: "21px" }}
                  >
                    {(progression.progressTarget ?? progression.activityScore).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Mute user button */}
              <div
                className="flex items-center justify-center rounded-[5px] w-full cursor-pointer select-none"
                style={{
                  height: 48,
                  background: "#151728",
                  border: "1px solid #26293E",
                }}
              >
                <div className="flex items-center gap-1">
                  <MuteIcon />
                  <span
                    className="font-[Inter] font-medium text-[14px] text-white tracking-[-0.03em]"
                    style={{ lineHeight: "21px" }}
                  >
                    Mute user
                  </span>
                </div>
              </div>
            </div>

            {/* ── Tabs ──────────────────────────────────── */}
            <div className="flex flex-col gap-3 shrink-0">
              {/* Tab bar */}
              <div className="flex items-start px-4 pt-2">
                <div
                  className="flex items-center gap-2 rounded-[20px] p-1"
                  style={{ background: "#151728" }}
                >
                  {(["all", "badges"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="flex items-center justify-center rounded-[15px] transition-colors"
                      style={{
                        padding: "8px 20px",
                        background: activeTab === tab ? "#14A28A" : "#151728",
                        minWidth: 95,
                      }}
                    >
                      <span
                        className="font-[Manrope] font-semibold text-[14px] text-white tracking-[0.02em]"
                        style={{ lineHeight: "34px" }}
                      >
                        {tab === "all" ? "All" : "Badges"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── All tab ────────────────────────────── */}
              {activeTab === "all" && (
                <>
                  {/* Statistics */}
                  <div
                    className="flex flex-col gap-4 px-4 py-3"
                    style={{ borderBottom: "1px solid #1E2133" }}
                  >
                    {/* Section header */}
                    <div className="flex items-center gap-2">
                      <ChartIcon />
                      <span
                        className="font-[Manrope] font-bold text-[16px] text-white tracking-[0.02em] flex-1"
                        style={{ lineHeight: "34px" }}
                      >
                        Statistics
                      </span>
                    </div>

                    {/* Stat cards row */}
                    <div className="flex flex-wrap gap-3">
                      <StatCard
                        icon={<CheckIcon />}
                        value={stats.offersCompleted.toLocaleString()}
                        label="Offers completed"
                      />
                      <StatCard
                        wide
                        icon={<WalletIcon />}
                        value={`$${(stats.totalEarningsCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
                        label="Total Earnings"
                      />
                      <StatCard
                        icon={<UsersIcon />}
                        value={stats.referralCount.toLocaleString()}
                        label="Users Referred"
                      />
                      <StatCard
                        wide
                        icon={<WalletIcon />}
                        value={`$${(stats.last30DaysCents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`}
                        label="Last 30D Earnings"
                      />
                    </div>
                  </div>

                  {/* Offers table */}
                  <div className="flex flex-col gap-3 px-4 pb-6">
                    {/* Section header */}
                    <div className="flex items-center gap-2">
                      <OfferIcon />
                      <span
                        className="font-[Manrope] font-bold text-[16px] text-white tracking-[0.02em] flex-1"
                        style={{ lineHeight: "34px" }}
                      >
                        Offers
                      </span>
                    </div>

                    {/* Table */}
                    <div className="flex flex-col w-full">
                      {/* Header row */}
                      <div
                        className="flex items-center px-2 gap-4"
                        style={{ height: 37, borderBottom: "1px solid #1E2133" }}
                      >
                        {["Name", "Reward", "Time"].map((col, i) => (
                          <span
                            key={col}
                            className="font-[Inter] font-medium text-[14px] text-[#8C8FA8] tracking-[-0.03em]"
                            style={{
                              lineHeight: "21px",
                              flex: 1,
                              textAlign: i === 0 ? "left" : i === 1 ? "center" : "right",
                            }}
                          >
                            {col}
                          </span>
                        ))}
                      </div>

                      {/* Data rows */}
                      {recentOffers.length === 0 ? (
                        <div className="py-8 text-center text-[#8C8FA8] text-sm">
                          No offers to display
                        </div>
                      ) : (
                        recentOffers.map((offer, idx) => (
                          <div
                            key={offer._id}
                            className="flex items-center px-2 gap-4"
                            style={{
                              height: 47,
                              background: idx % 2 === 1 ? "#151728" : "transparent",
                            }}
                          >
                            {/* Name cell */}
                            <div className="flex items-center gap-1 flex-1 min-w-0">
                              {offer.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={offer.imageUrl}
                                  alt={offer.title}
                                  className="rounded shrink-0"
                                  style={{ width: 23, height: 23 }}
                                />
                              ) : (
                                <div
                                  className="shrink-0 rounded flex items-center justify-center"
                                  style={{ width: 23, height: 23, background: "#26293E" }}
                                >
                                  <OfferIcon />
                                </div>
                              )}
                              <span
                                className="font-[Inter] font-medium text-[13px] text-white tracking-[-0.03em] truncate"
                                style={{ lineHeight: "21px" }}
                              >
                                {offer.title}
                              </span>
                            </div>

                            {/* Reward cell */}
                            <div className="flex items-center justify-center gap-1" style={{ flex: 1 }}>
                              <DollarIcon />
                              <span
                                className="font-[Inter] font-medium text-[13px] text-white tracking-[-0.03em]"
                                style={{ lineHeight: "21px" }}
                              >
                                {(offer.rewardCents / 100).toFixed(2)}
                              </span>
                            </div>

                            {/* Time cell */}
                            <div className="flex items-center justify-end" style={{ flex: 1 }}>
                              <span
                                className="font-[Inter] font-medium text-[12px] text-[#6B6E8A] tracking-[-0.03em] text-right"
                                style={{ lineHeight: "21px" }}
                              >
                                {timeAgo(offer.completedAt)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ── Badges tab ─────────────────────────── */}
              {activeTab === "badges" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 pb-6">
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

        {/* No profile */}
        {!loading && !isPrivate && !profile && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-[#8C8FA8]">Failed to load profile</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;
