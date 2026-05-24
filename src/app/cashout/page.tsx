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
  brandName: string;
  subtitle?: string;
  logoSrc: string;
  gradientClassName: string;
  badge?: string;
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
  {
    id: "btc",
    name: "Bitcoin",
    brandName: "bitcoin",
    subtitle: "0.50€ transaction fee",
    logoSrc: "/assets/bit.png",
    gradientClassName: "from-[#2C14A6] to-[#3F21C4]",
    category: "crypto",
    cryptoType: "btc",
  },
  {
    id: "doge",
    name: "Dogecoin",
    brandName: "Dogecoin",
    subtitle: "0.50€ transaction fee",
    logoSrc: "/assets/dolar.png",
    gradientClassName: "from-[#B87B0B] to-[#D99A1C]",
    category: "crypto",
    cryptoType: "doge",
  },
  {
    id: "sol",
    name: "Solana",
    brandName: "SOLANA",
    subtitle: "0.50€ transaction fee",
    logoSrc: "/assets/sol.png",
    gradientClassName: "from-[#B61D1D] to-[#D12D2D]",
    category: "crypto",
    cryptoType: "sol",
  },
  {
    id: "eth",
    name: "Ethereum",
    brandName: "Ethereum",
    subtitle: "0.50€ transaction fee",
    logoSrc: "/assets/eth.png",
    gradientClassName: "from-[#3B9627] to-[#52B338]",
    category: "crypto",
    cryptoType: "eth",
  },
  {
    id: "ltc",
    name: "Litecoin",
    brandName: "Litecoin",
    subtitle: "0.50€ transaction fee",
    logoSrc: "/assets/lit.png",
    gradientClassName: "from-[#0A8C63] to-[#10A479]",
    category: "crypto",
    cryptoType: "ltc",
  },
];

const WITHDRAW_CASH: CashoutCard[] = [
  {
    id: "paypal",
    name: "Paypal",
    brandName: "PayPal",
    logoSrc: "/assets/paypal.png",
    gradientClassName: "from-[#20214B] to-[#2B2E6A]",
    category: "cash",
    method: "paypal",
  },
  {
    id: "worldcoin",
    name: "Worldcoin",
    brandName: "Worldcoin",
    logoSrc: "/assets/worldcoin.png",
    gradientClassName: "from-[#1F2048] to-[#2B2E63]",
    badge: "30% OFF",
    category: "crypto",
    cryptoType: "worldcoin",
  },
  {
    id: "visa",
    name: "Visa",
    brandName: "Visa",
    logoSrc: "/assets/visa.png",
    gradientClassName: "from-[#1F2048] to-[#2B2E63]",
    category: "cash",
    method: "bank_transfer",
  },
];

const GIFTCARDS: CashoutCard[] = [
  {
    id: "amazon",
    name: "Amazon",
    brandName: "Amazon",
    logoSrc: "/assets/amazon.png",
    gradientClassName: "from-[#2C14A6] to-[#3F21C4]",
    category: "giftcard",
  },
  {
    id: "itunes",
    name: "App stores",
    brandName: "iTunes",
    logoSrc: "/assets/apple.png",
    gradientClassName: "from-[#B87B0B] to-[#D99A1C]",
    category: "giftcard",
  },
  {
    id: "spotify",
    name: "Spotify",
    brandName: "Spotify",
    logoSrc: "/assets/spot.png",
    gradientClassName: "from-[#B61D1D] to-[#D12D2D]",
    category: "giftcard",
  },
  {
    id: "playstation",
    name: "Playstations",
    brandName: "Playstation",
    logoSrc: "/assets/play.png",
    gradientClassName: "from-[#3B9627] to-[#52B338]",
    category: "giftcard",
  },
  {
    id: "steam",
    name: "Steam",
    brandName: "Steam",
    logoSrc: "/assets/cb.png",
    gradientClassName: "from-[#0A8C63] to-[#10A479]",
    category: "giftcard",
  },
];

interface CashoutMethodModalProps {
  card: CashoutCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userBalance?: number;
}

