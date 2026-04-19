"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import OffersSurveysRewardsDisclaimer from "@/Components/Shared/OffersSurveysRewardsDisclaimer";
import NotificationDropdown from "@/Components/HomePage/NotificationDropdown";
import { FaAndroid, FaApple } from "react-icons/fa";

// ─── Ticker animation injected once ─────────────────────────────────────────
const TICKER_CSS = `
@keyframes scrollLeft {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.ticker-track {
  display: flex;
  gap: 12px;
  width: max-content;
  animation: scrollLeft 40s linear infinite;
}
.ticker-track:hover { animation-play-state: paused; }
`;

// ─── Inline SVG icons ────────────────────────────────────────────────────────

const IcoGrid = () => (
  <svg width="20" height="20" viewBox="0 0 20.5 20.5" fill="none">
    <path
      d="M10.5 5C10.5 3.07 12.07 1.5 14 1.5C15.93 1.5 17.5 3.07 17.5 5C17.5 6.93 15.93 8.5 14 8.5C12.07 8.5 10.5 6.93 10.5 5ZM0 0.5H9V9.5H0V0.5ZM0 11.5H9V20.5H0V11.5ZM11 11.5H20V20.5H11V11.5Z"
      fill="white"
    />
  </svg>
);

const IcoLightning = () => (
  <svg width="18" height="23" viewBox="0 0 18 23" fill="none">
    <path d="M10 0L0 13H8.5L8 23L18 10H9.5L10 0Z" fill="#8C8FA8" />
  </svg>
);

const IcoSearch = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M10.69 9.74L13.54 12.6L12.6 13.54L9.74 10.69A6 6 0 1 1 10.69 9.74ZM6 10.67A4.67 4.67 0 1 0 6 1.33A4.67 4.67 0 0 0 6 10.67Z"
      fill="#8C8FA8"
    />
  </svg>
);

const IcoBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IcoCashout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M17.5 10.5C18.8807 10.5 20 11.6193 20 13V18C20 19.3807 18.8807 20.5 17.5 20.5H6.5C5.11929 20.5 4 19.3807 4 18V13C4 11.6193 5.11929 10.5 6.5 10.5H17.5ZM17.5 3.5C18.8807 3.5 20 4.61929 20 6V8.5H4V6C4 4.61929 5.11929 3.5 6.5 3.5H17.5Z" fill="white" />
  </svg>
);

const IcoAndroid = () => <FaAndroid size={11} color="#B3B6C7" aria-hidden="true" />;

const IcoApple = () => <FaApple size={11} color="#B3B6C7" aria-hidden="true" />;

const IcoThumbUp = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
    <path
      d="M10 5H7.5V2a1 1 0 0 0-1-1 1 1 0 0 0-1 1v3H3a1.5 1.5 0 0 0-1.5 1.5v5A1.5 1.5 0 0 0 3 13h7a1.5 1.5 0 0 0 1.38-.9l2-4a1.5 1.5 0 0 0 .12-.6V6.5A1.5 1.5 0 0 0 12 5h-2Z"
      fill="#8C8FA8"
    />
  </svg>
);

const IcoThumbDown = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
    <path
      d="M4 9H6.5V12a1 1 0 0 0 1 1 1 1 0 0 0 1-1V9H11a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11 1H4A1.5 1.5 0 0 0 2.62 1.9l-2 4A1.5 1.5 0 0 0 .5 6.5V7.5A1.5 1.5 0 0 0 2 9h2Z"
      fill="#8C8FA8"
    />
  </svg>
);

const IcoViews = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z"
      stroke="#8C8FA8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" fill="#8C8FA8" />
  </svg>
);

const IcoChevronLeftGray = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
    <path d="M9.5 0.5L5 7L0.5 0.5H9.5Z" fill="#8C8FA8" />
  </svg>
);

const IcoChevronRightGray = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
    <path d="M0.5 0.5L5 7L9.5 0.5H0.5Z" fill="#8C8FA8" />
  </svg>
);

const IcoWorldcoin = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" stroke="#B3B6C7" strokeWidth="2" fill="none" />
    <circle cx="20" cy="20" r="10" stroke="#B3B6C7" strokeWidth="1.5" fill="none" />
    <ellipse cx="20" cy="20" rx="6" ry="18" stroke="#B3B6C7" strokeWidth="1.5" fill="none" />
    <line x1="2" y1="20" x2="38" y2="20" stroke="#B3B6C7" strokeWidth="1.5" />
  </svg>
);

const IcoSolana = () => (
  <svg width="40" height="35" viewBox="0 0 48 42" fill="none">
    <path d="M0 33L8.18 41.28C8.35 41.43 8.54 41.58 8.78 41.67C9.02 41.77 9.27 41.82 9.52 41.82H47.08C47.26 41.82 47.43 41.77 47.58 41.67C47.73 41.58 47.85 41.44 47.92 41.28C48 41.12 48.02 40.94 47.99 40.77C47.95 40.6 47.87 40.44 47.75 40.31L39.83 32.04a.9.9 0 0 0-.66-.28H.92a.93.93 0 0 0-.55.17.93.93 0 0 0-.32.42.93.93 0 0 0-.03.55.93.93 0 0 0 .28.5L0 33ZM39.83 16.3a.9.9 0 0 1 .66.28L48 24.58a.93.93 0 0 1 .21 1.02.93.93 0 0 1-.84.59H.92a.93.93 0 0 1-.85-.58.93.93 0 0 1 .2-1.01L8.18 16.6a.9.9 0 0 1 .66-.28H39.83ZM.92 10.36H39.83a.9.9 0 0 0 .66-.28L48 1.8A.93.93 0 0 0 47.08 0H9.52C9.27 0 9.02.05 8.78.15 8.54.24 8.35.38 8.18.54L0 8.82a.93.93 0 0 0 .92 1.54Z" fill="white" />
  </svg>
);

