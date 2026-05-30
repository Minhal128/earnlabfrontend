"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, Moon, Gift, User, FileText, HelpCircle, Headphones, Lock, Shield, BarChart2, CircleDollarSign } from "lucide-react";
import LogoImg from "../../../public/assets/logo.png";

const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/htr9C8EjKG";
const TELEGRAM_URL = "https://t.me/labwardscom";
const X_URL = "https://x.com/labwards?s=21";

function StarTile({ half = false }: { half?: boolean }) {
  return (
    <div className={`w-[38px] h-[30px] flex items-center justify-center rounded-[3px] ${half ? "bg-[#00B67A]/60" : "bg-[#00B67A]"}`}>
      <svg width="16" height="16" viewBox="0 0 14 14" fill="white" aria-hidden="true">
        <path d="M7 1l1.7 3.5 3.8.6-2.7 2.7.6 3.8L7 9.8l-3.4 1.8.6-3.8L1.5 5.1l3.8-.6L7 1z" />
      </svg>
    </div>
  );
}

function SocialBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-[10px] bg-[#1C2033] border border-[#2A2D3E] flex items-center justify-center text-[#8C9DB6] hover:text-white hover:bg-[#252840] transition-all"
    >
      {children}
    </a>
  );
}

function MobileLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-[#8C9DB6] hover:text-white transition-colors text-sm py-1">
      <span className="text-[#3E4460] flex-shrink-0">{icon}</span>
      {label}
    </Link>
  );
}

const SocialIcons = () => (
  <div className="flex items-center gap-3">
    <SocialBtn href={X_URL} label="X (Twitter)">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </SocialBtn>
    <SocialBtn href={TELEGRAM_URL} label="Telegram">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    </SocialBtn>
    <SocialBtn href={DISCORD_URL} label="Discord">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
      </svg>
    </SocialBtn>
  </div>
);

const LangThemeBtns = () => (
  <div className="flex items-center gap-2">
    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1C2033] border border-[#2A2D3E] text-[#8C9DB6] text-xs font-bold hover:text-white transition-all">
      <Globe size={13} /> English
    </button>
    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1C2033] border border-[#2A2D3E] text-[#8C9DB6] text-xs font-bold hover:text-white transition-all">
      <Moon size={13} /> Light
    </button>
  </div>
);

