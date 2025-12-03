"use client";

import React, { useState, useEffect } from "react";
import { Copy, Edit2, Share2, Trophy, TrendingUp, Zap, Star, Target } from "lucide-react";
import { toast } from "react-toastify";

interface ReferralData {
  affiliateCode: string;
  referralLink: string;
  totalReferrals: number;
  totalEarningsCents: number;
  conversionRate: number;
  tier: string;
}

// Tier configuration
const TIERS = [
  { name: "STARTER", commission: 5, minReferrals: 0, color: "from-slate-500 to-slate-600", borderColor: "border-slate-500", textColor: "text-slate-400" },
  { name: "BRONZE", commission: 7, minReferrals: 10, color: "from-amber-600 to-amber-700", borderColor: "border-amber-500", textColor: "text-amber-400" },
  { name: "SILVER", commission: 10, minReferrals: 25, color: "from-gray-400 to-gray-500", borderColor: "border-gray-400", textColor: "text-gray-300" },
  { name: "GOLD", commission: 15, minReferrals: 50, color: "from-yellow-500 to-yellow-600", borderColor: "border-yellow-500", textColor: "text-yellow-400" },
  { name: "PLATINUM", commission: 20, minReferrals: 100, color: "from-cyan-500 to-cyan-600", borderColor: "border-cyan-400", textColor: "text-cyan-400" },
];