const IcoClipboard = () => (
  <svg width="36" height="40" viewBox="0 0 36 40" fill="none">
    <path
      d="M6 4L6 12L30 12L30 4L34 4C35.1 4 36 4.89 36 5.99V38C36 39.1 35.1 40 34 40H2C.89 40 0 39.1 0 38V6C0 4.89.89 4 2 4H6ZM12 30H8V34H12V30ZM12 24H8V28H12V24ZM12 18H8V22H12V18ZM26 0V8H10V0H26Z"
      fill="white"
    />
  </svg>
);

// ─── Provider logo components ────────────────────────────────────────────────

const MonlixLogo = () => (
  <div className="flex flex-col items-center justify-center h-full gap-2">
    <svg width="90" height="24" viewBox="0 0 175 32" fill="none">
      <rect width="46" height="30" rx="4" fill="#FF6B35" opacity="0.9" />
      <rect x="6" y="10" width="5" height="11" rx="2.5" fill="white" />
      <rect x="13.5" y="7" width="5" height="17" rx="2.5" fill="white" />
      <rect x="21" y="10" width="5" height="11" rx="2.5" fill="white" />
      <rect x="31" y="4" width="5" height="22" rx="2" fill="#4DD6C1" opacity="0.9" />
      <rect x="38" y="4" width="5" height="22" rx="2" fill="#4DD6C1" opacity="0.9" />
      <rect x="51" y="7" width="30" height="5" rx="2" fill="white" />
      <rect x="51" y="14" width="24" height="5" rx="2" fill="white" />
      <rect x="51" y="21" width="30" height="5" rx="2" fill="white" />
    </svg>
    <span className="text-white font-bold text-[13px] tracking-widest">MONLIX</span>
  </div>
);

const MyLeadLogo = () => (
  <div className="flex flex-col items-center justify-center h-full gap-2">
    <svg width="60" height="44" viewBox="0 0 60 44" fill="none">
      <path d="M30 2L56 42H4L30 2Z" fill="#FF8C00" />
      <path d="M30 12L48 42H12L30 12Z" fill="#FFB347" />
      <circle cx="30" cy="36" r="4" fill="white" />
    </svg>
    <span className="text-white font-bold text-[13px] tracking-wider">MyLead</span>
  </div>
);

const GemiAdLogo = () => (
  <div className="flex flex-col items-center justify-center h-full gap-2">
    <svg width="50" height="44" viewBox="0 0 50 44" fill="none">
      <rect x="1" y="1" width="48" height="42" rx="8" fill="#7C3AED" />
      <path d="M32 14H18C15.8 14 14 15.8 14 18V26C14 28.2 15.8 30 18 30H32C34.2 30 36 28.2 36 26V18C36 15.8 34.2 14 32 14ZM32 24H25V20H32V24Z" fill="white" />
    </svg>
    <span className="text-white font-bold text-[13px] tracking-wider">GemiAd</span>
  </div>
);

const NortikLogo = () => (
  <div className="flex flex-col items-center justify-center h-full gap-2">
    <svg width="60" height="44" viewBox="0 0 138 46" fill="none">
      <rect x="1" y="1" width="136" height="44" rx="6" fill="none" stroke="#4DD6C1" strokeWidth="1.5" />
      <circle cx="30" cy="23" r="14" fill="#4DD6C1" opacity="0.25" />
      <circle cx="30" cy="23" r="8" fill="#4DD6C1" opacity="0.6" />
      <rect x="50" y="10" width="5" height="26" rx="2" fill="white" />
      <path d="M59 10L75 36H59V10Z" fill="none" stroke="white" strokeWidth="1.5" />
      <rect x="80" y="10" width="5" height="26" rx="2" fill="white" />
      <path d="M80 23L95 10V36L80 23Z" fill="white" />
      <rect x="100" y="10" width="5" height="26" rx="2" fill="white" />
      <rect x="108" y="10" width="5" height="26" rx="2" fill="white" />
      <rect x="116" y="10" width="5" height="26" rx="2" fill="white" />
    </svg>
    <span className="text-white font-bold text-[13px] tracking-wider">NORTIK</span>
  </div>
);

const LOGO_MAP: Record<string, React.FC> = {
  monlix: MonlixLogo,
  mylead: MyLeadLogo,
  gemiad: GemiAdLogo,
  nortik: NortikLogo,
};

type EarnFilterKey =
  | "all"
  | "fast-completion"
  | "sign-up-trial"
  | "save-money"
  | "casino"
  | "puzzle"
  | "sweepstake";

interface FeaturedGame {
  image: string;
  title: string;
  price: string;
  highlighted: boolean;
  categories: Exclude<EarnFilterKey, "all">[];
}

