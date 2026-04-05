"use client";

import Link from "next/link";
import { Globe, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const HIDDEN_PREFIXES = ["/sign-in", "/sign-up", "/signin", "/signup", "/sigin"];
const HIDDEN_ROUTES = new Set(["/", "/landing"]);

export default function AppFooter() {
  const pathname = usePathname();
  const router = useRouter();

  if (HIDDEN_ROUTES.has(pathname || "") || HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      if (token) {
        try {
          await fetch(`${api}/api/v1/auth/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          // ignore logout endpoint failures and still clear local auth
        }
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      router.push("/");
    } catch {
      // ignore sign out errors
    }
  };

  return (
    <footer className="border-t border-[#1E2133] bg-[#0B0D19] mt-10 mb-[70px] md:mb-0">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <h3 className="text-white font-bold text-lg">LabWards</h3>
          <p className="text-[#9CA3AF] text-sm mt-2">Earn rewards from games, offers, and surveys—fast, simple, and secure.</p>
        </div>

        <div>
          <h4 className="text-white font-semibold">Support</h4>
          <div className="mt-2 space-y-2 text-sm">
            <Link href="/support" className="block text-[#B3B6C7] hover:text-white transition-colors">Contact Us</Link>
            <Link href="/faq" className="block text-[#B3B6C7] hover:text-white transition-colors">FAQ</Link>
            <Link href="/help-center" className="block text-[#B3B6C7] hover:text-white transition-colors">Help Center</Link>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold">Features</h4>
          <div className="mt-2 space-y-2 text-sm">
            <Link href="/earn" className="block text-[#B3B6C7] hover:text-white transition-colors">Games</Link>
            <Link href="/rewards" className="block text-[#B3B6C7] hover:text-white transition-colors">Rewards</Link>
            <Link href="/tasks" className="block text-[#B3B6C7] hover:text-white transition-colors">Tasks</Link>
            <Link href="/leaderboard" className="block text-[#B3B6C7] hover:text-white transition-colors">Leaderboard</Link>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold">Account</h4>
          <div className="mt-2 space-y-2 text-sm">
            <Link href="/account" className="block text-[#B3B6C7] hover:text-white transition-colors">Profile</Link>
            <Link href="/referrals" className="block text-[#B3B6C7] hover:text-white transition-colors">Referrals</Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-[#F87171] hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
            <div className="flex items-center gap-2 text-[#B3B6C7]">
              <Globe className="w-4 h-4" /> English
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#1E2133]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-[#8C8FA8]">©2026 LabWards. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-[#B3B6C7] hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/privacy" className="text-[#B3B6C7] hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="text-[#B3B6C7] hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
