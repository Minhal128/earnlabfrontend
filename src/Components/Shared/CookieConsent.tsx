"use client";

import React, { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already accepted/rejected cookies
        const cookieConsent = localStorage.getItem("cookieConsent");
        if (!cookieConsent) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        setIsVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem("cookieConsent", "rejected");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
            <div className="max-w-6xl mx-auto bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5">
                    {/* Left side - Icon and Text */}
                    <div className="flex items-start sm:items-center gap-4 flex-1">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Cookie className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
                                🍪 We use cookies
                            </h3>
                            <p className="text-[#9CA3AF] text-xs sm:text-sm leading-relaxed">
                                We use cookies to improve your experience, analyze site traffic, and personalize content. 
                                By clicking "Accept All", you consent to our use of cookies.{" "}
                                <a 
                                    href="/privacy" 
                                    className="text-emerald-400 hover:text-emerald-300 underline transition-colors"
                                >
                                    Learn more
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Right side - Buttons */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleReject}
                            className="flex-1 sm:flex-initial px-5 py-2.5 text-sm font-semibold text-[#9CA3AF] hover:text-white bg-transparent border border-[#2A2D3E] hover:border-[#3A3D4E] rounded-lg transition-all duration-200"
                        >
                            Reject
                        </button>
                        <button
                            onClick={handleAccept}
                            className="flex-1 sm:flex-initial px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/20"
                        >
                            Accept All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
