
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

import BgImg from "../../../public/assets/bg.png";
import LockImg from "../../../public/assets/locak.png";

type VerifyProps = {
    height?: string;
};

const Verify: React.FC<VerifyProps> = () => {
    const [isClaiming, setIsClaiming] = useState(false);

    const handleClaimBonus = async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        
        if (!token) {
            toast.info("Please sign up first to claim your bonus");
            return;
        }

        setIsClaiming(true);
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${api}/api/v1/user/claim-email-verification-bonus`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("🎉 Bonus claimed! You received $0.25 + 3 Free Boxes!");
            } else {
                toast.error(data.message || "Failed to claim bonus");
            }
        } catch (err) {
            console.error("Error claiming bonus:", err);
            toast.error("Failed to claim bonus. Please try again.");
        } finally {
            setIsClaiming(false);
        }
    };
    return (
        <div className="md:min-h-screen h-[600px] flex items-center justify-center mt-10 md:mt-0 bg-[#083136] px-4">
            <div
                className={`relative w-full max-w-4xl md:h-[500px] rounded-xl overflow-hidden`}
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={BgImg}
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <div className="relative text-center px-6 py-12 rounded-xl">
                    <h2 className="text-2xl md:text-4xl pt-6 font-semibold text-[#0D0F1E]">
                        Verify Your Email To Unlock <br /> $0.25 + 3 Freeboxes
                    </h2>
                    <p className="text-[#3A3E57] md:px-52 mt-5 text-sm font-semibold md:text-lg">
                        Sign up today, confirm your email, and instantly receive $0.25 cash
                        plus 3 Free boxes with exciting reward probabilities.
                    </p>

                    <button 
                        onClick={handleClaimBonus}
                        disabled={isClaiming}
                        className="mt-7 px-14 py-3 cursor-pointer rounded-full bg-gradient-to-t from-[#0B816D] to-[#18C3A7] text-white font-semibold shadow-md transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isClaiming ? "Claiming..." : "Claim my Bonus"}
                    </button>

                    <div className="flex items-center pt-4 justify-center font-semibold gap-2 mt-4 text-[#151728] text-md">
                        <span className="">
                            <Image
                                src={LockImg}
                                alt="Lock Image"
                                width={30}
                                height={20}
                                className="object-contain"
                            />
                        </span>
                        Secure sign-ups – No hidden fees
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verify;