interface Provider {
  id: string;
  type: string;
  displayName: string;
  progress: number;
  likes?: string;
  views?: string;
  logoUrl?: string;
  launchUrl?: string;
  sourceKind?: "survey" | "offerwall";
  categories: Exclude<EarnFilterKey, "all">[];
}

interface OfferwallApiItem {
  _id?: string;
  id?: string;
  name?: string;
  displayName?: string;
  type?: string;
  category?: string;
  logoUrl?: string;
  callbackUrl?: string;
  isActive?: boolean;
  status?: string;
  metadata?: {
    logoUrl?: string;
    rating?: number;
    launchUrl?: string;
    offerUrl?: string;
  };
}

function deriveProviderCategories(input: string): Exclude<EarnFilterKey, "all">[] {
  const text = input.toLowerCase();
  const derived: Exclude<EarnFilterKey, "all">[] = [];

  if (/survey/.test(text)) derived.push("sweepstake");
  if (/casino|slot|game/.test(text)) derived.push("casino");
  if (/sign\s*up|signup|trial|offer|ad/.test(text)) derived.push("sign-up-trial");
  if (/save|deal|cashback|coupon/.test(text)) derived.push("save-money");
  if (/quick|fast/.test(text)) derived.push("fast-completion");
  if (/puzzle/.test(text)) derived.push("puzzle");

  if (derived.length === 0) derived.push("fast-completion");
  return Array.from(new Set(derived));
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  { image: "/game-tile-tap-master.png", action: "User withdrew", name: "Slots",       amount: "$0.8" },
  { special: "worldcoin",               action: "User withdrew", name: "Worldcoin",   amount: "$0.8" },
  { image: "/game-slot.png",            action: "User withdrew", name: "Slot",        amount: "$0.8" },
  { image: "/game-monopoly.png",        action: "User withdrew", name: "Monopoly",    amount: "$0.8" },
  { image: "/game-torox.png",           action: "User withdrew", name: "Torox",       amount: "$0.8" },
  { special: "offerwall",               action: "User earned",   name: "Offer walls", amount: "$0.5" },
  { special: "solana",                  action: "User withdrew", name: "Solana",      amount: "$0.2" },
  // duplicate set for seamless loop
  { image: "/game-tile-tap-master.png", action: "User withdrew", name: "Slots",       amount: "$0.8" },
  { special: "worldcoin",               action: "User withdrew", name: "Worldcoin",   amount: "$0.8" },
  { image: "/game-slot.png",            action: "User withdrew", name: "Slot",        amount: "$0.8" },
  { image: "/game-monopoly.png",        action: "User withdrew", name: "Monopoly",    amount: "$0.8" },
  { image: "/game-torox.png",           action: "User withdrew", name: "Torox",       amount: "$0.8" },
  { special: "offerwall",               action: "User earned",   name: "Offer walls", amount: "$0.5" },
  { special: "solana",                  action: "User withdrew", name: "Solana",      amount: "$0.2" },
];

const FEATURED_GAMES: FeaturedGame[] = [
  {
    image: "/game-tile-tap-master.png",
    title: "Tile Tap Master",
    price: "$0.8",
    highlighted: true,
    categories: ["fast-completion", "puzzle"],
  },
  {
    image: "/game-goblins-woods.png",
    title: "Goblins Woods",
    price: "$0.8",
    highlighted: true,
    categories: ["puzzle", "sweepstake"],
  },
  {
    image: "/game-slot.png",
    title: "Slot",
    price: "$0.8",
    highlighted: false,
    categories: ["casino", "fast-completion"],
  },
  {
    image: "/game-angry-bird.png",
    title: "Angry Bird",
    price: "$0.8",
    highlighted: false,
    categories: ["puzzle"],
  },
  {
    image: "/game-screw-factory.png",
    title: "Screw Out Factory",
    price: "$0.8",
    highlighted: false,
    categories: ["save-money", "puzzle"],
  },
  {
    image: "/game-big-giant.png",
    title: "Big Giant",
    price: "$0.8",
    highlighted: false,
    categories: ["sweepstake", "casino"],
  },
];

