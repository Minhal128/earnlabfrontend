"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CircleHelp,
  CreditCard,
  FileText,
  Gift,
  Headset,
  Home,
  Shield,
  Trophy,
  UserRound,
  Smile,
} from "lucide-react";

const platformLinks = [
  { href: "/earn", label: "Earn", icon: Home },
  { href: "/leaderboard", label: "Leaderboards", icon: Trophy },
  { href: "/rewards", label: "Rewards", icon: Gift },
];

const userCenterLinks = [
  { href: "/account", label: "Account", icon: UserRound },
  { href: "/wallet", label: "Transactions", icon: CreditCard },
  { href: "/faq", label: "FAQ", icon: CircleHelp },
  { href: "/support", label: "Support", icon: Headset },
];

const termsLinks = [
  { href: "/terms", label: "Services Terms", icon: FileText },
  { href: "/privacy", label: "Privacy", icon: Shield },
  { href: "/cookies", label: "Cookie policy", icon: Smile },
];

const supportLinks = [
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQ" },
];

const featureLinks = [
  { href: "/games", label: "Games" },
  { href: "/rewards", label: "Rewards" },
  { href: "/tasks", label: "Tasks" },
];

const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/htr9C8EjKG";
const TELEGRAM_URL = "https://t.me/labwardscom";
const X_URL = "https://x.com/labwards?s=21";

function StarTile({ dimmed = false, compact = false }: { dimmed?: boolean; compact?: boolean }) {
  return (
    <div
      className={`${compact ? "h-[14px] w-[18px]" : "h-[30px] w-[38px]"} ${dimmed ? "bg-[#00B67A]/70" : "bg-[#00B67A]"} flex items-center justify-center`}
    >
      <svg width={compact ? "8" : "16"} height={compact ? "8" : "16"} viewBox="0 0 14 14" fill="white" aria-hidden="true">
        <path d="M7 1l1.7 3.5 3.8.6-2.7 2.7.6 3.8L7 9.8l-3.4 1.8.6-3.8L1.5 5.1l3.8-.6L7 1z" />
      </svg>
    </div>
  );
}

function SocialIconBox({
  children,
  href,
  label,
}: {
  children: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-7 h-7 bg-[#141933] border border-[#2A2F49] rounded-[6px] flex items-center justify-center text-[#B3B6C7] hover:text-white hover:border-[#3B4266] transition-colors"
    >
      {children}
    </a>
  );
}

function FooterPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full border border-[#2A2F49] bg-transparent text-[#C8CBDB] text-[10px]"
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DesktopLinkGroup({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="text-white font-semibold text-[14px] mb-3">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link href={item.href} className="text-[#A8AEC7] text-[13px] hover:text-white transition-colors">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LinkGroup({
  title,
  items,
  titleClassName = "text-[#888DA9]",
}: {
  title: string;
  items: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
  titleClassName?: string;
}) {
  return (
    <div>
      <h4 className={`font-semibold text-[16px] sm:text-[18px] leading-none mb-4 ${titleClassName}`}>{title}</h4>
      <ul className="space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href + item.label}>
              <Link
                href={item.href}
                className="text-[#D5D8E8] text-[15px] hover:text-white inline-flex items-center gap-2.5 transition-colors"
              >
                <Icon className="w-4 h-4 text-[#A1A6BE]" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function AppFooter() {
  return (
    <footer className="bg-[#070B24] border-t border-[#1A1E38] mt-10 mb-[70px] md:mb-0">
      <div className="max-w-[1312px] mx-auto px-4 pt-10 sm:pt-12 pb-8">
        {/* Mobile */}
        <div className="sm:hidden flex flex-col items-center">
          <Image
            src="/landing-image-003.png"
            alt="Lab Wards"
            width={172}
            height={36}
            className="h-9 w-auto mb-4"
            priority={false}
          />

          <div className="flex items-center gap-1.5 mb-3" aria-label="TrustScore 4.5 out of 5">
            {[...Array(5)].map((_, i) => (
              <StarTile key={i} dimmed={i === 4} />
            ))}
          </div>
          <p className="text-[#BEC2D6] text-[15px] mb-9">
            <span className="font-semibold">TrustScore 4.5</span> | 200 reviews
          </p>

          <div className="w-full grid grid-cols-2 gap-8 mb-9 px-3">
            <LinkGroup title="Platform" items={platformLinks} />
            <LinkGroup title="User Center" items={userCenterLinks} />
          </div>

          <div className="text-center mb-8">
            <LinkGroup title="Terms" items={termsLinks} titleClassName="text-[#8D92AB]" />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="grid md:grid-cols-[1.7fr_0.85fr_0.85fr] gap-10">
            <div>
              <Image
                src="/landing-image-003.png"
                alt="Lab Wards"
                width={172}
                height={36}
                className="h-9 w-auto mb-3"
                priority={false}
              />
              <div className="flex items-center gap-1 mb-1.5" aria-label="TrustScore 4.5 out of 5">
                {[...Array(5)].map((_, i) => (
                  <StarTile key={i} dimmed={i === 4} compact />
                ))}
              </div>
              <p className="text-[#A8AEC7] text-[10px] mb-3">
                <span className="font-semibold text-[#E5E7F2]">TrustScore 4.5</span> | 200 reviews
              </p>

              <p className="text-[#D2D6E9] text-[22px] leading-[1.2] max-w-[560px]">
                Sign up today and grab your instant bonus. Every task completed puts money in your pocket.
              </p>
            </div>

            <DesktopLinkGroup title="Support" items={supportLinks} />
            <DesktopLinkGroup title="Features" items={featureLinks} />
          </div>

          <div className="border-t border-[#1A1E38] pt-5 w-full flex items-center justify-between gap-4 mt-7">
            <p className="text-[#8F94AD] text-sm">©2026 Lab Wards, All Rights Reserved</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center text-[#A8AEC7] text-sm">
                <Link href="/terms" className="hover:text-white transition-colors">Terms Of Use</Link>
                <span className="mx-3 text-[#434A69]">|</span>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <span className="mx-3 text-[#434A69]">|</span>
                <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
              </div>
              <div className="flex gap-2.5">
                <SocialIconBox href={X_URL} label="Open X (Twitter)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </SocialIconBox>
                <SocialIconBox href={TELEGRAM_URL} label="Open Telegram">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </SocialIconBox>
                <SocialIconBox href={DISCORD_URL} label="Join Discord">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                  </svg>
                </SocialIconBox>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden border-t border-[#1A1E38] pt-6 w-full flex flex-col items-center gap-4 mt-8">
          <p className="text-[#8F94AD] text-sm">©2026 Lab Wards, All Rights Reserved</p>

          <div className="flex gap-2.5">
            <SocialIconBox href={X_URL} label="Open X (Twitter)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </SocialIconBox>
            <SocialIconBox href={TELEGRAM_URL} label="Open Telegram">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </SocialIconBox>
            <SocialIconBox href={DISCORD_URL} label="Join Discord">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
            </SocialIconBox>
          </div>
        </div>

        <div className="mt-10 text-center overflow-hidden">
          <h2 className="text-[64px] sm:text-[88px] md:text-[112px] font-extrabold tracking-[0.06em] text-[#1E2C4B]/80 leading-none">
            LAB WARDS
          </h2>
        </div>
      </div>
    </footer>
  );
}
