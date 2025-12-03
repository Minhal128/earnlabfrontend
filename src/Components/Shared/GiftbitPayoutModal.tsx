"use client";

import { useState, useEffect } from "react";
import { X, Gift, Mail, DollarSign, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";

interface GiftbitBrand {
  brandCode: string;
  brandName: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  minValue: number;
  maxValue: number;
  currency: string;
}

interface GiftbitPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
  onPayoutComplete: () => void;
}

const GiftbitPayoutModal: React.FC<GiftbitPayoutModalProps> = ({
  isOpen,
  onClose,
  userBalance,
  onPayoutComplete,
}) => {
  const [brands, setBrands] = useState<GiftbitBrand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<GiftbitBrand | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [giftMessage, setGiftMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<"select-brand" | "enter-details" | "confirm">("select-brand");

  useEffect(() => {
    if (isOpen) {
      fetchBrands();
    }
  }, [isOpen]);

  const fetchBrands = async () => {
    setBrandsLoading(true);
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${api}/api/v1/giftbit/brands`);
      const data = await response.json();
      
      if (data.success) {
        console.log("Fetched brands:", data.brands); // Debug log
        setBrands(data.brands);
      } else {
        setError("Failed to load gift card brands");
      }
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError("Failed to load gift card brands");
    } finally {
      setBrandsLoading(false);
    }
  };

  const handleBrandSelect = (brand: GiftbitBrand) => {
    setSelectedBrand(brand);
    setStep("enter-details");
    setError(null);
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  const validateForm = (): boolean => {
    if (!selectedBrand) {
      setError("Please select a gift card brand");
      return false;
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount");
      return false;
    }

    // Minimum amount is $1.00 for most gift cards
    if (amountNum < 1.00) {
      setError("Minimum amount is $1.00");
      return false;
    }

    const amountCents = Math.round(amountNum * 100);
    if (amountCents < 100) {
      setError("Amount is too small. Minimum is $1.00");
      return false;
    }

    if (amountCents > userBalance) {
      setError("Insufficient balance");
      return false;
    }

    if (amountNum < selectedBrand.minValue || amountNum > selectedBrand.maxValue) {
      setError(`Amount must be between $${selectedBrand.minValue} and $${selectedBrand.maxValue}`);
      return false;
    }

    if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setStep("confirm");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("token");

      const amountCents = Math.round(parseFloat(amount) * 100);

      const payload = {
        brandCode: selectedBrand?.brandCode,
        brandName: selectedBrand?.brandName,
        amountCents,
        recipientEmail,
        recipientName: recipientName || recipientEmail,
        giftMessage: giftMessage || "Thank you for using LabWards!",
      };

      console.log("Submitting payout with payload:", payload);
      console.log("Selected brand:", selectedBrand);

      const response = await fetch(`${api}/api/v1/giftbit/payout/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Show success for 4 seconds before closing
        setTimeout(() => {
          onPayoutComplete();
          handleClose();
        }, 4000);
      } else {
        setError(data.message || "Failed to create gift card payout");
      }
    } catch (err: any) {
      console.error("Error creating payout:", err);
      setError("An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("select-brand");
    setSelectedBrand(null);
    setAmount("");
    setRecipientEmail("");
    setRecipientName("");
    setGiftMessage("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-gradient-to-br from-[#1E2133] to-[#151728] rounded-2xl max-w-2xl w-full border border-[#30334A] shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1E2133]/95 backdrop-blur-sm border-b border-[#30334A] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Gift className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Gift Card Payout</h2>
              <p className="text-sm text-[#9CA3AF]">Send gift cards using your balance</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[#B3B6C7] hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Animation */}
          {success && (
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent border-2 border-emerald-500/50 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
              {/* Animated background circles */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-75" />
              </div>
              
              <div className="relative flex items-start gap-4">
                {/* Animated checkmark icon */}
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative p-2 bg-emerald-500/20 rounded-full">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-in zoom-in-50 duration-300 delay-150" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    🎉 Payment Successful!
                  </h3>
                  <p className="text-emerald-400 font-medium mb-1">
                    Your gift card has been sent
                  </p>
                  <p className="text-sm text-emerald-300/80">
                    {recipientEmail} will receive their gift card via email shortly
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span>Processing...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step === "select-brand" ? "bg-emerald-500 text-white" : "bg-[#30334A] text-[#9CA3AF]"
            }`}>
              1
            </div>
            <div className={`h-1 w-16 ${step !== "select-brand" ? "bg-emerald-500" : "bg-[#30334A]"}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step === "enter-details" ? "bg-emerald-500 text-white" : "bg-[#30334A] text-[#9CA3AF]"
            }`}>
              2
            </div>
            <div className={`h-1 w-16 ${step === "confirm" ? "bg-emerald-500" : "bg-[#30334A]"}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step === "confirm" ? "bg-emerald-500 text-white" : "bg-[#30334A] text-[#9CA3AF]"
            }`}>
              3
            </div>
          </div>

          {/* Step 1: Select Brand */}
          {step === "select-brand" && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Select Gift Card Brand</h3>
              {brandsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                  {brands.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-[#9CA3AF]">
                      No gift card brands available
                    </div>
                  ) : (
                    brands.map((brand) => (
                      <button
                        key={brand.brandCode}
                        onClick={() => handleBrandSelect(brand)}
                        className="p-4 rounded-lg bg-[#252840] border-2 border-[#30334A] hover:border-emerald-500 hover:bg-[#2A2D3E] transition-all group relative overflow-hidden"
                      >
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative">
                          <div className="aspect-square rounded-lg bg-gradient-to-br from-white to-gray-100 mb-3 flex items-center justify-center p-3 overflow-hidden shadow-sm">
                            {brand.imageUrl ? (
                              <img
                                src={brand.imageUrl}
                                alt={brand.brandName || "Gift Card"}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  // Fallback if image fails to load
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <Gift className={`w-12 h-12 text-gray-400 ${brand.imageUrl ? 'hidden' : ''}`} />
                          </div>
                          <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-1">
                            {brand.brandName || brand.brandCode || "Unknown Brand"}
                          </p>
                          <p className="text-xs text-emerald-400 font-medium">
                            ${brand.minValue || 0} - ${brand.maxValue || 0}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Enter Details */}
          {step === "enter-details" && selectedBrand && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-[#252840] border border-[#30334A]">
                <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center p-2">
                  {selectedBrand.imageUrl ? (
                    <img
                      src={selectedBrand.imageUrl}
                      alt={selectedBrand.brandName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Gift className="w-8 h-8 text-[#9CA3AF]" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{selectedBrand.brandName}</p>
                  <p className="text-sm text-[#9CA3AF]">
                    ${selectedBrand.minValue} - ${selectedBrand.maxValue}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setStep("select-brand");
                    setSelectedBrand(null);
                  }}
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  Gift Card Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="1.00"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#252840] border border-[#30334A] text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  Minimum: $1.00 • Available: ${(userBalance / 100).toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  Recipient Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#252840] border border-[#30334A] text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  Recipient Name (Optional)
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-[#252840] border border-[#30334A] text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  Gift Message (Optional)
                </label>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Thank you for using LabWards!"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-[#252840] border border-[#30334A] text-white focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStep("select-brand");
                    setSelectedBrand(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-lg bg-[#252840] border border-[#30334A] text-white font-semibold hover:bg-[#2A2D3E] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleContinue}
                  className="flex-1 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && selectedBrand && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Confirm Payout</h3>

              <div className="space-y-3 p-4 rounded-lg bg-[#252840] border border-[#30334A]">
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Gift Card</span>
                  <span className="text-white font-medium">{selectedBrand.brandName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Amount</span>
                  <span className="text-white font-medium">${amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Recipient</span>
                  <span className="text-white font-medium">{recipientEmail}</span>
                </div>
                {recipientName && (
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Name</span>
                    <span className="text-white font-medium">{recipientName}</span>
                  </div>
                )}
                <div className="h-px bg-[#30334A]" />
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Your New Balance</span>
                  <span className="text-emerald-400 font-semibold">
                    ${((userBalance - parseFloat(amount) * 100) / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("enter-details")}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-lg bg-[#252840] border border-[#30334A] text-white font-semibold hover:bg-[#2A2D3E] transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  {loading && (
                    <div className="absolute inset-0 bg-emerald-600 flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="animate-pulse">Processing Payment...</span>
                      </div>
                    </div>
                  )}
                  {!loading && (
                    <>
                      <Gift className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Confirm Payout</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftbitPayoutModal;