function CashoutMethodModal({ card, isOpen, onClose, onSuccess, userBalance = 0 }: CashoutMethodModalProps) {
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
        destinationLabel: `${card.id === 'btc' ? 'BTC' : card.name} Address`,
        destinationPlaceholder: "Enter address",
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

    if (amountValue < 0.5) {
      toast.error("Minimum withdrawal amount is $0.5");
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
        className="w-full max-w-[400px] rounded-2xl border border-[#23353E] bg-[#0F1D24] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#14A990]/20 flex items-center justify-center text-[#14A990]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <h3 className="text-white text-lg font-bold">Cashout {card.name}</h3>
          </div>
          <button onClick={handleClose} className="text-[#8C8FA8] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-[#14A990]/10 border border-[#14A990]/20 rounded-full px-4 py-2 mb-6 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#14A990] flex items-center justify-center text-[10px] font-bold text-white">!</div>
            <p className="text-[#14A990] text-xs font-semibold">The minimum withdrawal is $0.5</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Destination Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[#8C8FA8] text-xs font-semibold">{methodMeta.destinationLabel}</label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={methodMeta.destinationPlaceholder}
                className="w-full bg-[#15242C] border border-[#23353E] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#14A990]/50"
              />
              <button 
                type="button"
                className="absolute right-2 top-1.5 px-3 py-1.5 bg-[#23353E] hover:bg-[#2C414C] rounded-md text-white text-[11px] font-bold transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          {/* Amount Field */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <label className="text-[#8C8FA8] text-xs font-semibold">Amount</label>
                <span className="text-[#8C8FA8] text-[10px] font-medium">Your balance : ${(userBalance / 100).toFixed(2)}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="E.g $120"
                className="w-full bg-[#15242C] border border-[#23353E] rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#14A990]/50"
              />
              <button 
                type="button"
                onClick={() => setAmount((userBalance / 100).toString())}
                className="absolute right-2 top-1.5 px-3 py-1.5 bg-[#23353E] hover:bg-[#2C414C] rounded-md text-white text-[11px] font-bold transition-colors"
              >
                Max
              </button>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-[#15242C]/50 border border-[#23353E] rounded-lg p-4 flex flex-col gap-3">
            <p className="text-[#8C8FA8] text-[10px] font-bold uppercase tracking-wider mb-1">Transaction details</p>
            <div className="flex items-center justify-between text-xs">
                <span className="text-[#8C8FA8] font-medium">BTC Rate</span>
                <span className="text-white font-bold">$68,936.37</span>
            </div>
            <div className="flex items-center justify-between text-xs">
                <span className="text-[#8C8FA8] font-medium">Transaction fee</span>
                <span className="text-white font-bold">$0.20</span>
            </div>
            <div className="flex items-center justify-between text-xs">
                <span className="text-[#8C8FA8] font-medium">Value</span>
                <span className="text-white font-bold">BTC 0.00003547</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-lg bg-gradient-to-r from-[#0AC07D] to-[#14A990] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0AC07D]/10 hover:shadow-[#0AC07D]/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            {submitting ? "Submitting..." : "Cashout"}
          </button>
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
      <h2 className="text-white font-bold text-2xl sm:text-[40px] leading-tight">{title}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onCardClick(card)}
            className="group relative overflow-hidden rounded-[14px] border border-white/10 h-[178px] sm:h-[190px] p-3 sm:p-4 text-left transition-transform hover:scale-[1.015]"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientClassName}`} />
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.35) 0.7px, transparent 0.7px)",
                backgroundSize: "4px 4px",
              }}
            />

            {card.badge && (
              <span className="absolute right-3 top-3 z-10 rounded-full bg-[#FDBA0F] px-2 py-0.5 text-[10px] font-bold text-[#111827]">
                {card.badge}
              </span>
            )}

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-white/20 backdrop-blur-[1px] flex items-center justify-center overflow-hidden">
                  <Image
                    src={card.logoSrc}
                    alt={card.name}
                    width={24}
                    height={24}
                    className={`h-full w-full object-contain ${card.id === 'worldcoin' ? 'invert brightness-200 mix-blend-screen' : ''}`}
                  />
                </div>
                <p className="text-white text-[15px] sm:text-[17px] font-semibold tracking-tight truncate">
                  {card.brandName}
                </p>
              </div>

              <div className="text-center pb-0.5">
                <p className="text-white font-medium text-sm sm:text-base leading-tight">{card.name}</p>
                {card.subtitle && <p className="text-white/70 text-[11px] mt-1">{card.subtitle}</p>}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[14px]" />
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
        <Section title="Giftcard" cards={GIFTCARDS} onCardClick={handleCardClick} />
      </main>

      <CashoutMethodModal
        card={selectedCard}
        isOpen={methodModalOpen}
        onClose={() => setMethodModalOpen(false)}
        userBalance={balanceCents}
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
