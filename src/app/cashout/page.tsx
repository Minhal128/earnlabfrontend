"use client";

import React, { useRef } from "react";
import TopBar from "@/Components/Topbar";
import Link from "next/link";

/* ───────────────────────── TICKER ───────────────────────── */
const TICKER = [
  { game: "Slots",     action: "withdrew", amount: "$0.8", grad: ["#F97316","#EF4444"] },
  { game: "Worldcoin", action: "withdrew", amount: "$0.8", grad: ["#6366F1","#3B82F6"] },
  { game: "Slot",      action: "withdrew", amount: "$0.8", grad: ["#8B5CF6","#EC4899"] },
  { game: "Monopoly",  action: "withdrew", amount: "$0.8", grad: ["#10B981","#059669"] },
  { game: "Worldcoin", action: "withdrew", amount: "$0.8", grad: ["#14A28A","#0891B2"] },
  { game: "Slots",     action: "withdrew", amount: "$0.8", grad: ["#F59E0B","#F97316"] },
  { game: "Torox",     action: "earned",   amount: "$0.5", grad: ["#A855F7","#7C3AED"] },
  { game: "Offer walls",action:"earned",   amount: "$0.5", grad: ["#06B6D4","#14A28A"] },
];

function TickerItem({ item }: { item: typeof TICKER[0] }) {
  return (
    <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] shrink-0 mx-2" style={{ width: 260, height: 72, background: "#181A2C" }}>
      {/* Game thumbnail */}
      <div className="shrink-0 rounded-[6px] overflow-hidden flex items-center justify-center text-white font-black text-xl relative" style={{ width: 56, height: 56, background: `linear-gradient(135deg,${item.grad[0]},${item.grad[1]})` }}>
        {/* inner dot texture */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 56 56"><defs><pattern id={`d${item.game}`} x="0" y="0" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.2" fill="white"/></pattern></defs><rect width="56" height="56" fill={`url(#d${item.game})`}/></svg>
        <span className="relative z-10" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:22 }}>{item.game.charAt(0)}</span>
      </div>
      {/* Text */}
      <div className="flex flex-col justify-center min-w-0">
        <span className="text-[#6B6E8A] font-medium truncate" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, lineHeight:"20px", letterSpacing:"-0.01em" }}>User {item.action}</span>
        <span className="text-[#B3B6C7] font-medium truncate" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:18, lineHeight:"20px", letterSpacing:"-0.01em" }}>{item.game}</span>
      </div>
      {/* Amount */}
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
        @keyframes cticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .cticker-wrap { display:flex; align-items:center; animation:cticker 36s linear infinite; width:max-content; height:88px; }
      `}</style>
      <div className="cticker-wrap">
        {[...TICKER,...TICKER,...TICKER].map((item,i)=>(
          <TickerItem key={i} item={item}/>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── CARD LOGOS ───────────────────────── */
const BitcoinLogo = () => (
  <div className="flex items-center gap-2">
    <div className="rounded-full flex items-center justify-center font-black text-white shrink-0" style={{width:33,height:33,background:"#F7931A",fontSize:21,fontFamily:"serif"}}>₿</div>
    <span className="font-bold text-white" style={{fontFamily:"'DM Sans',sans-serif",fontSize:27,lineHeight:"20px",letterSpacing:"-0.01em"}}>bitcoin</span>
  </div>
);
const DogecoinLogo = () => (
  <div className="flex items-center gap-1.5">
    <div className="rounded-full flex items-center justify-center font-black text-white shrink-0" style={{width:37,height:37,background:"linear-gradient(135deg,#C3A634,#F0B429)",fontSize:20,fontFamily:"serif"}}>Ð</div>
    <span className="font-bold text-white" style={{fontFamily:"'DM Sans',sans-serif",fontSize:27,lineHeight:"20px",letterSpacing:"-0.01em"}}>Dogecoin</span>
  </div>
);
const SolanaLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg width="33" height="33" viewBox="0 0 128 128" fill="none"><defs><linearGradient id="sg" x1="0" y1="128" x2="128" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#9945FF"/><stop offset="1" stopColor="#14F195"/></linearGradient></defs><rect width="128" height="128" rx="64" fill="url(#sg)"/><path d="M34 84h60l-14 14H20l14-14zm0-28h60l-14-14H20l14 14zm60-14H34L20 56h60l14-14z" fill="white"/></svg>
    <span className="font-bold text-white" style={{fontFamily:"'DM Sans',sans-serif",fontSize:27,lineHeight:"20px",letterSpacing:"-0.01em"}}>SOLANA</span>
  </div>
);
const EthereumLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg width="33" height="33" viewBox="0 0 128 128" fill="none"><rect width="128" height="128" rx="64" fill="#627EEA"/><path d="M64 20L38 66l26 15 26-15L64 20z" fill="white" fillOpacity=".8"/><path d="M38 66l26 15v27L38 66z" fill="white" fillOpacity=".6"/><path d="M90 66l-26 15v27l26-42z" fill="white"/></svg>
    <span className="font-bold text-white" style={{fontFamily:"'DM Sans',sans-serif",fontSize:27,lineHeight:"20px",letterSpacing:"-0.01em"}}>Ethereum</span>
  </div>
);
const LitecoinLogo = () => (
  <div className="flex items-center gap-1.5">
    <div className="rounded-full flex items-center justify-center font-black text-white shrink-0" style={{width:33,height:33,background:"linear-gradient(135deg,#BFBBBB,#8F8F8F)",fontSize:20,fontFamily:"serif"}}>Ł</div>
    <span className="font-bold text-white" style={{fontFamily:"'DM Sans',sans-serif",fontSize:27,lineHeight:"20px",letterSpacing:"-0.01em"}}>Litecoin</span>
  </div>
);
const PaypalLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg width="40" height="40" viewBox="0 0 128 128" fill="none"><rect width="128" height="128" rx="64" fill="#003087"/><text x="64" y="82" textAnchor="middle" fill="white" fontSize="56" fontFamily="serif" fontWeight="bold">P</text></svg>
    <span className="font-bold text-white" style={{fontFamily:"'DM Sans',sans-serif",fontSize:27,lineHeight:"20px",letterSpacing:"-0.01em"}}>PayPal</span>
  </div>
);
const WorldcoinLogo = () => (
  <div className="flex items-center gap-1">
    <svg width="38" height="38" viewBox="0 0 128 128" fill="none"><rect width="128" height="128" rx="64" fill="white"/><circle cx="64" cy="64" r="40" stroke="#000" strokeWidth="8" fill="none"/><line x1="64" y1="24" x2="64" y2="104" stroke="#000" strokeWidth="6"/><line x1="30" y1="52" x2="98" y2="52" stroke="#000" strokeWidth="6"/><line x1="28" y1="76" x2="100" y2="76" stroke="#000" strokeWidth="6"/></svg>
    <span className="font-bold text-white" style={{fontFamily:"'DM Sans',sans-serif",fontSize:27,lineHeight:"20px",letterSpacing:"-0.01em"}}>Worldcoin</span>
  </div>
);
const VisaLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg width="33" height="33" viewBox="0 0 128 128" fill="none"><rect width="128" height="128" rx="16" fill="#1A1F71"/><text x="64" y="82" textAnchor="middle" fill="white" fontSize="44" fontFamily="Arial" fontWeight="bold" fontStyle="italic">VISA</text></svg>
    <span className="font-bold text-white" style={{fontFamily:"'DM Sans',sans-serif",fontSize:27,lineHeight:"20px",letterSpacing:"-0.01em"}}>Visa</span>
  </div>
);
const AmazonLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg width="40" height="40" viewBox="0 0 128 128" fill="none"><rect width="128" height="128" rx="14" fill="#FF9900"/><text x="64" y="82" textAnchor="middle" fill="#232F3E" fontSize="56" fontFamily="serif" fontWeight="bold">a</text></svg>
    <span className="font-bold text-white" style={{fontFamily:"'DM Sans',sans-serif",fontSize:27,lineHeight:"20px",letterSpacing:"-0.01em"}}>Amazon</span>
  </div>
);
const ITunesLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg width="40" height="40" viewBox="0 0 128 128" fill="none"><rect width="128" height="128" rx="24" fill="url(#itg)"/><defs><linearGradient id="itg" x1="0" y1="0" x2="128" y2="128"><stop stopColor="#FD6F6F"/><stop offset="1" stopColor="#FF1A55"/></linearGradient></defs><text x="64" y="85" textAnchor="middle" fill="white" fontSize="62" fontFamily="serif">♪</text></svg>
    <span className="font-bold text-white" style={{fontFamily:"'DM Sans',sans-serif",fontSize:27,lineHeight:"20px",letterSpacing:"-0.01em"}}>iTunes</span>
  </div>
);
const SpotifyLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg width="40" height="40" viewBox="0 0 128 128" fill="none"><rect width="128" height="128" rx="64" fill="#1DB954"/><path d="M96 70c-16-10-42-11-57-6a5 5 0 01-2-9c18-5 47-4 66 7a5 5 0 01-7 8zm-3-14c-14-9-37-11-54-6a4 4 0 11-2-7c20-6 45-4 62 7a4 4 0 11-6 6zm-62-17c-3 1-6-1-7-4s1-6 4-7c20-6 52-5 72 8a5 5 0 01-5 8c-17-10-47-11-64-5z" fill="white"/></svg>
    <span className="font-bold text-white" style={{fontFamily:"'DM Sans',sans-serif",fontSize:27,lineHeight:"20px",letterSpacing:"-0.01em"}}>Spotify</span>
  </div>
);
const PlaystationLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg width="33" height="33" viewBox="0 0 128 128" fill="none"><rect width="128" height="128" rx="12" fill="#003087"/><text x="64" y="85" textAnchor="middle" fill="white" fontSize="46" fontFamily="Arial" fontWeight="bold">PS</text></svg>
    <span className="font-bold text-white" style={{fontFamily:"'DM Sans',sans-serif",fontSize:27,lineHeight:"20px",letterSpacing:"-0.01em"}}>Playstation</span>
  </div>
);
const SteamLogo = () => (
  <div className="flex items-center gap-1.5">
    <svg width="33" height="33" viewBox="0 0 128 128" fill="none"><rect width="128" height="128" rx="12" fill="#1b2838"/><path d="M56 36c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm-20 44l20-8c2 6 8 10 15 10a16 16 0 000-32c-6 0-12 3-15 8L36 68a28 28 0 1020 12z" fill="#66C0F4"/></svg>
    <span className="font-bold text-white" style={{fontFamily:"'DM Sans',sans-serif",fontSize:27,lineHeight:"20px",letterSpacing:"-0.01em"}}>Steam</span>
  </div>
);

/* ───────────────────────── DOT PATTERN ───────────────────────── */
function DotPattern({ color }: { color: string }) {
  const id = `dp${color.replace("#","")}`;
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 224 246" preserveAspectRatio="xMidYMid slice" style={{ opacity:0.35 }}>
      <defs><pattern id={id} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.5" fill={color}/></pattern></defs>
      <rect width="224" height="246" fill={`url(#${id})`}/>
    </svg>
  );
}

