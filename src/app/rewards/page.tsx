"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import TopBar from "@/Components/Topbar";
import { useSocket } from "@/contexts/SocketProvider";
import { toast } from "@/utils/toast";

/* ─────────────────────────── TICKER (same as cashout) ─────────────────────────── */
const TICKER = [
  { game:"Slots",      action:"withdrew", amount:"$0.8",  grad:["#F97316","#EF4444"] },
  { game:"Worldcoin",  action:"withdrew", amount:"$0.8",  grad:["#6366F1","#3B82F6"] },
  { game:"Slot",       action:"withdrew", amount:"$0.8",  grad:["#8B5CF6","#EC4899"] },
  { game:"Monopoly",   action:"withdrew", amount:"$0.8",  grad:["#10B981","#059669"] },
  { game:"Worldcoin",  action:"withdrew", amount:"$0.8",  grad:["#14A28A","#0891B2"] },
  { game:"Slots",      action:"withdrew", amount:"$0.8",  grad:["#F59E0B","#F97316"] },
  { game:"Torox",      action:"earned",   amount:"$0.5",  grad:["#A855F7","#7C3AED"] },
  { game:"Offer walls",action:"earned",   amount:"$0.5",  grad:["#06B6D4","#14A28A"] },
];

function TickerItem({ item }: { item: typeof TICKER[0] }) {
  return (
    <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] shrink-0 mx-2"
         style={{ width:260, height:72, background:"#181A2C" }}>
      <div className="shrink-0 rounded-[6px] overflow-hidden flex items-center justify-center text-white font-black text-xl relative"
           style={{ width:56, height:56, background:`linear-gradient(135deg,${item.grad[0]},${item.grad[1]})` }}>
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 56 56">
          <defs><pattern id={`td${item.game}`} x="0" y="0" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.2" fill="white"/></pattern></defs>
          <rect width="56" height="56" fill={`url(#td${item.game})`}/>
        </svg>
        <span className="relative z-10" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:22 }}>{item.game.charAt(0)}</span>
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <span className="text-[#6B6E8A] font-medium truncate" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, lineHeight:"20px", letterSpacing:"-0.01em" }}>User {item.action}</span>
        <span className="text-[#B3B6C7] font-medium truncate" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:18, lineHeight:"20px", letterSpacing:"-0.01em" }}>{item.game}</span>
      </div>
      <span className="ml-auto font-bold shrink-0" style={{ fontFamily:"'Manrope',sans-serif", fontSize:22, lineHeight:"24px", letterSpacing:"0.02em", background:"linear-gradient(338deg,rgba(255,255,255,0) 40%,rgba(255,255,255,.6) 126%),#0AC07D", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
        {item.amount}
      </span>
    </div>
  );
}

