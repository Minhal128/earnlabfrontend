"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUser, useAuth } from "@clerk/nextjs";

import Af1 from "../../../public/assets/af1.png";
import Af2 from "../../../public/assets/af2.png";
import Af3 from "../../../public/assets/af3.png";
import Af4 from "../../../public/assets/af4.png";
import tierImg from "../../../public/assets/teir.png";

type Tab = "dashboard" | "codes" | "tiers";

interface ReferralData {
  affiliateCode: string;
  referralLink: string;
  totalEarnedCents: number;
  availableCents: number;
  pendingCount: number;
}

const AffiliateDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://earlabbackend.vercel.app";

  // Fetch referral data from API
  useEffect(() => {
    const fetchReferralData = async () => {
      if (!isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/v1/user/referrals`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setReferralData(data);
        }
      } catch (error) {
        console.error("Error fetching referral data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [isSignedIn, getToken]);

  // Copy referral link
  const copyToClipboard = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Share on social media
  const shareOnSocial = (platform: string) => {
    if (!referralData?.referralLink) return;

    const text = `Join Labwards and earn money! Use my referral link: ${referralData.referralLink}`;
    const encodedText = encodeURIComponent(text);

    const urls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralData.referralLink)}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralData.referralLink)}&text=${encodedText}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
  };

  if (loading) {
    return (
      <div className="w-full pt-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg p-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-lg">
      {/* Header */}
      <div className="mb-6 px-4 overflow-visible">
        <h2 className="text-xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent inline-block" style={{ fontKerning: 'auto', letterSpacing: '0.02em' }}>
          🚀 Affiliate Program
        </h2>
        <p className="text-slate-300 text-xs md:text-base mt-2">
          Earn money for every friend you refer to Labwards
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-2 bg-slate-800 border border-slate-700 w-full md:w-96 rounded-lg overflow-hidden mb-6 mx-4 shadow-lg">
        {["dashboard", "codes", "tiers"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={`flex-1 px-2 md:px-4 py-2 cursor-pointer capitalize transition text-xs md:text-base font-medium
              ${
                activeTab === tab
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "dashboard" && (
        <div className="px-4 pb-6">
          {/* Referral Link Section - Prominent */}
          {referralData && (
            <div className="mb-6 p-6 bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-700 rounded-2xl shadow-2xl border border-cyan-500 border-opacity-30">
              <h3 className="text-white font-bold mb-3 text-xl">🔗 Your Referral Link</h3>
              <p className="text-cyan-100 text-sm mb-4 opacity-95">
                Share this link with friends to earn commissions!
              </p>

              {/* Link Display */}
              <div className="bg-slate-900 bg-opacity-50 backdrop-blur-sm rounded-xl p-4 mb-4 flex items-center justify-between gap-3 flex-wrap border border-cyan-400 border-opacity-30">
                <code className="text-cyan-300 text-sm break-all flex-1 font-mono">
                  {referralData.referralLink}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition shadow-lg"
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>

              {/* Affiliate Code */}
              <div className="mb-4 bg-slate-900 bg-opacity-40 rounded-lg p-3 border border-cyan-400 border-opacity-20">
                <p className="text-cyan-200 text-sm opacity-90">Your Affiliate Code:</p>
                <p className="text-cyan-300 font-bold text-lg font-mono">{referralData.affiliateCode}</p>
              </div>

              {/* Social Share Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => shareOnSocial("twitter")}
                  className="bg-slate-700 hover:bg-slate-600 text-cyan-300 px-3 py-2 rounded-lg text-sm font-medium transition border border-cyan-400 border-opacity-40"
                >
                  𝕏 Twitter
                </button>
                <button
                  onClick={() => shareOnSocial("facebook")}
                  className="bg-slate-700 hover:bg-slate-600 text-cyan-300 px-3 py-2 rounded-lg text-sm font-medium transition border border-cyan-400 border-opacity-40"
                >
                  f Facebook
                </button>
                <button
                  onClick={() => shareOnSocial("whatsapp")}
                  className="bg-slate-700 hover:bg-slate-600 text-cyan-300 px-3 py-2 rounded-lg text-sm font-medium transition border border-cyan-400 border-opacity-40"
                >
                  💬 WhatsApp
                </button>
                <button
                  onClick={() => shareOnSocial("telegram")}
                  className="bg-slate-700 hover:bg-slate-600 text-cyan-300 px-3 py-2 rounded-lg text-sm font-medium transition border border-cyan-400 border-opacity-40"
                >
                  ✈️ Telegram
                </button>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="group bg-gradient-to-br from-slate-800 to-slate-700 px-4 py-5 rounded-xl flex items-center gap-3 border border-cyan-500 border-opacity-30 shadow-lg hover:shadow-cyan-500/20 hover:shadow-2xl hover:border-cyan-400 hover:scale-105 hover:bg-gradient-to-br hover:from-cyan-900/40 hover:to-slate-700 transition-all duration-300 cursor-pointer">
              <Image
                src={Af1}
                alt="Available Revenue"
                width={32}
                height={32}
                className="object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  ${referralData ? (referralData.availableCents / 100).toFixed(2) : "0.00"}
                </h3>
                <p className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">Available to Claim</p>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-slate-800 to-slate-700 px-4 py-5 rounded-xl flex items-center gap-3 border border-blue-500 border-opacity-30 shadow-lg hover:shadow-blue-500/20 hover:shadow-2xl hover:border-blue-400 hover:scale-105 hover:bg-gradient-to-br hover:from-blue-900/40 hover:to-slate-700 transition-all duration-300 cursor-pointer">
              <Image
                src={Af2}
                alt="Pending Referrals"
                width={32}
                height={32}
                className="object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                  {referralData?.pendingCount || 0}
                </h3>
                <p className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">Pending Referrals</p>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-slate-800 to-slate-700 px-4 py-5 rounded-xl flex items-center gap-3 border border-purple-500 border-opacity-30 shadow-lg hover:shadow-purple-500/20 hover:shadow-2xl hover:border-purple-400 hover:scale-105 hover:bg-gradient-to-br hover:from-purple-900/40 hover:to-slate-700 transition-all duration-300 cursor-pointer">
              <Image
                src={Af3}
                alt="Total Referred"
                width={32}
                height={32}
                className="object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors">0</h3>
                <p className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">Total Referred Users</p>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-slate-800 to-slate-700 px-4 py-5 rounded-xl flex items-center gap-3 border border-green-500 border-opacity-30 shadow-lg hover:shadow-green-500/20 hover:shadow-2xl hover:border-green-400 hover:scale-105 hover:bg-gradient-to-br hover:from-green-900/40 hover:to-slate-700 transition-all duration-300 cursor-pointer">
              <Image
                src={Af4}
                alt="Total Earned"
                width={32}
                height={32}
                className="object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                  ${referralData ? ((referralData.totalEarnedCents + referralData.availableCents) / 100).toFixed(2) : "0.00"}
                </h3>
                <p className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">Total Earned</p>
              </div>
            </div>
          </div>

          {/* Claim Button */}
          {referralData && referralData.availableCents > 0 && (
            <div className="mb-6">
              <button
                onClick={copyToClipboard}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
              >
                💰 Claim ${(referralData.availableCents / 100).toFixed(2)} to Wallet
              </button>
            </div>
          )}

          {/* Referred Users Section */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">👥 Your Referred Users</h3>

            <div className="text-center py-8 text-slate-400">
              <p>No referred users yet. Share your link to get started!</p>
            </div>
          </div>
        </div>
      )}

      {/* Codes Tab */}
      {activeTab === "codes" && (
        <div className="px-4 pb-6 space-y-6">
          {/* Referral Code Section */}
          {referralData && (
            <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-700 rounded-2xl shadow-2xl border border-cyan-500 border-opacity-30 p-6">
              <h3 className="text-white font-bold mb-3 text-xl">🔑 Your Referral Code</h3>
              <p className="text-cyan-100 text-sm mb-4 opacity-95">
                Share this code with friends to earn commissions!
              </p>

              {/* Code Display */}
              <div className="bg-slate-900 bg-opacity-50 backdrop-blur-sm rounded-xl p-4 mb-4 flex items-center justify-between gap-3 flex-wrap border border-cyan-400 border-opacity-30">
                <code className="text-cyan-300 text-lg break-all flex-1 font-mono font-bold">
                  {referralData.affiliateCode}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralData.affiliateCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition shadow-lg"
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>

              {/* Referral Link */}
              <div className="mb-4 bg-slate-900 bg-opacity-40 rounded-lg p-3 border border-cyan-400 border-opacity-20">
                <p className="text-cyan-200 text-sm opacity-90 mb-2">Your Referral Link:</p>
                <code className="text-cyan-300 font-mono text-xs break-all">{referralData.referralLink}</code>
              </div>
            </div>
          )}

          {/* Earnings Stats */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">📊 Your Referral Earnings</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-4 rounded-xl border border-cyan-500 border-opacity-30">
                <p className="text-cyan-300 text-sm font-medium mb-1">Pending Earnings</p>
                <p className="text-2xl font-bold text-cyan-400">
                  ${referralData ? (referralData.availableCents / 100).toFixed(2) : "0.00"}
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-4 rounded-xl border border-blue-500 border-opacity-30">
                <p className="text-blue-300 text-sm font-medium mb-1">Pending Referrals</p>
                <p className="text-2xl font-bold text-blue-400">{referralData?.pendingCount || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-4 rounded-xl border border-green-500 border-opacity-30">
                <p className="text-green-300 text-sm font-medium mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-green-400">
                  ${referralData ? (referralData.totalEarnedCents / 100).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tiers Tab */}
      {activeTab === "tiers" && (
        <div className="px-4 pb-6">
          <div className="mb-6">
            <span className="px-6 py-2 text-sm rounded-full bg-slate-700 text-cyan-300 font-medium border border-cyan-500 border-opacity-30">
              💡 Earn higher commissions as you refer more users!
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { tier: 1, commission: 5, requirement: "Default (0 referrals)", color: "border-cyan-500", hoverBg: "hover:from-cyan-900/40", hoverShadow: "hover:shadow-cyan-500/30", hoverBorder: "hover:border-cyan-400", textColor: "text-cyan-400" },
              { tier: 2, commission: 7, requirement: "10+ referrals", color: "border-blue-500", hoverBg: "hover:from-blue-900/40", hoverShadow: "hover:shadow-blue-500/30", hoverBorder: "hover:border-blue-400", textColor: "text-blue-400" },
              { tier: 3, commission: 10, requirement: "25+ referrals", color: "border-purple-500", hoverBg: "hover:from-purple-900/40", hoverShadow: "hover:shadow-purple-500/30", hoverBorder: "hover:border-purple-400", textColor: "text-purple-400" },
              { tier: 4, commission: 15, requirement: "50+ referrals (VIP)", color: "border-green-500", hoverBg: "hover:from-green-900/40", hoverShadow: "hover:shadow-green-500/30", hoverBorder: "hover:border-green-400", textColor: "text-green-400" },
            ].map((tier) => (
              <div
                key={tier.tier}
                className={`group bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl ${tier.hoverShadow} hover:scale-105 ${tier.hoverBg} hover:to-slate-700 transition-all duration-300 border ${tier.color} ${tier.hoverBorder} border-opacity-40 cursor-pointer`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={tierImg}
                    alt={`Tier ${tier.tier}`}
                    width={40}
                    height={40}
                    className="rounded-md group-hover:scale-110 transition-transform duration-300"
                  />
                  <h3 className="text-lg font-bold text-white group-hover:text-slate-100">Tier {tier.tier}</h3>
                </div>

                <hr className="border-slate-600 mb-4 group-hover:border-slate-500 transition-colors" />

                <div className="mb-4">
                  <p className="text-slate-300 text-sm font-medium mb-2 group-hover:text-white transition-colors">Commission Rate:</p>
                  <p className={`text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-400`}>
                    {tier.commission}%
                  </p>
                </div>

                <hr className="border-slate-600 mb-4 group-hover:border-slate-500 transition-colors" />

                <div>
                  <p className="text-slate-300 text-sm font-medium mb-2 group-hover:text-white transition-colors">Requirement:</p>
                  <p className="text-slate-200 text-sm font-semibold group-hover:text-white transition-colors">{tier.requirement}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">
            <h4 className="text-white font-bold mb-4 text-lg">📈 How It Works:</h4>
            <ul className="text-slate-300 text-sm space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold text-lg">✓</span>
                <span>Share your referral link with friends</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold text-lg">✓</span>
                <span>When they sign up and complete offers, you earn commission</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-400 font-bold text-lg">✓</span>
                <span>Your commission rate increases as you refer more users</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 font-bold text-lg">✓</span>
                <span>Admins can set custom rates for top referrers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold text-lg">✓</span>
                <span>Claim your earnings anytime to your wallet</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateDashboard;
