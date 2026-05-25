"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import GiftCardRedemptionModal from "@/Components/Shared/GiftCardRedemptionModal";
import { toast } from "@/utils/toast";

/* ── Ticker CSS ──────────────────────────────────────────────────── */
const TICKER_CSS = `
@keyframes scrollLeft {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.cashout-ticker {
  display: flex; gap: 12px; width: max-content;
  animation: scrollLeft 40s linear infinite;
}
.cashout-ticker:hover { animation-play-state: paused; }
`;

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ── Types ───────────────────────────────────────────────────────── */
interface CashoutCard {
  id: string;
  name: string;
  brandName: string;
  subtitle?: string;
  logoSrc: string;
  gradient: string;
  badge?: string;
  category: "crypto" | "cash" | "giftcard";
  method?: "paypal" | "bank_transfer";
  cryptoType?: string;
}

/* ── Data ────────────────────────────────────────────────────────── */
const POPULAR: CashoutCard[] = [
  { id: "btc",  name: "Bitcoin",  brandName: "bitcoin",  subtitle: "0.50€ transaction fee", logoSrc: "/assets/bit.png",      gradient: "linear-gradient(135deg,#2C14A6,#3F21C4)", category: "crypto", cryptoType: "btc"  },
  { id: "doge", name: "Dogecoin", brandName: "Dogecoin", subtitle: "0.50€ transaction fee", logoSrc: "/assets/dolar.png",    gradient: "linear-gradient(135deg,#B87B0B,#D99A1C)", category: "crypto", cryptoType: "doge" },
  { id: "sol",  name: "Solana",   brandName: "SOLANA",   subtitle: "0.50€ transaction fee", logoSrc: "/assets/sol.png",      gradient: "linear-gradient(135deg,#B61D1D,#D12D2D)", category: "crypto", cryptoType: "sol"  },
  { id: "eth",  name: "Ethereum", brandName: "Ethereum", subtitle: "0.50€ transaction fee", logoSrc: "/assets/eth.png",      gradient: "linear-gradient(135deg,#3B9627,#52B338)", category: "crypto", cryptoType: "eth"  },
  { id: "ltc",  name: "Litecoin", brandName: "Litecoin", subtitle: "0.50€ transaction fee", logoSrc: "/assets/lit.png",      gradient: "linear-gradient(135deg,#0A8C63,#10A479)", category: "crypto", cryptoType: "ltc"  },
];

const WITHDRAW_CASH: CashoutCard[] = [
  { id: "paypal",    name: "Paypal",   brandName: "PayPal",   logoSrc: "/assets/paypal.png",    gradient: "linear-gradient(135deg,#20214B,#2B2E6A)", category: "cash",   method: "paypal"        },
  { id: "worldcoin", name: "Worldcoin",brandName: "Worldcoin",logoSrc: "/assets/worldcoin.png", gradient: "linear-gradient(135deg,#1F2048,#2B2E63)", badge: "30% OFF", category: "crypto", cryptoType: "worldcoin" },
  { id: "visa",      name: "Visa",     brandName: "Visa",     logoSrc: "/assets/visa.png",      gradient: "linear-gradient(135deg,#1F2048,#2B2E63)", category: "cash",   method: "bank_transfer" },
];

const GIFTCARDS: CashoutCard[] = [
  { id: "amazon",      name: "Amazon",     brandName: "Amazon",     logoSrc: "/assets/amazon.png", gradient: "linear-gradient(135deg,#2C14A6,#3F21C4)", category: "giftcard" },
  { id: "itunes",      name: "App stores", brandName: "iTunes",     logoSrc: "/assets/apple.png",  gradient: "linear-gradient(135deg,#B87B0B,#D99A1C)", category: "giftcard" },
  { id: "spotify",     name: "Spotify",    brandName: "Spotify",    logoSrc: "/assets/spot.png",   gradient: "linear-gradient(135deg,#B61D1D,#D12D2D)", category: "giftcard" },
  { id: "playstation", name: "Playstations",brandName: "Playstation",logoSrc: "/assets/play.png",  gradient: "linear-gradient(135deg,#3B9627,#52B338)", category: "giftcard" },
  { id: "steam",       name: "Steam",      brandName: "Steam",      logoSrc: "/assets/cb.png",     gradient: "linear-gradient(135deg,#0A8C63,#10A479)", category: "giftcard" },
];