function TickerBar() {
  return (
    <div className="w-full overflow-hidden" style={{ background:"#0D0F1E", borderBottom:"1px solid #1E2133", height:88 }}>
      <style>{`
        @keyframes rticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .rticker-wrap { display:flex; align-items:center; animation:rticker 36s linear infinite; width:max-content; height:88px; }
      `}</style>
      <div className="rticker-wrap">
        {[...TICKER,...TICKER,...TICKER].map((item,i)=>(
          <TickerItem key={i} item={item}/>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── CTA BUTTON ─────────────────────────── */
function TealBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-1.5 rounded-[10px] font-bold text-white disabled:opacity-60 transition-all hover:opacity-90"
      style={{ background:"linear-gradient(12.07deg,rgba(255,255,255,0) 16.27%,rgba(255,255,255,.4) 93.68%),#099F86", boxShadow:"0px 9px 24px rgba(20,169,144,.3)", padding:"14px 10px", minWidth:131, height:56, fontFamily:"'Manrope',sans-serif", fontSize:17.7, lineHeight:"20px" }}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────── ICONS ─────────────────────────── */
function StepIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 12h16M14 6l6 6-6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* Spinning wheel illustration */
function SpinWheel() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="55" fill="#2A1050" stroke="#7B3CC4" strokeWidth="2"/>
      {/* Wheel segments */}
      {[0,45,90,135,180,225,270,315].map((angle,i)=>(
        <path key={i} d={`M60 60 L${60+54*Math.cos((angle-22.5)*Math.PI/180)} ${60+54*Math.sin((angle-22.5)*Math.PI/180)} A54 54 0 0 1 ${60+54*Math.cos((angle+22.5)*Math.PI/180)} ${60+54*Math.sin((angle+22.5)*Math.PI/180)} Z`}
          fill={["#E84EEE","#FF8EFF","#C032CC","#E84EEE","#FF8EFF","#C032CC","#E84EEE","#FF8EFF"][i]}
          stroke="#2A1050" strokeWidth="1.5"/>
      ))}
      {/* Divider lines */}
      {[0,45,90,135,180,225,270,315].map((angle,i)=>(
        <line key={i} x1="60" y1="60" x2={60+56*Math.cos(angle*Math.PI/180)} y2={60+56*Math.sin(angle*Math.PI/180)} stroke="#2A1050" strokeWidth="2"/>
      ))}
      {/* Green section */}
      <path d={`M60 60 L${60+54*Math.cos((270-22.5)*Math.PI/180)} ${60+54*Math.sin((270-22.5)*Math.PI/180)} A54 54 0 0 1 ${60+54*Math.cos((270+22.5)*Math.PI/180)} ${60+54*Math.sin((270+22.5)*Math.PI/180)} Z`} fill="#22C55E" stroke="#2A1050" strokeWidth="1.5"/>
      <circle cx="60" cy="60" r="10" fill="#FFFFFF" stroke="#E84EEE" strokeWidth="3"/>
      {/* Pointer */}
      <path d="M60 5 L55 15 H65 Z" fill="#FFFFFF"/>
    </svg>
  );
}

/* Treasure chest with gold coins */
function TreasureChest() {
  return (
    <svg width="130" height="105" viewBox="0 0 130 105" fill="none">
      {/* Coins behind */}
      <ellipse cx="88" cy="88" rx="18" ry="10" fill="#E0A020"/>
      <ellipse cx="88" cy="84" rx="18" ry="10" fill="#F5C842"/>
      <ellipse cx="105" cy="80" rx="13" ry="7" fill="#E0A020"/>
      <ellipse cx="105" cy="76" rx="13" ry="7" fill="#F5C842"/>
      {/* Chest body */}
      <rect x="10" y="55" width="85" height="46" rx="6" fill="#C05722"/>
      <rect x="10" y="55" width="85" height="46" rx="6" fill="url(#chestgrad)"/>
      <defs>
        <linearGradient id="chestgrad" x1="52" y1="55" x2="52" y2="101" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F08D23"/>
          <stop offset="1" stopColor="#C05722"/>
        </linearGradient>
      </defs>
      {/* Chest lid */}
      <rect x="10" y="32" width="85" height="30" rx="6" fill="#E0922D"/>
      <path d="M10 50 Q10 32 52.5 32 Q95 32 95 50 Z" fill="#F6B84A"/>
      {/* Lock */}
      <rect x="43" y="48" width="19" height="15" rx="3" fill="#C8A020" stroke="#A07010" strokeWidth="1"/>
      <path d="M48 48 V43 C48 39 57 39 57 43 V48" stroke="#A07010" strokeWidth="2.5" fill="none"/>
      {/* Gold coins in chest */}
      <ellipse cx="33" cy="58" rx="10" ry="5.5" fill="#F5C842"/>
      <ellipse cx="33" cy="55" rx="10" ry="5.5" fill="#FFD700"/>
      <ellipse cx="65" cy="60" rx="8" ry="4.5" fill="#F5C842"/>
      <ellipse cx="65" cy="57" rx="8" ry="4.5" fill="#FFD700"/>
      {/* Gold stars/sparkles */}
      <circle cx="15" cy="38" r="3.5" fill="#F5C842"/>
      <circle cx="8" cy="52" r="2.5" fill="#F5C842"/>
      <circle cx="98" cy="40" r="3" fill="#F5C842"/>
    </svg>
  );
}

/* Trophy */
function Trophy() {
  return (
    <svg width="120" height="118" viewBox="0 0 120 118" fill="none">
      {/* Stars */}
      <circle cx="15" cy="30" r="4" fill="#F8E43A"/>
      <circle cx="10" cy="55" r="3" fill="#F8E43A"/>
      <circle cx="108" cy="25" r="3.5" fill="#F8E43A"/>
      <circle cx="112" cy="50" r="2.5" fill="#F8E43A"/>
      <circle cx="25" cy="15" r="2.5" fill="#F8E43A"/>
      {/* Trophy cup */}
      <path d="M35 10 H85 L80 65 C80 72 70 78 60 78 C50 78 40 72 40 65 Z" fill="#F5C842"/>
      <path d="M35 10 H85 L82 58 C82 68 72 75 60 75 C48 75 38 68 38 58 Z" fill="#FFD700"/>
      {/* Handles */}
      <path d="M35 18 C18 18 12 30 12 42 C12 54 22 60 35 58" stroke="#F5C842" strokeWidth="7" fill="none" strokeLinecap="round"/>
      <path d="M85 18 C102 18 108 30 108 42 C108 54 98 60 85 58" stroke="#F5C842" strokeWidth="7" fill="none" strokeLinecap="round"/>
      {/* Base */}
      <rect x="48" y="78" width="24" height="14" rx="2" fill="#E0A020"/>
      <rect x="38" y="92" width="44" height="10" rx="4" fill="#F5C842"/>
      <rect x="38" y="92" width="44" height="10" rx="4" fill="#FFD700" opacity=".7"/>
      {/* Star on trophy */}
      <path d="M60 25 L63 35 H73 L65 41 L68 51 L60 45 L52 51 L55 41 L47 35 H57 Z" fill="white" opacity=".8"/>
    </svg>
  );
}

/* ─────────────────────────── BONUS CARD ─────────────────────────── */
interface BonusCardProps {
  title: string;
  subtitle: string;
  btnLabel: string;
  btnDisabled?: boolean;
  onBtn: () => void;
  illustration: React.ReactNode;
}

function BonusCard({ title, subtitle, btnLabel, btnDisabled, onBtn, illustration }: BonusCardProps) {
  return (
    <div className="relative overflow-hidden flex-1 min-w-0"
         style={{ background:"#111324", border:"1px solid #3A7E59", borderRadius:20, height:231 }}>
      {/* Right pattern panel */}
      <div className="absolute right-0 top-0 bottom-0" style={{ width:175, background:"#0C343F", zIndex:0 }}/>
      {/* Blur ellipses */}
      <div className="absolute pointer-events-none" style={{ width:278, height:278, right:-120, bottom:-160, background:"#11C5A7", filter:"blur(160px)", mixBlendMode:"plus-lighter", zIndex:1 }}/>
      <div className="absolute pointer-events-none" style={{ width:278, height:278, left:-100, top:-185, background:"#11C5A7", filter:"blur(160px)", mixBlendMode:"plus-lighter", zIndex:1 }}/>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-6">
        {/* Left: title + subtitle + illustration */}
        <div className="flex flex-col justify-between h-full py-5 flex-1 min-w-0">
          <div>
            <h3 className="font-bold text-white" style={{ fontFamily:"'Manrope',sans-serif", fontSize:20, lineHeight:"34px", letterSpacing:"0.02em" }}>{title}</h3>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, lineHeight:"20px", letterSpacing:"-0.01em", color:"#8C8FA8", maxWidth:210 }}>{subtitle}</p>
          </div>
          <div className="mt-2">
            {illustration}
          </div>
        </div>

        {/* Right: CTA button */}
        <div className="shrink-0 ml-4">
          <TealBtn onClick={onBtn} disabled={btnDisabled}>
            <StepIcon/>
            <span>{btnLabel}</span>
          </TealBtn>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── FOOTER (shared with cashout) ─────────────────────────── */
function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background:"#0D0F1E", paddingTop:60, paddingBottom:90 }}>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center select-none" style={{ zIndex:0 }}>
        <span style={{ fontFamily:"'Manrope',sans-serif", fontWeight:800, fontSize:"clamp(56px,11vw,122px)", lineHeight:"110%", letterSpacing:"0.01em", background:"linear-gradient(3.74deg,rgba(118,163,220,0) 3.38%,#13243A 201.62%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>LAB WARDS</span>
      </div>
      <div className="relative z-10 max-w-[1281px] mx-auto px-6 flex flex-col gap-10">
        <div className="flex flex-wrap gap-14 justify-between">
          <div className="flex flex-col gap-5 max-w-[550px]">
            <span className="font-extrabold text-white text-[28px]" style={{ fontFamily:"'Manrope',sans-serif" }}>Lab<span style={{color:"#14A28A"}}>W</span>ards</span>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">{[1,2,3,4,5].map(s=><div key={s} className="w-8 h-8 flex items-center justify-center" style={{background:"#00B67A"}}><span className="text-white text-lg">★</span></div>)}</div>
              <span className="text-white font-bold text-sm" style={{fontFamily:"'Manrope',sans-serif"}}>TrustScore 4.5 | 200 reviews</span>
            </div>
            <p className="text-white font-semibold text-xl leading-[29px]" style={{fontFamily:"'Manrope',sans-serif"}}>Sign up today and grab your instant bonus. Every task completed puts money in your pocket.</p>
          </div>
          <div className="flex flex-wrap gap-16">
            <div className="flex flex-col gap-6">
              <h3 className="text-white font-bold text-xl" style={{fontFamily:"'Manrope',sans-serif"}}>Support</h3>
              <div className="flex flex-col gap-3">
                <Link href="/contact" className="text-[#B3B6C7] font-medium text-lg hover:text-white transition-colors" style={{fontFamily:"'Manrope',sans-serif"}}>Contact Us</Link>
                <Link href="/faq" className="text-[#B3B6C7] font-medium text-lg hover:text-white transition-colors" style={{fontFamily:"'Manrope',sans-serif"}}>FAQ</Link>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h3 className="text-white font-bold text-xl" style={{fontFamily:"'Manrope',sans-serif"}}>Features</h3>
              <div className="flex flex-col gap-3">
                <Link href="/earn" className="text-[#B3B6C7] font-medium text-lg hover:text-white transition-colors" style={{fontFamily:"'Manrope',sans-serif"}}>Games</Link>
                <Link href="/rewards" className="text-[#B3B6C7] font-medium text-lg hover:text-white transition-colors" style={{fontFamily:"'Manrope',sans-serif"}}>Rewards</Link>
                <Link href="/tasks" className="text-[#B3B6C7] font-medium text-lg hover:text-white transition-colors" style={{fontFamily:"'Manrope',sans-serif"}}>Tasks</Link>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h3 className="text-white font-bold text-xl" style={{fontFamily:"'Manrope',sans-serif"}}>Connect With Us</h3>
              <div className="flex gap-3">
                {[
                  <svg key="tp" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2l2.6 8H22l-6.6 4.8 2.5 7.7L12 17.7l-5.9 4.8 2.5-7.7L2 10h7.4z"/></svg>,
                  <svg key="tg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M2.01 12C2.01 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2.01 17.52 2.01 12zm15.4-5.5l-2.06 9.72c-.15.68-.56.85-1.12.53l-3-2.21-1.45 1.4c-.16.16-.3.29-.6.29l.21-3.02 5.51-4.98c.24-.21-.05-.33-.37-.12L7 12.98l-2.95-.92c-.64-.2-.65-.64.14-.95l11.52-4.44c.53-.2 1 .13.7.83z"/></svg>,
                  <svg key="dc" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                ].map((icon,i)=>(
                  <div key={i} className="w-14 h-14 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" style={{background:"#1E2133",border:"1px solid #111324"}}>{icon}</div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full cursor-pointer hover:opacity-80" style={{border:"1px solid #26293E"}}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="white" opacity=".9"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zM2 8c0-.4.04-.79.1-1.17l3.4 3.4v.67c0 .74.6 1.33 1.33 1.33v1.3A5.34 5.34 0 012 8zm5.33 5.28V12c-.74 0-1.33-.6-1.33-1.33V9.33L4.28 7.6A4.67 4.67 0 0113.27 5l-1.6 1.6v.73c0 .74-.6 1.34-1.34 1.34h-1.33v1.33c0 .37-.3.67-.67.67H7.33v1.61z"/></svg>
                  <span className="text-white text-sm font-medium" style={{fontFamily:"'DM Sans',sans-serif"}}>English</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full cursor-pointer hover:opacity-80" style={{border:"1px solid #26293E"}}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2a6 6 0 100 12A6 6 0 008 2z" stroke="white" strokeWidth="1.5"/></svg>
                  <span className="text-white text-sm font-medium" style={{fontFamily:"'DM Sans',sans-serif"}}>Light</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div style={{height:1,background:"#243B46"}}/>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-[#B3B6C7] text-lg" style={{fontFamily:"'Manrope',sans-serif"}}>©2026 Lab Wards, All Rights Reserved</span>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="text-[#B3B6C7] text-lg hover:text-white transition-colors" style={{fontFamily:"'Manrope',sans-serif"}}>Terms of Use</Link>
              <div style={{width:1,height:18,background:"#50536F"}}/>
              <Link href="/privacy" className="text-[#B3B6C7] text-lg hover:text-white transition-colors" style={{fontFamily:"'Manrope',sans-serif"}}>Privacy Policy</Link>
              <div style={{width:1,height:18,background:"#50536F"}}/>
              <Link href="/cookies" className="text-[#B3B6C7] text-lg hover:text-white transition-colors" style={{fontFamily:"'Manrope',sans-serif"}}>Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────── SUPPORT FAB ─────────────────────────── */
function SupportFab() {
  return (
    <button className="fixed bottom-8 right-8 z-50 flex items-center justify-center rounded-full shadow-lg hover:opacity-90 transition-opacity"
            style={{width:60,height:60,background:"linear-gradient(336deg,rgba(20,162,138,0) -8%,#14A28A 82%)"}}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12v5c0 1.1.9 2 2 2h1c.55 0 1-.45 1-1v-5c0-.55-.45-1-1-1H4v-1c0-4.42 3.58-8 8-8s8 3.58 8 8v1h-1c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1h1c1.1 0 2-.9 2-2v-5c0-5.52-4.48-10-10-10z" fill="white"/>
      </svg>
    </button>
  );
}

/* ─────────────────────────── PAGE ─────────────────────────── */
export default function RewardsPage() {
  const getApi = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const { socket } = useSocket();

  const [dailyEligible, setDailyEligible]   = useState<boolean | null>(null);
  const [claimLoading,  setClaimLoading]    = useState(false);
  const [claimMessage,  setClaimMessage]    = useState<string | null>(null);

  const fetchDaily = async () => {
    const api   = getApi();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) { setDailyEligible(null); return; }
    try {
      const res  = await fetch(`${api}/api/v1/user/daily-checkin`, { headers:{ Authorization:`Bearer ${token}` } });
      if (!res.ok) { setDailyEligible(null); return; }
      const data = await res.json().catch(() => ({}));
      if (data && typeof data.eligible === "boolean") {
        setDailyEligible(data.eligible);
      }
    } catch { setDailyEligible(null); }
  };

  useEffect(() => { fetchDaily(); }, []);

  useEffect(() => {
    if (!socket) return;
    const onNotif = (n: any) => {
      try {
        if (n?.type === "daily.checkin") {
          setDailyEligible(false);
          toast.success(n.body || n.message || "Daily bonus claimed");
        }
      } catch {}
    };
    socket.on("notification", onNotif);
    return () => { try { socket.off("notification", onNotif); } catch {} };
  }, [socket]);

  const doDailyClaim = async () => {
    const api   = getApi();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) { setClaimMessage("Please sign in to claim rewards."); return; }
    setClaimLoading(true); setClaimMessage(null);
    try {
      const res  = await fetch(`${api}/api/v1/user/daily-checkin/claim`, {
        method:"POST",
        headers:{ Authorization:`Bearer ${token}`, "Content-Type":"application/json" },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = body?.message || "Failed to claim";
        setClaimMessage(msg);
        if (res.status === 400 || /already claimed/i.test(msg)) setDailyEligible(false);
        toast.error(msg);
      } else {
        setClaimMessage(body?.message || "Claim successful");
        setDailyEligible(false);
        toast.success(body?.message || "Claim successful");
      }
    } catch { setClaimMessage("Failed to claim reward"); }
    finally  { setClaimLoading(false); }
  };

  const spinLabel = claimLoading ? "Spinning…" : (dailyEligible === false ? "Claimed" : "Spin");

  return (
    <div className="min-h-screen" style={{ background:"#0D0F1E" }}>
      <TopBar/>
      <TickerBar/>

      {/* ── Bonus cards ─────────────────────────────────────────── */}
      <main className="px-6 md:px-16 py-8 max-w-[1440px] mx-auto">
        <div className="flex gap-4">
          {/* Sign up bonus */}
          <BonusCard
            title="Sign up bonus"
            subtitle="Win up to $30"
            btnLabel={spinLabel}
            btnDisabled={claimLoading || dailyEligible === false}
            onBtn={doDailyClaim}
            illustration={<SpinWheel/>}
          />

          {/* 7 days Streak */}
          <BonusCard
            title="7 days Streak"
            subtitle="Earn $1 daily to keep up with streak"
            btnLabel="Go to streak"
            onBtn={() => {}}
            illustration={<TreasureChest/>}
          />

          {/* Verification */}
          <BonusCard
            title="Verification"
            subtitle="Win $0.2 each"
            btnLabel="Go to Verification"
            onBtn={() => {}}
            illustration={<Trophy/>}
          />
        </div>

        {claimMessage && (
          <p className="mt-4 text-sm text-teal-400 text-center" style={{fontFamily:"'DM Sans',sans-serif"}}>{claimMessage}</p>
        )}
      </main>

      <Footer/>
      <SupportFab/>
    </div>
  );
}
