"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Zap, CheckSquare, MessageSquare, Gift, Trophy, Users, Menu, Share2, MessageCircle } from "lucide-react";
import { useState } from "react";

const PageNavigation = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/home", label: "Dashboard", icon: Home },
    { href: "/earn", label: "Earn", icon: Zap },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/servey", label: "Surveys", icon: MessageSquare },
    { href: "/rewards", label: "Rewards", icon: Gift },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/referrals", label: "Referrals", icon: Share2 },
    { href: "/chat", label: "Chat", icon: MessageCircle },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-center bg-[#0A0C1A] w-full overflow-x-auto">
        <div className="flex gap-2 bg-gradient-to-r from-[#0A0C1A] via-[#1A1D2E] to-[#0A0C1A] border border-emerald-500/20 rounded-full p-2 shadow-lg shadow-emerald-500/10 whitespace-nowrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  isActive(item.href)
                    ? "bg-emerald-500 text-white"
                    : "text-[#9CA3AF] hover:text-white hover:bg-[#26293E]"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0C1A] border-t border-emerald-500/20 z-40 shadow-lg shadow-emerald-500/10">
        <div className="flex justify-between items-center py-3 px-1">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-1.5 py-2 rounded-lg transition-all flex-1 ${
                  isActive(item.href)
                    ? "text-emerald-400"
                    : "text-[#9CA3AF] hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs truncate">{item.label}</span>
              </Link>
            );
          })}
          {/* Referrals */}
          <Link
            href="/referrals"
            className={`flex flex-col items-center gap-1 px-1.5 py-2 rounded-lg transition-all flex-1 ${
              isActive("/referrals")
                ? "text-emerald-400"
                : "text-[#9CA3AF] hover:text-white"
            }`}
          >
            <Share2 size={20} />
            <span className="text-xs truncate">Referrals</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col items-center gap-1 px-1.5 py-2 rounded-lg text-[#9CA3AF] hover:text-white transition-all flex-1"
          >
            <Menu size={20} />
            <span className="text-xs">More</span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute bottom-16 right-0 left-0 bg-gradient-to-b from-[#1A1D2E] to-[#0A0C1A] border-t border-emerald-500/20 p-2 space-y-1 shadow-lg shadow-emerald-500/10">
            {navItems.slice(5).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E]"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default PageNavigation;
