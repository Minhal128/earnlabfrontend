"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

/* ───────────── Star Rating ───────────── */
const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.26 5.06 16.7l.94-5.49-4-3.9 5.53-.8L10 1.5z"
      fill={filled ? '#FF8D28' : '#30334A'}
    />
  </svg>
);
const Stars = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} filled={i < count} />
    ))}
  </div>
);

/* ───────────── FAQ Accordion ───────────── */
const faqData = [
  {
    q: 'How can i start earning on LabWard?',
    a: "Creating an account on LabWard is quick and easy. You can sign up using your email, Google, Facebook, or Steam. Once logged in, you'll have access to the Earn section to complete offers and the Games section to play Boxes and Battles. Just sign in and start exploring.",
  },
  {
    q: 'How many payout methods are available?',
    a: 'LabWard supports over 15 payout methods including PayPal, Bitcoin, Ethereum, Solana, VISA gift cards, Steam wallet codes, Google Play credits, Amazon gift cards, and more. We are constantly adding new payout options based on user feedback.',
  },
  {
    q: 'How do I withdraw from LabWard?',
    a: 'Navigate to the Rewards section in your dashboard, select your preferred payout method, enter the withdrawal amount (minimum $0.50), and confirm the transaction. Your earnings will be sent within the processing time for that method.',
  },
  {
    q: 'How long does the withdrawal take?',
    a: 'Most withdrawals are processed within 24 hours. Crypto payments (BTC, ETH, SOL) usually arrive within minutes. PayPal transfers take 1-2 business days. Gift card codes are typically delivered instantly via email after approval.',
  },
  {
    q: 'Is LabWard available worldwide?',
    a: 'Yes! LabWard is available in over 180 countries. However, some specific offers and surveys may be region-locked depending on advertiser requirements. The more populated regions tend to have more available tasks.',
  },
];

const FAQItem = ({
  q,
  a,
  open,
  onClick,
}: {
  q: string;
  a: string;
  open: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full text-left border-b border-[#26293E] pb-5 mb-5 last:border-0 last:mb-0 last:pb-0 bg-transparent cursor-pointer group"
  >
    <div className="flex justify-between items-center">
      <span className="text-white font-semibold text-base group-hover:text-[#18C2A3] transition-colors duration-200">{q}</span>
      <span className={`text-xl ml-4 w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${open ? 'bg-[#18C2A3] text-white' : 'bg-[#26293E] text-[#B3B6C7]'}`}>{open ? '+' : '—'}</span>
    </div>
    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}>
      <p className="text-[#6B6E8A] text-sm leading-relaxed">{a}</p>
    </div>
  </button>
);

/* ───────────── Testimonial Card ───────────── */
const TestimonialCard = ({
  img,
  name,
  country,
  flag,
  text,
  stars,
}: {
  img: string;
  name: string;
  country: string;
  flag: string;
  text: string;
  stars: number;
}) => (
  <div className="flex-1 min-w-0 sm:min-w-[300px] bg-[#16182A] border border-[#26293E] rounded-[20px] p-5 sm:p-8 flex flex-col gap-4 sm:gap-6">
    <div className="flex items-center gap-3">
      <img
        src={img}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <p className="text-white font-semibold text-lg">{name}</p>
        <p className="text-[#B3B6C7] text-xs flex items-center gap-1.5">
          <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#0AC07D"/></svg> {country}
        </p>
      </div>
    </div>
    <p className="text-[#B3B6C7] text-base leading-7">{text}</p>
    <Stars count={stars} />
  </div>
);

/* ───────────── Stat Card ───────────── */
const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <div className="flex flex-col items-center gap-3 sm:gap-4">
    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[rgba(255,255,255,0.15)] to-[#099F86] flex items-center justify-center shadow-[0_9px_24px_rgba(20,169,144,0.3)]">
      {icon}
    </div>
    <h3 className="text-[#0AC07D] text-2xl sm:text-4xl font-bold">{value}</h3>
    <p className="text-[#8C8FA8] text-xs sm:text-sm text-center">{label}</p>
  </div>
);

/* ───────────── Payout Ticker Row ───────────── */
const PayoutItem = ({
  icon,
  label,
  name,
  amount,
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  amount: string;
}) => (
  <div className="flex items-center gap-2 sm:gap-3 bg-[#181A2C] rounded-[10px] px-2 sm:px-3 py-2 sm:py-3 min-w-[200px] sm:min-w-[240px]">
    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[#6B6E8A] text-xs sm:text-sm">{label}</span>
      <span className="text-[#B3B6C7] text-sm sm:text-base font-medium">{name}</span>
    </div>
    <span className="text-[#0AC07D] font-bold text-lg sm:text-xl ml-auto">{amount}</span>
  </div>
);

/* ───────────── Reward Icon Box ───────────── */
const RewardBox = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#111324] border border-[#26293E] rounded-2xl flex items-center justify-center ${className}`}>
    {children}
  </div>
);

/* ───────────── SVG Icons ───────────── */
const GlobeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8C8FA8" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const ClipboardIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8C8FA8" strokeWidth="1.5" strokeLinecap="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 6h6M9 10h6M9 14h4"/>
  </svg>
);
const SolanaCircleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#9945FF" strokeWidth="1.5"/><circle cx="12" cy="12" r="4" fill="#9945FF"/>
  </svg>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
