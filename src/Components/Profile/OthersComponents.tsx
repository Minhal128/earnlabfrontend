"use client";
import { useState } from "react";
import { Loader2, Gift } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateProfileFields } from "@/store/userSlice";

const OthersComponents = () => {
    const [selected, setSelected] = useState<string>("");
    const [bonusCode, setBonusCode] = useState("");
    const [isRedeeming, setIsRedeeming] = useState(false);
    const dispatch = useDispatch();

    const options = ["1 Day", "3 Days", "7 Days", "14 Days", "30 Days"];

    const handleRedeemBonus = async () => {
        if (!bonusCode.trim()) {
            toast.error("Please enter a bonus code");
            return;
        }

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            toast.error("Please sign in to redeem bonus codes");
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
                body: JSON.stringify({ code: bonusCode.trim() }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(`🎁 ${data.message || "Bonus code redeemed successfully"}! +$${(data.rewardCents / 100).toFixed(2)}`);
                
                // Update balance in Redux
                if (typeof data.newBalanceCents === "number") {
                    dispatch(updateProfileFields({ balanceCents: data.newBalanceCents }));
                }

                // Clear the input
                setBonusCode("");

                // Emit event to update balance in Topbar
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("balance-updated", { 
                        detail: { balanceCents: data.newBalanceCents } 
                    }));
                }
            } else {
                toast.error(data.message || "Failed to redeem bonus code");
            }
        } catch (err) {
            console.error("Error redeeming bonus code:", err);
            toast.error("Failed to redeem bonus code");
        } finally {
            setIsRedeeming(false);
        }
    };

    return (
        <div className="w-full space-y-8">
            {/* Bonus Code Section */}
            <div className="md:w-[58%]">
                <h2 className="text-white text-lg font-semibold mb-2 flex items-center gap-2">
                    <Gift size={20} className="text-teal-400" />
                    Bonus Code
                </h2>
                <p className="text-[#8C8FA8] text-sm mb-4">
                    Have a bonus code? Enter it here to redeem your reward and boost your balance!
                </p>
                
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={bonusCode}
                        onChange={(e) => setBonusCode(e.target.value.toUpperCase())}
                        placeholder="Enter your bonus code"
                        className="px-4 py-3 text-sm bg-[#26293E] border border-gray-700 rounded-md outline-none text-white focus:border-teal-400 transition"
                        disabled={isRedeeming}
                    />
                    <button 
                        onClick={handleRedeemBonus}
                        disabled={isRedeeming || !bonusCode.trim()}
                        className="w-full px-4 py-3 bg-gradient-to-r from-[#099F86] to-[#0EA88F] text-white font-medium rounded-md transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isRedeeming ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                Redeeming...
                            </>
                        ) : (
                            <>
                                <Gift size={16} />
                                Redeem Bonus Code
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Self-exclusion Section */}
            <div className="md:w-[58%]">
                <h2 className="text-white text-lg font-semibold mb-2">Self-exclusion</h2>
            <p className="text-[#8C8FA8] text-sm mb-6">
                Our self-exclusion feature allows you to take a break from playing
                games at any time. Choose a time-out period, and we will pause your access
                to our games. You can still earn and use all other features
            </p>

            {/* Options */}
            <div className="flex flex-wrap md:gap-3 gap-2 mb-3">
                {options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => setSelected(opt)}
                        className={`md:px-10 px-3 md:py-4 py-2 rounded-md md:text-sm text-xs font-medium transition ${selected === opt
                            ? "bg-teal-500 text-white"
                            : "bg-[#26293E] text-[#B3B6C]"
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {/* Action Button */}
            <button
                disabled={!selected}
                className={'w-full bg-[#9F0909] md:py-4 py-3 cursor-pointer rounded-md font-medium text-white transition'}
            >
                Activate Self-exclusion
            </button>
            </div>
        </div>
    );
};

export default OthersComponents;