const TICKER_ITEMS = [
  { img: "/game-tile-tap-master.png", name: "Slots",     action: "User withdrew", amount: "$0.8" },
  { img: "/game-slot.png",            name: "Worldcoin", action: "User withdrew", amount: "$0.8" },
  { img: "/game-monopoly.png",        name: "Slot",      action: "User withdrew", amount: "$0.8" },
  { img: "/game-torox.png",           name: "Monopoly",  action: "User withdrew", amount: "$0.8" },
  { img: "/game-angry-bird.png",      name: "Worldcoin", action: "User withdrew", amount: "$0.8" },
  { img: "/game-big-giant.png",       name: "Big Giant", action: "User earned",   amount: "$1.0" },
  { img: "/game-tile-tap-master.png", name: "Slots",     action: "User withdrew", amount: "$0.8" },
  { img: "/game-slot.png",            name: "Worldcoin", action: "User withdrew", amount: "$0.8" },
  { img: "/game-monopoly.png",        name: "Slot",      action: "User withdrew", amount: "$0.8" },
  { img: "/game-torox.png",           name: "Monopoly",  action: "User withdrew", amount: "$0.8" },
  { img: "/game-angry-bird.png",      name: "Worldcoin", action: "User withdrew", amount: "$0.8" },
  { img: "/game-big-giant.png",       name: "Big Giant", action: "User earned",   amount: "$1.0" },
];

/* ── Icons ───────────────────────────────────────────────────────── */
const IcoBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoCashoutBtn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M17.5 10.5C18.88 10.5 20 11.62 20 13V18C20 19.38 18.88 20.5 17.5 20.5H6.5C5.12 20.5 4 19.38 4 18V13C4 11.62 5.12 10.5 6.5 10.5H17.5ZM17.5 3.5C18.88 3.5 20 4.62 20 6V8.5H4V6C4 4.62 5.12 3.5 6.5 3.5H17.5Z" fill="white" />
  </svg>
);
const IcoHeadset = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 12C3 7.03 7.03 3 12 3s9 4.03 9 9v5a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h2v-1a7 7 0 0 0-14 0v1h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/* ── Cashout Card ────────────────────────────────────────────────── */
function Card({ card, onClick }: { card: CashoutCard; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden rounded-[16px] flex flex-col hover:scale-[1.02] transition-transform active:scale-[0.98] w-full min-h-[145px] sm:min-h-[170px]"
      style={{ border: "1px solid rgba(255,255,255,0.1)", background: card.gradient }}
    >
      {/* Dot grid — concentrated in center, fading to edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
          WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 55%, black 20%, transparent 80%)",
          maskImage: "radial-gradient(ellipse 70% 65% at 50% 55%, black 20%, transparent 80%)",
        }}
      />

      {/* Badge */}
      {card.badge && (
        <span
          className="absolute top-3 left-1/2 -translate-x-1/2 z-20 rounded-full text-[#111] text-[11px] font-bold px-3 py-[3px] whitespace-nowrap"
          style={{ background: "#FDBA0F" }}
        >
          {card.badge}
        </span>
      )}

      {/* Top: logo icon + brand name */}
      <div className={`relative z-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 ${card.badge ? "pt-9 sm:pt-10" : "pt-3 sm:pt-4"}`}>
        <div className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 flex items-center justify-center">
          <Image
            src={card.logoSrc}
            alt={card.brandName}
            width={32}
            height={32}
            className="object-contain w-full h-full"
          />
        </div>
        <span className="text-white font-bold text-[13px] sm:text-[17px] leading-tight truncate">
          {card.brandName}
        </span>
      </div>

      {/* Middle — dot pattern fills this */}
      <div className="flex-1 min-h-[40px]" />

      {/* Bottom: name + subtitle */}
      <div className="relative z-10 pb-3 sm:pb-4 text-center px-2 sm:px-3">
        <p className="text-white font-semibold text-[12px] sm:text-[15px]">{card.name}</p>
        {card.subtitle && (
          <p className="text-white/65 text-[10px] sm:text-[11px] mt-0.5 hidden sm:block">{card.subtitle}</p>
        )}
      </div>

      {/* Inner ring */}
      <div className="pointer-events-none absolute inset-0 rounded-[16px] ring-1 ring-inset ring-white/10" />
    </button>
  );
}