/* ───────────── Testimonial Data ───────────── */
const testimonials = [
  {
    img: '/img15.png',
    name: 'Leslie Alexander',
    country: 'United Kingdom',
    flag: '🇬🇧',
    text: "I was skeptical at first, but after completing just a few surveys I was able to cash out directly to my PayPal. Fast, simple, and legit — I'm hooked!",
    stars: 5,
  },
  {
    img: '/img16.png',
    name: 'Bessie Cooper',
    country: 'United States',
    flag: '🇺🇸',
    text: "I honestly didn't expect much at first, but LabWards surprised me. The tasks are simple, payouts are fast, and everything works exactly as promised.",
    stars: 5,
  },
  {
    img: '/img17.png',
    name: 'Brooklyn Simmons',
    country: 'France',
    flag: '🇫🇷',
    text: "What I like most about LabWards is how straightforward it is. No confusing steps, no hidden tricks. I complete surveys or offers in my free time and the earnings add up fast.",
    stars: 4,
  },
  {
    img: '/img15.png',
    name: 'Sarah Johnson',
    country: 'Canada',
    flag: '🇨🇦',
    text: "I've tried many reward platforms before but LabWards is by far the best. The interface is clean, tasks are easy, and I got paid within hours of my first withdrawal.",
    stars: 5,
  },
  {
    img: '/img16.png',
    name: 'Marcus Williams',
    country: 'Germany',
    flag: '🇩🇪',
    text: "The crypto withdrawal options are fantastic. I can cash out to Bitcoin or Solana and the fees are minimal. Great platform for earning in your spare time!",
    stars: 5,
  },
  {
    img: '/img17.png',
    name: 'Emily Chen',
    country: 'Australia',
    flag: '🇦🇺',
    text: "LabWards makes it so easy to earn extra income. I do surveys during my commute and play games in the evening. Already earned over $200 this month!",
    stars: 5,
  },
];

