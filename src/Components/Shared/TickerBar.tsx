"use client";

import React, { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const WorldcoinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
      stroke="#14A28A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M12 16v-4m0-4h.01"
      stroke="#14A28A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const OfferwallIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6h18M3 12h18M3 18h18"
      stroke="#6155F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const TickerItem = ({
  icon,
  label,
  value,
  amount,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  amount: string;
}) => (
  <div className="flex items-center gap-2 sm:gap-3 bg-[#1A1D2E] rounded-md sm:rounded-lg px-2 sm:px-[14px] py-1 sm:py-2 min-w-max border border-[#2A2D3E]">
    <div className="w-[18px] h-[18px] sm:w-[24px] sm:h-[24px]">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[9px] sm:text-[11px] font-medium text-[#8C8FA8] leading-[10px] sm:leading-[12px]">
        {label}
      </span>
      <span className="text-[11px] sm:text-[14px] font-semibold text-white leading-[14px] sm:leading-[18px] mt-0.5 sm:mt-1">
        {value}
      </span>
    </div>
    <div className="ml-1 sm:ml-2 bg-[#252840] rounded text-[11px] sm:text-[14px] font-bold text-[#14A28A] px-2 py-0.5 sm:py-1 leading-none shadow-[0_2px_4px_rgba(20,162,138,0.1)]">
      {amount}
    </div>
  </div>
);

const STATIC_TICKER = [
  { icon: <WorldcoinIcon />, label: "User withdrew", value: "Litecoin", amount: "$3.50" },
  { icon: <OfferwallIcon />, label: "User earned", value: "OfferToro", amount: "$0.80" },
  { icon: <WorldcoinIcon />, label: "User withdrew", value: "Ethereum", amount: "$15.00" },
  { icon: <OfferwallIcon />, label: "User earned", value: "AdGate", amount: "$1.20" },
  { icon: <WorldcoinIcon />, label: "User withdrew", value: "Bitcoin", amount: "$42.50" },
  { icon: <OfferwallIcon />, label: "User earned", value: "RevU", amount: "$2.10" },
  { icon: <WorldcoinIcon />, label: "User withdrew", value: "PayPal", amount: "$5.00" },
  { icon: <OfferwallIcon />, label: "User earned", value: "Lootably", amount: "$0.45" },
  { icon: <WorldcoinIcon />, label: "User withdrew", value: "Dogecoin", amount: "$1.50" },
  { icon: <OfferwallIcon />, label: "User earned", value: "Ayestudios", amount: "$3.75" },
];

export default function TickerBar() {
  const [feedEvents, setFeedEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/v1/feed/activity`)
      .then((r) => r.json())
      .then((data) => { if (data?.events) setFeedEvents(data.events); })
      .catch(() => {});
  }, []);

  let baseTickerItems =
    feedEvents.length > 0
      ? feedEvents.map((ev: any) => {
          const isWithdrawal = ev.type === "withdrawal";
          const amountStr = ev.amountCents
            ? `$${(ev.amountCents / 100).toFixed(2)}`
            : "$0.00";
          const value = ev.text
            ? ev.text.replace(/withdrew|earned/i, "").trim()
            : isWithdrawal
            ? "Withdrawal"
            : "Offer";
          return {
            icon: isWithdrawal ? <WorldcoinIcon /> : <OfferwallIcon />,
            label: isWithdrawal ? "User withdrew" : "User earned",
            value,
            amount: amountStr,
          };
        })
      : STATIC_TICKER;

  if (baseTickerItems.length < 6) {
    baseTickerItems = [...baseTickerItems, ...STATIC_TICKER];
  }
  const tickerItems = [...baseTickerItems, ...baseTickerItems, ...baseTickerItems, ...baseTickerItems];

  return (
    <div className="w-full bg-[#0D0F1E] overflow-hidden border-b border-[#1E2133] pointer-events-none">
      <div className="flex animate-scroll-left flex-row gap-[15px] px-4 py-2 sm:py-3 w-max">
        {tickerItems.map((item, i) => (
          <TickerItem key={i} icon={item.icon} label={item.label} value={item.value} amount={item.amount} />
        ))}
      </div>
    </div>
  );
}