export default function AppFooter() {
  return (
    <footer className="relative w-full bg-[#0D0F1E] border-t border-[#1E2133] pt-10 pb-8 overflow-hidden mb-[70px] md:mb-0">
      {/* Watermark */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none">
        <h2 className="text-[60px] sm:text-[72px] md:text-[88px] font-black leading-none whitespace-nowrap text-white opacity-[0.04]">
          LAB WARDS
        </h2>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10">

        {/* ── MOBILE layout ── */}
        <div className="md:hidden flex flex-col items-center gap-7">
          <Image src={LogoImg} alt="LabWards" className="h-9 w-auto object-contain" />

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              <StarTile /><StarTile /><StarTile /><StarTile /><StarTile half />
            </div>
            <p className="text-[#B3B6C7] text-sm font-bold">
              TrustScore 4.5
              <span className="mx-2 text-[#2C3146]">|</span>
              200 reviews
            </p>
          </div>

          {/* Platform + User Center 2-col */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-1 w-full max-w-[340px]">
            <div className="flex flex-col gap-0.5">
              <h4 className="text-white font-bold text-sm mb-2">Platform</h4>
              <MobileLink href="/earn"        icon={<CircleDollarSign size={13} />} label="Earn" />
              <MobileLink href="/leaderboard" icon={<BarChart2 size={13} />}        label="Leaderboards" />
              <MobileLink href="/rewards"     icon={<Gift size={13} />}             label="Rewards" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-white font-bold text-sm mb-2">User Center</h4>
              <MobileLink href="/account"      icon={<User size={13} />}        label="Account" />
              <MobileLink href="/wallet" icon={<FileText size={13} />}    label="Transactions" />
              <MobileLink href="/faq"          icon={<HelpCircle size={13} />}  label="FAQ" />
              <MobileLink href="/contact"      icon={<Headphones size={13} />}  label="Support" />
            </div>
          </div>

          {/* Terms — centred */}
          <div className="flex flex-col items-center gap-1">
            <h4 className="text-white font-bold text-sm mb-2">Terms</h4>
            <MobileLink href="/terms"   icon={<FileText size={13} />} label="Services Terms" />
            <MobileLink href="/privacy" icon={<Lock size={13} />}     label="Privacy" />
            <MobileLink href="/cookies" icon={<Shield size={13} />}   label="Cookie policy" />
          </div>

          {/* Bottom bar */}
          <div className="w-full border-t border-[#1E2133] pt-5 flex flex-col items-center gap-4">
            <p className="text-[#64748B] text-xs">@2026 Lab Wards, All Rights Reserved</p>
            <SocialIcons />
            <LangThemeBtns />
          </div>
        </div>

        {/* ── DESKTOP layout (4-column grid) ── */}
        <div className="hidden md:grid md:grid-cols-[1.8fr_1fr_1fr_1.2fr] gap-10 mb-10">

          {/* Col 1 — Logo + trust + description */}
          <div className="flex flex-col gap-5">
            <Image src={LogoImg} alt="LabWards" className="h-9 w-auto object-contain" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <StarTile /><StarTile /><StarTile /><StarTile /><StarTile half />
              </div>
              <p className="text-[#B3B6C7] text-sm font-bold">
                TrustScore 4.5
                <span className="mx-2 text-[#2C3146]">|</span>
                200 reviews
              </p>
            </div>
            <p className="text-[#8C9DB6] text-[14px] leading-relaxed max-w-[340px]">
              Sign up today and grab your instant bonus. Every task completed puts money in your pocket.
            </p>
          </div>

          {/* Col 2 — Platform */}
          <div className="flex flex-col gap-5">
            <h4 className="text-white font-bold text-lg">Platform</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/earn"        className="text-[#8C9DB6] hover:text-white transition-colors text-sm font-medium">Earn</Link></li>
              <li><Link href="/leaderboard" className="text-[#8C9DB6] hover:text-white transition-colors text-sm font-medium">Leaderboards</Link></li>
              <li><Link href="/rewards"     className="text-[#8C9DB6] hover:text-white transition-colors text-sm font-medium">Rewards</Link></li>
            </ul>
          </div>

          {/* Col 3 — User Center */}
          <div className="flex flex-col gap-5">
            <h4 className="text-white font-bold text-lg">User Center</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/account"      className="text-[#8C9DB6] hover:text-white transition-colors text-sm font-medium">Account</Link></li>
              <li><Link href="/wallet" className="text-[#8C9DB6] hover:text-white transition-colors text-sm font-medium">Transactions</Link></li>
              <li><Link href="/faq"          className="text-[#8C9DB6] hover:text-white transition-colors text-sm font-medium">FAQ</Link></li>
              <li><Link href="/contact"      className="text-[#8C9DB6] hover:text-white transition-colors text-sm font-medium">Support</Link></li>
            </ul>
          </div>

          {/* Col 4 — Connect With Us */}
          <div className="flex flex-col gap-5">
            <h4 className="text-white font-bold text-lg">Connect With Us</h4>
            <SocialIcons />
            <LangThemeBtns />
          </div>
        </div>

        {/* Desktop bottom divider */}
        <div className="hidden md:flex border-t border-[#1E2133] pt-6 items-center justify-between gap-4">
          <p className="text-[#64748B] text-xs">@2026 Lab Wards, All Rights Reserved</p>
          <div className="flex items-center gap-4 text-xs text-[#64748B]">
            <Link href="/terms"   className="hover:text-white transition-colors">Terms of Use</Link>
            <span className="text-[#2C3146]">|</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-[#2C3146]">|</span>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