const LANDINGPAGEComponent = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for testimonial slider
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const maxSlide = isMobile
    ? testimonials.length - 1
    : Math.ceil(testimonials.length / 3) - 1;

  // Auto-slide testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [maxSlide]);

  return (
    <div className="w-full min-h-screen bg-[#0D0F1E] text-white font-['DM_Sans',sans-serif] overflow-x-hidden pb-16 sm:pb-0">
      {/* ═══════ NAVBAR ═══════ */}
      <nav className="w-full bg-[#16192E] px-4 sm:px-10 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-50">
        <img src="/landing-image-003.png" alt="Lab Wards" className="h-7 sm:h-9" />
        {/* Mobile hamburger */}
        <button className="sm:hidden w-10 h-10 bg-[#26293E] rounded-lg flex items-center justify-center">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M1 1h16M1 7h16M1 13h16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {/* Desktop buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/signin" className="px-6 py-3 rounded-full border border-[#3A3E57] bg-[#30334A] text-white font-bold text-sm">
            Sign in
          </Link>
          <Link href="/signup" className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0AC07D] to-[#14A990] text-white font-bold text-sm shadow-[0_9px_24px_rgba(20,169,144,0.3)]">
            Sign up
          </Link>
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="relative">
        {/* Banner images */}
        <div className="w-full h-[380px] sm:h-[400px] md:h-[450px] overflow-hidden flex">
          <img
            src="/landing-image-001.png"
            alt=""
            className="w-1/2 h-full object-cover"
          />
          <img
            src="/landing-image-002.png"
            alt=""
            className="w-1/2 h-full object-cover"
          />
        </div>
        {/* Wave overlay */}
        <div className="absolute inset-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 528"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="hero-grad"
                x1="0.5"
                y1="0.6"
                x2="0.5"
                y2="0"
              >
                <stop offset="0%" stopColor="#101324" />
                <stop offset="100%" stopColor="#0D0F1E" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              d="M0 0L1440 0L1440 400C1440 400 1341 507 1262 508C1179 510 1157 415 1076 401C938 377 866 511 726 519C567 528 525 366 370 401C289 419 258 509 176 508C95 507 0 401 0 401L0 0Z"
              fill="url(#hero-grad)"
            />
          </svg>
        </div>

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-4 sm:pt-16">
          <h1 className="text-3xl sm:text-5xl md:text-[60px] font-semibold leading-[1.05] tracking-tight max-w-[620px]">
            <span className="text-[#0AC07D]">Get paid</span> for what you
            already do online
          </h1>
          <p className="text-[#B3B6C7] text-sm sm:text-lg mt-3 sm:mt-4 max-w-[520px] leading-relaxed px-2">
            Complete surveys, play games, and finish quick offers to earn real
            money, crypto, and rewards.
          </p>
          <button className="mt-5 sm:mt-7 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-[#0AC07D] to-[#14A990] text-white font-bold shadow-[0_9px_24px_rgba(20,169,144,0.3)] text-sm sm:text-base hover:scale-105 hover:shadow-[0_12px_32px_rgba(20,169,144,0.5)] transition-all duration-300">
            Start Earning Now
          </button>
        </div>
      </section>

      {/* ═══════ CARDS SECTION ═══════ */}
      <section className="relative flex justify-center items-end gap-3 sm:gap-4 -mt-4 sm:-mt-10 pt-4 pb-14 sm:pb-20 px-2 sm:px-4">
        {/* Left card - tilted */}
        <div className="w-[110px] sm:w-[280px] shrink-0 bg-[#1C1E32] border border-[#383C61] rounded-lg sm:rounded-xl p-2 sm:p-4 transform -rotate-6 sm:-rotate-3 translate-y-4 sm:translate-y-6 hover:scale-105 transition-transform duration-300">
          <div className="relative rounded-md sm:rounded-lg overflow-hidden h-[75px] sm:h-[170px] bg-[#0D0F1E]">
            <img
              src="/landing-image-004.png"
              alt=""
              className="w-full h-full object-cover"
            />
            <img
              src="/landing-image-005.png"
              alt=""
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[55%]"
            />
          </div>
          <div className="mt-1 sm:mt-3">
            <h3 className="text-white font-semibold text-[9px] sm:text-lg truncate">Yappin Game</h3>
            <p className="text-[#6B6E8A] text-[7px] sm:text-sm truncate">Reach level 8 to earn</p>
            <p className="text-[#0AC07D] font-bold text-[10px] sm:text-xl mt-0.5 sm:mt-1">$0.2</p>
          </div>
        </div>

        {/* Center card - larger */}
        <div className="w-[180px] sm:w-[320px] shrink-0 bg-[#1C1E32] border border-[#383C61] rounded-xl p-3 sm:p-4 z-10 relative hover:scale-105 transition-transform duration-300">
          <div className="relative rounded-lg overflow-hidden h-[130px] sm:h-[230px] bg-[#0D0F1E]">
            <img
              src="/landing-image-004.png"
              alt=""
              className="w-full h-full object-cover"
            />
            <img
              src="/img7.png"
              alt=""
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[65%]"
            />
          </div>
          <div className="mt-2 sm:mt-3">
            <h3 className="text-white font-semibold text-sm sm:text-2xl">Octopus Mane</h3>
            <p className="text-[#6B6E8A] text-[11px] sm:text-base">
              Reach level 2 to earn
            </p>
            <p className="text-[#0AC07D] font-bold text-base sm:text-2xl mt-0.5 sm:mt-1">$0.8</p>
          </div>
        </div>

        {/* Right card - tilted */}
        <div className="w-[110px] sm:w-[280px] shrink-0 bg-[#1C1E32] border border-[#383C61] rounded-lg sm:rounded-xl p-2 sm:p-4 transform rotate-6 sm:rotate-3 translate-y-4 sm:translate-y-6 hover:scale-105 transition-transform duration-300">
          <div className="relative rounded-md sm:rounded-lg overflow-hidden h-[75px] sm:h-[170px] bg-[#0D0F1E]">
            <img
              src="/landing-image-004.png"
              alt=""
              className="w-full h-full object-cover"
            />
            <img
              src="/landing-image-006.png"
              alt=""
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[65%]"
            />
          </div>
          <div className="mt-1 sm:mt-3">
            <h3 className="text-white font-semibold text-[9px] sm:text-lg truncate">Quick Surveys</h3>
            <p className="text-[#6B6E8A] text-[7px] sm:text-sm truncate">Answer 2 surveys</p>
            <p className="text-[#0AC07D] font-bold text-[10px] sm:text-xl mt-0.5 sm:mt-1">$0.4</p>
          </div>
        </div>
      </section>

      {/* ═══════ LIVE PAYOUTS ═══════ */}
      <section className="max-w-[1312px] mx-auto px-4 py-10 sm:py-16">
        <h2 className="text-3xl sm:text-5xl font-semibold text-center tracking-tight mb-4 sm:mb-6 animate-fadeInUp">
          Live Payouts
        </h2>

        <div className="bg-[#111324] rounded-2xl p-4 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Total payout */}
            <div className="bg-[#181A2C] rounded-xl p-5 sm:p-8 flex flex-col items-center justify-center gap-2 min-w-0 sm:min-w-[260px]">
              <div className="w-11 h-11 rounded-full bg-[#099F86] flex items-center justify-center shadow-[0_9px_24px_rgba(20,169,144,0.3)] animate-pulse-glow">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path
                    d="M13 2C7.48 2 3 6.48 3 12s4.48 10 10 10 10-4.48 10-10S18.52 2 13 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                    fill="white"
                  />
                </svg>
              </div>
              <h3 className="text-[#0AC07D] text-3xl font-bold">
                $1,046,468.34
              </h3>
              <p className="text-[#8C8FA8] text-xs text-center">
                Total payouts made in the last 24h
              </p>
            </div>

            {/* Mobile: 2x2 grid */}
            <div className="sm:hidden grid grid-cols-2 gap-3">
              <PayoutItem
                icon={<GlobeIcon />}
                label="User withdrew"
                name="Worldcoin"
                amount="$0.8"
              />
              <PayoutItem
                icon={
                  <img
                    src="/img8.png"
                    alt=""
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover"
                  />
                }
                label="User earned"
                name="Torox"
                amount="$0.8"
              />
              <PayoutItem
                icon={
                  <img
                    src="/img8.png"
                    alt=""
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover"
                  />
                }
                label="User earned"
                name="Torox"
                amount="$0.8"
              />
              <PayoutItem
                icon={<GlobeIcon />}
                label="User withdrew"
                name="Worldcoin"
                amount="$0.8"
              />
            </div>

            {/* Desktop: Ticker rows */}
            <div className="hidden sm:flex flex-1 flex-col gap-4 overflow-hidden">
              <div className="flex gap-4 animate-slideRight">
                <PayoutItem
                  icon={<GlobeIcon />}
                  label="User withdrew"
                  name="Worldcoin"
                  amount="$0.8"
                />
                <PayoutItem
                  icon={
                    <img
                      src="/img8.png"
                      alt=""
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  }
                  label="User earned"
                  name="Torox"
                  amount="$0.8"
                />
                <PayoutItem
                  icon={<ClipboardIcon />}
                  label="User earned"
                  name="Offer walls"
                  amount="$0.5"
                />
                <PayoutItem
                  icon={<SolanaCircleIcon />}
                  label="User withdrew"
                  name="Solana"
                  amount="$0.2"
                />
                {/* Duplicate for seamless loop */}
                <PayoutItem
                  icon={<GlobeIcon />}
                  label="User withdrew"
                  name="Worldcoin"
                  amount="$0.8"
                />
                <PayoutItem
                  icon={
                    <img
                      src="/img8.png"
                      alt=""
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  }
                  label="User earned"
                  name="Torox"
                  amount="$0.8"
                />
                <PayoutItem
                  icon={<ClipboardIcon />}
                  label="User earned"
                  name="Offer walls"
                  amount="$0.5"
                />
                <PayoutItem
                  icon={<SolanaCircleIcon />}
                  label="User withdrew"
                  name="Solana"
                  amount="$0.2"
                />
              </div>
              <div className="flex gap-4 animate-slideLeft">
                <PayoutItem
                  icon={<ClipboardIcon />}
                  label="User earned"
                  name="Offer walls"
                  amount="$0.5"
                />
                <PayoutItem
                  icon={<SolanaCircleIcon />}
                  label="User withdrew"
                  name="Solana"
                  amount="$0.2"
                />
                <PayoutItem
                  icon={
                    <img
                      src="/img8.png"
                      alt=""
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  }
                  label="User earned"
                  name="Torox"
                  amount="$0.8"
                />
                <PayoutItem
                  icon={<GlobeIcon />}
                  label="User withdrew"
                  name="Worldcoin"
                  amount="$0.8"
                />
                {/* Duplicate for seamless loop */}
                <PayoutItem
                  icon={<ClipboardIcon />}
                  label="User earned"
                  name="Offer walls"
                  amount="$0.5"
                />
                <PayoutItem
                  icon={<SolanaCircleIcon />}
                  label="User withdrew"
                  name="Solana"
                  amount="$0.2"
                />
                <PayoutItem
                  icon={
                    <img
                      src="/img8.png"
                      alt=""
                      className="w-12 h-12 rounded-md object-cover"
                    />
                  }
                  label="User earned"
                  name="Torox"
                  amount="$0.8"
                />
                <PayoutItem
                  icon={<GlobeIcon />}
                  label="User withdrew"
                  name="Worldcoin"
                  amount="$0.8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ PARTNER LOGOS ═══════ */}
      <section className="max-w-[1100px] mx-auto px-4 py-10 sm:py-16">
        <div className="flex items-center justify-center gap-4 sm:gap-10 md:gap-16 flex-nowrap overflow-x-auto scrollbar-hide">
          {/* Monlix */}
          <div className="flex items-center gap-2 shrink-0">
            <svg width="40" height="34" viewBox="0 0 40 34" fill="none">
              <path d="M20 2L2 14l18 18 18-18L20 2z" stroke="#3E4262" strokeWidth="2.5" fill="none"/>
              <path d="M20 10l-8 6h16l-8-6z" fill="#3E4262"/>
              <path d="M12 16l8 8 8-8" stroke="#3E4262" strokeWidth="1.5" fill="none"/>
            </svg>
            <span className="text-[#3E4262] text-xl sm:text-3xl font-bold tracking-wide whitespace-nowrap">Monlix</span>
          </div>
          {/* MyLead */}
          <div className="flex items-center gap-2 shrink-0">
            <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
              <circle cx="14" cy="8" r="5" fill="#3E4262"/>
              <path d="M14 15v14" stroke="#3E4262" strokeWidth="3" strokeLinecap="round"/>
              <path d="M10 20h8" stroke="#3E4262" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="14" cy="31" r="2.5" fill="#3E4262"/>
            </svg>
            <span className="text-[#3E4262] text-xl sm:text-3xl font-bold tracking-wide whitespace-nowrap">MyLead</span>
          </div>
          {/* GemiAd */}
          <div className="flex items-center gap-2 shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="8" cy="8" r="4.5" fill="#3E4262"/>
              <circle cx="24" cy="8" r="4.5" fill="#3E4262"/>
              <circle cx="8" cy="24" r="4.5" fill="#3E4262"/>
              <circle cx="24" cy="24" r="4.5" fill="#3E4262"/>
              <circle cx="16" cy="16" r="4.5" fill="#3E4262"/>
            </svg>
            <span className="text-[#3E4262] text-xl sm:text-3xl font-bold tracking-wide whitespace-nowrap">GemiAd</span>
          </div>
          {/* Fourth partner icon (scrolling lines + circle) */}
          <div className="flex items-center shrink-0">
            <svg width="48" height="36" viewBox="0 0 48 36" fill="none">
              <path d="M4 8h32" stroke="#3E4262" strokeWidth="3" strokeLinecap="round"/>
              <path d="M4 16h28" stroke="#3E4262" strokeWidth="3" strokeLinecap="round"/>
              <path d="M4 24h24" stroke="#3E4262" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="40" cy="8" r="6" stroke="#2DAD97" strokeWidth="2" fill="none"/>
              <path d="M40 5v6M37 8h6" stroke="#2DAD97" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ═══════ EARN BY COMPLETING TASKS ═══════ */}
      <section className="max-w-[1312px] mx-auto px-4 py-10 sm:py-16">
        <h2 className="text-3xl sm:text-5xl font-semibold text-center tracking-tight mb-8 sm:mb-10 animate-fadeInUp">
          Earn by Completing{' '}
          <span className="text-[#18C2A3]">Simple Tasks</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              img: '/img12.png',
              title: 'Answer Surveys',
              desc: 'Share your opinion in short, verified surveys and earn cash instantly. Clear rewards, no guessing.',
            },
            {
              img: '/img13.png',
              title: 'Play Games',
              desc: 'Play popular games, reach milestones, and get rewarded. The more you play, the more you earn.',
            },
            {
              img: '/img14.png',
              title: 'Complete Offers',
              desc: 'Sign up, test apps, or complete simple forms to earn easy rewards in just a few clicks.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#111324] rounded-2xl overflow-hidden hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(24,194,163,0.12)] transition-all duration-300">
              <div className="h-[180px] sm:h-[270px] flex items-center justify-center p-4 sm:p-6">
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-full object-contain"
                />
              </div>
              <div className="text-center px-4 sm:px-6 pb-6 sm:pb-8">
                <h3 className="text-white text-xl sm:text-2xl font-semibold">
                  {item.title}
                </h3>
                <p className="text-[#6B6E8A] text-sm mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="bg-[#111324] py-12 sm:py-20">
        <div className="max-w-[1312px] mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-semibold text-center tracking-tight mb-8 sm:mb-12 animate-fadeIn">
            What people are saying{' '}
            <span className="text-[#18C2A3]">about us</span>
          </h2>
          <div className="overflow-hidden" ref={testimonialRef}>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: isMobile
                  ? `translateX(-${testimonialSlide * 100}%)`
                  : `translateX(-${testimonialSlide * (100 / Math.ceil(testimonials.length / 3))}%)`,
              }}
            >
              {/* On mobile: 1 per slide, sm+: 3 per slide — handled via CSS */}
              {testimonials.map((t, i) => (
                <div key={i} className="min-w-full sm:min-w-[33.333%] shrink-0 px-2">
                  <TestimonialCard {...t} />
                </div>
              ))}
            </div>
          </div>
          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setTestimonialSlide((p) => (p <= 0 ? maxSlide : p - 1))}
              className="w-11 h-11 bg-[#26293E] border border-[#3A3E57] rounded-md flex items-center justify-center hover:bg-[#30334A] transition-colors"
            >
              <svg width="15" height="13" viewBox="0 0 15 13" fill="none">
                <path d="M14 6.5H1M1 6.5L6.5 1M1 6.5L6.5 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex gap-1">
              {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => setTestimonialSlide(i)}
                  className={`h-1 rounded-full cursor-pointer transition-all duration-300 ${
                    i === testimonialSlide ? 'w-5 bg-[#2DAD97]' : 'w-3.5 bg-[#30334A]'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setTestimonialSlide((p) => (p >= maxSlide ? 0 : p + 1))}
              className="w-11 h-11 bg-[#26293E] border border-[#3A3E57] rounded-md flex items-center justify-center hover:bg-[#30334A] transition-colors"
            >
              <svg width="15" height="13" viewBox="0 0 15 13" fill="none">
                <path d="M1 6.5H14M14 6.5L8.5 1M14 6.5L8.5 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section className="py-12 sm:py-20">
        <div className="max-w-[1312px] mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-semibold text-center tracking-tight mb-8 sm:mb-12 animate-fadeInUp">
            You can be part of our{' '}
            <span className="text-[#18C2A3]">earners</span>
          </h2>
          <div className="bg-[#111324] rounded-2xl px-4 sm:px-8 py-10 sm:py-16">
            <div className="divide-y divide-[#26293E] sm:divide-y-0 sm:grid sm:grid-cols-4 sm:gap-8">
              <div className="py-6 first:pt-0 sm:py-0">
                <StatCard
                  icon={
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                  }
                  value="€5M"
                  label="Total rewards Earned"
                />
              </div>
              <div className="py-6 sm:py-0">
                <StatCard
                  icon={
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
                      <path d="M12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  }
                  value="€23.5"
                  label="Average money earned"
                />
              </div>
              <div className="py-6 sm:py-0">
                <StatCard
                  icon={
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  }
                  value="23,057"
                  label="Total users"
                />
              </div>
              <div className="py-6 last:pb-0 sm:py-0">
                <StatCard
                  icon={
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
                    </svg>
                  }
                  value="16,000"
                  label="Tasks completed"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="max-w-[1312px] mx-auto px-4 py-10 sm:py-16">
        <h2 className="text-3xl sm:text-5xl font-semibold text-center tracking-tight mb-8 sm:mb-12 animate-fadeInUp">
          Frequently Asked Questions
        </h2>
        <div className="flex gap-6 sm:gap-10 flex-col lg:flex-row">
          {/* FAQ Image - hidden on mobile */}
          <div className="hidden lg:block lg:w-[380px] shrink-0">
            <img
              src="/img18.png"
              alt="FAQ characters"
              className="w-full rounded-2xl object-cover"
            />
          </div>
          {/* FAQ Items */}
          <div className="flex-1">
            {faqData.map((item, i) => (
              <FAQItem
                key={i}
                q={item.q}
                a={item.a}
                open={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ REWARDS SECTION ═══════ */}
      <section className="max-w-[1312px] mx-auto px-4 py-10 sm:py-16">
        <h2 className="text-3xl sm:text-5xl font-semibold text-center tracking-tight mb-8 sm:mb-12 animate-fadeInUp">
          One Platform,{' '}
          <span className="text-[#18C2A3]">multiple Rewards</span>
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 max-w-[860px] mx-auto">
          {/* Row 1 */}
          {/* VISA */}
          <RewardBox className="w-full aspect-[1.2/1] sm:aspect-square p-4">
            <svg width="58" height="20" viewBox="0 0 54 18" fill="none">
              <path d="M20.7 0.6L13.5 17.4H8.9L5.4 3.8C5.2 3 4.9 2.6 4.3 2.3C3.3 1.8 1.7 1.3 0.3 1L0.4 0.6H7.8C8.7 0.6 9.5 1.2 9.7 2.2L11.4 11.4L15.9 0.6H20.7ZM37 11.8C37 7.3 30.7 7.1 30.7 5.1C30.7 4.5 31.3 3.8 32.5 3.7C33.8 3.5 35.6 3.8 37 4.5L37.7 1.2C36.3 0.7 34.7 0.3 32.7 0.3C28.2 0.3 25 2.8 25 6.3C25 8.9 27.3 10.3 29 11.2C30.8 12.1 31.4 12.7 31.4 13.5C31.4 14.7 30 15.2 28.7 15.2C27 15.2 25.2 14.7 23.8 14L23.1 17.4C24.7 18.1 27 18.4 29.2 18.4C34 18.4 37 16 37 11.8ZM47.3 17.4H51.3L47.8 0.6H44.1C43.3 0.6 42.6 1.1 42.3 1.8L35.7 17.4H40.5L41.4 14.8H47.2L47.3 17.4ZM42.7 11.2L45.2 4.4L46.6 11.2H42.7ZM23 0.6L19.2 17.4H14.6L18.4 0.6H23Z" fill="white"/>
            </svg>
          </RewardBox>
          {/* Bitcoin */}
          <RewardBox className="w-full aspect-[1.2/1] sm:aspect-square p-4">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="21" stroke="#F7931A" strokeWidth="2.5" fill="none"/>
              <path d="M30.5 21.2c.5-3.2-2-4.9-5.3-6l1.1-4.4-2.6-.7-1.1 4.3c-.7-.2-1.4-.3-2.1-.5l1.1-4.3-2.6-.7-1.1 4.4c-.6-.1-1.1-.3-1.6-.4l-3.6-.9-.7 2.8s2 .5 1.9.5c1.1.3 1.3 1 1.2 1.5l-1.2 5c.1 0 .2 0 .3.1h-.3l-1.7 6.9c-.1.3-.4.8-1.1.6 0 0-1.9-.5-1.9-.5l-1.3 3 3.4.8c.6.2 1.3.3 1.9.5l-1.1 4.4 2.6.7 1.1-4.4c.7.2 1.4.4 2.1.5l-1.1 4.4 2.6.7 1.1-4.4c4.5.9 7.9.5 9.3-3.6 1.1-3.3-.1-5.2-2.4-6.4 1.7-.4 3-1.6 3.4-4zm-6 8.5c-.8 3.2-6.2 1.5-7.9 1l1.4-5.7c1.8.4 7.4 1.3 6.5 4.7zm.8-8.5c-.7 2.9-5.2 1.4-6.6 1l1.3-5.1c1.5.4 6.2 1 5.3 4.1z" fill="#F7931A"/>
            </svg>
          </RewardBox>
          {/* Apple */}
          <RewardBox className="w-full aspect-[1.2/1] sm:aspect-square p-4">
            <svg width="40" height="48" viewBox="0 0 42 52" fill="white">
              <path d="M34.8 43.2c-1.9 2.8-3.9 5.5-6.9 5.6-3 .1-4-1.8-7.4-1.8-3.4 0-4.5 1.7-7.3 1.9-2.9.1-5.2-3-7.1-5.8C2 35.6-.6 26.4 3.5 20.2c2.1-3 5.7-5 9.7-5 2.9 0 5.7 2 7.4 2 1.8 0 5.2-2.4 8.8-2.1 1.5.1 5.7.6 8.4 4.4-.2.1-5 2.9-5 8.7 0 6.9 6.1 9.3 6.2 9.3 0 .2-1 3.3-3.4 6.5l.2.2zM25.8 0c-3.5.1-7.5 2.3-9.9 5.3-2.1 2.6-3.9 6.4-3.4 10.1 3.8.3 7.8-2 10.2-5.1 2.2-2.7 3.8-6.4 3.1-10.3z"/>
            </svg>
          </RewardBox>
          {/* Asterisk / Star burst */}
          <RewardBox className="hidden sm:flex w-full aspect-[1.2/1] sm:aspect-square p-4">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <line x1="22" y1="2" x2="22" y2="42" stroke="#18C2A3" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="2" y1="22" x2="42" y2="22" stroke="#18C2A3" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="7.8" y1="7.8" x2="36.2" y2="36.2" stroke="#18C2A3" strokeWidth="3.5" strokeLinecap="round"/>
              <line x1="36.2" y1="7.8" x2="7.8" y2="36.2" stroke="#18C2A3" strokeWidth="3.5" strokeLinecap="round"/>
              <circle cx="22" cy="2" r="3.5" fill="#18C2A3"/>
              <circle cx="22" cy="42" r="3.5" fill="#18C2A3"/>
              <circle cx="2" cy="22" r="3.5" fill="#18C2A3"/>
              <circle cx="42" cy="22" r="3.5" fill="#18C2A3"/>
              <circle cx="7.8" cy="7.8" r="3.5" fill="#18C2A3"/>
              <circle cx="36.2" cy="36.2" r="3.5" fill="#18C2A3"/>
              <circle cx="36.2" cy="7.8" r="3.5" fill="#18C2A3"/>
              <circle cx="7.8" cy="36.2" r="3.5" fill="#18C2A3"/>
            </svg>
          </RewardBox>
          {/* Dollar / Cash App */}
          <RewardBox className="hidden sm:flex w-full aspect-[1.2/1] sm:aspect-square p-4">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#3B3D55"/>
              <path d="M20 8v2m0 20v2m-5.5-16.5c0-2.5 2.5-3.5 5.5-3.5s5.5 1 5.5 3.5-2.5 3-5.5 3.5-5.5 1.5-5.5 4 2.5 3.5 5.5 3.5 5.5-1 5.5-3.5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </RewardBox>

          {/* Row 2 - hidden on mobile, visible on sm+ */}
          {/* Bitcoin (duplicate position - already shown above, this is for desktop row continuity) */}
          {/* Steam */}
          <RewardBox className="w-full aspect-[1.2/1] sm:aspect-square p-4">
            <svg width="44" height="44" viewBox="0 0 256 256" fill="white">
              <path d="M128 16C74.2 16 28.2 55.3 18.6 106.8l58.9 24.3c5.3-3.6 11.7-5.8 18.5-5.8 1 0 1.9 0 2.9.1l27.7-40.2v-.6c0-22.1 18-40 40.1-40s40.1 18 40.1 40-18 40-40.1 40c-.5 0-1 0-1.4 0l-39.5 28.2c0 .7.1 1.5.1 2.2 0 16.6-13.5 30.1-30.1 30.1-14.9 0-27.3-10.8-29.7-25.1L25.2 156C38.5 208.6 86.5 248 128 248c66.3 0 120-53.7 120-120S194.3 16 128 16zm-38.8 175.5l-12.4-5.1c2.3 4.8 6.2 8.8 11.2 11.2 10.8 5.1 23.7.5 28.7-10.3 2.4-5.2 2.5-10.9.1-16.2-2.4-5.2-6.8-9.1-12-11.5-5.2-2.4-10.6-2.3-15.5-.5l12.8 5.3c8 3.3 11.7 12.4 8.4 20.3-3.3 7.9-12.4 11.7-20.3 8.4l-1-.6zm92.4-94.2c0-14.7-12-26.7-26.7-26.7s-26.7 12-26.7 26.7 12 26.7 26.7 26.7 26.7-12 26.7-26.7zm-46.7 0c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z"/>
            </svg>
          </RewardBox>
          {/* Solana */}
          <RewardBox className="w-full aspect-[1.2/1] sm:aspect-square p-4">
            <svg width="40" height="32" viewBox="0 0 398 312" fill="white">
              <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/>
              <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/>
              <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/>
            </svg>
          </RewardBox>
          {/* Google Play */}
          <RewardBox className="w-full aspect-[1.2/1] sm:aspect-square p-4">
            <svg width="40" height="44" viewBox="0 0 512 512" fill="none">
              <path d="M48 16.3v479.4L288 256 48 16.3z" fill="white" opacity="0.9"/>
              <path d="M48 16.3L330.7 178l-42.7 78L48 16.3z" fill="white" opacity="0.7"/>
              <path d="M48 495.7l240-239.7 42.7 78L48 495.7z" fill="white" opacity="0.7"/>
              <path d="M330.7 178l42.7 78 90.6-44L330.7 178z" fill="white" opacity="0.5"/>
              <path d="M330.7 334l42.7-78 90.6 44-133.3 34z" fill="white" opacity="0.5"/>
            </svg>
          </RewardBox>
          {/* Nike */}
          <RewardBox className="hidden sm:flex w-full aspect-[1.2/1] sm:aspect-square p-4">
            <svg width="48" height="20" viewBox="0 0 100 36" fill="white">
              <path d="M4.5 29.5C10 21.5 21 13 33.5 9c8.5-2.7 14 .5 15 4-4 1-14 6-24 14.5L4.5 29.5zM48.5 13c2 3.5-.5 9-8.5 16L96 6 48.5 13z"/>
            </svg>
          </RewardBox>
          {/* Octagon / Polygon */}
          <RewardBox className="hidden sm:flex w-full aspect-[1.2/1] sm:aspect-square p-4">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M13 2h14l11 11v14l-11 11H13L2 27V13L13 2z" stroke="white" strokeWidth="2.5" fill="none"/>
              <path d="M16 10h8l6 6v8l-6 6h-8l-6-6v-8l6-6z" stroke="white" strokeWidth="2" fill="none"/>
            </svg>
          </RewardBox>
        </div>
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section className="max-w-[1312px] mx-auto px-4 py-10 sm:py-16">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#1a3a2e] to-[#111324]">
          <img
            src="/img19.png"
            alt=""
            className="w-full h-[250px] sm:h-[350px] object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 animate-fadeInUp">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Start Earning Real Rewards Today
            </h2>
            <p className="text-[#B3B6C7] text-sm sm:text-base max-w-[520px] mb-5 sm:mb-8 leading-relaxed">
              Join thousands completing simple tasks, playing games, and
              answering surveys to earn real cash and rewards. It only takes a
              few minutes to get started.
            </p>
            <button className="px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-white text-[#0D0F1E] font-bold text-sm sm:text-base hover:bg-[#18C2A3] hover:text-white transition-colors duration-300 hover:shadow-[0_0_30px_rgba(24,194,163,0.4)]">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-[#0D0F1E] border-t border-[#1C1E32] pt-10 sm:pt-16 pb-20 sm:pb-8">
        <div className="max-w-[1312px] mx-auto px-4">

          {/* ── MOBILE FOOTER ── */}
          <div className="sm:hidden flex flex-col items-center">
            {/* Logo */}
            <img src="/landing-image-003.png" alt="Lab Wards" className="h-9 mb-5" />
            {/* Trustpilot */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-6 h-6 ${i < 4 ? 'bg-[#00B67A]' : 'bg-[#00B67A]/60'} flex items-center justify-center`}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                    <path d="M7 1l1.7 3.5 3.8.6-2.7 2.7.6 3.8L7 9.8l-3.4 1.8.6-3.8L1.5 5.1l3.8-.6L7 1z" />
                  </svg>
                </div>
              ))}
            </div>
            <p className="text-[#B3B6C7] text-sm mb-8">
              <span className="font-semibold">TrustScore 4.5</span> | 200 reviews
            </p>

            {/* Two columns: Platform + User Center */}
            <div className="w-full grid grid-cols-2 gap-8 mb-8 px-4">
              <div>
                <h4 className="text-white font-semibold text-lg mb-4">Platform</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0AC07D" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> Earn
                  </a></li>
                  <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0AC07D" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="6"/><path d="M9 18h6M12 14v4"/></svg> Leaderboards
                  </a></li>
                  <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0AC07D" strokeWidth="2" strokeLinecap="round"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8V5c0-1.7 1.3-3 3-3M12 8V5c0-1.7-1.3-3-3-3"/></svg> Rewards
                  </a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg mb-4">User Center</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0AC07D" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Account
                  </a></li>
                  <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0AC07D" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg> Transactions
                  </a></li>
                  <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0AC07D" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg> FAQ
                  </a></li>
                  <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0AC07D" strokeWidth="2" strokeLinecap="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg> Support
                  </a></li>
                </ul>
              </div>
            </div>

            {/* Terms */}
            <div className="text-center mb-8">
              <h4 className="text-[#18C2A3] font-semibold text-lg mb-4">Terms</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white inline-flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0AC07D" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg> Services Terms
                </a></li>
                <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white inline-flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0AC07D" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Privacy
                </a></li>
                <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white inline-flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0AC07D" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> Cookie policy
                </a></li>
              </ul>
            </div>

            {/* Bottom */}
            <div className="border-t border-[#1C1E32] pt-6 w-full flex flex-col items-center gap-4">
              <p className="text-[#B3B6C7] text-sm">©2026 Lab Wards, All Rights Reserved</p>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[#26293E] border border-[#3A3E57] rounded-lg flex items-center justify-center cursor-pointer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <div className="w-10 h-10 bg-[#26293E] border border-[#3A3E57] rounded-lg flex items-center justify-center cursor-pointer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
                </div>
                <div className="w-10 h-10 bg-[#26293E] border border-[#3A3E57] rounded-lg flex items-center justify-center cursor-pointer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-[#26293E] border border-[#3A3E57] rounded-lg text-[#B3B6C7] text-xs flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  English
                </button>
                <button className="px-4 py-2 bg-[#26293E] border border-[#3A3E57] rounded-lg text-[#B3B6C7] text-xs flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  Light
                </button>
              </div>
            </div>
          </div>

          {/* ── DESKTOP FOOTER ── */}
          <div className="hidden sm:block">
            <div className="flex flex-wrap gap-12 mb-12">
              {/* Brand */}
              <div className="flex-1 min-w-[260px]">
                <img src="/landing-image-003.png" alt="Lab Wards" className="h-9 mb-4" />
                {/* Trustpilot */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-6 h-6 ${i < 4 ? 'bg-[#00B67A]' : 'bg-[#00B67A]/60'} flex items-center justify-center`}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                        <path d="M7 1l1.7 3.5 3.8.6-2.7 2.7.6 3.8L7 9.8l-3.4 1.8.6-3.8L1.5 5.1l3.8-.6L7 1z" />
                      </svg>
                    </div>
                  ))}
                </div>
                <p className="text-[#B3B6C7] text-sm mb-4">
                  <span className="font-semibold">TrustScore 4.5</span> | 200 reviews
                </p>
                <p className="text-[#B3B6C7] text-sm max-w-[320px] leading-relaxed">
                  Sign up today and grab your instant bonus. Every task completed puts money in your pocket.
                </p>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-4">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white">FAQ</a></li>
                </ul>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-4">Features</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white">Games</a></li>
                  <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white">Rewards</a></li>
                  <li><a href="#" className="text-[#B3B6C7] text-sm hover:text-white">Tasks</a></li>
                </ul>
              </div>

              {/* Connect */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-4">Connect With Us</h4>
                <div className="flex gap-3 mb-6">
                  {[
                    <svg key="star" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
                    <svg key="circle" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>,
                    <svg key="discord" width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>,
                  ].map((icon, i) => (
                    <div key={i} className="w-11 h-11 bg-[#26293E] border border-[#3A3E57] rounded-lg flex items-center justify-center cursor-pointer">
                      {icon}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-[#26293E] border border-[#3A3E57] rounded-lg text-[#B3B6C7] text-xs flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    English
                  </button>
                  <button className="px-4 py-2 bg-[#26293E] border border-[#3A3E57] rounded-lg text-[#B3B6C7] text-xs flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    Light
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[#1C1E32] pt-6 flex flex-wrap justify-between items-center">
              <p className="text-[#B3B6C7] text-sm">©2026 Lab Wards, All Rights Reserved</p>
              <div className="flex gap-5">
                <a href="#" className="text-[#B3B6C7] text-sm hover:text-white">Terms of Use</a>
                <a href="#" className="text-[#B3B6C7] text-sm hover:text-white">Privacy Policy</a>
                <a href="#" className="text-[#B3B6C7] text-sm hover:text-white">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>

        {/* Big LAB WARDS text at bottom */}
        <div className="mt-12 text-center overflow-hidden">
          <h1 className="text-[48px] sm:text-[80px] md:text-[120px] font-extrabold tracking-wide text-[#16192E] leading-none">
            LAB WARDS
          </h1>
        </div>
      </footer>

      {/* ═══════ MOBILE BOTTOM NAV ═══════ */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#111324] border-t border-[#1C1E32] flex items-center justify-around py-2 z-50">
        <a href="#" className="flex flex-col items-center gap-0.5 text-[#0AC07D]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-[10px] font-medium">Home</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-0.5 text-[#6B6E8A]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span className="text-[10px]">Earn</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-0.5 text-[#6B6E8A]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/>
          </svg>
          <span className="text-[10px]">Tasks</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-0.5 text-[#6B6E8A]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <span className="text-[10px]">Surveys</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-0.5 text-[#6B6E8A]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <span className="text-[10px]">Menu</span>
        </a>
      </nav>
    </div>
  );
};

export default LANDINGPAGEComponent;

