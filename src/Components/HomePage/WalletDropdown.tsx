"use client";

import React, { useState, useMemo } from "react";
import { X, ChevronDown, Loader2 } from "lucide-react";
import { BiSolidWallet } from "react-icons/bi";
import Select, { SingleValue } from "react-select";
import countryList from "react-select-country-list";
import ReactCountryFlag from "react-country-flag";
import Image, { StaticImageData } from "next/image";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateProfileFields } from "@/store/userSlice";

// Assets
import Old from "../../../public/assets/visacard.png";
import Btc from "../../../public/assets/bit.png";
import Eth from "../../../public/assets/eth.png";
import Lit from "../../../public/assets/lit.png";
import Sol from "../../../public/assets/sol.png";
import Tet from "../../../public/assets/tet.png";
import Tron from "../../../public/assets/tron.png";
import Rip from "../../../public/assets/rip.png";
import POl from "../../../public/assets/pol.png";
import Ripple from "../../../public/assets/ripple.png";
import USD from "../../../public/assets/usd.png";
import World from "../../../public/assets/world.png";

import Play from "../../../public/assets/play.png";
import N from "../../../public/assets/n.png";
import NEt from "../../../public/assets/net.png";
import Zal from "../../../public/assets/zal.png";
import Spot from "../../../public/assets/spot.png";
import Rob from "../../../public/assets/rob.png";
import Paypal from "../../../public/assets/pay.png";
import Itune from "../../../public/assets/i.png";

interface Props {
    onClose: () => void;
}

interface CountryOption {
    label: string;
    value: string;
}

interface Method {
    name: string;
    icon: StaticImageData;
}