const PROVIDERS: Provider[] = [
  {
    id: "m1",
    type: "monlix",
    displayName: "Monlix",
    progress: 44,
    categories: ["sign-up-trial", "save-money"],
  },
  {
    id: "ml",
    type: "mylead",
    displayName: "MyLead",
    progress: 38,
    categories: ["sign-up-trial", "fast-completion"],
  },
  {
    id: "g1",
    type: "gemiad",
    displayName: "GemiAd",
    progress: 58,
    categories: ["save-money", "sweepstake"],
  },
  {
    id: "n1",
    type: "nortik",
    displayName: "Nortik",
    progress: 62,
    categories: ["casino", "sweepstake"],
  },
  {
    id: "m2",
    type: "monlix",
    displayName: "Monlix",
    progress: 44,
    categories: ["sign-up-trial", "save-money"],
  },
  {
    id: "g2",
    type: "gemiad",
    displayName: "GemiAd",
    progress: 58,
    categories: ["save-money", "fast-completion"],
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

interface TickerItemData {
  image?: string;
  special?: string;
  action: string;
  name: string;
  amount: string;
}

const TickerCard: React.FC<TickerItemData> = ({ image, special, action, name, amount }) => {
  const renderIcon = () => {
    if (image) {
      return (
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1E2133]">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      );
    }
    if (special === "worldcoin") {
      return <div className="w-12 h-12 flex items-center justify-center flex-shrink-0"><IcoWorldcoin /></div>;
    }
    if (special === "offerwall") {
      return <div className="w-12 h-12 flex items-center justify-center flex-shrink-0"><IcoClipboard /></div>;
    }
    if (special === "solana") {
      return <div className="w-12 h-12 flex items-center justify-center flex-shrink-0"><IcoSolana /></div>;
    }
    return <div className="w-12 h-12 rounded-lg bg-[#1E2133] flex-shrink-0" />;
  };

  return (
    <div className="flex flex-row items-center gap-[10px] bg-[#181A2C] px-3 py-[10px] rounded-[10px] flex-shrink-0 h-[72px]"
         style={{ minWidth: "244px" }}>
      {renderIcon()}
      <div className="flex flex-col justify-center gap-[4px]">
        <p className="text-[12px] font-medium text-[#6B6E8A] leading-5 m-0">{action}</p>
        <span className="text-[14px] font-medium text-[#B3B6C7] leading-5">{name}</span>
      </div>
      <h2 className="text-[18px] font-bold text-[#0AC07D] ml-auto leading-6 tracking-[0.4px]">{amount}</h2>
    </div>
  );
};

const FilterTabItem: React.FC<{
  filter: EarnFilterKey;
  label: string;
  count: number;
  active?: boolean;
  icon: React.ReactNode;
  onClick: (filter: EarnFilterKey) => void;
}> = ({ filter, label, count, active = false, icon, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(filter)}
    className="relative flex flex-col items-center gap-[2px] flex-shrink-0 bg-transparent border-0 p-0 cursor-pointer"
  >
    <div className="flex flex-col items-center gap-[2px]">
      <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
      <p className={`text-[13px] font-medium leading-5 text-center ${active ? "text-white" : "text-[#8C8FA8]"}`}>
        <span className="whitespace-nowrap">{label}</span>
      </p>
    </div>
    <div className="absolute -top-0.5 -right-3 w-4 h-4 bg-[rgba(126,129,147,0.2)] rounded-[5px] flex items-center justify-center">
      <span className="text-[9px] font-medium text-white">{count}</span>
    </div>
  </button>
);

const GameCard: React.FC<{
  image: string;
  title: string;
  price: string;
  highlighted?: boolean;
}> = ({ image, title, price, highlighted = false }) => (
  <div
    className="relative rounded-[10px] overflow-visible bg-[#151728] flex-shrink-0 min-w-[220px] sm:min-w-[240px] md:min-w-0 md:flex-1"
    style={{
      border: highlighted ? "1.5px solid #4DD6C1" : "1px solid #1E2133",
    }}
  >
    <div className="w-full h-[135px] relative overflow-hidden rounded-t-[9px]">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/20" />
    </div>
    <div className="absolute top-[10px] right-[10px] w-[31px] h-[28px] bg-black/20 rounded-[5px] flex items-center justify-center">
      <IcoApple />
    </div>
    <div className="px-3 pt-[10px] pb-3 flex flex-col gap-[5px]">
      <p className="text-[14px] font-medium text-[#B3B6C7] leading-5 truncate m-0">{title}</p>
      <span className="text-[18px] font-bold text-[#0AC07D] leading-6 tracking-[0.4px]">{price}</span>
    </div>
  </div>
);

const ProviderCard: React.FC<{
  type: string;
  displayName: string;
  progress: number;
  likes?: string;
  views?: string;
  logoUrl?: string;
  onClick?: () => void;
}> = ({ type, displayName, progress, likes = "2.6K", views = "10K", logoUrl, onClick }) => {
  const Logo = LOGO_MAP[type] ?? MonlixLogo;

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative rounded-[10px] bg-[#151728] flex flex-col overflow-hidden text-left transition-colors cursor-pointer flex-shrink-0 min-w-[220px] sm:min-w-[240px] md:min-w-0 md:flex-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4DD6C1]"
      style={{ border: "1px solid #1E2133" }}
      aria-label={`Open ${displayName} offers`}
    >
      <div className="h-[135px] w-full flex items-center justify-center bg-[#0F111E] relative">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={`${displayName} logo`}
            className="max-w-[150px] max-h-[80px] object-contain px-2"
          />
        ) : (
          <Logo />
        )}
        <div className="absolute top-[10px] right-[10px] w-[31px] h-[28px] bg-black/20 rounded-[5px] flex items-center justify-center">
          <IcoApple />
        </div>
      </div>
      <div className="px-3 pt-3 pb-3 flex flex-col gap-[8px]">
        <div className="w-full h-[5px] rounded-full bg-[#1E2133]">
          <div
            className="h-full rounded-full bg-[#0AC07D]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-full flex items-center justify-between bg-[#151728] border border-[#37417B] px-2 py-[6px] rounded-[8px]"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-[3px]">
                <IcoThumbUp />
                <span className="text-[11px] text-[#B3B6C7]">{likes}</span>
              </div>
              <div className="flex items-center gap-[3px]">
                <IcoViews />
                <span className="text-[11px] text-[#B3B6C7]">{views}</span>
              </div>
            </div>
            <div className="flex items-center gap-[3px]">
              <IcoThumbDown />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

// ─── Section components ───────────────────────────────────────────────────────

const EarnLegacyTopControls: React.FC<{
  notificationCount: number;
  profileInitial: string;
  onHomeClick: () => void;
  onBellClick: () => void;
  onWalletClick: () => void;
  onCashoutClick: () => void;
  onProfileClick: () => void;
}> = ({
  notificationCount,
  profileInitial,
  onHomeClick,
  onBellClick,
  onWalletClick,
  onCashoutClick,
  onProfileClick,
}) => (
  <div className="sticky top-0 z-40 bg-[#14162A] border-b border-[#1E2133]">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 py-2 md:py-3">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onHomeClick}
          className="flex items-center"
          aria-label="Go to home"
        >
          <img src="/logo-labwards.png" alt="Labwards" className="h-9 sm:h-10 md:h-11 w-auto object-contain" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onBellClick}
          className="relative h-[42px] w-[42px] sm:h-[44px] sm:w-[44px] rounded-[8px] bg-[#1E2133] border border-[#30334A] flex items-center justify-center transition-opacity hover:opacity-90"
          aria-label="Open notifications"
        >
          <IcoBell />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-1 rounded-full bg-[#0AC07D] text-white text-[9px] leading-[14px] font-bold text-center">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onWalletClick}
          className="h-[42px] sm:h-[44px] rounded-[8px] bg-[#1E2133] border border-[#30334A] px-2 sm:px-4 flex items-center gap-1.5 sm:gap-2 transition-opacity hover:opacity-90"
          aria-label="Open wallet"
        >
          <span className="text-[#B3B6C7] text-[14px] leading-none font-bold">$</span>
          <span className="text-white font-bold text-[20px] sm:text-[22px] leading-none">120</span>
          <span className="hidden sm:inline text-[#B3B6C7] text-[14px] leading-none">USD</span>
        </button>

        <button
          type="button"
          onClick={onCashoutClick}
          className="h-[42px] sm:h-[44px] rounded-[8px] px-3 sm:px-5 flex items-center gap-2 text-white font-bold text-[15px] leading-none transition-opacity hover:opacity-90"
          style={{
            background: "linear-gradient(12.07deg, rgba(255, 255, 255, 0) 16.27%, rgba(255, 255, 255, 0.4) 93.68%), #099F86",
            boxShadow: "0px 7px 19px rgba(20,169,144,0.3)",
          }}
          aria-label="Go to cashout"
        >
          <IcoCashout />
          <span className="hidden sm:inline">Cashout</span>
        </button>

        <button
          type="button"
          onClick={onProfileClick}
          className="h-[42px] sm:h-[44px] w-[50px] sm:w-[54px] rounded-[8px] bg-[#1E2133] border border-[#0AC07D] text-white font-bold text-[18px] leading-none transition-opacity hover:opacity-90"
          aria-label="Open account"
        >
          {profileInitial}
        </button>
        </div>
      </div>
    </div>
  </div>
);

const ActivityTicker: React.FC = () => (
  <div className="mx-4 sm:mx-6 md:mx-16 mt-4 md:mt-[22px] h-[72px] overflow-hidden rounded-[10px] bg-[#151728] border border-[#1E2133] flex items-center">
    <div className="ticker-track px-3">
      {TICKER_ITEMS.map((item, idx) => (
        <TickerCard key={idx} {...item} />
      ))}
    </div>
  </div>
);

const useHorizontalSlider = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;

    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    setCanPrev(element.scrollLeft > 2);
    setCanNext(element.scrollLeft < maxScrollLeft - 2);
  }, []);

  const scrollPrev = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;
    element.scrollBy({ left: -Math.max(260, element.clientWidth * 0.7), behavior: "smooth" });
  }, []);

  const scrollNext = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;
    element.scrollBy({ left: Math.max(260, element.clientWidth * 0.7), behavior: "smooth" });
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    updateScrollState();
    element.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      element.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  return { containerRef, canPrev, canNext, scrollPrev, scrollNext, updateScrollState };
};

