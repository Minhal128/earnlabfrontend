"use client";

import React, { useState, useEffect } from "react";
import { X, Award, TrendingUp, Clock, Zap, ArrowDownRight, ArrowUpRight, Users } from "lucide-react";
import Image from "next/image";

interface UserProfile {
  _id: string;
  username: string;
  avatar?: string;
  tier?: string;
  xp?: number;
  maxXp?: number;
  totalEarningsCents: number;
  totalWithdrawnCents?: number;
  completedTasksCount: number;
  last30DaysEarningsCents: number;
  affiliatedFriendsCount?: number;
  joinedAt?: string;
  recentTasks?: Array<{
    _id: string;
    title: string;
    rewardCents: number;
    completedAt: string;
    type: string;
    provider?: string;
    image?: string;
  }>;
  recentWithdrawals?: Array<{
    _id: string;
    amountCents: number;
    method: string;
    status: string;
    createdAt: string;
  }>;
}

interface UserProfileModalProps {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, userId, onClose }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${api}/api/v1/user/${userId}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A1D2E] rounded-2xl border border-emerald-500/20 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-emerald-500/10 bg-[#1A1D2E] z-10">
          <h2 className="text-lg font-bold text-white">Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#26293E] rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400"></div>
            </div>
          ) : profile ? (
            <>
              {/* Profile Header */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {profile.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{profile.username}</h3>
                  <p className="text-xs text-gray-400">
                    Joined {profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                  </p>
                </div>
              </div>

              {/* Tier Progress */}
              <div className="bg-[#26293E] rounded-xl p-3 border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">{profile.tier || 'Silver'}</span>
                  <span className="text-sm font-medium text-yellow-400">Gold</span>
                </div>
                <div className="w-full bg-[#1A1D2E] rounded-full h-2 mb-1">
                  <div 
                    className="h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((profile.xp || 0) / (profile.maxXp || 100000)) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{profile.xp || 0} XP</span>
                  <span>{(profile.maxXp || 100000).toLocaleString()} XP</span>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Statistics</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#26293E] rounded-lg p-3 border border-gray-700">
                    <p className="text-lg font-bold text-emerald-400">
                      ${(profile.totalEarningsCents / 100).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">Total Earned</p>
                  </div>
                  <div className="bg-[#26293E] rounded-lg p-3 border border-gray-700">
                    <p className="text-lg font-bold text-white">{profile.completedTasksCount}</p>
                    <p className="text-xs text-gray-400">Completed Tasks</p>
                  </div>
                  <div className="bg-[#26293E] rounded-lg p-3 border border-gray-700">
                    <p className="text-lg font-bold text-white">{profile.affiliatedFriendsCount || 0}</p>
                    <p className="text-xs text-gray-400">Affiliated Friends</p>
                  </div>
                </div>
              </div>

              {/* Tasks History */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-3">Tasks</h4>
                <div className="bg-[#26293E] rounded-xl border border-gray-700 overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-3 gap-2 px-3 py-2 bg-[#1A1D2E] text-xs text-gray-400 border-b border-gray-700">
                    <span>Tasks</span>
                    <span className="text-center">Date</span>
                    <span className="text-right">Reward</span>
                  </div>
                  
                  {/* Table Rows */}
                  <div className="max-h-48 overflow-y-auto">
                    {profile.recentTasks && profile.recentTasks.length > 0 ? (
                      profile.recentTasks.map((task, idx) => (
                        <div 
                          key={task._id || idx} 
                          className="grid grid-cols-3 gap-2 px-3 py-2.5 border-b border-gray-700/50 hover:bg-[#1A1D2E]/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {task.image ? (
                              <img src={task.image} alt={task.title} className="w-8 h-8 rounded object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-xs font-bold">
                                {task.title?.charAt(0) || 'T'}
                              </div>
                            )}
                            <span className="text-xs text-white truncate">{task.title}</span>
                          </div>
                          <span className="text-xs text-gray-400 text-center self-center">
                            {new Date(task.completedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} | {new Date(task.completedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                          </span>
                          <span className="text-xs text-emerald-400 font-semibold text-right self-center">
                            ${(task.rewardCents / 100).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-6 text-center text-gray-400 text-xs">
                        No tasks completed yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Failed to load user profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
