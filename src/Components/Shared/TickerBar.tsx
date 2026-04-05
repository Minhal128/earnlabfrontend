"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const LOGO_RULES: Array<{ pattern: RegExp; src: string }> = [
  { pattern: /bitcoin|btc/i, src: "/assets/bit.png" },
  { pattern: /doge|dogecoin/i, src: "/assets/dolar.png" },
  { pattern: /sol|solana/i, src: "/assets/sol.png" },
  { pattern: /eth|ethereum/i, src: "/assets/eth.png" },
  { pattern: /litecoin|ltc/i, src: "/assets/lit.png" },
  { pattern: /paypal/i, src: "/assets/paypal.png" },
  { pattern: /worldcoin/i, src: "/assets/worldcoin.png" },
  { pattern: /visa/i, src: "/assets/visa.png" },
  { pattern: /amazon/i, src: "/assets/amazon.png" },
  { pattern: /spotify/i, src: "/assets/spot.png" },
  { pattern: /offer|task|survey|adgate|offertoro|revu|lootably|ayestudios/i, src: "/assets/task.png" },
];

function getLogoForText(text: string, fallbackLabel: string) {
  const input = `${text} ${fallbackLabel}`.trim();
  const matched = LOGO_RULES.find((rule) => rule.pattern.test(input));
  return matched?.src || "/assets/logo.png";
}

function TickerItem({
  logoSrc,
  label,
  value,
  amount,
}: {
  logoSrc: string;
  label: string;
  value: string;
  amount: string;
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-[#1A1D2E] rounded-md sm:rounded-lg px-2 sm:px-[14px] py-1.5 sm:py-2 min-w-max border border-[#2A2D3E]">
      <div className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] rounded bg-[#0E1121] border border-[#2A2D3E] flex items-center justify-center overflow-hidden">
        <Image src={logoSrc} alt={value} width={24} height={24} className="w-full h-full object-contain" />
      </div>
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
}

const STATIC_TICKER = [
  { label: "User withdrew", value: "Bitcoin", amount: "$3.50" },
  { label: "User earned", value: "OfferToro", amount: "$0.80" },
  { label: "User withdrew", value: "Ethereum", amount: "$15.00" },
  { label: "User earned", value: "AdGate", amount: "$1.20" },
  { label: "User withdrew", value: "PayPal", amount: "$5.00" },
  { label: "User earned", value: "Lootably", amount: "$0.45" },
  { label: "User withdrew", value: "Dogecoin", amount: "$1.50" },
  { label: "User earned", value: "Ayestudios", amount: "$3.75" },
];

export default function TickerBar() {
  const [feedEvents, setFeedEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/v1/feed/activity`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.events)) {
          setFeedEvents(data.events);
        }
      })
      .catch(() => {
        // fallback to static ticker
      });
  }, []);

  const tickerItems = useMemo(() => {
    let base =
      feedEvents.length > 0
        ? feedEvents.map((ev: any) => {
            const isWithdrawal = ev.type === "withdrawal";
            const amountStr = ev.amountCents
              ? `$${(ev.amountCents / 100).toFixed(2)}`
              : "$0.00";

            const value = ev.text
              ? ev.text.replace(/withdrew|earned|from/gi, "").trim()
              : isWithdrawal
                ? "Withdrawal"
                : "Offer";

            const label = isWithdrawal ? "User withdrew" : "User earned";
            return {
              label,
              value,
              amount: amountStr,
              logoSrc: getLogoForText(value, label),
            };
          })
        : STATIC_TICKER.map((item) => ({
            ...item,
            logoSrc: getLogoForText(item.value, item.label),
          }));

    if (base.length < 6) {
      base = [
        ...base,
        ...STATIC_TICKER.map((item) => ({
          ...item,
          logoSrc: getLogoForText(item.value, item.label),
        })),
      ];
    }

    return [...base, ...base, ...base];
  }, [feedEvents]);

  return (
    <div className="w-full bg-[#0D0F1E] overflow-hidden border-b border-[#1E2133] pointer-events-none">
      <div className="flex animate-scroll-left flex-row gap-[15px] px-4 py-2 sm:py-3 w-max">
        {tickerItems.map((item, i) => (
          <TickerItem
            key={`${item.value}-${item.amount}-${i}`}
            logoSrc={item.logoSrc}
            label={item.label}
            value={item.value}
            amount={item.amount}
          />
        ))}
      </div>
    </div>
  );
}
