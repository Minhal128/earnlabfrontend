
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { ArrowRight, Check } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

import BgImg from "../../../public/assets/bg.png";
import LockImg from "../../../public/assets/locak.png";

type VerifyProps = {
    height?: string;
    onOpenLogin?: () => void;
};

const Verify: React.FC<VerifyProps> = ({ onOpenLogin }) => {
    const [isClaiming, setIsClaiming] = useState(false);

    const handleStartEarning = () => {
        // Scroll to top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Open login modal after a short delay to allow scroll
        if (onOpenLogin) {
            setTimeout(() => {
                onOpenLogin();
            }, 500);
        }
    };

    return (
        <div className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0A0C1A] to-[#0D1117]">
            <div className="max-w-5xl mx-auto">
                {/* Main CTA Card */}
                <div
                    className="relative w-full rounded-3xl overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #0d9488 0%, #059669 30%, #10b981 60%, #34d399 100%)",
                    }}
                >
                    {/* Decorative circles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                    </div>

                    {/* Content */}
                    <div className="relative text-center px-6 sm:px-12 py-16 md:py-20">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                            Join the Labwards
                        </h2>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-100">
                                Community Today
                            </span>
                        </h2>
                        
                        <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mb-10">
                            Thousands of users are already earning daily. Create your free account in seconds
                            and start turning your time into money.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                            <button 
                                onClick={handleStartEarning}
                                disabled={isClaiming}
                                className="flex items-center gap-2 px-8 py-4 bg-white text-[#0D9488] font-bold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Start Earning Free
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            
                            <a 
                                href="https://discord.gg/htr9C8EjKG"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-8 py-4 bg-[#5865F2] text-white font-bold rounded-full shadow-lg hover:bg-[#4752C4] transition-all duration-300 transform hover:scale-105"
                            >
                                <FaDiscord className="w-5 h-5" />
                                Join Discord
                            </a>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <span>No Credit Card</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <span>Instant Signup</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <span>Fast Payouts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verify;
