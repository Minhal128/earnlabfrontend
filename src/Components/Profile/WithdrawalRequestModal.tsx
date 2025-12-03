"use client";

import React, { useState, useEffect } from "react";
import { FaX } from "react-icons/fa6";
import axios from "axios";

interface WithdrawalMethod {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
  onSuccess: () => void;
}

const GIFT_CARD_TYPES = [
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

const PRESET_AMOUNTS = [5, 10, 20, 25, 50, 100];

const CRYPTO_TYPES = [
  { id: "btc", name: "Bitcoin (BTC)" },
  { id: "eth", name: "Ethereum (ETH)" },
  { id: "ltc", name: "Litecoin (LTC)" },
  { id: "usdt", name: "USDT (TRC20)" },
  { id: "sol", name: "Solana (SOL)" },
];

const WithdrawalRequestModal: React.FC<WithdrawalRequestModalProps> = ({
  isOpen,
  onClose,
  userBalance,
  onSuccess,
}) => {
  const [methods, setMethods] = useState<WithdrawalMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [giftCardType, setGiftCardType] = useState<string>("");
  const [cryptoType, setCryptoType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMethods();
    }
  }, [isOpen]);

  const fetchMethods = async () => {
    try {
      const response = await axios.get("/api/v1/payouts/options");
      setMethods(response.data);
      if (response.data.length > 0) {
        setSelectedMethod(response.data[0].key);
      }
    } catch (err) {
      console.error("Failed to fetch withdrawal methods:", err);
      setError("Failed to load withdrawal methods");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!selectedMethod) {
      setError("Please select a withdrawal method");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const amountValue = parseFloat(amount);
    if (amountValue < 5) {
      setError("Minimum withdrawal amount is $5");
      return;
    }

    const amountCents = Math.round(amountValue * 100);
    if (amountCents > userBalance) {
      setError("Insufficient balance");
      return;
    }

    if (!destination) {
      setError(
        selectedMethod === "giftcard"
          ? "Please enter your email address"
          : "Please enter a valid destination"
      );
      return;
    }

    if (selectedMethod === "giftcard" && !giftCardType) {
      setError("Please select a gift card type");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/v1/user/withdrawals/request",
        {
          amountCents,
          method: selectedMethod,
          destination,
          giftCardType: selectedMethod === "giftcard" ? giftCardType : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      setAmount("");
      setDestination("");
      setGiftCardType("");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to submit withdrawal request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E2133] rounded-lg p-5 max-w-sm w-full mx-4 border border-[#2A2D44] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Request Withdrawal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <FaX size={20} />
          </button>
        </div>

        {success ? (
          <div className="text-center py-6">
            <div className="text-green-500 text-4xl mb-3">✓</div>
            <h3 className="text-lg font-bold text-white mb-2">
              Request Submitted!
            </h3>
            <p className="text-gray-400 text-sm">
              Your withdrawal request has been submitted and is pending admin
              review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2.5 text-red-400 text-xs">
                {error}
              </div>
            )}

            {/* Balance Info */}
            <div className="bg-[#151728] rounded-lg p-2.5 border border-[#2A2D44]">
              <p className="text-gray-400 text-xs">Available Balance</p>
              <p className="text-xl font-bold text-[#18C3A7]">
                ${(userBalance / 100).toFixed(2)}
              </p>
            </div>

            {/* Method Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Withdrawal Method
              </label>
              <select
                value={selectedMethod}
                onChange={(e) => {
                  setSelectedMethod(e.target.value);
                  setDestination("");
                  setGiftCardType("");
                  setCryptoType("");
                }}
                className="w-full bg-[#151728] border border-[#2A2D44] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#18C3A7]"
              >
                {methods.map((method) => (
                  <option key={method.key} value={method.key}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preset Amount Buttons */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Amount (USD)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset.toString())}
                    className={`py-2 px-3 rounded-lg text-sm font-semibold transition ${
                      amount === preset.toString()
                        ? "bg-[#18C3A7] text-black"
                        : "bg-[#151728] border border-[#2A2D44] text-white hover:border-[#18C3A7]"
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Or enter custom amount"
                className="w-full bg-[#151728] border border-[#2A2D44] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#18C3A7]"
              />
            </div>

            {/* Gift Card Type Selection */}
            {selectedMethod === "giftcard" && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Gift Card Type
                </label>
                <select
                  value={giftCardType}
                  onChange={(e) => setGiftCardType(e.target.value)}
                  className="w-full bg-[#151728] border border-[#2A2D44] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#18C3A7]"
                >
                  <option value="">Select a gift card type</option>
                  {GIFT_CARD_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Crypto Type Selection */}
            {selectedMethod === "crypto" && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Cryptocurrency
                </label>
                <select
                  value={cryptoType}
                  onChange={(e) => setCryptoType(e.target.value)}
                  className="w-full bg-[#151728] border border-[#2A2D44] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#18C3A7]"
                >
                  <option value="">Select cryptocurrency</option>
                  {CRYPTO_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Destination Input */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                {selectedMethod === "giftcard"
                  ? "Email Address"
                  : selectedMethod === "crypto"
                    ? "Wallet Address"
                    : "PayPal Email"}
              </label>
              <input
                type={selectedMethod === "giftcard" || selectedMethod === "paypal" ? "email" : "text"}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={
                  selectedMethod === "giftcard"
                    ? "your@email.com"
                    : selectedMethod === "paypal"
                      ? "paypal@email.com"
                      : selectedMethod === "crypto"
                        ? "Enter wallet address..."
                        : "Enter destination"
                }
                className="w-full bg-[#151728] border border-[#2A2D44] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#18C3A7]"
              />
            </div>

            {/* Info Message */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2.5 text-blue-400 text-xs">
              <p>
                Your withdrawal will be reviewed by our admin team. Once
                approved, you'll receive your funds via email.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[#151728] border border-[#2A2D44] rounded-lg py-2 text-sm text-white hover:bg-[#1a1f2e] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#18C3A7] rounded-lg py-2 text-sm text-black font-semibold hover:bg-[#15b39a] transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default WithdrawalRequestModal;
