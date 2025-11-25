"use client";

import React, { useState, useEffect } from "react";
import { X, Award, TrendingUp, Clock, Zap } from "lucide-react";
import Image from "next/image";

interface UserProfile {
  _id: string;
  username: string;
  avatar?: string;
  tier?: string;
  totalEarningsCents: number;
  completedTasksCount: number;
  last30DaysEarningsCents: number;
  affiliatedFriendsCount?: number;
  recentEarnings?: Array<{
    _id: string;
    title: string;
    rewardCents: number;
    completedAt: string;
    type: string;
    provider?: string;
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
      <div className="bg-[#1A1D2E] rounded-2xl border border-emerald-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-emerald-500/10 bg-[#1A1D2E]">
          <h2 className="text-xl font-bold text-white">User Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#26293E] rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
            </div>
          ) : profile ? (
            <>
              {/* Profile Header */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{profile.username}</h3>
                {profile.tier && (
                  <div className="inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-sm text-emerald-400 font-medium">
                    {profile.tier}
                  </div>
                )}
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#26293E] rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={18} className="text-emerald-400" />
                    <span className="text-xs text-gray-400">Total Earned</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    ${(profile.totalEarningsCents / 100).toFixed(2)}
                  </p>
                </div>

                <div className="bg-[#26293E] rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={18} className="text-blue-400" />
                    <span className="text-xs text-gray-400">Tasks Done</span>
                  </div>
                  <p className="text-xl font-bold text-white">{profile.completedTasksCount}</p>
                </div>

                <div className="bg-[#26293E] rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={18} className="text-purple-400" />
                    <span className="text-xs text-gray-400">Last 30 Days</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    ${(profile.last30DaysEarningsCents / 100).toFixed(2)}
                  </p>
                </div>

                {profile.affiliatedFriendsCount !== undefined && (
                  <div className="bg-[#26293E] rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={18} className="text-yellow-400" />
                      <span className="text-xs text-gray-400">Referrals</span>
                    </div>
                    <p className="text-xl font-bold text-white">{profile.affiliatedFriendsCount}</p>
                  </div>
                )}
              </div>

              {/* Recent Earnings */}
              {profile.recentEarnings && profile.recentEarnings.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Recent Earnings</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {profile.recentEarnings.map((earning) => (
                      <div
                        key={earning._id}
                        className="bg-[#26293E] rounded-lg p-3 border border-gray-700 hover:border-emerald-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm truncate">{earning.title}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                              {earning.provider && (
                                <span className="px-2 py-0.5 bg-gray-700 rounded text-gray-300">
                                  {earning.provider}
                                </span>
                              )}
                              <span>{new Date(earning.completedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-400 font-semibold text-sm">
                              +${(earning.rewardCents / 100).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">{earning.type}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
