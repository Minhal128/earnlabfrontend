"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TopBar from "@/Components/Topbar";
import OffersSurveysRewardsDisclaimer from "@/Components/Shared/OffersSurveysRewardsDisclaimer";
import TickerBar from "../../Components/Shared/TickerBar";
import { useSocket } from "@/contexts/SocketProvider";

interface RewardCardProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  buttonText: string;
  disabled?: boolean;
  onClick: () => void;
}

function RewardCard({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  buttonText,
  disabled,
  onClick,
}: RewardCardProps) {
  return (
    <article className="rounded-2xl border border-[#2C3146] bg-[#131629] p-5 sm:p-6 flex flex-col gap-4 min-h-[320px]">
      <div className="flex-1">
        <h2 className="text-white font-bold text-xl sm:text-2xl leading-tight">{title}</h2>
        <p className="text-[#9CA3AF] mt-2 text-sm sm:text-base">{subtitle}</p>
      </div>

      <div className="h-[120px] sm:h-[140px] rounded-xl bg-[#1A1F35] border border-[#2A2F45] flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="max-h-[110px] sm:max-h-[125px] max-w-[150px] w-auto object-contain"
        />
      </div>

      <button
        onClick={onClick}
        disabled={disabled}
        className="h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-base transition-colors"
      >
        {buttonText}
      </button>
    </article>
  );
}

interface SpinRewardModalProps {
  open: boolean;
  spinning: boolean;
  rewardLabel: string;
  message: string | null;
  onClose: () => void;
}

interface DailyCheckinNotification {
  type?: string;
  body?: string;
  message?: string;
}

function SpinRewardModal({
  open,
  spinning,
  rewardLabel,
  message,
  onClose,
}: SpinRewardModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#2A2F45] bg-[#131629] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        <h3 className="text-white text-xl sm:text-2xl font-bold">Signing up bonus</h3>
        <p className="text-[#9CA3AF] text-sm sm:text-base mt-2">
          {spinning ? "Spinning your reward..." : "Your reward is ready!"}
        </p>

        <div className="relative w-[220px] h-[220px] mx-auto mt-5 mb-4">
          <Image
            src="/assets/reward.png"
            alt="Spinning reward wheel"
            width={220}
            height={220}
            className={`w-full h-full object-contain transition-transform duration-700 ${spinning ? "animate-spin" : ""}`}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-emerald-400/30 bg-[#0D0F1E]/90 px-5 py-2">
              <span className="text-emerald-400 font-bold text-xl">{rewardLabel}</span>
            </div>
          </div>
        </div>

        <p className="text-[#B3B6C7] text-sm min-h-[20px]">{message || ""}</p>

        <button
          onClick={onClose}
          disabled={spinning}
          className="mt-4 h-11 w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-colors"
        >
          {spinning ? "Spinning..." : "Done"}
        </button>
      </div>
    </div>
  );
}

