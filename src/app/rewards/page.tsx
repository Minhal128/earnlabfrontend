"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TopBar from "@/Components/Topbar";
import TickerBar from "../../Components/Shared/TickerBar";
import { useSocket } from "@/contexts/SocketProvider";
import { toast } from "@/utils/toast";

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
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={150}
          height={150}
          className="max-h-[110px] sm:max-h-[125px] w-auto object-contain"
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

export default function RewardsPage() {
  const router = useRouter();
  const { socket } = useSocket();
  const [dailyEligible, setDailyEligible] = useState<boolean | null>(null);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

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

  useEffect(() => {
    fetchDaily();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNotif = (n: any) => {
      try {
        if (n?.type === "daily.checkin") {
          setDailyEligible(false);
          toast.success(n.body || n.message || "Daily bonus claimed");
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
        if (res.status === 400 || /already claimed/i.test(msg)) {
          setDailyEligible(false);
        }
        toast.error(msg);
      } else {
        setClaimMessage(body?.message || "Claim successful");
        setDailyEligible(false);
        toast.success(body?.message || "Claim successful");
      }
    } catch {
      setClaimMessage("Failed to claim reward");
      toast.error("Failed to claim reward");
    } finally {
      setClaimLoading(false);
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
            onClick={() => router.push("/task")}
          />

          <RewardCard
            title="Verification"
            subtitle="Complete your profile and unlock bonus rewards"
            imageSrc="/assets/teir.png"
            imageAlt="Verification trophy"
            buttonText="Go to Account"
            onClick={() => router.push("/account")}
          />
        </section>

        {claimMessage && (
          <p className="mt-5 text-sm sm:text-base text-emerald-400 text-center">{claimMessage}</p>
        )}
      </main>
    </div>
  );
}
