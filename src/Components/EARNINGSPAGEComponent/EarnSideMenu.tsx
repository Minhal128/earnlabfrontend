"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import LogoImg from "../../../public/assets/logo.png";

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M1 1L11 11M1 11L11 1" stroke="#1E2133" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const MENU_ITEMS = [
  {
    label: "Earn",
    href: "/earn",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={active ? "#0AC07D" : "#8C9DB6"} strokeWidth="1.5" />
        <path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3H15" stroke={active ? "#0AC07D" : "#8C9DB6"} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L14.5 8.5L21 9.3L16.5 13.6L17.75 20L12 16.9L6.25 20L7.5 13.6L3 9.3L9.5 8.5L12 3Z" stroke={active ? "#0AC07D" : "#8C9DB6"} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Reward",
    href: "/rewards",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke={active ? "#0AC07D" : "#8C9DB6"} strokeWidth="1.5" />
        <path d="M12 11V22M3 7h18v4H3V7Z" stroke={active ? "#0AC07D" : "#8C9DB6"} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 7C12 7 9 4 7 5s-1 4 2 3 3-3 3-1M12 7c0 0 3-3 5-2s1 4-2 3-3-3-3-1" stroke={active ? "#0AC07D" : "#8C9DB6"} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "FAQ",
    href: "/faq",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={active ? "#0AC07D" : "#8C9DB6"} strokeWidth="1.5" />
        <path d="M9.5 9.5C9.5 8.12 10.62 7 12 7s2.5 1.12 2.5 2.5C14.5 11 13 12 12 13" stroke={active ? "#0AC07D" : "#8C9DB6"} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="0.75" fill={active ? "#0AC07D" : "#8C9DB6"} />
      </svg>
    ),
  },
];

const SUPPORT_ICON = (active: boolean) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 12C3 7.03 7.03 3 12 3s9 4.03 9 9v5a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h2v-1a7 7 0 0 0-14 0v1h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5" stroke={active ? "#0AC07D" : "#8C9DB6"} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Tournament {
  _id: string;
  name: string;
  imageUrl?: string;
  status: "active" | "coming_soon" | "ended";
}

const FALLBACK_TOURNAMENTS: Tournament[] = [
  { _id: "t1", name: "mYADS", imageUrl: "/img3.png", status: "coming_soon" },
  { _id: "t2", name: "mYADS", imageUrl: "/img4.png", status: "coming_soon" },
  { _id: "t3", name: "mYADS", imageUrl: "/img5.png", status: "coming_soon" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EarnSideMenu: React.FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tournaments, setTournaments] = useState<Tournament[]>(FALLBACK_TOURNAMENTS);

  useEffect(() => {
    fetch(`${API}/api/v1/tournaments`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.tournaments) && d.tournaments.length > 0) {
          setTournaments(d.tournaments);
        }
      })
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="flex flex-col w-full sm:max-w-[400px] overflow-hidden"
        style={{ background: "#0D0F1E", height: "100dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#1E2133]">
          <Image src={LogoImg} alt="LabWards" className="h-8 w-auto object-contain" />
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-[6px] bg-[#8C8FA8] hover:bg-[#a0a3bb] transition-colors"
            aria-label="Close menu"
          >
            <XIcon />
          </button>
        </div>

        {/* Menu items */}
        <div className="flex flex-col gap-2 px-4 pt-5 pb-3">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3.5 rounded-[10px] border transition-all"
                style={{
                  background: isActive ? "rgba(10,192,125,0.08)" : "#151728",
                  borderColor: isActive ? "rgba(10,192,125,0.4)" : "#1E2133",
                }}
              >
                {item.icon(isActive)}
                <span
                  className="text-[15px] font-medium"
                  style={{ color: isActive ? "#0AC07D" : "white" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Support — navigates to full support page */}
          <Link
            href="/support"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3.5 rounded-[10px] bg-[#151728] border border-[#1E2133] hover:border-[#0AC07D]/40 hover:bg-[#1A1E35] transition-all"
          >
            {SUPPORT_ICON(pathname === "/support")}
            <span
              className="text-[15px] font-medium"
              style={{ color: pathname === "/support" ? "#0AC07D" : "white" }}
            >
              Support
            </span>
          </Link>
        </div>

        {/* Cashout button */}
        <div className="px-4 pb-4">
          <button
            onClick={() => { onClose(); router.push("/cashout"); }}
            className="w-full flex items-center justify-between px-5 py-4 rounded-[12px] text-white text-[16px] font-bold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #0AC07D 0%, #0BBFA0 100%)",
              boxShadow: "0 8px 24px rgba(10,192,125,0.35)",
            }}
          >
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="3" stroke="white" strokeWidth="1.8" />
                <path d="M2 10h20" stroke="white" strokeWidth="1.8" />
                <path d="M6 15h4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Cashout
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="white">
              <path d="M1 1l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Tournaments */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-bold text-[17px]">Tournaments</span>
            <span className="text-[#0AC07D] text-[13px] font-semibold">
              {tournaments.filter((t) => t.status === "active").length} Ongoing
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {tournaments.map((t) => (
              <div key={t._id} className="flex-shrink-0 w-[130px] rounded-[12px] overflow-hidden bg-[#151728] border border-[#1E2133]">
                <div className="relative h-[80px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.imageUrl || "/img3.png"}
                    alt={t.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <span className="absolute top-2 left-2 text-white text-[11px] font-bold bg-black/50 px-1.5 py-0.5 rounded">
                    {t.name}
                  </span>
                </div>
                <div className="px-2 py-2">
                  <p className="text-[#8C9DB6] text-[12px] font-medium">
                    {t.status === "active" ? "Active" : t.status === "coming_soon" ? "Coming soon" : "Ended"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnSideMenu;
