"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Send, Disc, Star, Globe, Moon } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full bg-[#0D0F1E] border-t border-[#1E2133] pt-16 pb-8 overflow-hidden">
      {/* Background Text Overlay */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.03]">
        <h2 className="text-[180px] font-black leading-none whitespace-nowrap text-white">LAB WARDS</h2>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Trust Section */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[28px] font-black text-white tracking-tight">Lab<span className="text-[#0AC07D]">Wards</span></span>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 bg-[#00B67A] rounded-sm flex items-center justify-center text-white">
                    <Star size={14} fill="currentColor" />
                  </div>
                ))}
                <div className="w-6 h-6 bg-[#31364B] rounded-sm flex items-center justify-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#00B67A] w-1/2" />
                  <Star size={14} fill="currentColor" className="relative z-10" />
                </div>
              </div>
              <p className="text-[#B3B6C7] text-sm font-bold">
                TrustScore 4.5 <span className="mx-2 text-[#2C3146]">|</span> 200 reviews
              </p>
            </div>

            <p className="text-[#8C9DB6] text-[14px] leading-relaxed max-w-[300px]">
              Sign up today and grab your instant bonus. Every task completed puts money in your pocket.
            </p>
          </div>

          {/* Support Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold text-lg">Support</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/contact" className="text-[#8C9DB6] hover:text-[#0AC07D] transition-colors text-sm font-medium">Contact Us</Link></li>
              <li><Link href="/faq" className="text-[#8C9DB6] hover:text-[#0AC07D] transition-colors text-sm font-medium">FAQ</Link></li>
            </ul>
          </div>

          {/* Features Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold text-lg">Features</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/games" className="text-[#8C9DB6] hover:text-[#0AC07D] transition-colors text-sm font-medium">Games</Link></li>
              <li><Link href="/rewards" className="text-[#8C9DB6] hover:text-[#0AC07D] transition-colors text-sm font-medium">Rewards</Link></li>
              <li><Link href="/tasks" className="text-[#8C9DB6] hover:text-[#0AC07D] transition-colors text-sm font-medium">Tasks</Link></li>
            </ul>
          </div>

          {/* Connect and Toggles */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-bold text-lg">Connect With Us</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-[#1C2033] border border-[#2A2D3E] flex items-center justify-center text-[#8C9DB6] hover:text-white hover:bg-[#252840] transition-all">
                <Star size={20} fill="currentColor" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-[#1C2033] border border-[#2A2D3E] flex items-center justify-center text-[#8C9DB6] hover:text-white hover:bg-[#252840] transition-all">
                <Send size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-[#1C2033] border border-[#2A2D3E] flex items-center justify-center text-[#8C9DB6] hover:text-white hover:bg-[#252840] transition-all">
                <Disc size={20} />
              </a>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1C2033] border border-[#2A2D3E] text-[#8C9DB6] text-xs font-bold hover:text-white transition-all">
                <Globe size={14} />
                English
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1C2033] border border-[#2A2D3E] text-[#8C9DB6] text-xs font-bold hover:text-white transition-all">
                <Moon size={14} />
                Light
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1E2133] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[#64748B] text-xs">@2026 Lab Wards, All Rights Reserved</p>
          
          <div className="flex items-center gap-8">
            <Link href="/terms" className="text-[#64748B] hover:text-white text-xs transition-colors">Terms of Use</Link>
            <Link href="/privacy" className="text-[#64748B] hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="text-[#64748B] hover:text-white text-xs transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
