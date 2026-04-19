"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FaPaypal, FaAmazon, FaCcVisa, FaBitcoin } from "react-icons/fa";
import { SiEthereum } from "react-icons/si";
import type { StaticImageData } from "next/image";
import WorldcoinImg from "../../../public/assets/world.png";
// import XRPImg from "../../../public/assets/xrp.jpg";
import SignInModal from "../HomePage/SigninModal";

interface PayoutMethodsProps {
  isLoggedIn?: boolean;
}

interface PayoutMethod {
  name: string;
  icon?: any;
  image?: StaticImageData;
  color: string;
  isImage: boolean;
}

const PayoutMethods: React.FC<PayoutMethodsProps> = ({ isLoggedIn = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const payoutMethods = [
    { name: "PayPal", icon: FaPaypal, color: "#003087", isImage: false },
    { name: "Amazon", icon: FaAmazon, color: "#FF9900", isImage: false },
    { name: "Visa", icon: FaCcVisa, color: "#1434CB", isImage: false },
    { name: "Bitcoin", icon: FaBitcoin, color: "#F7931A", isImage: false },
    { name: "Ethereum", icon: SiEthereum, color: "#627EEA", isImage: false },
    // { name: "XRP", image: XRPImg, color: "#00AAE4", isImage: true },
    { name: "Worldcoin", image: WorldcoinImg, color: "#ffffff", isImage: true },
  ];

  const handleClick = () => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md bg-[#1A1D2E] hover:bg-[#252840] transition-all duration-200 border border-[#2A2D3E] group"
      >
        <span className="text-[9px] sm:text-[10px] font-medium text-[#9CA3AF] group-hover:text-white transition-colors hidden sm:inline">
          Payout
        </span>
        <div className="flex items-center -space-x-0.5">
          {payoutMethods.slice(0, 3).map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div
                key={method.name}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border border-[#2A2D3E] transition-transform group-hover:scale-110"
                style={{ backgroundColor: method.color, zIndex: 3 - index }}
              >
                {method.isImage && method.image ? (
                  <Image 
                    src={method.image} 
                    alt={method.name}
                    width={12}
                    height={12}
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 object-contain"
                  />
                ) : IconComponent ? (
                  <IconComponent size={10} color="white" />
                ) : null}
              </div>
            );
          })}
        </div>
        <span className="text-[9px] sm:text-[10px] text-[#10B981] font-semibold">+3</span>
      </button>

      {/* Modal for non-logged-in users */}
      {isModalOpen && !isLoggedIn && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gradient-to-br from-[#1E2133] to-[#151728] rounded-2xl p-8 max-w-md w-full border border-[#30334A] shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#B3B6C7] hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Multiple Payout Options Available!
              </h2>
              <p className="text-[#B3B6C7]">
                Get paid through your preferred method
              </p>
            </div>

            {/* Payout methods grid */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {payoutMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <div
                    key={method.name}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[#0D0F1E] border border-[#30334A] hover:border-[#10B981] transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: method.color }}
                    >
                      {method.isImage && method.image ? (
                        <Image 
                          src={method.image} 
                          alt={method.name}
                          width={24}
                          height={24}
                          className={`w-6 h-6 object-contain ${method.name === 'Worldcoin' ? 'invert brightness-200 mix-blend-screen' : ''}`}
                        />
                      ) : IconComponent ? (
                        <IconComponent size={24} color="white" />
                      ) : null}
                    </div>
                    <span className="text-xs text-white font-medium text-center">{method.name}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsSignInOpen(true);
                }}
                className="block w-full py-3 px-6 rounded-lg bg-gradient-to-r from-[#099F86] to-[#0BB89A] hover:from-[#0BB89A] hover:to-[#099F86] text-white font-semibold text-center transition-all duration-300 shadow-lg shadow-[#099F86]/20"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsSignInOpen(true);
                }}
                className="block w-full py-3 px-6 rounded-lg bg-transparent border-2 border-[#4DD6C1] text-[#4DD6C1] hover:bg-[#4DD6C1] hover:text-[#0D0F1E] font-semibold text-center transition-all duration-300"
              >
                Register Now
              </button>
            </div>

            <p className="text-xs text-[#8C8FA8] text-center mt-4">
              Join thousands earning with flexible payout options
            </p>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onForgotPassword={() => {
          // Handle forgot password if needed
        }}
        onSignUp={() => {
          // Handle sign up if needed
        }}
      />
    </>
  );
};

export default PayoutMethods;
