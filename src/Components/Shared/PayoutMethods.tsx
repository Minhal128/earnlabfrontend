"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Wallet } from "lucide-react";
import Link from "next/link";

// Import payout method logos
import PayPalImg from "../../../public/assets/paypal.png";
import AmazonImg from "../../../public/assets/amazon.png";
import VisaImg from "../../../public/assets/visa.png";
import BitcoinImg from "../../../public/assets/bit.png";
import EthereumImg from "../../../public/assets/eth.png";
import VenmoImg from "../../../public/assets/venmo.png";

interface PayoutMethodsProps {
  isLoggedIn?: boolean;
}

const PayoutMethods: React.FC<PayoutMethodsProps> = ({ isLoggedIn = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const payoutMethods = [
    { name: "PayPal", logo: PayPalImg },
    { name: "Amazon", logo: AmazonImg },
    { name: "Visa", logo: VisaImg },
    { name: "Bitcoin", logo: BitcoinImg },
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1A1D2E] hover:bg-[#252840] transition-all duration-200 border border-[#2A2D3E] group"
      >
        <span className="text-xs font-medium text-[#9CA3AF] group-hover:text-white transition-colors hidden lg:inline">
          Payout
        </span>
        <div className="flex items-center -space-x-1">
          {payoutMethods.map((method, index) => (
            <div
              key={method.name}
              className="w-5 h-5 rounded-full bg-white flex items-center justify-center border border-[#2A2D3E] transition-transform group-hover:scale-110"
              style={{ zIndex: payoutMethods.length - index }}
            >
              <Image
                src={method.logo}
                alt={method.name}
                width={12}
                height={12}
                className="object-contain"
              />
            </div>
          ))}
        </div>
        <span className="text-xs text-[#10B981] font-semibold">+2</span>
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
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[...payoutMethods, { name: "Ethereum", logo: EthereumImg }, { name: "Venmo", logo: VenmoImg }].map((method) => (
                <div
                  key={method.name}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0F1E] border border-[#30334A] hover:border-[#10B981] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Image
                      src={method.logo}
                      alt={method.name}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm text-white font-medium">{method.name}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link
                href="/sign-in"
                className="block w-full py-3 px-6 rounded-lg bg-gradient-to-r from-[#099F86] to-[#0BB89A] hover:from-[#0BB89A] hover:to-[#099F86] text-white font-semibold text-center transition-all duration-300 shadow-lg shadow-[#099F86]/20"
              >
                Sign In
              </Link>
              <Link
                href="/sign-in"
                className="block w-full py-3 px-6 rounded-lg bg-transparent border-2 border-[#4DD6C1] text-[#4DD6C1] hover:bg-[#4DD6C1] hover:text-[#0D0F1E] font-semibold text-center transition-all duration-300"
              >
                Register Now
              </Link>
            </div>

            <p className="text-xs text-[#8C8FA8] text-center mt-4">
              Join thousands earning with flexible payout options
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PayoutMethods;
