"use client";

import React, { useState } from "react";
import { X, Gift, Loader } from "lucide-react";
import { toast } from "react-toastify";

interface GiftCardRedemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
  onRedemptionComplete?: () => void;
}

const GIFT_CARDS = [
  { id: "amazon", name: "Amazon" },
  { id: "google_play", name: "Google Play" },
  { id: "apple_itunes", name: "Apple iTunes" },
  { id: "steam", name: "Steam" },
  { id: "xbox", name: "Xbox" },
  { id: "playstation", name: "PlayStation" },
  { id: "netflix", name: "Netflix" },
  { id: "spotify", name: "Spotify" },
  { id: "roblox", name: "Roblox" },
  { id: "nintendo", name: "Nintendo" },
];

// Supported denominations per brand (fallback - will be fetched from backend)
// Conservative defaults for testbed environment
const BRAND_DENOMINATIONS: { [key: string]: number[] } = {
  'amazon': [10, 20, 25, 50, 100],
  'google_play': [10, 20, 50, 100],
  'apple_itunes': [10, 20, 25, 50, 100],
  'steam': [10, 20, 50, 100],
  'xbox': [10, 20, 50, 100],
  'playstation': [10, 20, 50, 100],
  'netflix': [10, 20, 50, 100],
  'spotify': [10, 20, 50, 100],
  'roblox': [10, 20, 50, 100],
  'nintendo': [10, 20, 50, 100],
};

const CURRENCIES = ["USD", "EUR"];

export default function GiftCardRedemptionModal({
  isOpen,
  onClose,
  userBalance,
  onRedemptionComplete,
}: GiftCardRedemptionModalProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedDenomination, setSelectedDenomination] = useState<number | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableDenominations, setAvailableDenominations] = useState<number[]>([]);
  const [loadingDenominations, setLoadingDenominations] = useState(false);

  // Fetch available denominations when card is selected
  const handleCardSelect = async (cardId: string) => {
    setSelectedCard(cardId);
    setSelectedDenomination(null);
    setLoadingDenominations(true);
    
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${api}/api/v1/giftcard/denominations/${cardId}`);
      const data = await res.json();
      
      if (res.ok && data.denominations) {
        setAvailableDenominations(data.denominations);
      } else {
        // Fallback to hardcoded denominations
        setAvailableDenominations(BRAND_DENOMINATIONS[cardId] || []);
      }
    } catch (err) {
      console.error("Error fetching denominations:", err);
      // Fallback to hardcoded denominations
      setAvailableDenominations(BRAND_DENOMINATIONS[cardId] || []);
    } finally {
      setLoadingDenominations(false);
    }
  };

  const handleRedeem = async () => {
    if (!selectedCard || !selectedDenomination) {
      toast.error("Please select a gift card and denomination");
      return;
    }

    const amountNeeded = selectedDenomination;
    const availableBalance = userBalance / 100;

    if (availableBalance < amountNeeded) {
      toast.error(
        `Insufficient balance. You need $${amountNeeded.toFixed(2)} but only have $${availableBalance.toFixed(2)}`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        toast.error("Please sign in to redeem a gift card");
        return;
      }

      const payload = {
        giftCardType: selectedCard,
        denomination: selectedDenomination,
        currency: selectedCurrency,
      };
      
      console.log('📤 Sending gift card redemption:', payload);

      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${api}/api/v1/user/giftcard/redeem`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        const message = data.requiresManualEntry 
          ? `✅ Request submitted! Admin will generate and send the code to your email.`
          : `✅ Gift card redemption submitted! Check your email for the code.`;
        
        toast.success(message);
        setSelectedCard(null);
        setSelectedDenomination(null);
        setSelectedCurrency("USD");
        onClose();
        onRedemptionComplete?.();
      } else {
        // Show detailed error message
        let errorMsg = data.message || "Failed to redeem gift card";
        if (data.available && Array.isArray(data.available)) {
          errorMsg += ` Available: $${data.available.join(", $")}`;
        }
        toast.error(errorMsg);
        
        // If backend returned supported denominations, update the UI
        if (data.available && Array.isArray(data.available) && selectedCard) {
          setAvailableDenominations(data.available);
        }
      }
    } catch (err) {
      console.error("Error redeeming gift card:", err);
      toast.error("Failed to redeem gift card. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1D2E] rounded-2xl border border-[#2A2D3E] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2D3E] sticky top-0 bg-[#1A1D2E]">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Redeem Gift Card</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#252840] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Balance Info */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <p className="text-sm text-[#9CA3AF] mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-emerald-400">
              ${(userBalance / 100).toFixed(2)}
            </p>
          </div>

          {/* Select Gift Card */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Select Gift Card
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {GIFT_CARDS.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardSelect(card.id)}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center ${
                    selectedCard === card.id
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-[#2A2D3E] bg-[#252840] hover:border-[#3A3D4E]"
                  }`}
                >
                  <p className="text-sm font-medium text-white">{card.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Select Currency */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Currency
            </label>
            <div className="flex gap-3">
              {CURRENCIES.map((currency) => (
                <button
                  key={currency}
                  onClick={() => setSelectedCurrency(currency)}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    selectedCurrency === currency
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : "border-[#2A2D3E] bg-[#252840] text-white hover:border-[#3A3D4E]"
                  }`}
                >
                  {currency}
                </button>
              ))}
            </div>
          </div>

          {/* Select Denomination */}
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Denomination
            </label>
            {selectedCard ? (
              loadingDenominations ? (
                <p className="text-sm text-gray-400">Loading denominations...</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(availableDenominations.length > 0 ? availableDenominations : BRAND_DENOMINATIONS[selectedCard] || []).map((denom) => (
                    <button
                      key={denom}
                      onClick={() => setSelectedDenomination(denom)}
                      disabled={userBalance / 100 < denom}
                      className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                        selectedDenomination === denom
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                          : userBalance / 100 < denom
                            ? "border-[#2A2D3E] bg-[#252840] text-gray-500 cursor-not-allowed opacity-50"
                            : "border-[#2A2D3E] bg-[#252840] text-white hover:border-[#3A3D4E]"
                      }`}
                    >
                      {selectedCurrency}
                      {denom}
                    </button>
                  ))}
                </div>
              )
            ) : (
              <p className="text-sm text-gray-400">Please select a gift card first</p>
            )}
            {selectedDenomination && userBalance / 100 < selectedDenomination && (
              <p className="text-xs text-red-400 mt-2">
                Insufficient balance for this denomination
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              ℹ️ Your redemption request will be reviewed by our admin team. The gift card code will be sent to your registered email address within 24 hours.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-lg bg-[#252840] hover:bg-[#2A2D3E] text-white font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRedeem}
              disabled={
                !selectedCard ||
                !selectedDenomination ||
                isSubmitting ||
                userBalance / 100 < (selectedDenomination || 0)
              }
              className="flex-1 py-3 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  Redeem Gift Card
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
