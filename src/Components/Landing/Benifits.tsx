"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";
import { Zap, Gift, TrendingUp } from "lucide-react";

import VisaImg from "../../../public/assets/visa.png";
import PaypalImg from "../../../public/assets/paypal.png";
import AmazonImg from "../../../public/assets/amazon.png";
import WorldcoinImg from "../../../public/assets/world.png";
import BitcoinImg from "../../../public/assets/bit.png";
import LitecoinImg from "../../../public/assets/lit.png";
import DogeImg from "../../../public/assets/dolar.png";
import SolanaImg from "../../../public/assets/sol.png";

import IconTop from "../../../public/assets/benifits.png";

type Benefit = {
  id: number;
  name: string;
  icon: StaticImageData;
};

const benefits: Benefit[] = [
  { id: 1, name: "PayPal", icon: PaypalImg },
  { id: 2, name: "VISA", icon: VisaImg },
  { id: 3, name: "Amazon", icon: AmazonImg },
  { id: 4, name: "Worldcoin", icon: WorldcoinImg },
  { id: 5, name: "Bitcoin", icon: BitcoinImg },
  { id: 6, name: "Litecoin", icon: LitecoinImg },
  { id: 7, name: "Dogecoin", icon: DogeImg },
  { id: 8, name: "Solana", icon: SolanaImg },
];

const Benefits: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-b from-[#0A0C1A] via-[#0f0f1a] to-[#0A0C1A] text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Gift className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="uppercase tracking-widest text-sm font-semibold text-emerald-400">
              Multiple Payout Options
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Get Paid Your Way
          </h2>
          <p className="text-lg text-[#9CA3AF] leading-relaxed">
            Choose from multiple withdrawal methods and get your rewards instantly. We support all major payment platforms.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className="group relative"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1D2E] to-[#151728] rounded-xl p-4 sm:p-6 border border-[#2A2D3E] group-hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mb-3 sm:mb-4 rounded-lg bg-[#252840] p-3 group-hover:bg-emerald-500/10 transition-colors">
                  <Image
                    src={benefit.icon}
                    alt={benefit.name}
                    className="object-contain w-full h-full"
                  />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-white text-center group-hover:text-emerald-400 transition-colors">
                  {benefit.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-16 pt-16 border-t border-[#2A2D3E]">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Instant Payouts</h3>
              <p className="text-sm text-[#9CA3AF]">Get your rewards instantly with our fast processing system</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">No Hidden Fees</h3>
              <p className="text-sm text-[#9CA3AF]">Transparent pricing with zero hidden charges</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Gift className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Flexible Options</h3>
              <p className="text-sm text-[#9CA3AF]">Choose the payment method that works best for you</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