export default function RewardsPage() {
  const router = useRouter();
  const { socket } = useSocket();
  const [dailyEligible, setDailyEligible] = useState<boolean | null>(null);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);
  const [spinModalOpen, setSpinModalOpen] = useState(false);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [spinMessage, setSpinMessage] = useState<string | null>(null);
  const [spinRewardLabel, setSpinRewardLabel] = useState("$0.25");
  const [verificationImage, setVerificationImage] = useState("/assets/profile.png");

  const getApi = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchDaily = async () => {
    const api = getApi();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setDailyEligible(null);
      return;
    }
    try {
      const res = await fetch(`${api}/api/v1/user/daily-checkin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setDailyEligible(null);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (typeof data?.eligible === "boolean") {
        setDailyEligible(data.eligible);
      }
    } catch {
      setDailyEligible(null);
    }
  };

  const fetchProfilePreview = async () => {
    const api = getApi();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    try {
      const res = await fetch(`${api}/api/v1/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;

      const data = await res.json().catch(() => ({}));
      const avatar = data?.profile?.avatarUrl || data?.user?.avatarUrl;
      if (typeof avatar === "string" && avatar.trim()) {
        setVerificationImage(avatar);
      }
    } catch {
      // Keep default verification image
    }
  };

  useEffect(() => {
    fetchDaily();
    fetchProfilePreview();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNotif = (n: DailyCheckinNotification) => {
      try {
        if (n?.type === "daily.checkin") {
          setDailyEligible(false);
          setSpinMessage(n.body || n.message || "Daily bonus claimed");
          setWheelSpinning(false);
          setSpinModalOpen(true);
        }
      } catch {
        // ignore malformed socket notifications
      }
    };

    socket.on("notification", onNotif);
    return () => {
      try {
        socket.off("notification", onNotif);
      } catch {
        // ignore cleanup errors
      }
    };
  }, [socket]);

  const doDailyClaim = async () => {
    const api = getApi();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setClaimMessage("Please sign in to claim rewards.");
      return;
    }

    setClaimLoading(true);
    setClaimMessage(null);
    setSpinMessage(null);
    setSpinModalOpen(true);
    setWheelSpinning(true);

    try {
      const res = await fetch(`${api}/api/v1/user/daily-checkin/claim`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = body?.message || "Failed to claim";
        setClaimMessage(msg);
        setSpinRewardLabel("$0.00");
        setSpinMessage(msg);
        if (res.status === 400 || /already claimed/i.test(msg)) {
          setDailyEligible(false);
        }
      } else {
        const rewardCents =
          typeof body?.rewardCents === "number"
            ? body.rewardCents
            : typeof body?.rewardAmountCents === "number"
              ? body.rewardAmountCents
              : typeof body?.amountCents === "number"
                ? body.amountCents
                : 25;

        const reward = `$${(rewardCents / 100).toFixed(2)}`;

        setClaimMessage(body?.message || "Claim successful");
        setDailyEligible(false);
        setSpinRewardLabel(reward);
        setSpinMessage(body?.message || `You won ${reward}`);
      }
    } catch {
      setClaimMessage("Failed to claim reward");
      setSpinRewardLabel("$0.00");
      setSpinMessage("Failed to claim reward");
    } finally {
      setClaimLoading(false);
      setWheelSpinning(false);
    }
  };

  const spinLabel = claimLoading ? "Spinning..." : dailyEligible === false ? "Claimed" : "Spin";

  return (
    <div className="min-h-screen bg-[#0D0F1E]">
      <TopBar />
      <TickerBar />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-10">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <RewardCard
            title="Sign up bonus"
            subtitle="Win up to $30"
            imageSrc="/assets/reward.png"
            imageAlt="Spin reward wheel"
            buttonText={spinLabel}
            disabled={claimLoading || dailyEligible === false}
            onClick={doDailyClaim}
          />

          <RewardCard
            title="7 days streak"
            subtitle="Earn daily rewards to keep your streak alive"
            imageSrc="/assets/box.png"
            imageAlt="Streak rewards"
            buttonText="Go to Tasks"
            onClick={() => router.push("/tasks")}
          />

          <RewardCard
            title="Verification"
            subtitle="Complete your profile and unlock bonus rewards"
            imageSrc={verificationImage}
            imageAlt="Profile picture verification"
            buttonText="Verify now"
            onClick={() => router.push("/verification")}
          />
        </section>

        <OffersSurveysRewardsDisclaimer className="mt-6" />

        <SpinRewardModal
          open={spinModalOpen}
          spinning={wheelSpinning}
          rewardLabel={spinRewardLabel}
          message={spinMessage}
          onClose={() => setSpinModalOpen(false)}
        />

        {claimMessage && (
          <p className="mt-5 text-sm sm:text-base text-emerald-400 text-center">{claimMessage}</p>
        )}
      </main>
    </div>
  );
}