/* ── Section ─────────────────────────────────────────────────────── */
function Section({ title, cards, onCardClick }: { title: string; cards: CashoutCard[]; onCardClick: (c: CashoutCard) => void }) {
  const gridClass = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3";

  return (
    <section className="flex flex-col gap-3 sm:gap-4">
      <h2 className="text-white font-bold text-[20px] sm:text-[22px]">{title}</h2>
      <div className={gridClass}>
        {cards.map(c => <Card key={c.id} card={c} onClick={() => onCardClick(c)} />)}
      </div>
    </section>
  );
}

/* ── Cashout Modal ───────────────────────────────────────────────── */
function CashoutMethodModal({ card, isOpen, onClose, onSuccess, userBalance = 0 }: {
  card: CashoutCard | null; isOpen: boolean; onClose: () => void; onSuccess: () => void; userBalance?: number;
}) {
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const meta = useMemo(() => {
    if (!card) return { method: "crypto" as const, label: "Destination", placeholder: "Enter destination" };
    if (card.category === "crypto") return { method: "crypto" as const, label: `${card.id === "btc" ? "BTC" : card.name} Address`, placeholder: "Enter wallet address" };
    if (card.method === "paypal") return { method: "paypal" as const, label: "PayPal email", placeholder: "you@example.com" };
    return { method: "bank_transfer" as const, label: "Card / bank details", placeholder: "Enter card or bank destination" };
  }, [card]);

  const close = () => { setAmount(""); setDestination(""); setSubmitting(false); onClose(); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card) return;
    const amt = Number(amount);
    if (!amt || isNaN(amt) || amt <= 0) { toast.error("Please enter a valid amount"); return; }
    if (amt < 0.5) { toast.error("Minimum withdrawal is $0.5"); return; }
    if (!destination.trim()) { toast.error(`Please provide ${meta.label.toLowerCase()}`); return; }
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) { toast.warn("Please sign in first"); return; }
    try {
      setSubmitting(true);
      const payload: Record<string, unknown> = { amountCents: Math.round(amt * 100), method: meta.method, destination: destination.trim() };
      if (card.cryptoType) payload.cryptoType = card.cryptoType;
      const res = await fetch(`${API}/api/v1/user/withdrawals/request`, {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to submit");
      toast.success(data?.message || "Withdrawal request submitted!");
      onSuccess(); close();
    } catch (err) {
      toast.error((err as Error).message || "Failed to submit");
    } finally { setSubmitting(false); }
  };

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4" onClick={close}>
      <div className="w-full max-w-[400px] rounded-2xl border border-[#23353E] bg-[#0F1D24] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white text-lg font-bold">Cashout {card.name}</h3>
          <button onClick={close} className="text-[#8C8FA8] hover:text-white"><X size={20} /></button>
        </div>
        <div className="bg-[#14A990]/10 border border-[#14A990]/20 rounded-full px-4 py-2 mb-5 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#14A990] flex items-center justify-center text-[10px] font-bold text-white">!</div>
          <p className="text-[#14A990] text-xs font-semibold">Minimum withdrawal is $0.5</p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#8C8FA8] text-xs font-semibold">{meta.label}</label>
            <div className="relative">
              <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder={meta.placeholder}
                className="w-full bg-[#15242C] border border-[#23353E] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#14A990]/50" />
              <button type="button" className="absolute right-2 top-1.5 px-3 py-1.5 bg-[#23353E] hover:bg-[#2C414C] rounded-md text-white text-[11px] font-bold">Save</button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[#8C8FA8] text-xs font-semibold">Amount</label>
              <span className="text-[#8C8FA8] text-[10px]">Balance: ${(userBalance / 100).toFixed(2)}</span>
            </div>
            <div className="relative">
              <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="E.g $120"
                className="w-full bg-[#15242C] border border-[#23353E] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#14A990]/50" />
              <button type="button" onClick={() => setAmount((userBalance / 100).toString())}
                className="absolute right-2 top-1.5 px-3 py-1.5 bg-[#23353E] hover:bg-[#2C414C] rounded-md text-white text-[11px] font-bold">Max</button>
            </div>
          </div>
          <button type="submit" disabled={submitting}
            className="w-full h-12 rounded-lg text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg,#0AC07D,#14A990)", boxShadow: "0 8px 24px rgba(10,192,125,0.3)" }}>
            <IcoCashoutBtn />
            {submitting ? "Submitting..." : "Cashout"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export default function CashoutPage() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<CashoutCard | null>(null);
  const [methodOpen, setMethodOpen]   = useState(false);
  const [giftOpen, setGiftOpen]       = useState(false);
  const [balanceCents, setBalanceCents] = useState(0);
  const [notifCount, setNotifCount]   = useState(0);
  const [profileInit, setProfileInit] = useState("B");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("user");
      if (raw) { const u = JSON.parse(raw) as { displayName?: string; username?: string; email?: string }; setProfileInit((u.displayName || u.username || u.email || "B").charAt(0).toUpperCase()); }
    } catch {}
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API}/api/v1/user/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (typeof d?.profile?.balanceCents === "number") setBalanceCents(d.profile.balanceCents); }).catch(() => {});
    fetch(`${API}/api/v1/user/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (Array.isArray(d?.notifications)) setNotifCount(d.notifications.filter((n: { read?: boolean }) => !n.read).length); }).catch(() => {});
  }, []);

  const handleCardClick = (card: CashoutCard) => {
    setSelectedCard(card);
    if (card.category === "giftcard") { setGiftOpen(true); return; }
    setMethodOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D1F] text-white">
      <style>{TICKER_CSS}</style>

      {/* ── Topbar ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-[#14162A] border-b border-[#1E2133]">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 md:px-16 py-2 md:py-3 flex items-center justify-between gap-2 sm:gap-3">
          <button onClick={() => router.push("/home")} aria-label="Home" className="flex-shrink-0">
            <img src="/logo-labwards.png" alt="LabWards" className="h-8 sm:h-10 md:h-11 w-auto object-contain" />
          </button>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button onClick={() => router.push("/notifications")}
              className="relative h-[38px] w-[38px] sm:h-[44px] sm:w-[44px] rounded-[8px] bg-[#1E2133] border border-[#30334A] flex items-center justify-center hover:opacity-90 flex-shrink-0">
              <IcoBell />
              {notifCount > 0 && <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-1 rounded-full bg-[#0AC07D] text-[9px] font-bold text-white text-center leading-[14px]">{notifCount > 99 ? "99+" : notifCount}</span>}
            </button>
            <button onClick={() => router.push("/wallet")}
              className="h-[38px] sm:h-[44px] rounded-[8px] bg-[#1E2133] border border-[#30334A] px-2 sm:px-4 flex items-center gap-1 sm:gap-1.5 hover:opacity-90">
              <span className="text-[#B3B6C7] text-[12px] sm:text-[14px] font-bold">$</span>
              <span className="text-white font-bold text-[16px] sm:text-[22px] leading-none">120</span>
              <span className="text-[#B3B6C7] text-[12px] sm:text-[14px]">USD</span>
            </button>
            <button onClick={() => router.push("/cashout")}
              className="hidden sm:flex h-[44px] rounded-[8px] px-5 items-center gap-2 text-white font-bold text-[15px] hover:opacity-90"
              style={{ background: "linear-gradient(12.07deg,rgba(255,255,255,0) 16.27%,rgba(255,255,255,0.4) 93.68%),#099F86", boxShadow: "0px 7px 19px rgba(20,169,144,0.3)" }}>
              <IcoCashoutBtn />
              Cashout
            </button>
            <button onClick={() => router.push("/account")}
              className="h-[38px] w-[38px] sm:h-[44px] sm:w-[54px] rounded-[8px] bg-[#1E2133] border border-[#0AC07D] text-white font-bold text-[16px] sm:text-[18px] hover:opacity-90 flex-shrink-0">
              {profileInit}
            </button>
          </div>
        </div>
      </div>

      {/* ── Activity Ticker ──────────────────────────────────────── */}
      <div className="mx-3 sm:mx-6 md:mx-16 mt-3 sm:mt-4 h-[56px] sm:h-[72px] overflow-hidden rounded-[10px] bg-[#151728] border border-[#1E2133] flex items-center shrink-0">
        <div className="cashout-ticker px-2 sm:px-3">
          {TICKER_ITEMS.map((t, i) => (
            <div key={i} className="flex items-center gap-[8px] sm:gap-[10px] bg-[#181A2C] px-2 sm:px-3 py-[8px] sm:py-[10px] rounded-[10px] flex-shrink-0 h-[44px] sm:h-[56px]" style={{ minWidth: "155px" }}>
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#1E2133]">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center gap-[1px] sm:gap-[2px]">
                <p className="text-[10px] sm:text-[11px] font-medium text-[#6B6E8A] m-0">{t.action}</p>
                <span className="text-[12px] sm:text-[13px] font-medium text-[#B3B6C7]">{t.name}</span>
              </div>
              <span className="text-[13px] sm:text-[16px] font-bold text-[#0AC07D] ml-auto">{t.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sections ─────────────────────────────────────────────── */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-6 md:px-16 py-4 sm:py-8 flex flex-col gap-6 sm:gap-10">
        <Section title="Popular"       cards={POPULAR}       onCardClick={handleCardClick} />
        <Section title="Withdraw cash" cards={WITHDRAW_CASH} onCardClick={handleCardClick} />
        <Section title="Giftcard"      cards={GIFTCARDS}     onCardClick={handleCardClick} />
      </main>

      {/* ── Floating Support ─────────────────────────────────────── */}
      <button
        onClick={() => router.push("/support")}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full hover:scale-105 transition-transform"
        style={{ width: 52, height: 52, background: "linear-gradient(135deg,#0AC07D,#0BBFA0)", boxShadow: "0 8px 24px rgba(10,192,125,0.45)" }}
        aria-label="Support"
      >
        <IcoHeadset />
      </button>

      {/* ── Modals ───────────────────────────────────────────────── */}
      <CashoutMethodModal
        card={selectedCard} isOpen={methodOpen}
        onClose={() => setMethodOpen(false)} userBalance={balanceCents}
        onSuccess={() => { setMethodOpen(false); setSelectedCard(null); }}
      />
      <GiftCardRedemptionModal
        isOpen={giftOpen}
        onClose={() => { setGiftOpen(false); setSelectedCard(null); }}
        userBalance={balanceCents}
        onRedemptionComplete={() => { setGiftOpen(false); setSelectedCard(null); }}
      />
    </div>
  );
}
