"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Link as LinkIcon,
  Mail,
  MessageCirclePlus,
  MessageSquareOff,
  UserRound,
  Users,
} from "lucide-react";
import TopBar from "@/Components/Topbar";
import TickerBar from "@/Components/Shared/TickerBar";
import { toast } from "@/utils/toast";

type HistoryFilter = "all" | "offers" | "tasks" | "cashout" | "reward";

type HistoryStatus = "completed" | "pending";

interface AccountProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  balanceCents: number;
  profilePrivacy: "public" | "private";
}

interface AccountStats {
  offersCompleted: number;
  totalEarningsCents: number;
  last30DaysCents: number;
  referralCount: number;
}

interface RecentOffer {
  _id: string;
  title: string;
  rewardCents: number;
  completedAt?: string;
  provider?: string;
}

interface HistoryRow {
  id: string;
  name: string;
  date: string;
  type: "reward" | "task" | "cashout";
  amountCents: number;
  status: HistoryStatus;
  category: Exclude<HistoryFilter, "all">;
  href?: string;
}

interface NotificationSetting {
  key: string;
  title: string;
  subtitle: string;
  enabled: boolean;
}

interface MutedUser {
  id: string;
  name: string;
  avatar: string;
}

interface ApiProfilePayload {
  _id?: string;
  uuid?: string;
  id?: string;
  username?: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  balanceCents?: number;
  profilePrivacy?: "public" | "private";
}

interface ApiProfileResponse {
  profile?: ApiProfilePayload;
  user?: ApiProfilePayload;
  stats?: Partial<AccountStats>;
}

interface ApiGameUserResponse {
  stats?: Partial<AccountStats>;
  recentOffers?: RecentOffer[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const formatDateLabel = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const deriveLabwardId = (rawId: string) => {
  const cleaned = rawId.replace(/[^a-zA-Z0-9]/g, "");
  if (!cleaned) return "0001635";
  return cleaned.slice(-7).toUpperCase().padStart(7, "0");
};

const createFallbackHistory = (): HistoryRow[] => [
  {
    id: "fallback-1",
    name: "Referral",
    date: "29 Jan 2026",
    type: "reward",
    amountCents: 16,
    status: "completed",
    category: "reward",
  },
  {
    id: "fallback-2",
    name: "Verification",
    date: "29 Jan 2026",
    type: "reward",
    amountCents: 16,
    status: "completed",
    category: "offers",
  },
  {
    id: "fallback-3",
    name: "Referral",
    date: "29 Jan 2026",
    type: "reward",
    amountCents: 16,
    status: "completed",
    category: "tasks",
  },
  {
    id: "fallback-4",
    name: "Verification",
    date: "29 Jan 2026",
    type: "reward",
    amountCents: 16,
    status: "completed",
    category: "cashout",
  },
];

const defaultNotificationSettings: NotificationSetting[] = [
  {
    key: "cashoutConfirmation",
    title: "Cashout confirmation",
    subtitle: "Receive confirmation when you cashout funds",
    enabled: true,
  },
  {
    key: "earnConfirmation",
    title: "Earn confirmation",
    subtitle: "Get notified about your earnings",
    enabled: true,
  },
  {
    key: "leaderboardWinnings",
    title: "Leaderboard winnings",
    subtitle: "Stay updated on leaderboard wins and rankings",
    enabled: true,
  },
  {
    key: "promotionalAlerts",
    title: "Promotional alerts",
    subtitle: "Get exclusive deals and promotional offers",
    enabled: true,
  },
  {
    key: "newsletterUpdates",
    title: "Newsletter updates",
    subtitle: "Receive our weekly newsletter with updates and tips",
    enabled: true,
  },
];

const defaultMutedUsers: MutedUser[] = [
  { id: "mute-1", name: "Ruby Tems", avatar: "🧕" },
  { id: "mute-2", name: "Zach", avatar: "🧑‍🚀" },
];

const MiniBars = ({ active }: { active: number }) => (
  <div className="flex items-end gap-[2px]">
    {Array.from({ length: 15 }).map((_, index) => (
      <span
        key={index}
        className={`w-[3px] h-[10px] rounded-[2px] ${index < active ? "bg-[#18C3A7]" : "bg-[#26293E]"}`}
      />
    ))}
  </div>
);

const MetricCard = ({
  value,
  label,
  activeBars,
}: {
  value: string;
  label: string;
  activeBars: number;
}) => (
  <div className="rounded-[10px] border border-[#1E2133] bg-[#151728] px-3 py-2">
    <MiniBars active={activeBars} />
    <p className="mt-2 text-[22px] font-semibold text-white leading-[1.1]" style={{ fontFamily: "var(--font-dm-sans)" }}>
      {value}
    </p>
    <p className="text-[12px] text-[#6B6E8A]" style={{ fontFamily: "var(--font-dm-sans)" }}>
      {label}
    </p>
  </div>
);

const Switch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`relative h-6 w-10 rounded-full transition-colors ${enabled ? "bg-[#18C3A7]" : "bg-[#30334A]"}`}
    aria-pressed={enabled}
  >
    <span
      className={`absolute top-[3px] h-4 w-4 rounded-full bg-white transition-transform ${enabled ? "translate-x-[22px]" : "translate-x-[3px]"}`}
    />
  </button>
);

const AccountClonePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [stats, setStats] = useState<AccountStats>({
    offersCompleted: 0,
    totalEarningsCents: 0,
    last30DaysCents: 0,
    referralCount: 0,
  });
  const [recentOffers, setRecentOffers] = useState<RecentOffer[]>([]);
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [usernameDraft, setUsernameDraft] = useState("");
  const [publicStatusDraft, setPublicStatusDraft] = useState("Summary");
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>(
    defaultNotificationSettings,
  );
  const [mutedUsers, setMutedUsers] = useState<MutedUser[]>(defaultMutedUsers);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const persistNotificationSettings = useCallback(async (next: NotificationSetting[]) => {
    const token = getToken();
    if (!token) return;

    const settingsPayload = next.reduce<Record<string, boolean>>((acc, item) => {
      acc[item.key] = item.enabled;
      return acc;
    }, {});

    try {
      await fetch(`${API_BASE}/api/v1/user/settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: settingsPayload,
          profilePrivacy: profile?.profilePrivacy || "public",
        }),
      });
    } catch {
      // Keep local state even if remote save fails
    }
  }, [profile?.profilePrivacy]);

  const fetchAccountData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const profileRes = await fetch(`${API_BASE}/api/v1/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!profileRes.ok) {
        throw new Error("Failed to load account profile");
      }

      const profileData: ApiProfileResponse = await profileRes.json();
      const payload = profileData.profile || profileData.user;

      if (!payload) {
        throw new Error("Profile payload not found");
      }

      const resolvedProfile: AccountProfile = {
        id: payload._id || payload.uuid || payload.id || "",
        username: payload.username || "",
        displayName: payload.displayName || payload.username || "User",
        email: payload.email || "",
        avatarUrl: payload.avatarUrl,
        balanceCents: payload.balanceCents || 0,
        profilePrivacy: payload.profilePrivacy || "public",
      };

      setProfile(resolvedProfile);
      setUsernameDraft(resolvedProfile.displayName);
      setPublicStatusDraft(
        resolvedProfile.profilePrivacy === "public" ? "Summary" : "Private",
      );

      setStats((prev) => ({
        ...prev,
        offersCompleted: profileData.stats?.offersCompleted || prev.offersCompleted,
        totalEarningsCents:
          profileData.stats?.totalEarningsCents || payload.balanceCents || prev.totalEarningsCents,
        last30DaysCents: profileData.stats?.last30DaysCents || prev.last30DaysCents,
        referralCount: profileData.stats?.referralCount || prev.referralCount,
      }));

      if (resolvedProfile.id) {
        const gameRes = await fetch(`${API_BASE}/api/v1/games/user/${resolvedProfile.id}`);
        if (gameRes.ok) {
          const gameData: ApiGameUserResponse = await gameRes.json();
          if (Array.isArray(gameData.recentOffers)) {
            setRecentOffers(gameData.recentOffers);
          }
          if (gameData.stats) {
            setStats((prev) => ({
              ...prev,
              offersCompleted: gameData.stats?.offersCompleted || prev.offersCompleted,
              totalEarningsCents:
                gameData.stats?.totalEarningsCents || prev.totalEarningsCents,
              last30DaysCents: gameData.stats?.last30DaysCents || prev.last30DaysCents,
              referralCount: gameData.stats?.referralCount || prev.referralCount,
            }));
          }
        }
      }
    } catch {
      toast.error("Failed to load account page data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  const saveProfile = async (field: "displayName" | "profilePrivacy") => {
    const token = getToken();
    if (!token || !profile) {
      toast.warn("Please sign in to update your profile");
      return;
    }

    setSavingProfile(true);

    try {
      const payload =
        field === "displayName"
          ? { displayName: usernameDraft }
          : {
              profilePrivacy:
                publicStatusDraft.toLowerCase() === "private" ? "private" : "public",
            };

      const res = await fetch(`${API_BASE}/api/v1/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              displayName: field === "displayName" ? usernameDraft : prev.displayName,
              profilePrivacy:
                field === "profilePrivacy"
                  ? publicStatusDraft.toLowerCase() === "private"
                    ? "private"
                    : "public"
                  : prev.profilePrivacy,
            }
          : prev,
      );

      toast.success("Profile updated");
    } catch {
      toast.error("Unable to update profile right now");
    } finally {
      setSavingProfile(false);
    }
  };

  const historyRows = useMemo<HistoryRow[]>(() => {
    if (recentOffers.length === 0) {
      return createFallbackHistory();
    }

    return recentOffers.slice(0, 8).map((offer, index) => ({
      id: offer._id || `recent-${index}`,
      name: offer.title || "Offer",
      date: formatDateLabel(offer.completedAt),
      type: "reward",
      amountCents: offer.rewardCents || 0,
      status: "completed",
      category: index % 3 === 0 ? "offers" : index % 3 === 1 ? "tasks" : "reward",
      href: `/tasks`,
    }));
  }, [recentOffers]);

  const filteredHistoryRows = useMemo(() => {
    if (historyFilter === "all") return historyRows;
    return historyRows.filter((row) => row.category === historyFilter);
  }, [historyFilter, historyRows]);

  const accountTotals = useMemo(() => {
    const availableBalance = profile?.balanceCents || 0;
    const totalEarnings = Math.max(stats.totalEarningsCents, availableBalance);
    const withdrawn = Math.max(totalEarnings - availableBalance, 0);
    const completedPayouts = stats.last30DaysCents > 0 ? stats.last30DaysCents : totalEarnings;

    return {
      availableBalance,
      totalEarnings,
      withdrawn,
      completedPayouts,
    };
  }, [profile?.balanceCents, stats.last30DaysCents, stats.totalEarningsCents]);

  const toggleNotification = (key: string) => {
    setNotificationSettings((prev) => {
      const next = prev.map((item) =>
        item.key === key ? { ...item, enabled: !item.enabled } : item,
      );
      void persistNotificationSettings(next);
      return next;
    });
  };

  const handleUnmuteUser = (id: string) => {
    setMutedUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0D0F1E] text-white">
      <TopBar />
      <TickerBar />

      <main className="mx-auto w-full max-w-[1312px] px-4 py-6 md:px-8">
        <h1
          className="text-[30px] font-bold tracking-[0.02em] text-white"
          style={{ fontFamily: "var(--font-manrope)" }}
        >
          Account
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#18C3A7] border-t-transparent" />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
            <section className="rounded-[10px] border border-[#1E2133] bg-[#111324] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="relative h-[86px] w-[106px] rounded-[11px] bg-[#6155F5]">
                    {profile?.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatarUrl}
                        alt={profile.displayName}
                        className="h-full w-full rounded-[11px] object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-[56px] font-bold leading-none text-white" style={{ fontFamily: "var(--font-inter)" }}>
                          {(profile?.displayName || "U").charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#111324] bg-[#FF2D55] text-[12px]"
                      aria-label="Change profile picture"
                      onClick={() => toast.info("Avatar upload can be changed from profile settings")}
                    >
                      📷
                    </button>
                  </div>
                  <p className="mt-3 truncate text-[34px] font-bold leading-[1.05] text-white" style={{ fontFamily: "var(--font-manrope)", fontSize: "32px" }}>
                    {profile?.displayName || "Muhammed H"}
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-full border border-[#26293E] bg-[#151728] px-5 py-2 text-[13px] text-white hover:border-[#30334A]"
                  onClick={() => toast.info("Public profile preview will be available soon")}
                >
                  View profile
                </button>
              </div>

              <div className="mt-4 border-t border-[#1E2133]">
                <div className="flex items-center justify-between border-b border-[#1E2133] px-2 py-2">
                  <span className="text-[15px] text-[#8C8FA8]">Labward ID</span>
                  <span className="text-[16px] font-semibold text-white">
                    {deriveLabwardId(profile?.id || "")}
                  </span>
                </div>
                <div className="flex items-center justify-between px-2 py-2">
                  <span className="text-[15px] text-[#8C8FA8]">Level</span>
                  <span className="rounded-[6px] border border-[#0088FF] bg-[#0D1325] px-2 py-[2px] text-[12px] text-[#7FCBFF]">
                    {stats.offersCompleted > 50
                      ? "Gold"
                      : stats.offersCompleted > 15
                        ? "Silver"
                        : "Bronze"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  value={formatCurrency(accountTotals.availableBalance)}
                  label="Available balance"
                  activeBars={3}
                />
                <MetricCard
                  value={formatCurrency(accountTotals.totalEarnings)}
                  label="Total Earnings"
                  activeBars={6}
                />
                <MetricCard
                  value={formatCurrency(accountTotals.withdrawn)}
                  label="Withdrawn"
                  activeBars={6}
                />
                <MetricCard
                  value={formatCurrency(accountTotals.completedPayouts)}
                  label="Completed payouts"
                  activeBars={6}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {([
                  ["all", "All"],
                  ["offers", "Offers"],
                  ["tasks", "Tasks"],
                  ["cashout", "Cashout"],
                  ["reward", "Reward"],
                ] as Array<[HistoryFilter, string]>).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setHistoryFilter(value)}
                    className={`rounded-full border px-4 py-[6px] text-[13px] transition-colors ${
                      historyFilter === value
                        ? "border-[#18C3A7] bg-[#18C3A7] text-white"
                        : "border-[#26293E] bg-[#151728] text-white hover:border-[#3A3D55]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
                <button
                  type="button"
                  className="ml-auto rounded-full border border-[#26293E] bg-[#151728] px-4 py-[6px] text-[13px] text-white hover:border-[#3A3D55]"
                  onClick={() => toast.info("CSV export will be available in next update")}
                >
                  Export CSV
                </button>
              </div>

              <div className="mt-3 overflow-hidden rounded-[8px] border border-[#1E2133]">
                <div className="grid grid-cols-[1.9fr_1fr_0.9fr_0.8fr_1fr_0.7fr] items-center bg-[#0B0D1B] px-3 py-2 text-[12px] text-[#8C8FA8]">
                  <span>Name</span>
                  <span>Date</span>
                  <span>Type</span>
                  <span>Amount</span>
                  <span>Status</span>
                  <span className="text-right">Action</span>
                </div>

                {filteredHistoryRows.map((row, index) => (
                  <div
                    key={row.id}
                    className={`grid grid-cols-[1.9fr_1fr_0.9fr_0.8fr_1fr_0.7fr] items-center px-3 py-2 text-[12px] ${
                      index % 2 === 0 ? "bg-[#151728]" : "bg-[#121527]"
                    }`}
                  >
                    <span className="truncate text-white">{row.name}</span>
                    <span className="text-white">{row.date}</span>
                    <span className="text-white">{row.type === "reward" ? "Reward" : row.type}</span>
                    <span className="text-white">{formatCurrency(row.amountCents)}</span>
                    <span>
                      <span className="inline-flex rounded-full bg-[#091E1F] px-3 py-1 text-[11px] text-[#18C3A7]">
                        {row.status === "completed" ? "Completed" : "Pending"}
                      </span>
                    </span>
                    <span className="flex justify-end">
                      <button
                        type="button"
                        className="text-white/90 hover:text-white"
                        onClick={() => {
                          if (row.href) {
                            window.location.href = row.href;
                          }
                        }}
                        aria-label={`Open ${row.name}`}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[10px] border border-[#1E2133] bg-[#111324] p-4">
              <div className="border-b border-[#1E2133] pb-4">
                <div className="mb-4 flex items-center gap-2 text-white">
                  <UserRound className="h-5 w-5 text-[#14A28A]" />
                  <h2 className="text-[26px] font-bold" style={{ fontFamily: "var(--font-manrope)", fontSize: "20px" }}>
                    Profile Information
                  </h2>
                </div>

                <label className="mb-1 block text-[15px] text-[#6B6E8A]">Username</label>
                <div className="mb-3 flex items-center gap-2 rounded-[10px] border border-[#262A3A] bg-[#151828] p-2">
                  <input
                    value={usernameDraft}
                    onChange={(event) => setUsernameDraft(event.target.value)}
                    className="w-full bg-transparent px-1 text-[18px] text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => void saveProfile("displayName")}
                    disabled={savingProfile}
                    className="rounded-[10px] bg-[#14A28A] px-5 py-2 text-[14px] font-semibold text-white disabled:opacity-60"
                  >
                    Save
                  </button>
                </div>

                <label className="mb-1 block text-[15px] text-[#6B6E8A]">Email Address</label>
                <div className="mb-3 flex items-center gap-2 rounded-[10px] border border-[#262A3A] bg-[#151828] p-2">
                  <input
                    value={profile?.email || "bustinjieb@gmail.com"}
                    readOnly
                    className="w-full bg-transparent px-1 text-[18px] text-white outline-none"
                  />
                  <span className="inline-flex items-center gap-1 rounded-[8px] bg-[#26293E] px-3 py-2 text-[14px] text-white">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#18C3A7] text-[10px] text-black">✓</span>
                    Verified
                  </span>
                  <button
                    type="button"
                    onClick={() => toast.info("Email changes can be made in security settings")}
                    className="rounded-[10px] bg-[#14A28A] px-5 py-2 text-[14px] font-semibold text-white"
                  >
                    Change
                  </button>
                </div>

                <label className="mb-1 block text-[15px] text-[#6B6E8A]">Public status</label>
                <div className="flex items-center gap-2 rounded-[10px] border border-[#262A3A] bg-[#151828] p-2">
                  <input
                    value={publicStatusDraft}
                    onChange={(event) => setPublicStatusDraft(event.target.value)}
                    className="w-full bg-transparent px-1 text-[18px] text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => void saveProfile("profilePrivacy")}
                    disabled={savingProfile}
                    className="rounded-[10px] bg-[#14A28A] px-5 py-2 text-[14px] font-semibold text-white disabled:opacity-60"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="border-b border-[#1E2133] py-4">
                <div className="mb-3 flex items-center gap-2 text-white">
                  <Mail className="h-5 w-5 text-[#14A28A]" />
                  <h3 className="text-[20px] font-bold" style={{ fontFamily: "var(--font-manrope)", fontSize: "20px" }}>
                    Email Notifications
                  </h3>
                </div>

                <div className="space-y-3">
                  {notificationSettings.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-3 rounded-[10px] border border-[#262A3A] bg-[#151828] px-3 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[16px] text-white">{item.title}</p>
                        <p className="text-[15px] text-[#6B6E8A]">{item.subtitle}</p>
                      </div>
                      <Switch
                        enabled={item.enabled}
                        onToggle={() => toggleNotification(item.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b border-[#1E2133] py-4">
                <div className="mb-3 flex items-center gap-2 text-white">
                  <LinkIcon className="h-5 w-5 text-[#14A28A]" />
                  <h3 className="text-[20px] font-bold" style={{ fontFamily: "var(--font-manrope)", fontSize: "20px" }}>
                    Connections
                  </h3>
                </div>

                <div className="flex items-center gap-3 rounded-[10px] border border-[#262A3A] bg-[#151828] px-3 py-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[6px] bg-[#1E2133]">
                    <Image
                      src="/assets/worldcoin.png"
                      alt="Worldcoin"
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain invert brightness-200 mix-blend-screen"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] text-white">Worldcoin</p>
                    <p className="text-[15px] text-[#6B6E8A]">Not connected</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-[10px] bg-[#14A28A] px-8 py-2 text-[14px] font-semibold text-white"
                    onClick={() => toast.info("Worldcoin connection setup will be available soon")}
                  >
                    Link
                  </button>
                </div>
              </div>

              <div className="border-b border-[#1E2133] py-4">
                <div className="mb-3 flex items-center gap-2 text-white">
                  <Users className="h-5 w-5 text-[#14A28A]" />
                  <h3 className="text-[20px] font-bold" style={{ fontFamily: "var(--font-manrope)", fontSize: "20px" }}>
                    Referral
                  </h3>
                </div>

                <div className="rounded-[10px] border border-[#262A3A] bg-[#151828] px-3 py-3">
                  <p className="text-[16px] text-white">Total invitee</p>
                  <p className="text-[15px] text-[#6B6E8A]">
                    {stats.referralCount > 0 ? `${stats.referralCount} referrals` : "No referrals"}
                  </p>
                </div>
              </div>

              <div className="py-4">
                <div className="mb-3 flex items-center gap-2 text-white">
                  <MessageSquareOff className="h-5 w-5 text-[#14A28A]" />
                  <h3 className="text-[20px] font-bold" style={{ fontFamily: "var(--font-manrope)", fontSize: "20px" }}>
                    Muted users
                  </h3>
                </div>

                <div className="space-y-3">
                  {mutedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 rounded-[10px] border border-[#262A3A] bg-[#151828] px-3 py-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#1E2133] text-[20px]">
                        {user.avatar}
                      </div>
                      <p className="min-w-0 flex-1 truncate text-[16px] text-white">{user.name}</p>
                      <button
                        type="button"
                        className="text-white hover:text-[#18C3A7]"
                        onClick={() => handleUnmuteUser(user.id)}
                        aria-label={`Unmute ${user.name}`}
                      >
                        <MessageCirclePlus className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-4 w-full rounded-[5px] border border-[#26293E] bg-[#151728] py-3 text-[14px] text-[#FF383C] hover:opacity-90"
                  onClick={() => toast.warn("Please contact support to delete account")}
                >
                  Delete account
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default AccountClonePage;
