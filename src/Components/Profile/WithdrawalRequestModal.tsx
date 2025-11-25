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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1E2133] rounded-lg p-8 max-w-md w-full mx-4 border border-[#2A2D44]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Request Withdrawal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <FaX size={20} />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Request Submitted!
            </h3>
            <p className="text-gray-400">
              Your withdrawal request has been submitted and is pending admin
              review. You'll receive a notification once it's processed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Balance Info */}
            <div className="bg-[#151728] rounded-lg p-3 border border-[#2A2D44]">
              <p className="text-gray-400 text-sm">Available Balance</p>
              <p className="text-2xl font-bold text-[#18C3A7]">
                ${(userBalance / 100).toFixed(2)}
              </p>
            </div>

            {/* Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Withdrawal Method
              </label>
              <select
                value={selectedMethod}
                onChange={(e) => {
                  setSelectedMethod(e.target.value);
                  setDestination("");
                  setGiftCardType("");
                }}
                className="w-full bg-[#151728] border border-[#2A2D44] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#18C3A7]"
              >
                {methods.map((method) => (
                  <option key={method.key} value={method.key}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-[#151728] border border-[#2A2D44] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#18C3A7]"
              />
            </div>

            {/* Gift Card Type Selection */}
            {selectedMethod === "giftcard" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gift Card Type
                </label>
                <select
                  value={giftCardType}
                  onChange={(e) => setGiftCardType(e.target.value)}
                  className="w-full bg-[#151728] border border-[#2A2D44] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#18C3A7]"
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

            {/* Destination Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {selectedMethod === "giftcard"
                  ? "Email Address"
                  : selectedMethod === "crypto"
                    ? "Wallet Address"
                    : selectedMethod === "paypal"
                      ? "Recipient Email"
                      : "Bank Account"}
              </label>
              <input
                type={selectedMethod === "giftcard" || selectedMethod === "paypal" ? "email" : "text"}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={
                  selectedMethod === "giftcard"
                    ? "your@email.com"
                    : selectedMethod === "paypal"
                      ? "recipient@email.com"
                      : selectedMethod === "crypto"
                        ? "0x..."
                        : "Enter destination"
                }
                className="w-full bg-[#151728] border border-[#2A2D44] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#18C3A7]"
              />
            </div>

            {/* Info Message */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-blue-400 text-sm">
              <p>
                Your withdrawal request will be reviewed by our admin team. Once
                approved, you'll receive your funds or gift card code via email.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[#151728] border border-[#2A2D44] rounded-lg py-2 text-white hover:bg-[#1a1f2e] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#18C3A7] rounded-lg py-2 text-black font-semibold hover:bg-[#15b39a] transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default WithdrawalRequestModal;
