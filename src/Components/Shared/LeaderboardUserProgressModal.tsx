"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Award, BarChart3, Trophy, X } from "lucide-react";

interface SelectedLeaderboardUser {
  userId: string;
  rank: number;
  points: number;
  reward: number;
  name: string;
  avatarUrl?: string;
}

interface ProgressionData {
  currentLevel: string;
  nextLevel?: string | null;
  progressPercent?: number;
  progressCurrent?: number;
  progressTarget?: number | null;
}

interface RecentOffer {
  _id: string;
  title: string;
  rewardCents: number;
  completedAt?: string;
}

interface ApiProfile {
  uuid?: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
}

interface ApiStats {
  offersCompleted?: number;
  totalEarningsCents?: number;
  last30DaysCents?: number;
  referralCount?: number;
}

interface ApiResponse {
  isPrivate?: boolean;
  profile?: ApiProfile;
  stats?: ApiStats;
  progression?: ProgressionData;
  recentOffers?: RecentOffer[];
}

interface LeaderboardUserProgressModalProps {
  isOpen: boolean;
  selectedUser: SelectedLeaderboardUser | null;
  onClose: () => void;
}

const toMoney = (cents?: number) => `$${((cents || 0) / 100).toFixed(2)}`;

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const LeaderboardUserProgressModal: React.FC<LeaderboardUserProgressModalProps> = ({
  isOpen,
  selectedUser,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [stats, setStats] = useState<ApiStats>({});
  const [progression, setProgression] = useState<ProgressionData>({ currentLevel: "Beginner" });
  const [recentOffers, setRecentOffers] = useState<RecentOffer[]>([]);

  useEffect(() => {
    if (!isOpen || !selectedUser?.userId) {
      setLoading(false);
      setIsPrivate(false);
      setProfile(null);
      setStats({});
      setProgression({ currentLevel: "Beginner" });
      setRecentOffers([]);
      return;
    }

    let active = true;

    const fetchUserProgress = async () => {
      setLoading(true);
      try {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${api}/api/v1/games/user/${selectedUser.userId}`);
        const data: ApiResponse = await res.json().catch(() => ({}));

        if (!active) return;

        if (!res.ok) {
          setIsPrivate(false);
          setProfile(null);
          setStats({});
          setProgression({ currentLevel: "Beginner" });
          setRecentOffers([]);
          return;
        }

        if (data?.isPrivate) {
          setIsPrivate(true);
          setProfile(data.profile || null);
          setStats({});
          setProgression({ currentLevel: "Private" });
          setRecentOffers([]);
          return;
        }

        setIsPrivate(false);
        setProfile(data.profile || null);
        setStats(data.stats || {});
        setProgression(data.progression || { currentLevel: "Beginner" });
        setRecentOffers(Array.isArray(data.recentOffers) ? data.recentOffers : []);
      } catch {
        if (!active) return;
        setIsPrivate(false);
        setProfile(null);
        setStats({});
        setProgression({ currentLevel: "Beginner" });
        setRecentOffers([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchUserProgress();

    return () => {
      active = false;
    };
  }, [isOpen, selectedUser]);

  const displayName =
    profile?.displayName || profile?.username || selectedUser?.name || "User";

  const progressPercent = useMemo(
    () => Math.min(100, Math.max(0, progression.progressPercent || 0)),
    [progression.progressPercent],
  );

  if (!isOpen || !selectedUser) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border border-[#2A2D3E] bg-[#141727] text-white max-h-[92vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2A2D3E] bg-[#141727] px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="text-base sm:text-lg font-bold">Leaderboard Progress</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-[#252840] transition-colors"
            aria-label="Close leaderboard progress modal"
          >
            <X className="w-5 h-5 text-[#B3B6C7]" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-9 w-9 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="p-4 sm:p-6 space-y-5">
            <div className="flex items-center gap-3 rounded-xl border border-[#2A2D3E] bg-[#1A1D2E] p-4">
              {profile?.avatarUrl || selectedUser.avatarUrl ? (
                <Image
                  src={profile?.avatarUrl || selectedUser.avatarUrl || "/assets/avatar.png"}
                  alt={displayName}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full border border-[#3A3E57] object-cover"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg font-bold text-emerald-400">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-base sm:text-lg font-bold truncate">{displayName}</p>
                <p className="text-xs sm:text-sm text-[#8C8FA8]">
                  Rank #{selectedUser.rank} • {selectedUser.points.toLocaleString()} points
                </p>
              </div>

              <div className="shrink-0 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-right">
                <p className="text-[10px] sm:text-xs text-[#8C8FA8]">Leaderboard Reward</p>
                <p className="text-sm sm:text-base font-bold text-emerald-400">${selectedUser.reward}</p>
              </div>
            </div>

            {isPrivate ? (
              <div className="rounded-xl border border-[#2A2D3E] bg-[#1A1D2E] p-6 text-center">
                <p className="text-base font-semibold text-white">This profile is private</p>
                <p className="text-sm text-[#8C8FA8] mt-1">
                  You can still view leaderboard position and points for this user.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-[#2A2D3E] bg-[#1A1D2E] p-3">
                    <p className="text-[11px] text-[#8C8FA8]">Rank</p>
                    <p className="text-lg font-bold text-yellow-400">#{selectedUser.rank}</p>
                  </div>
                  <div className="rounded-xl border border-[#2A2D3E] bg-[#1A1D2E] p-3">
                    <p className="text-[11px] text-[#8C8FA8]">Points Earned</p>
                    <p className="text-lg font-bold text-white">{selectedUser.points.toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl border border-[#2A2D3E] bg-[#1A1D2E] p-3">
                    <p className="text-[11px] text-[#8C8FA8]">Tasks Completed</p>
                    <p className="text-lg font-bold text-white">{(stats.offersCompleted || 0).toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl border border-[#2A2D3E] bg-[#1A1D2E] p-3">
                    <p className="text-[11px] text-[#8C8FA8]">Total Rewards</p>
                    <p className="text-lg font-bold text-emerald-400">{toMoney(stats.totalEarningsCents)}</p>
                  </div>
                  <div className="rounded-xl border border-[#2A2D3E] bg-[#1A1D2E] p-3">
                    <p className="text-[11px] text-[#8C8FA8]">Last 30 Days</p>
                    <p className="text-lg font-bold text-emerald-300">{toMoney(stats.last30DaysCents)}</p>
                  </div>
                  <div className="rounded-xl border border-[#2A2D3E] bg-[#1A1D2E] p-3">
                    <p className="text-[11px] text-[#8C8FA8]">Referrals</p>
                    <p className="text-lg font-bold text-white">{(stats.referralCount || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#2A2D3E] bg-[#1A1D2E] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    <p className="font-semibold text-sm sm:text-base">Progress Overview</p>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                    <span className="text-[#9CA3AF]">{progression.currentLevel || "Beginner"}</span>
                    <span className="text-[#9CA3AF]">{progression.nextLevel || "MAX"}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#111827] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] sm:text-xs text-[#8C8FA8]">
                    <span>{(progression.progressCurrent || 0).toLocaleString()} XP</span>
                    <span>{(progression.progressTarget || 0).toLocaleString()} XP</span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#2A2D3E] bg-[#1A1D2E] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <p className="font-semibold text-sm sm:text-base">Recent Completed Tasks</p>
                  </div>

                  {recentOffers.length === 0 ? (
                    <p className="text-sm text-[#8C8FA8]">No completed tasks available yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {recentOffers.slice(0, 6).map((offer) => (
                        <div
                          key={offer._id}
                          className="flex items-center justify-between rounded-lg border border-[#2A2D3E] bg-[#151728] px-3 py-2"
                        >
                          <div className="min-w-0 pr-3">
                            <p className="text-sm text-white font-medium truncate">{offer.title}</p>
                            <p className="text-[11px] text-[#8C8FA8]">{formatDateTime(offer.completedAt)}</p>
                          </div>
                          <p className="text-sm font-semibold text-emerald-400">{toMoney(offer.rewardCents)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardUserProgressModal;
