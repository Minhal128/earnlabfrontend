"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
  avatarUrl,
  name,
  country,
  text,
  amount,
  activityDate,
}: {
  avatarUrl?: string | null;
  name: string;
  country: string;
  text: string;
  amount: string;
  activityDate: string;
}) => (
  <div className="bg-[#16182A] border border-[#26293E] rounded-xl p-3 sm:p-4 flex flex-col gap-2.5 sm:gap-3 h-full">
    <div className="flex items-center gap-2.5 sm:gap-3">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover"
        />
      ) : (
        <div
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 ring-1 ring-white/10 overflow-hidden flex items-center justify-center"
          style={{ background: getGeneratedAvatarBackground(name) }}
          aria-label={`${name} generated avatar`}
        >
          <div
            aria-hidden="true"
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white/25"
          />
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
      <div>
        <p className="text-white font-semibold text-[13px] sm:text-sm">{name}</p>
        <p className="text-[#B3B6C7] text-[10px] sm:text-[11px] flex items-center gap-1.5">
          <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#0AC07D"/></svg> {country}
        </p>
      </div>
    </div>
    <p className="text-[#B3B6C7] text-[12px] sm:text-[13px] leading-5">{text}</p>
    <div className="flex items-center justify-between text-[11px] text-[#8C8FA8] pt-1">
      <span>{activityDate}</span>
      <span className="text-[#0AC07D] font-semibold">{amount}</span>
    </div>
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
type RecentActivityResponse = {
  activities?: Array<{
    type?: 'payout' | 'earning' | 'referral';
    username?: string;
    avatarUrl?: string | null;
    countryCode?: string | null;
    countryName?: string | null;
    amount?: number;
    method?: string;
    offerName?: string;
    provider?: string;
    timestamp?: string;
  }>;
  stats?: {
    totalPayout24hCents?: number;
    completedPayouts24hCount?: number;
    totalRewardsEarnedCents?: number;
    averageMoneyEarnedCents?: number;
    tasksCompletedCount?: number;
  };
};

type LandingActivity = NonNullable<
  NonNullable<RecentActivityResponse['activities']>[number]
>;

type LandingViewModel = {
  activities: LandingActivity[];
  stats: {
    totalPayout24hCents: number | null;
    completedPayouts24hCount: number | null;
    totalRewardsEarnedCents: number | null;
    averageMoneyEarnedCents: number | null;
    tasksCompletedCount: number | null;
  };
};

const LANDING_BACKEND_CHECK_TIMEOUT_MS = 3_000;

const MOCK_LANDING_VIEW_MODEL: LandingViewModel = {
  activities: [
    {
      type: 'payout',
      username: 'Ava',
      countryCode: 'US',
      countryName: 'United States',
      amount: 80,
      method: 'paypal',
      timestamp: '2026-04-09T08:15:00.000Z',
    },
    {
      type: 'earning',
      username: 'Liam',
      countryCode: 'GB',
      countryName: 'United Kingdom',
      amount: 50,
      provider: 'Offerwall',
      timestamp: '2026-04-09T08:42:00.000Z',
    },
    {
      type: 'payout',
      username: 'Noah',
      countryCode: 'DE',
      countryName: 'Germany',
      amount: 120,
      method: 'bitcoin',
      timestamp: '2026-04-09T09:08:00.000Z',
    },
    {
      type: 'earning',
      username: 'Emma',
      countryCode: 'CA',
      countryName: 'Canada',
      amount: 65,
      provider: 'Survey',
      timestamp: '2026-04-09T09:24:00.000Z',
    },
    {
      type: 'payout',
      username: 'Mason',
      countryCode: 'AU',
      countryName: 'Australia',
      amount: 95,
      method: 'solana',
      timestamp: '2026-04-09T09:41:00.000Z',
    },
    {
      type: 'earning',
      username: 'Sophia',
      countryCode: 'IN',
      countryName: 'India',
      amount: 45,
      provider: 'Games',
      timestamp: '2026-04-09T10:03:00.000Z',
    },
    {
      type: 'payout',
      username: 'Ethan',
      countryCode: 'BR',
      countryName: 'Brazil',
      amount: 70,
      method: 'visa',
      timestamp: '2026-04-09T10:17:00.000Z',
    },
    {
      type: 'earning',
      username: 'Olivia',
      countryCode: 'FR',
      countryName: 'France',
      amount: 58,
      provider: 'Tasks',
      timestamp: '2026-04-09T10:34:00.000Z',
    },
  ],
  stats: {
    totalPayout24hCents: 12_500,
    completedPayouts24hCount: 42,
    totalRewardsEarnedCents: 68_900,
    averageMoneyEarnedCents: 235,
    tasksCompletedCount: 1_428,
  },
};

const normalizeRecentActivityResponse = (
  data: RecentActivityResponse | null
): LandingViewModel => {
  const activities = Array.isArray(data?.activities)
    ? data.activities.filter(
        (activity): activity is LandingActivity =>
          typeof activity?.username === 'string' &&
          typeof activity?.amount === 'number'
      )
    : [];

  return {
    activities,
    stats: {
      totalPayout24hCents:
        typeof data?.stats?.totalPayout24hCents === 'number'
          ? data.stats.totalPayout24hCents
          : null,
      completedPayouts24hCount:
        typeof data?.stats?.completedPayouts24hCount === 'number'
          ? data.stats.completedPayouts24hCount
          : null,
      totalRewardsEarnedCents:
        typeof data?.stats?.totalRewardsEarnedCents === 'number'
          ? data.stats.totalRewardsEarnedCents
          : null,
      averageMoneyEarnedCents:
        typeof data?.stats?.averageMoneyEarnedCents === 'number'
          ? data.stats.averageMoneyEarnedCents
          : null,
      tasksCompletedCount:
        typeof data?.stats?.tasksCompletedCount === 'number'
          ? data.stats.tasksCompletedCount
          : null,
    },
  };
};

const hasUsableBackendContent = (payload: LandingViewModel): boolean => {
  if (payload.activities.length > 0) {
    return true;
  }

  return [
    payload.stats.totalPayout24hCents,
    payload.stats.completedPayouts24hCount,
    payload.stats.totalRewardsEarnedCents,
    payload.stats.averageMoneyEarnedCents,
    payload.stats.tasksCompletedCount,
  ].some((value) => typeof value === 'number' && value > 0);
};

const formatCurrencyFromCents = (value: number | null | undefined): string =>
  typeof value === 'number'
    ? `$${(value / 100).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : '—';

const formatCountryLabel = (activity: LandingActivity): string => {
  const explicitCountry = activity.countryName?.trim();
  if (explicitCountry) {
    return explicitCountry;
  }

  const code = activity.countryCode?.trim().toUpperCase();
  if (!code) {
    return 'Country unavailable';
  }

  try {
    const displayName = new Intl.DisplayNames(['en'], { type: 'region' }).of(
      code
    );
    return displayName || code;
  } catch {
    return code;
  }
};

const formatActivitySummary = (activity: LandingActivity): string => {
  if (activity.type === 'payout') {
    const payoutMethod = activity.method?.replace('_', ' ') || 'wallet payout';
    return `Completed a ${payoutMethod} withdrawal`;
  }

  if (activity.type === 'earning') {
    const source = activity.provider || activity.offerName || 'offerwall task';
    return `Earned rewards from ${source}`;
  }

  return 'Received a referral reward payout';
};

const formatActivityDate = (value: string | undefined): string => {
  if (!value) {
    return 'Recently';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const getGeneratedAvatarBackground = (seed: string): string => {
  const safeSeed = seed || 'user';
  const hash = safeSeed
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const primaryHue = hash % 360;
  const secondaryHue = (primaryHue + 44) % 360;

  return `linear-gradient(135deg, hsl(${primaryHue} 68% 46%) 0%, hsl(${secondaryHue} 72% 38%) 100%)`;
};

const resolveLandingApiBaseUrl = (): string => {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : 'https://earnlabbackend.vercel.app';
};



const REWARD_LOGOS = [
  { id: 'visa', name: 'Visa', src: '/assets/visa.png' },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    src: '/assets/bit.png',
  },
  { id: 'apple', name: 'Apple', src: '/assets/apple.png' },
  {
    id: 'paypal',
    name: 'PayPal',
    src: '/assets/paypal.png',
  },
  {
    id: 'worldcoin',
    name: 'Worldcoin',
    src: '/assets/worldcoin.png',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    src: '/assets/amazon.png',
  },
  { id: 'solana', name: 'Solana', src: '/assets/sol.png' },
  {
    id: 'playstation',
    name: 'PlayStation',
    src: '/assets/play.png',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    src: '/assets/spot.png',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    src: '/assets/pol.png',
  },
];

const LANDINGPAGEComponent = () => {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [recentActivities, setRecentActivities] = useState<LandingActivity[]>([]);
  const [totalPayout24hCents, setTotalPayout24hCents] = useState<number | null>(null);
  const [completedPayouts24hCount, setCompletedPayouts24hCount] = useState<number | null>(null);
  const [totalRewardsEarnedCents, setTotalRewardsEarnedCents] = useState<number | null>(null);
  const [averageMoneyEarnedCents, setAverageMoneyEarnedCents] = useState<number | null>(null);
  const [tasksCompletedCount, setTasksCompletedCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const applyLandingPayload = (payload: LandingViewModel) => {
      if (!active) {
        return;
      }

      setTotalPayout24hCents(payload.stats.totalPayout24hCents);
      setCompletedPayouts24hCount(payload.stats.completedPayouts24hCount);
      setTotalRewardsEarnedCents(payload.stats.totalRewardsEarnedCents);
      setAverageMoneyEarnedCents(payload.stats.averageMoneyEarnedCents);
      setTasksCompletedCount(payload.stats.tasksCompletedCount);
      setRecentActivities(payload.activities);
    };

    const fetchPayoutSummary = async () => {
      const primaryApi = resolveLandingApiBaseUrl();
      const apiCandidates = [primaryApi, 'https://earnlabbackend.vercel.app'].filter(
        (api, index, self) => self.indexOf(api) === index
      );

      const deadline = Date.now() + LANDING_BACKEND_CHECK_TIMEOUT_MS;
      let backendPayload: RecentActivityResponse | null = null;

      for (const api of apiCandidates) {
        const remainingMs = deadline - Date.now();

        if (remainingMs <= 0) {
          break;
        }

        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), remainingMs);

        try {
          const response = await fetch(
            `${api}/api/v1/offerwalls/recent-activity?limit=60`,
            {
              cache: 'no-store',
              signal: controller.signal,
            }
          );

          if (!response.ok) {
            continue;
          }

          backendPayload = (await response.json()) as RecentActivityResponse;
          break;
        } catch {
          continue;
        } finally {
          window.clearTimeout(timeoutId);
        }
      }

      const normalizedBackendPayload = normalizeRecentActivityResponse(backendPayload);
      applyLandingPayload(
        hasUsableBackendContent(normalizedBackendPayload)
          ? normalizedBackendPayload
          : MOCK_LANDING_VIEW_MODEL
      );
    };

    fetchPayoutSummary();
    const interval = window.setInterval(fetchPayoutSummary, 60_000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const launchUserCount = 100;

  const payoutActivities = recentActivities.slice(0, 8);

  const totalPayout24hText =
    typeof totalPayout24hCents === 'number'
      ? formatCurrencyFromCents(totalPayout24hCents)
      : 'Live data unavailable';
  const totalRewardsEarnedText = formatCurrencyFromCents(totalRewardsEarnedCents);
  const averageMoneyEarnedText = formatCurrencyFromCents(averageMoneyEarnedCents);
  const tasksCompletedText =
    typeof tasksCompletedCount === 'number'
      ? tasksCompletedCount.toLocaleString('en-US')
      : '—';
  const launchUserCountText = launchUserCount.toLocaleString('en-US');

  const splitIndex = Math.max(1, Math.ceil(payoutActivities.length / 2));
  const payoutRowOneActivities = payoutActivities.slice(0, splitIndex);
  const payoutRowTwoActivities =
    payoutActivities.slice(splitIndex).length > 0
      ? payoutActivities.slice(splitIndex)
      : payoutRowOneActivities;

  const activitiesForTestimonials = (() => {
    const result: LandingActivity[] = [];
    const seenCountries = new Set<string>();

    for (const activity of recentActivities) {
      const countryKey =
        activity.countryCode?.toUpperCase() || activity.countryName || '';
      if (!countryKey || seenCountries.has(countryKey)) {
        continue;
      }
      seenCountries.add(countryKey);
      result.push(activity);

      if (result.length >= 6) {
        break;
      }
    }

    if (result.length < 6) {
      for (const activity of recentActivities) {
        const alreadyIncluded = result.some(
          (item) =>
            item.username === activity.username &&
            item.timestamp === activity.timestamp
        );

        if (!alreadyIncluded) {
          result.push(activity);
        }

        if (result.length >= 6) {
          break;
        }
      }
    }

    return result;
  })();

  const getPayoutItemMeta = (activity: LandingActivity) => {
    if (activity.type === 'payout') {
      return {
        icon: <GlobeIcon />,
        label: `${activity.username} withdrew`,
        name: activity.method?.replace('_', ' ') || 'Wallet payout',
      };
    }

    if (activity.type === 'earning') {
      return {
        icon: <ClipboardIcon />,
        label: `${activity.username} earned`,
        name: activity.provider || activity.offerName || 'Offerwall',
      };
    }

    return {
      icon: <SolanaCircleIcon />,
      label: `${activity.username} referred`,
      name: 'Referral reward',
    };
  };

  return (
    <div className="w-full min-h-screen bg-[#0D0F1E] text-white font-['DM_Sans',sans-serif] overflow-x-hidden pb-16 sm:pb-0">
      {/* ═══════ NAVBAR ═══════ */}
      <nav className="w-full bg-[#16192E] px-4 sm:px-10 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-50">
        <img src="/landing-image-003.png" alt="Lab Wards" className="h-7 sm:h-9" />
        {/* Mobile hamburger */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="sm:hidden w-10 h-10 bg-[#26293E] rounded-lg flex items-center justify-center">
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M1 1h16M1 7h16M1 13h16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {/* Desktop buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button onClick={() => router.push('/sigin')} className="px-6 py-3 rounded-full border border-[#3A3E57] bg-[#30334A] text-white font-bold text-sm">
            Sign in
          </button>
          <button onClick={() => router.push('/signup')} className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0AC07D] to-[#14A990] text-white font-bold text-sm shadow-[0_9px_24px_rgba(20,169,144,0.3)]">
            Sign up
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0D0F1E] flex flex-col p-4 sm:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between mb-8">
            <img src="/landing-image-003.png" alt="Lab Wards" className="h-7" />
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="w-10 h-10 bg-[#26293E] rounded-lg flex items-center justify-center text-[#8C8FA8]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 1L13 13M1 13L13 1" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            <button onClick={() => { setIsMobileMenuOpen(false); router.push('/sigin'); }} className="w-full py-4 text-center rounded-xl border border-[#3A3E57] bg-[#30334A] text-white font-bold text-lg">
              Sign in
            </button>
            <button onClick={() => { setIsMobileMenuOpen(false); router.push('/signup'); }} className="w-full py-4 text-center rounded-xl bg-gradient-to-r from-[#0AC07D] to-[#14A990] text-white font-bold text-lg shadow-[0_9px_24px_rgba(20,169,144,0.3)]">
              Sign up
            </button>
          </div>
        </div>
      )}

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
          <button onClick={() => router.push('/signup')} className="mt-5 sm:mt-7 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-[#0AC07D] to-[#14A990] text-white font-bold shadow-[0_9px_24px_rgba(20,169,144,0.3)] text-sm sm:text-base hover:scale-105 hover:shadow-[0_12px_32px_rgba(20,169,144,0.5)] transition-all duration-300">
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
                {totalPayout24hText}
              </h3>
              <p className="text-[#8C8FA8] text-xs text-center">
                Total payouts made in the last 24 hours
              </p>
            </div>

            {/* Mobile: 2x2 grid */}
            <div className="sm:hidden flex flex-col gap-3">
              {payoutActivities.length === 0 ? (
                <div className="rounded-xl border border-[#26293E] bg-[#181A2C] px-4 py-5 text-center text-[#8C8FA8] text-sm">
                  Live payout events will appear here as soon as they are recorded.
                </div>
              ) : (
                payoutActivities.slice(0, 4).map((activity, index) => {
                  const meta = getPayoutItemMeta(activity);
                  return (
                    <PayoutItem
                      key={`mobile-payout-${activity.username}-${activity.timestamp}-${index}`}
                      icon={meta.icon}
                      label={meta.label}
                      name={meta.name}
                      amount={formatCurrencyFromCents(activity.amount)}
                    />
                  );
                })
              )}
            </div>

            {/* Desktop: Ticker rows */}
            <div className="hidden sm:flex flex-1 flex-col gap-4 overflow-hidden">
              {payoutActivities.length === 0 ? (
                <div className="h-full rounded-xl border border-[#26293E] bg-[#181A2C] px-6 py-8 flex items-center justify-center text-[#8C8FA8] text-sm">
                  No payout activity has been published yet.
                </div>
              ) : (
                <>
                  <div className="flex gap-4 animate-slideRight">
                    {[...payoutRowOneActivities, ...payoutRowOneActivities].map(
                      (activity, index) => {
                        const meta = getPayoutItemMeta(activity);
                        return (
                          <PayoutItem
                            key={`desktop-payout-row-1-${activity.username}-${activity.timestamp}-${index}`}
                            icon={meta.icon}
                            label={meta.label}
                            name={meta.name}
                            amount={formatCurrencyFromCents(activity.amount)}
                          />
                        );
                      }
                    )}
                  </div>
                  <div className="flex gap-4 animate-slideLeft">
                    {[...payoutRowTwoActivities, ...payoutRowTwoActivities].map(
                      (activity, index) => {
                        const meta = getPayoutItemMeta(activity);
                        return (
                          <PayoutItem
                            key={`desktop-payout-row-2-${activity.username}-${activity.timestamp}-${index}`}
                            icon={meta.icon}
                            label={meta.label}
                            name={meta.name}
                            amount={formatCurrencyFromCents(activity.amount)}
                          />
                        );
                      }
                    )}
                  </div>
                </>
              )}
            </div>
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
          <h2 className="text-2xl sm:text-5xl font-semibold text-center tracking-tight mb-8 sm:mb-12 animate-fadeIn">
            What people are saying{' '}
            <span className="text-[#18C2A3]">about us</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {activitiesForTestimonials.length > 0 && (
              activitiesForTestimonials.slice(0, 8).map((activity, index) => (
                <div
                  key={`testimonial-activity-${activity.username}-${activity.timestamp}-${index}`}
                  className="h-full"
                >
                  <TestimonialCard
                    avatarUrl={activity.avatarUrl || null}
                    name={activity.username || 'User'}
                    country={formatCountryLabel(activity)}
                    text={formatActivitySummary(activity)}
                    amount={formatCurrencyFromCents(activity.amount)}
                    activityDate={formatActivityDate(activity.timestamp)}
                  />
                </div>
              ))
            )}
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
                  value={totalRewardsEarnedText}
                  label="Total rewards earned"
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
                  value={averageMoneyEarnedText}
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
                  value={launchUserCountText}
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
                  value={tasksCompletedText}
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
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-8 sm:gap-x-10 sm:gap-y-10 w-full mx-auto place-items-center">
          {REWARD_LOGOS.map((logo) => (
            <div
              key={logo.id}
              className="w-full min-h-[72px] sm:min-h-[96px] flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={`${logo.name} logo`}
                className={`w-auto max-w-[92%] h-10 sm:h-14 md:h-16 object-contain ${logo.id === 'worldcoin' ? 'invert brightness-200 mix-blend-screen' : ''}`}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
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
            <button onClick={() => router.push('/signup')} className="inline-block px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-white text-[#0D0F1E] font-bold text-sm sm:text-base hover:bg-[#18C2A3] hover:text-white transition-colors duration-300 hover:shadow-[0_0_30px_rgba(24,194,163,0.4)]">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Shared footer is rendered globally from src/app/layout.tsx */}

      {/* ═══════ MOBILE BOTTOM NAV ═══════ */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#111324] border-t border-[#1C1E32] flex items-center justify-around py-2 z-50">
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex flex-col items-center gap-0.5 text-[#0AC07D]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => router.push('/signup')} className="flex flex-col items-center gap-0.5 text-[#6B6E8A]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span className="text-[10px]">Earn</span>
        </button>
        <button onClick={() => router.push('/signup')} className="flex flex-col items-center gap-0.5 text-[#6B6E8A]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/>
          </svg>
          <span className="text-[10px]">Tasks</span>
        </button>
        <button onClick={() => router.push('/signup')} className="flex flex-col items-center gap-0.5 text-[#6B6E8A]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <span className="text-[10px]">Surveys</span>
        </button>
        <button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center gap-0.5 text-[#6B6E8A]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <span className="text-[10px]">Menu</span>
        </button>
      </nav>

    </div>
  );
};

export default LANDINGPAGEComponent;