const ReferralHub: React.FC = () => {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Get current tier based on referrals
  const getCurrentTier = (referrals: number) => {
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (referrals >= TIERS[i].minReferrals) {
        return TIERS[i];
      }
    }
    return TIERS[0];
  };

  // Get next tier
  const getNextTier = (referrals: number) => {
    for (let i = 0; i < TIERS.length; i++) {
      if (referrals < TIERS[i].minReferrals) {
        return TIERS[i];
      }
    }
    return null; // Already at max tier
  };

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/v1/user/referrals`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setReferralData({
            affiliateCode: data.affiliateCode || "cmavgvzxu000z0lbp2nk00ha0",
            referralLink: data.referralLink || "https://labwards.com/register?ref=cmavgvzxu000z0lbp2nk00ha0",
            totalReferrals: data.totalReferrals || 0,
            totalEarningsCents: data.totalEarningsCents || 0,
            conversionRate: data.conversionRate || 0.0,
            tier: data.tier || "STARTER",
          });
        }
      } catch (error) {
        console.error("Error fetching referral data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  const copyToClipboard = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(`${type === "code" ? "Code" : "Link"} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const shareOnSocial = (platform: string) => {
    if (!referralData) return;

    const text = `Join Labwards and earn money! Use my referral link to get started.`;
    const encodedText = encodeURIComponent(text);
    const encodedLink = encodeURIComponent(referralData.referralLink);

    const urls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedLink}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
      telegram: `https://t.me/share/url?url=${encodedLink}&text=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedLink}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
  };

  const currentTier = getCurrentTier(referralData?.totalReferrals || 0);
  const nextTier = getNextTier(referralData?.totalReferrals || 0);
  const progressToNextTier = nextTier 
    ? ((referralData?.totalReferrals || 0) / nextTier.minReferrals) * 100 
    : 100;

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0A0C1A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0A0C1A] text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-emerald-500/10 to-transparent border-b border-emerald-500/20 px-4 sm:px-6 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          <div className="text-xs uppercase tracking-widest text-emerald-400">Referral Hub</div>
          <h1 className="text-2xl sm:text-4xl font-bold">Grow faster with your community</h1>
          <p className="text-xs sm:text-base text-[#9CA3AF] max-w-2xl">
            Bring creators, gamers, and friends to Labwards and earn lifetime commissions on all their earnings.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Total Referrals */}
          <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-4 sm:p-6">
            <p className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-2">Total Referrals</p>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{referralData?.totalReferrals || 0}</p>
            <p className="text-xs text-[#9CA3AF]">All-time invites</p>
          </div>

          {/* Lifetime Earnings */}
          <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-4 sm:p-6">
            <p className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-2">Lifetime Earnings</p>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1">
              ${((referralData?.totalEarningsCents || 0) / 100).toFixed(2)}
            </p>
            <p className="text-xs text-[#9CA3AF]">Referral commissions</p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-4 sm:p-6">
            <p className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-2">Conversion Rate</p>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{(referralData?.conversionRate || 0).toFixed(1)}%</p>
            <p className="text-xs text-[#9CA3AF]">Referrals as clicks</p>
          </div>

          {/* Active Tier */}
          <div className={`bg-[#1A1D2E] border ${currentTier.borderColor} rounded-xl p-4 sm:p-6`}>
            <p className="text-xs uppercase tracking-widest text-[#9CA3AF] mb-2">Active Tier</p>
            <p className={`text-2xl sm:text-3xl font-bold ${currentTier.textColor} mb-1`}>{currentTier.name}</p>
            <p className="text-xs text-[#9CA3AF]">{currentTier.commission}% commission</p>
          </div>
        </div>

        {/* Tier Progression Section */}
        <div className="bg-gradient-to-br from-[#1A1D2E] to-[#151728] border border-[#2A2D3E] rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Tier Progression</h2>
              <p className="text-xs text-[#9CA3AF]">Unlock higher commissions as you grow</p>
            </div>
          </div>

          {/* Progress Bar */}
          {nextTier && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-semibold ${currentTier.textColor}`}>{currentTier.name}</span>
                <span className={`text-sm font-semibold ${nextTier.textColor}`}>{nextTier.name}</span>
              </div>
              <div className="h-3 bg-[#2A2D3E] rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${currentTier.color} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(progressToNextTier, 100)}%` }}
                />
              </div>
              <p className="text-xs text-[#9CA3AF] mt-2 text-center">
                {nextTier.minReferrals - (referralData?.totalReferrals || 0)} more referrals to reach {nextTier.name} ({nextTier.commission}% commission)
              </p>
            </div>
          )}

          {/* Tiers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {TIERS.map((tier, idx) => {
              const isCurrentTier = tier.name === currentTier.name;
              const isUnlocked = (referralData?.totalReferrals || 0) >= tier.minReferrals;
              
              return (
                <div 
                  key={tier.name}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    isCurrentTier 
                      ? `${tier.borderColor} bg-gradient-to-br ${tier.color} bg-opacity-20` 
                      : isUnlocked 
                        ? `${tier.borderColor} border-opacity-50 bg-[#1A1D2E]` 
                        : 'border-[#2A2D3E] bg-[#1A1D2E] opacity-60'
                  } hover:scale-105 hover:shadow-lg`}
                >
                  {isCurrentTier && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                  <div className="text-center">
                    <p className={`text-2xl sm:text-3xl font-bold ${tier.textColor} mb-1`}>{tier.commission}%</p>
                    <p className="text-xs font-semibold text-white mb-1">{tier.name}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{tier.minReferrals}+ refs</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">Key Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div className="flex items-center gap-3 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg p-3 sm:p-4">
              <span className="text-lg sm:text-xl flex-shrink-0">⭐</span>
              <span className="text-xs sm:text-sm text-[#9CA3AF]">Lifetime payouts</span>
            </div>
            <div className="flex items-center gap-3 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg p-3 sm:p-4">
              <span className="text-lg sm:text-xl flex-shrink-0">📊</span>
              <span className="text-xs sm:text-sm text-[#9CA3AF]">Higher tiers</span>
            </div>
            <div className="flex items-center gap-3 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg p-3 sm:p-4">
              <span className="text-lg sm:text-xl flex-shrink-0">📈</span>
              <span className="text-xs sm:text-sm text-[#9CA3AF]">Real-time analytics</span>
            </div>
            <div className="flex items-center gap-3 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg p-3 sm:p-4">
              <span className="text-lg sm:text-xl flex-shrink-0">🚀</span>
              <span className="text-xs sm:text-sm text-[#9CA3AF]">Dedicated support</span>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white">Your referral link</h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 w-fit">
              STANDARD
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#9CA3AF]">Earn 5% on every referral for life.</p>

          {/* Referral Code */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#9CA3AF]">Referral Code</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg px-4 py-3 font-mono text-xs sm:text-sm text-white break-all">
                {referralData?.affiliateCode}
              </div>
              <button
                onClick={() => copyToClipboard(referralData?.affiliateCode || "", "code")}
                className="px-4 sm:px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors whitespace-nowrap text-sm"
              >
                {copied === "code" ? "✓ Copied" : "Copy"}
              </button>
              <button className="px-4 sm:px-6 py-3 bg-[#1A1D2E] border border-[#2A2D3E] hover:border-emerald-500/30 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm">
                <Edit2 size={16} />
                <span className="hidden sm:inline">Edit</span>
              </button>
            </div>
          </div>

          {/* Referral Link */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#9CA3AF]">Referral Link</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg px-4 py-3 font-mono text-xs sm:text-sm text-white break-all">
                {referralData?.referralLink}
              </div>
              <button
                onClick={() => copyToClipboard(referralData?.referralLink || "", "link")}
                className="px-4 sm:px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors whitespace-nowrap text-sm"
              >
                {copied === "link" ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Quick Share */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#9CA3AF] flex items-center gap-2">
              <span>⭐</span> Quick share
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <button
                onClick={() => shareOnSocial("twitter")}
                className="flex items-center justify-center gap-1 sm:gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition-colors text-xs sm:text-sm"
              >
                <span>𝕏</span>
                <span className="hidden sm:inline">Twitter</span>
              </button>
              <button
                onClick={() => shareOnSocial("facebook")}
                className="flex items-center justify-center gap-1 sm:gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 sm:py-3 rounded-lg transition-colors text-xs sm:text-sm"
              >
                <span>f</span>
                <span className="hidden sm:inline">Facebook</span>
              </button>
              <button
                onClick={() => shareOnSocial("telegram")}
                className="flex items-center justify-center gap-1 sm:gap-2 bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 sm:py-3 rounded-lg transition-colors text-xs sm:text-sm"
              >
                <span>✈</span>
                <span className="hidden sm:inline">Telegram</span>
              </button>
              <button
                onClick={() => shareOnSocial("whatsapp")}
                className="flex items-center justify-center gap-1 sm:gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition-colors text-xs sm:text-sm"
              >
                <span>💬</span>
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Performance Section */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-white">Performance</h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF]">Snapshot</p>
          <p className="text-xs text-[#9CA3AF]">Live metrics pulled from your referral activity</p>
          <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-4 sm:p-6">
            <p className="text-center text-[#9CA3AF] py-6 sm:py-8 text-sm">No referral data available yet</p>
          </div>
        </div>

        {/* Affiliate Benefits Section */}
        <div className="space-y-3 sm:space-y-4 pb-8">
          <h2 className="text-lg sm:text-xl font-bold text-white">Affiliate Benefits</h2>
          <div className="space-y-2 sm:space-y-3">
            {[
              { icon: "⭐", title: "Lifetime Commissions", desc: "Earn forever from every user you refer" },
              { icon: "📊", title: "Instant Tracking", desc: "Real-time stats and performance metrics" },
              { icon: "🎯", title: "Tier Progression", desc: "Unlock higher commissions as you grow" },
              { icon: "⚡", title: "Fast Payments", desc: "Weekly payouts directly to your account" },
              { icon: "🎧", title: "Dedicated Support", desc: "Priority support for affiliates" },
              { icon: "🚀", title: "No Limits", desc: "Unlimited referrals, unlimited earning potential" },
            ].map((benefit, idx) => (
              <div key={idx} className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg p-3 sm:p-4 flex items-start gap-3 sm:gap-4">
                <span className="text-xl sm:text-2xl flex-shrink-0">{benefit.icon}</span>
                <div>
                  <p className="font-semibold text-sm sm:text-base text-white">{benefit.title}</p>
                  <p className="text-xs sm:text-sm text-[#9CA3AF]">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralHub;
