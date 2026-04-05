"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import TopBar from "@/Components/Topbar";
import TickerBar from "../../Components/Shared/TickerBar";
import GiftCardRedemptionModal from "@/Components/Shared/GiftCardRedemptionModal";
import { toast } from "@/utils/toast";

interface CashoutCard {
  id: string;
  name: string;
  subtitle?: string;
  logoSrc: string;
  category: "crypto" | "cash" | "giftcard";
  method?: "paypal" | "bank_transfer";
  cryptoType?: string;
}

interface CashoutMethodModalProps {
  card: CashoutCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const POPULAR: CashoutCard[] = [
  { id: "btc", name: "Bitcoin", subtitle: "0.50€ transaction fee", logoSrc: "/assets/bit.png", category: "crypto", cryptoType: "btc" },
  { id: "doge", name: "Dogecoin", subtitle: "0.50€ transaction fee", logoSrc: "/assets/dolar.png", category: "crypto", cryptoType: "doge" },
  { id: "sol", name: "Solana", subtitle: "0.50€ transaction fee", logoSrc: "/assets/sol.png", category: "crypto", cryptoType: "sol" },
  { id: "eth", name: "Ethereum", subtitle: "0.50€ transaction fee", logoSrc: "/assets/eth.png", category: "crypto", cryptoType: "eth" },
  { id: "ltc", name: "Litecoin", subtitle: "0.50€ transaction fee", logoSrc: "/assets/lit.png", category: "crypto", cryptoType: "ltc" },
];

const WITHDRAW_CASH: CashoutCard[] = [
  { id: "paypal", name: "PayPal", logoSrc: "/assets/paypal.png", category: "cash", method: "paypal" },
  { id: "worldcoin", name: "Worldcoin", logoSrc: "/assets/worldcoin.png", category: "crypto", cryptoType: "worldcoin" },
  { id: "visa", name: "Visa", logoSrc: "/assets/visa.png", category: "cash", method: "bank_transfer" },
];

const GIFTCARDS: CashoutCard[] = [
  { id: "amazon", name: "Amazon", logoSrc: "/assets/amazon.png", category: "giftcard" },
  { id: "itunes", name: "App Stores", logoSrc: "/assets/apple.png", category: "giftcard" },
  { id: "spotify", name: "Spotify", logoSrc: "/assets/spot.png", category: "giftcard" },
  { id: "playstation", name: "PlayStation", logoSrc: "/assets/play.png", category: "giftcard" },
  { id: "steam", name: "Steam", logoSrc: "/assets/cb.png", category: "giftcard" },
];

function CashoutMethodModal({ card, isOpen, onClose, onSuccess }: CashoutMethodModalProps) {
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const methodMeta = useMemo(() => {
    if (!card) {
      return {
        method: "crypto" as const,
        destinationLabel: "Destination",
        destinationPlaceholder: "Enter destination",
      };
    }

    if (card.category === "crypto") {
      return {
        method: "crypto" as const,
        destinationLabel: "Wallet address",
        destinationPlaceholder: "Enter your wallet address",
      };
    }

    if (card.method === "paypal") {
      return {
        method: "paypal" as const,
        destinationLabel: "PayPal email",
        destinationPlaceholder: "you@example.com",
      };
    }

    return {
      method: "bank_transfer" as const,
      destinationLabel: "Card / bank details",
      destinationPlaceholder: "Enter card or bank destination",
    };
  }, [card]);

  const handleClose = () => {
    setAmount("");
    setDestination("");
    setSubmitting(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card) return;

    const amountValue = Number(amount);
    if (!amountValue || Number.isNaN(amountValue) || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amountValue < 5) {
      toast.error("Minimum withdrawal amount is $5");
      return;
    }

    if (!destination.trim()) {
      toast.error(`Please provide ${methodMeta.destinationLabel.toLowerCase()}`);
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.warn("Please sign in to request a withdrawal");
      return;
    }

    try {
      setSubmitting(true);
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const payload: Record<string, unknown> = {
        amountCents: Math.round(amountValue * 100),
        method: methodMeta.method,
        destination: destination.trim(),
      };

      if (card.cryptoType) {
        payload.cryptoType = card.cryptoType;
      }

      const res = await fetch(`${api}/api/v1/user/withdrawals/request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit withdrawal request");
      }

      toast.success(data?.message || "Withdrawal request submitted successfully");
      onSuccess();
      handleClose();
    } catch (error) {
      toast.error((error as Error).message || "Failed to submit withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4" onClick={handleClose}>
      <div
        className="w-full max-w-[420px] rounded-2xl border border-[#2A2D3E] bg-[#151728] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-xl font-bold">{card.name} Cashout</h3>
          <button onClick={handleClose} className="w-8 h-8 rounded-lg bg-[#1E2133] text-[#9CA3AF] hover:text-white flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <div className="rounded-xl bg-[#1E2133] border border-[#2A2D3E] p-4 mb-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white/5 border border-[#2A2D3E] flex items-center justify-center overflow-hidden">
            <Image src={card.logoSrc} alt={card.name} width={36} height={36} className="object-contain" />
          </div>
          <div>
            <p className="text-white font-semibold">{card.name}</p>
            <p className="text-xs text-[#9CA3AF]">{card.subtitle || "Secure withdrawal request"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-1">Amount (USD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Minimum $5"
              className="w-full bg-[#0D0F1E] border border-[#2A2D3E] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-[#9CA3AF] mb-1">{methodMeta.destinationLabel}</label>
            <input
              type={methodMeta.method === "paypal" ? "email" : "text"}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={methodMeta.destinationPlaceholder}
              className="w-full bg-[#0D0F1E] border border-[#2A2D3E] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-1 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="h-10 rounded-lg border border-[#2A2D3E] bg-[#1E2133] text-white text-sm font-medium hover:bg-[#252840]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-10 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({
  title,
  cards,
  onCardClick,
}: {
  title: string;
  cards: CashoutCard[];
  onCardClick: (card: CashoutCard) => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-white font-bold text-2xl sm:text-3xl">{title}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onCardClick(card)}
            className="group rounded-2xl border border-[#26293E] bg-[#151728] hover:border-emerald-500/60 transition-all p-3 sm:p-4 text-left"
          >
            <div className="w-full h-[120px] sm:h-[140px] rounded-xl bg-[#1E2133] flex items-center justify-center overflow-hidden mb-3">
              <Image
                src={card.logoSrc}
                alt={card.name}
                width={120}
                height={120}
                className="max-h-[95px] w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-white font-semibold text-sm sm:text-base truncate">{card.name}</p>
            {card.subtitle && <p className="text-[#8C8FA8] text-xs mt-1">{card.subtitle}</p>}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function CashoutPage() {
  const [selectedCard, setSelectedCard] = useState<CashoutCard | null>(null);
  const [methodModalOpen, setMethodModalOpen] = useState(false);
  const [giftCardModalOpen, setGiftCardModalOpen] = useState(false);
  const [balanceCents, setBalanceCents] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;
      try {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${api}/api/v1/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && typeof data?.profile?.balanceCents === "number") {
          setBalanceCents(data.profile.balanceCents);
        }
      } catch {
        // ignore transient balance fetch errors
      }
    };
    fetchBalance();
  }, []);

  const handleCardClick = (card: CashoutCard) => {
    setSelectedCard(card);
    if (card.category === "giftcard") {
      setGiftCardModalOpen(true);
      return;
    }
    setMethodModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0D0F1E]">
      <TopBar />
      <TickerBar />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-10 flex flex-col gap-10">
        <Section title="Popular" cards={POPULAR} onCardClick={handleCardClick} />
        <Section title="Withdraw cash" cards={WITHDRAW_CASH} onCardClick={handleCardClick} />
        <Section title="Giftcards" cards={GIFTCARDS} onCardClick={handleCardClick} />
      </main>

      <CashoutMethodModal
        card={selectedCard}
        isOpen={methodModalOpen}
        onClose={() => setMethodModalOpen(false)}
        onSuccess={() => {
          setMethodModalOpen(false);
          setSelectedCard(null);
        }}
      />

      <GiftCardRedemptionModal
        isOpen={giftCardModalOpen}
        onClose={() => {
          setGiftCardModalOpen(false);
          setSelectedCard(null);
        }}
        userBalance={balanceCents}
        onRedemptionComplete={() => {
          setGiftCardModalOpen(false);
          setSelectedCard(null);
        }}
      />
    </div>
  );
}