/* ───────────────────────── PAYOUT CARD ───────────────────────── */
interface CardDef {
  id: string;
  name: string;
  subtitle?: string;
  bg: string;
  dotColor: string;
  ellipseColor: string;
  badge?: string;
  logo: React.ReactNode;
}

function PayoutCard({ card }: { card: CardDef }) {
  return (
    <div
      className="relative overflow-hidden rounded-[15px] cursor-pointer hover:scale-[1.02] transition-transform shrink-0 w-full sm:w-[224px] h-[200px] sm:h-[246px]"
      style={{ background:card.bg }}
    >
      {/* Dot pattern texture */}
      <DotPattern color={card.dotColor}/>

      {/* Blur ellipses depth */}
      <div className="absolute rounded-full pointer-events-none" style={{ width:162, height:162, left:-93, top:50, background:card.ellipseColor, filter:"blur(100px)", zIndex:1 }}/>
      <div className="absolute rounded-full pointer-events-none" style={{ width:162, height:162, right:-70, top:50, background:card.ellipseColor, filter:"blur(100px)", zIndex:1 }}/>

      {/* 30% OFF badge */}
      {card.badge && (
        <div className="absolute z-20 flex items-center justify-center" style={{ top:0, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(180deg,#FFCC00 0%,#E27500 100%)", borderRadius:36, padding:"6px 20px", minWidth:107, boxShadow:"0 10px 10px rgba(0,0,0,0.25)", whiteSpace:"nowrap" }}>
          <span className="font-bold text-[#0D0F1E]" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:17 }}>{card.badge}</span>
        </div>
      )}

      {/* Logo row at top */}
      <div className="absolute z-10 flex items-center justify-center w-full" style={{ top: card.badge ? 44 : 33 }}>
        {card.logo}
      </div>

      {/* Name + subtitle at bottom */}
      <div className="absolute z-10 bottom-10 left-0 right-0 flex flex-col items-center gap-[3px]">
        <span className="font-semibold text-center text-white" style={{ fontFamily:"'Manrope',sans-serif", fontSize:20, lineHeight:"23px", letterSpacing:"-0.01em" }}>
          {card.name}
        </span>
        {card.subtitle && (
          <span className="font-semibold text-center" style={{ fontFamily:"'Manrope',sans-serif", fontSize:16, lineHeight:"23px", color:"#C2C9CF" }}>
            {card.subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── CARD DATA ───────────────────────── */
const POPULAR: CardDef[] = [
  { id:"btc",  name:"Bitcoin",  subtitle:"0.50€ transaction fee", bg:"#300F9E", dotColor:"#9E80FF", ellipseColor:"#3E1DA8", logo:<BitcoinLogo/> },
  { id:"doge", name:"Dogecoin", subtitle:"0.50€ transaction fee", bg:"#A9650E", dotColor:"#F5C1A0", ellipseColor:"#A8751D", logo:<DogecoinLogo/> },
  { id:"sol",  name:"Solana",                                     bg:"#A31D16", dotColor:"#FC927E", ellipseColor:"#A81D1D", logo:<SolanaLogo/> },
  { id:"eth",  name:"Ethereum", subtitle:"0.50€ transaction fee", bg:"#508E18", dotColor:"#D3FBA5", ellipseColor:"#007228", logo:<EthereumLogo/> },
  { id:"ltc",  name:"Litecoin", subtitle:"0.50€ transaction fee", bg:"#137E4F", dotColor:"#94F5CD", ellipseColor:"#007228", logo:<LitecoinLogo/> },
];

const WITHDRAW_CASH: CardDef[] = [
  { id:"paypal",    name:"Paypal",    bg:"#131521", dotColor:"#4A5280", ellipseColor:"#1E2133", logo:<PaypalLogo/> },
  { id:"worldcoin", name:"Worldcoin", bg:"#191B27", dotColor:"#4A5280", ellipseColor:"#1E2133", badge:"30% OFF", logo:<WorldcoinLogo/> },
  { id:"visa",      name:"Visa",      bg:"#191B27", dotColor:"#4A5280", ellipseColor:"#1E2133", logo:<VisaLogo/> },
];

const GIFTCARDS: CardDef[] = [
  { id:"amazon",  name:"Amazon",       bg:"#2D0B9C", dotColor:"#9E80FF", ellipseColor:"#3E1DA8", logo:<AmazonLogo/> },
  { id:"itunes",  name:"App stores",   bg:"#A95E07", dotColor:"#F5C1A0", ellipseColor:"#A8751D", logo:<ITunesLogo/> },
  { id:"spotify", name:"Spotify",      bg:"#A21D13", dotColor:"#FC927E", ellipseColor:"#A81D1D", logo:<SpotifyLogo/> },
  { id:"ps",      name:"Playstations", bg:"#629415", dotColor:"#D3FBA5", ellipseColor:"#007228", logo:<PlaystationLogo/> },
  { id:"steam",   name:"Steam",        bg:"#17815A", dotColor:"#94F5CD", ellipseColor:"#007228", logo:<SteamLogo/> },
];

/* ───────────────────────── SECTION ───────────────────────── */
function Section({ title, cards }: { title: string; cards: CardDef[] }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-bold text-white px-2 sm:px-0" style={{ fontFamily:"'Manrope',sans-serif", fontSize:28, lineHeight:"34px", letterSpacing:"0.02em" }}>{title}</h2>
      <div className="grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap gap-2 sm:gap-4 justify-between sm:justify-start">
        {cards.map(card => (
          <PayoutCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── FOOTER ───────────────────────── */
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
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 text-center sm:text-left">
              <span className="text-[#B3B6C7] text-sm sm:text-base relative z-10" style={{fontFamily:"'Manrope',sans-serif"}}>©2026 Lab Wards, All Rights Reserved</span>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 relative z-10">
                <Link href="/terms" className="text-[#B3B6C7] text-sm sm:text-base hover:text-white transition-colors" style={{fontFamily:"'Manrope',sans-serif"}}>Terms of Use</Link>
                <div className="hidden sm:block" style={{width:1,height:18,background:"#50536F"}}/>
                <span className="sm:hidden text-[#50536F]">|</span>
                <Link href="/privacy" className="text-[#B3B6C7] text-sm sm:text-base hover:text-white transition-colors" style={{fontFamily:"'Manrope',sans-serif"}}>Privacy Policy</Link>
                <div className="hidden sm:block" style={{width:1,height:18,background:"#50536F"}}/>
                <span className="sm:hidden text-[#50536F]">|</span>
                <Link href="/cookies" className="text-[#B3B6C7] text-sm sm:text-base hover:text-white transition-colors" style={{fontFamily:"'Manrope',sans-serif"}}>Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────── SUPPORT FAB ───────────────────────── */
function SupportFab() {
  return (
    <button className="fixed bottom-8 right-8 z-50 flex items-center justify-center rounded-full shadow-lg hover:opacity-90 transition-opacity cursor-pointer" style={{width:60,height:60,background:"linear-gradient(336deg,rgba(20,162,138,0) -8%,#14A28A 82%)"}}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12v5c0 1.1.9 2 2 2h1c.55 0 1-.45 1-1v-5c0-.55-.45-1-1-1H4v-1c0-4.42 3.58-8 8-8s8 3.58 8 8v1h-1c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1h1c1.1 0 2-.9 2-2v-5c0-5.52-4.48-10-10-10z" fill="white"/></svg>
    </button>
  );
}

/* ───────────────────────── PAGE ───────────────────────── */
export default function CashoutPage() {
  return (
    <div className="min-h-screen" style={{background:"#0D0F1E"}}>
      <TopBar/>
      <TickerBar/>
      <main className="px-6 md:px-16 py-10 flex flex-col gap-14 max-w-[1440px] mx-auto">
        <Section title="Popular"       cards={POPULAR}/>
        <Section title="Withdraw cash" cards={WITHDRAW_CASH}/>
        <Section title="Giftcard"      cards={GIFTCARDS}/>
      </main>
      <Footer/>
      <SupportFab/>
    </div>
  );
}