const WalletDropdown: React.FC<Props> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<"general" | "task">("general");
    const [value, setValue] = useState<CountryOption | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
    const [promoCode, setPromoCode] = useState("");
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState("");
    const dispatch = useDispatch();

    // Check if selected method is Virtual Visa (cash) or Crypto
    const isVirtualVisa = selectedMethod?.name === "Virtual Visa";
    const isCrypto = selectedMethod && !isVirtualVisa;

    // Amount presets for Virtual Visa (in euros)
    const amountPresets = [10, 25, 50, 100];

    const options: CountryOption[] = useMemo(() => countryList().getData(), []);

    const handleChange = (val: SingleValue<CountryOption> | null) => {
        setValue(val);
        setSelectedMethod({ name: "Virtual Visa", icon: Old });
    };

    const handleRedeemPromo = async () => {
        if (!promoCode.trim()) {
            toast.error("Please enter a promo code");
            return;
        }

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            toast.error("Please sign in to redeem promo codes");
            return;
        }

        setIsRedeeming(true);
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${api}/api/v1/games/user/bonus-code/redeem`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: promoCode.trim() }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(`🎉 ${data.message || "Promo code redeemed successfully"}! +$${(data.rewardCents / 100).toFixed(2)}`);
                
                // Update balance in Redux
                if (typeof data.newBalanceCents === "number") {
                    dispatch(updateProfileFields({ balanceCents: data.newBalanceCents }));
                }

                // Clear the input
                setPromoCode("");

                // Emit event to update balance in Topbar
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("balance-updated", { 
                        detail: { balanceCents: data.newBalanceCents } 
                    }));
                }
            } else {
                toast.error(data.message || "Failed to redeem promo code");
            }
        } catch (err) {
            console.error("Error redeeming promo code:", err);
            toast.error("Failed to redeem promo code");
        } finally {
            setIsRedeeming(false);
        }
    };

    return (
        <div
            className={`
        fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        sm:absolute sm:translate-x-0 sm:translate-y-0 sm:left-auto sm:top-auto
        sm:right-[18%] sm:mt-[52%]
        md:w-100 w-90 md:h-[100%] h-[70%] sm:w-96 
        bg-[#1E2133] text-white rounded-xl shadow-lg overflow-hidden z-50
      `}
        >
            {/* Close Button */}
            <div className="flex items-end justify-end px-4 py-3">
                <button
                    onClick={onClose}
                    className="text-[#26293E] border p-1 cursor-pointer rounded-md bg-[#8C8FA8] hover:text-gray-200 transition"
                >
                    <X size={12} />
                </button>
            </div>

            {/* Title Row */}
            <div className="flex items-center gap-2 mx-4 py-2 mb-3 border-b border-[#30334A]">
                <BiSolidWallet size={22} className="text-white" />
                <span className="text-lg">Wallet</span>
            </div>

            {/* Tabs */}
            {!selectedMethod && (
                <div className="flex mx-4 rounded-md bg-[#26293E]">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`flex-1 py-2 cursor-pointer text-center text-sm font-medium ${activeTab === "general"
                            ? "bg-[#3A3E57] m-[6px] rounded-md text-white"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Withdrawal
                    </button>
                    <button
                        onClick={() => setActiveTab("task")}
                        className={`flex-1 py-2 cursor-pointer text-center text-sm font-medium ${activeTab === "task"
                            ? "bg-[#3A3E57] m-[6px] rounded-md text-white"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Promo code
                    </button>
                </div>
            )}

            {/* Country Select */}
            <div className="mx-4 mt-3 bg-[#26293E] rounded-md px-2 py-1">
                <Select<CountryOption, false>
                    options={options}
                    value={value}
                    onChange={handleChange}
                    formatOptionLabel={(country: CountryOption) => (
                        <div className="flex items-center gap-2">
                            <ReactCountryFlag
                                countryCode={country.value}
                                svg
                                style={{
                                    width: "1.5em",
                                    height: "1.5em",
                                    borderRadius: "2px",
                                }}
                            />
                            <span className="text-sm text-white">{country.label}</span>
                        </div>
                    )}
                    styles={{
                        control: (base) => ({
                            ...base,
                            backgroundColor: "#26293E",
                            border: "none",
                            boxShadow: "none",
                            color: "#fff",
                        }),
                        indicatorsContainer: (base) => ({
                            ...base,
                            borderLeft: "none",
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: "#26293E",
                            color: "#fff",
                            borderRadius: "6px",
                        }),
                        singleValue: (base) => ({
                            ...base,
                            color: "#fff",
                        }),
                        input: (base) => ({
                            ...base,
                            color: "#fff",
                        }),
                        option: (base, { isFocused }) => ({
                            ...base,
                            backgroundColor: isFocused ? "#3A3E57" : "#26293E",
                            color: "#fff",
                            cursor: "pointer",
                        }),
                    }}
                />
            </div>

            {/* Dynamic Content */}
            <div className="max-h-[70%] overflow-y-auto px-4 py-3 custom-scrollbar">
                {selectedMethod ? (
                    <div className="space-y-4">
                        {/* Chain/Method Info */}
                        <div>
                            <label className="text-sm mb-1 block">{isVirtualVisa ? "Payment Method" : "Chain"}</label>
                            <div className="flex items-center justify-between bg-[#26293E] border border-gray-700 rounded-md px-3 py-3">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={selectedMethod.icon}
                                        alt={selectedMethod.name}
                                        width={20}
                                        height={20}
                                    />
                                    <span>{selectedMethod.name}</span>
                                </div>
                                <ChevronDown size={16} className="text-gray-400" />
                            </div>
                        </div>

                        {/* Wallet Address - Only for Crypto */}
                        {isCrypto && (
                            <div>
                                <label className="text-sm mb-1 block">Wallet address</label>
                                <input
                                    type="text"
                                    placeholder="Enter your wallet address"
                                    className="w-full px-3 py-3 text-sm bg-[#26293E] border border-gray-700 rounded-md outline-none text-white focus:border-teal-400 transition"
                                />
                            </div>
                        )}

                        {/* Amount */}
                        <div>
                            <label className="text-sm mb-1 block">Amount</label>
                            
                            {/* Virtual Visa: Show preset buttons */}
                            {isVirtualVisa ? (
                                <>
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        {amountPresets.map((amount) => (
                                            <button
                                                key={amount}
                                                onClick={() => {
                                                    setSelectedAmount(amount);
                                                    setCustomAmount("");
                                                }}
                                                className={`px-4 py-3 rounded-md text-sm font-medium transition ${
                                                    selectedAmount === amount
                                                        ? "bg-teal-500 text-white"
                                                        : "bg-[#26293E] text-gray-300 hover:bg-[#2f3247]"
                                                }`}
                                            >
                                                €{amount}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">Or enter custom amount:</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-sm text-gray-400">€</span>
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => {
                                                setCustomAmount(e.target.value);
                                                setSelectedAmount(null);
                                            }}
                                            placeholder="Custom amount"
                                            className="flex-1 px-3 py-3 text-sm bg-[#26293E] border border-gray-700 rounded-md outline-none text-white focus:border-teal-400 transition"
                                        />
                                    </div>
                                </>
                            ) : (
                                /* Crypto: Show input with Max button */
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter amount"
                                        className="flex-1 px-3 py-3 text-sm bg-[#26293E] border border-gray-700 rounded-md outline-none text-white focus:border-teal-400 transition"
                                    />
                                    <button className="px-4 py-3 bg-[#6B6E8A] text-sm rounded-md hover:bg-[#7a7f9a] transition">
                                        Max
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Create Withdrawal */}
                        <button className="w-full cursor-pointer px-4 py-3 bg-gradient-to-r from-[#099F86] to-[#08c6a0] text-sm rounded-md transition hover:opacity-90">
                            Create withdrawal
                        </button>
                    </div>
                ) : activeTab === "general" ? (
                    <div className="space-y-3 mb-[28%]">
                        {/* Cash Section */}
                        <p className="text-sm text-white">Cash</p>
                        <div
                            className="flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer"
                            onClick={() =>
                                setSelectedMethod({ name: "Virtual Visa", icon: Old })
                            }
                        >
                            <Image src={Old} alt="Cash" width={22} height={22} />
                            <span className="text-sm">Virtual Visa</span>
                        </div>

                        {/* Crypto Section */}
                        <p className="text-sm text-white">Crypto</p>
                        <div className="flex gap-2">
                            <div
                                onClick={() => setSelectedMethod({ name: "Bitcoin", icon: Btc })}
                                className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer"
                            >
                                <Image src={Btc} alt="BTC" width={22} height={22} />
                                <span className="text-sm">Bitcoin</span>
                            </div>
                            <div
                                onClick={() =>
                                    setSelectedMethod({ name: "Ethereum", icon: Eth })
                                }
                                className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer"
                            >
                                <Image src={Eth} alt="ETH" width={22} height={22} />
                                <span className="text-sm">Ethereum</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={Lit} alt="Box1" width={22} height={22} />
                                <span className="text-sm">Litecoin</span>
                            </div>
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={Sol} alt="Box2" width={22} height={22} />
                                <span className="text-sm">Solana</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={Tet} alt="Box1" width={22} height={22} />
                                <span className="text-sm">Tether</span>
                            </div>
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={Tron} alt="Box2" width={22} height={22} />
                                <span className="text-sm">Tron</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={Rip} alt="Box1" width={22} height={22} />
                                <span className="text-sm">Ripple (XRP)</span>
                            </div>
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={POl} alt="Box2" width={22} height={22} />
                                <span className="text-sm">Polygon</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={Ripple} alt="Box1" width={22} height={22} />
                                <span className="text-sm">Ripple (XRP)</span>
                            </div>
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={USD} alt="Box2" width={22} height={22} />
                                <span className="text-sm">USD Coin</span>
                            </div>
                        </div>

                        <div className="flex w-[49%] gap-2">
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={World} alt="Box1" width={22} height={22} />
                                <span className="text-sm">World coin</span>
                            </div>
                        </div>

                        {/* Vouchers Section */}
                        <p className="text-sm text-white">Vouchers</p>
                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={Play} alt="Box1" width={22} height={22} />
                                <span className="text-sm">Playstation</span>
                            </div>
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={N} alt="Box2" width={22} height={22} />
                                <span className="text-sm">Nintendo</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={NEt} alt="Box1" width={22} height={22} />
                                <span className="text-sm">Netflix</span>
                            </div>
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={Zal} alt="Box2" width={22} height={22} />
                                <span className="text-sm">Zalando</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={Spot} alt="Box1" width={22} height={22} />
                                <span className="text-sm">Spotify</span>
                            </div>
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={Rob} alt="Box2" width={22} height={22} />
                                <span className="text-sm">Roblox</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={Paypal} alt="Box1" width={22} height={22} />
                                <span className="text-sm">Paypal</span>
                            </div>
                            <div className="flex-1 flex items-center gap-3 bg-[#26293E] border border-gray-700 rounded-md px-3 py-3 cursor-pointer">
                                <Image src={Itune} alt="Box2" width={22} height={22} />
                                <span className="text-sm">iTunes</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder="Enter your promo code"
                            className="px-3 py-3 text-sm bg-[#26293E] border border-gray-700 rounded-md outline-none text-white"
                            disabled={isRedeeming}
                        />
                        <button 
                            onClick={handleRedeemPromo}
                            disabled={isRedeeming || !promoCode.trim()}
                            className="w-full cursor-pointer px-4 py-3 bg-[#099F86] text-sm rounded-md transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isRedeeming ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Redeeming...
                                </>
                            ) : (
                                "Apply Promo Code"
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Custom Scrollbar */}
            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e2133;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #3a3e57;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
        </div>
    );
};

export default WalletDropdown;