const FilterBar: React.FC<{
  activeFilter: EarnFilterKey;
  filterCounts: Record<EarnFilterKey, number>;
  onFilterChange: (filter: EarnFilterKey) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}> = ({ activeFilter, filterCounts, onFilterChange, searchTerm, onSearchTermChange }) => (
  <div className="mt-4 flex flex-col gap-3 md:gap-0 md:h-[77px] md:flex-row md:items-center md:justify-between bg-[#151728] border border-[#1E2133] rounded-[10px] p-3 md:px-4">
    <div className="flex items-center gap-5 md:gap-7 overflow-x-auto scrollbar-hide w-full pb-1 md:pb-0">
      <FilterTabItem
        filter="all"
        label="View all"
        count={filterCounts.all}
        active={activeFilter === "all"}
        icon={<IcoGrid />}
        onClick={onFilterChange}
      />
      <FilterTabItem
        filter="fast-completion"
        label="Fast completion"
        count={filterCounts["fast-completion"]}
        active={activeFilter === "fast-completion"}
        icon={<IcoLightning />}
        onClick={onFilterChange}
      />
      <FilterTabItem
        filter="sign-up-trial"
        label="Sign up trial"
        count={filterCounts["sign-up-trial"]}
        active={activeFilter === "sign-up-trial"}
        icon={
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="6" r="4" stroke="#8C8FA8" strokeWidth="1.5" fill="none" />
          <path d="M1 17C1 13.13 4.58 10 9 10C13.42 10 17 13.13 17 17" stroke="#8C8FA8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      }
        onClick={onFilterChange}
      />
      <FilterTabItem
        filter="save-money"
        label="Save money"
        count={filterCounts["save-money"]}
        active={activeFilter === "save-money"}
        icon={
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M16 8V5A2 2 0 0 0 14 3H2A2 2 0 0 0 0 5V15A2 2 0 0 0 2 17H6" stroke="#8C8FA8" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <rect x="8" y="9" width="12" height="9" rx="2" stroke="#8C8FA8" strokeWidth="1.5" fill="none" />
          <circle cx="14" cy="13.5" r="1.5" fill="#8C8FA8" />
        </svg>
      }
        onClick={onFilterChange}
      />
      <FilterTabItem
        filter="casino"
        label="Casino"
        count={filterCounts.casino}
        active={activeFilter === "casino"}
        icon={
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="9" stroke="#8C8FA8" strokeWidth="1.5" fill="none" />
          <circle cx="11" cy="11" r="4" stroke="#8C8FA8" strokeWidth="1.5" fill="none" />
          <path d="M11 2V11M11 11L17.5 6M11 11L17.5 16" stroke="#8C8FA8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      }
        onClick={onFilterChange}
      />
      <FilterTabItem
        filter="puzzle"
        label="Puzzle"
        count={filterCounts.puzzle}
        active={activeFilter === "puzzle"}
        icon={
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M20 11.5C20 13.26 18.7 14.72 17 14.96V18C17 19.1 16.1 20 15 20H11.2V19.7C11.2 18.21 10 17 8.5 17C7 17 5.8 18.21 5.8 19.7V20H2C.89 20 0 19.1 0 18V14.2H.3C1.79 14.2 3 13 3 11.5C3 10 1.79 8.8.3 8.8H0V5C0 3.89.89 3 2 3H5.04C5.28 1.3 6.74 0 8.5 0C10.26 0 11.72 1.3 11.96 3H15C16.1 3 17 3.89 17 5V8.04C18.7 8.28 20 9.74 20 11.5ZM15 13H16.5C17.33 13 18 12.33 18 11.5C18 10.67 17.33 10 16.5 10H15V5H10V3.5C10 2.67 9.33 2 8.5 2C7.67 2 7 2.67 7 3.5V5H2V7.12C3.76 7.8 5 9.5 5 11.5C5 13.5 3.75 15.2 2 15.88V18H4.12C4.46 17.12 5.06 16.36 5.85 15.82C6.63 15.29 7.55 15 8.5 15C10.5 15 12.2 16.25 12.88 18H15V13Z" fill="#8C8FA8" />
        </svg>
      }
        onClick={onFilterChange}
      />
      <FilterTabItem
        filter="sweepstake"
        label="Sweepstake"
        count={filterCounts.sweepstake}
        active={activeFilter === "sweepstake"}
        icon={
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
          <path d="M12.8 4L14 5.2L7.2 12L6 10.8L12.8 4ZM2 0H18C19.1 0 20 .89 20 2V6C18.9 6 18 6.9 18 8C18 9.1 18.9 10 20 10V14C20 15.1 19.1 16 18 16H2C.89 16 0 15.1 0 14V10C1.1 10 2 9.1 2 8C2 6.9 1.1 6 0 6V2C0 .9.89 0 2 0ZM7.5 4C6.67 4 6 4.67 6 5.5C6 6.33 6.67 7 7.5 7C8.33 7 9 6.33 9 5.5C9 4.67 8.33 4 7.5 4ZM12.5 9C11.67 9 11 9.67 11 10.5C11 11.33 11.67 12 12.5 12C13.33 12 14 11.33 14 10.5C14 9.67 13.33 9 12.5 9Z" fill="#8C8FA8" />
        </svg>
      }
        onClick={onFilterChange}
      />
    </div>
    <div className="flex items-center gap-2 w-full md:w-auto">
      <div className="flex flex-1 md:flex-none items-center gap-2 bg-[#1E2133] border border-[#262F3E] px-3 py-[10px] rounded-[7px] w-full md:w-[361px]">
        <IcoSearch />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Search game or provider"
          className="w-full bg-transparent text-[#B3B6C7] text-[14px] font-medium placeholder:text-[#6B6E8A] outline-none"
        />
      </div>
    </div>
  </div>
);

const SectionHeader: React.FC<{
  title: string;
  onViewAll?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
}> = ({ title, onViewAll, onPrev, onNext, canPrev = false, canNext = false }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
    <div className="flex items-center gap-2 sm:gap-4">
      <h2 className="text-white font-bold text-[22px] sm:text-[24px] md:text-[28px] tracking-[0.56px] leading-[34px] m-0">{title}</h2>
      <div className="hidden md:flex items-center gap-2 bg-[#151728] border border-[#1E2133] px-3 py-2 rounded-[5px]">
        <IcoAndroid />
        <IcoApple />
        <svg width="17" height="10" viewBox="0 0 17 10" fill="none">
          <path d="M1 1H7.5V5H1V1ZM1 6H7.5V9H1V6ZM9 1H16V9H9V1Z" stroke="#B3B6C7" strokeWidth="1.3" fill="none" />
        </svg>
      </div>
    </div>
    <div className="flex w-full sm:w-auto sm:justify-end items-center gap-3">
      {(onPrev || onNext) && (
        <div className="flex items-center gap-[8px] bg-[#1E2133] border border-[#262F3E] px-2.5 py-[5px] rounded-[9px]">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canPrev}
            className="w-4 h-4 flex items-center justify-center disabled:opacity-35"
            aria-label={`Previous ${title} slide`}
          >
            <IcoChevronLeftGray />
          </button>
          <div className="w-px h-[16px] bg-[#30334A]" />
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            className="w-4 h-4 flex items-center justify-center disabled:opacity-35"
            aria-label={`Next ${title} slide`}
          >
            <IcoChevronRightGray />
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={onViewAll}
        disabled={!onViewAll}
        className="w-full sm:w-auto px-3 py-[8px] rounded-[8px] text-white font-bold text-[14px] leading-4"
        aria-label={`View all ${title}`}
        style={{ background: "linear-gradient(135deg,#0AC07D,#14A290)", boxShadow: "0 7px 19px rgba(20,169,144,0.3)" }}
      >
        View All
      </button>
    </div>
  </div>
);

const FeaturedSection: React.FC<{ games: FeaturedGame[]; onViewAll?: () => void }> = ({ games, onViewAll }) => {
  const { containerRef, canPrev, canNext, scrollPrev, scrollNext, updateScrollState } = useHorizontalSlider();

  useEffect(() => {
    updateScrollState();
  }, [games.length, updateScrollState]);

  return (
    <div className="mt-8 flex flex-col gap-3">
      <SectionHeader
        title="Featured offers"
        onViewAll={onViewAll}
        onPrev={scrollPrev}
        onNext={scrollNext}
        canPrev={canPrev}
        canNext={canNext}
      />
      {games.length === 0 ? (
        <div className="rounded-[10px] border border-[#1E2133] bg-[#151728] p-6 text-[#8C8FA8] text-sm">
          No featured results for the selected filter.
        </div>
      ) : (
        <div ref={containerRef} className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {games.map((game) => (
            <GameCard
              key={game.title}
              image={game.image}
              title={game.title}
              price={game.price}
              highlighted={game.highlighted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProviderSection: React.FC<{
  title: string;
  providers: Provider[];
  onViewAll?: () => void;
  onProviderClick?: (provider: Provider) => void;
}> = ({ title, providers, onViewAll, onProviderClick }) => {
  const { containerRef, canPrev, canNext, scrollPrev, scrollNext, updateScrollState } = useHorizontalSlider();

  useEffect(() => {
    updateScrollState();
  }, [providers.length, updateScrollState]);

  return (
    <div className="mt-10 flex flex-col gap-3">
      <SectionHeader
        title={title}
        onViewAll={onViewAll}
        onPrev={scrollPrev}
        onNext={scrollNext}
        canPrev={canPrev}
        canNext={canNext}
      />
      {providers.length === 0 ? (
        <div className="rounded-[10px] border border-[#1E2133] bg-[#151728] p-6 text-[#8C8FA8] text-sm">
          No providers found for the selected filter.
        </div>
      ) : (
        <div ref={containerRef} className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {providers.map((p) => (
            <ProviderCard
              key={p.id}
              type={p.type}
              displayName={p.displayName}
              progress={p.progress}
              likes={p.likes}
              views={p.views}
              logoUrl={p.logoUrl}
              onClick={() => onProviderClick?.(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main page component ──────────────────────────────────────────────────────

const EARNINGSPAGEComponent: React.FC = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<EarnFilterKey>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [providers, setProviders] = useState<Provider[]>(PROVIDERS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [profileInitial, setProfileInitial] = useState("B");

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const user = JSON.parse(userRaw) as { displayName?: string; username?: string; email?: string };
        const initial = (user.displayName || user.username || user.email || "B").charAt(0).toUpperCase();
        if (initial) setProfileInitial(initial);
      }
    } catch {
      // Keep default initial when storage parsing fails
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${api}/api/v1/user/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.notifications)) {
          const unreadCount = data.notifications.filter((n: { read?: boolean }) => !n.read).length;
          setNotificationCount(unreadCount);
        }
      })
      .catch(() => {
        // Keep fallback badge count state when API fails
      });
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchOfferwallProviders = async () => {
      try {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${api}/api/v1/offerwalls`, { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        const rawOfferwalls: OfferwallApiItem[] = Array.isArray(data?.offerwalls)
          ? data.offerwalls
          : Array.isArray(data?.data)
            ? data.data
            : [];

        const activeOfferwalls = rawOfferwalls.filter(
          (ow) => ow.isActive !== false && ow.status !== "inactive" && ow.status !== "paused",
        );

        const source = activeOfferwalls.length > 0 ? activeOfferwalls : rawOfferwalls;
        if (source.length === 0) return;

        const mappedProviders: Provider[] = source.map((ow, idx) => {
          const displayName = (ow.displayName || ow.name || `Offerwall ${idx + 1}`).trim();
          const kindHint = `${ow.category || ow.type || ""} ${displayName}`;
          const rating = Number(ow.metadata?.rating || 0);
          const progress = Number.isFinite(rating) && rating > 0
            ? Math.min(100, Math.max(20, rating * 20))
            : 55;

          return {
            id: ow._id || ow.id || `${displayName}-${idx}`,
            type: (ow.type || displayName).toLowerCase().replace(/\s+/g, ""),
            displayName,
            progress,
            likes: "2.6K",
            views: "10K",
            logoUrl: ow.metadata?.logoUrl || ow.logoUrl,
            launchUrl: ow.callbackUrl || ow.metadata?.launchUrl || ow.metadata?.offerUrl,
            sourceKind: /survey/i.test(kindHint) ? "survey" : "offerwall",
            categories: deriveProviderCategories(kindHint),
          };
        });

        if (mounted && mappedProviders.length > 0) {
          const stableProviderCount = PROVIDERS.length;
          const stabilizedProviders = mappedProviders.slice(0, stableProviderCount);

          if (stabilizedProviders.length < stableProviderCount) {
            stabilizedProviders.push(...PROVIDERS.slice(stabilizedProviders.length, stableProviderCount));
          }

          setProviders(stabilizedProviders);
        }
      } catch {
        // Keep local fallback providers when API request fails
      }
    };

    fetchOfferwallProviders();
    return () => {
      mounted = false;
    };
  }, []);

  const filterCounts = useMemo<Record<EarnFilterKey, number>>(() => {
    const counts: Record<EarnFilterKey, number> = {
      all: FEATURED_GAMES.length + providers.length,
      "fast-completion": 0,
      "sign-up-trial": 0,
      "save-money": 0,
      casino: 0,
      puzzle: 0,
      sweepstake: 0,
    };

    FEATURED_GAMES.forEach((game) => {
      game.categories.forEach((category) => {
        counts[category] += 1;
      });
    });

    providers.forEach((provider) => {
      provider.categories.forEach((category) => {
        counts[category] += 1;
      });
    });

    return counts;
  }, [providers]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredGames = useMemo(() => {
    return FEATURED_GAMES.filter((game) => {
      const passesFilter = activeFilter === "all" || game.categories.includes(activeFilter);
      const passesSearch =
        normalizedSearch.length === 0 || game.title.toLowerCase().includes(normalizedSearch);
      return passesFilter && passesSearch;
    });
  }, [activeFilter, normalizedSearch]);

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const passesFilter = activeFilter === "all" || provider.categories.includes(activeFilter);
      const passesSearch =
        normalizedSearch.length === 0 ||
        provider.displayName.toLowerCase().includes(normalizedSearch);
      return passesFilter && passesSearch;
    });
  }, [activeFilter, normalizedSearch, providers]);

  const filteredOfferwallProviders = useMemo(
    () => filteredProviders.filter((provider) => provider.sourceKind !== "survey"),
    [filteredProviders],
  );

  const filteredSurveyProviders = useMemo(
    () => filteredProviders.filter((provider) => provider.sourceKind === "survey"),
    [filteredProviders],
  );

  const handleProviderClick = (provider: Provider) => {
    if (provider.launchUrl && /^https?:\/\//i.test(provider.launchUrl)) {
      window.open(provider.launchUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const offerwall = encodeURIComponent(provider.displayName || provider.type || "offerwall");
    router.push(`/tasks?offerwall=${offerwall}`);
  };

  const resetFilters = () => {
    setActiveFilter("all");
    setSearchTerm("");
  };

  const openAllTasks = () => {
    resetFilters();
    router.push("/tasks");
  };

  const openAllSurveys = () => {
    resetFilters();
    router.push("/surveys");
  };

  const openWallet = () => {
    router.push("/wallet");
  };

  const openCashout = () => {
    router.push("/cashout");
  };

  const openAccount = () => {
    router.push("/account");
  };

  const openHome = () => {
    router.push("/home");
  };

  return (
    <div className="bg-[#0B0D1F] min-h-screen font-sans text-white">
      <style>{TICKER_CSS}</style>
      <EarnLegacyTopControls
        notificationCount={notificationCount}
        profileInitial={profileInitial}
        onHomeClick={openHome}
        onBellClick={() => setShowNotifications((prev) => !prev)}
        onWalletClick={openWallet}
        onCashoutClick={openCashout}
        onProfileClick={openAccount}
      />
      <main>
        <div className="max-w-[1440px] mx-auto">
          <ActivityTicker />
          <div className="px-4 sm:px-6 md:px-16 pb-10">
            <FilterBar
              activeFilter={activeFilter}
              filterCounts={filterCounts}
              onFilterChange={setActiveFilter}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
            />
            <FeaturedSection games={filteredGames} onViewAll={openAllTasks} />
            <ProviderSection
              title="Offer walls"
              providers={filteredOfferwallProviders}
              onViewAll={openAllTasks}
              onProviderClick={handleProviderClick}
            />
            <ProviderSection
              title="Survey"
              providers={filteredSurveyProviders}
              onViewAll={openAllSurveys}
              onProviderClick={handleProviderClick}
            />
            <OffersSurveysRewardsDisclaimer className="mt-10" />
          </div>
        </div>
      </main>
      {showNotifications && (
        <NotificationDropdown onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

export default EARNINGSPAGEComponent;
