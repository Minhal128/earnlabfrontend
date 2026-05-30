"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "@/utils/toast";

/* ── CSS ─────────────────────────────────────────────────────────── */
const TICKER_CSS = `
@keyframes scrollLeft {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.survey-ticker {
  display: flex; gap: 12px; width: max-content;
  animation: scrollLeft 40s linear infinite;
}
.survey-ticker:hover { animation-play-state: paused; }
`;

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ── Types ───────────────────────────────────────────────────────── */
type SurveyQuestion = { id: string; prompt: string; placeholder: string; numericOnly?: boolean };
type SurveyProvider  = { id: string; name: string; logoUrl?: string; launchUrl?: string };
type OfferwallApiItem = {
  _id?: string; id?: string; name?: string; displayName?: string; type?: string;
  category?: string; logoUrl?: string; callbackUrl?: string;
  isActive?: boolean; status?: string;
  metadata?: { logoUrl?: string; launchUrl?: string; offerUrl?: string; referralUrl?: string };
};

/* ── Survey questions ────────────────────────────────────────────── */
const QUESTIONS: SurveyQuestion[] = [
  { id: "householdIncome", prompt: "My household earns approximately $ per year?",  placeholder: "Only numbers", numericOnly: true },
  { id: "ageRange",        prompt: "Which age range best describes me?",             placeholder: "Example: 25-34" },
  { id: "occupation",      prompt: "My current occupation is?",                     placeholder: "Example: Full-time employee" },
  { id: "education",       prompt: "What is your highest level of education?",      placeholder: "Example: Bachelor's degree" },
  { id: "country",         prompt: "Which country do you currently live in?",       placeholder: "Example: United States" },
  { id: "maritalStatus",   prompt: "What is your marital status?",                  placeholder: "Example: Married" },
  { id: "children",        prompt: "How many children do you have?",                placeholder: "Only numbers", numericOnly: true },
  { id: "employment",      prompt: "What is your employment status?",               placeholder: "Example: Full-time" },
  { id: "interests",       prompt: "What are your main hobbies or interests?",      placeholder: "Example: Gaming, Travel" },
];

/* ── Ticker data ─────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  { img: "/game-tile-tap-master.png", name: "Slots",      action: "User withdrew", amount: "$0.8" },
  { img: "/game-slot.png",            name: "Worldcoin",  action: "User withdrew", amount: "$0.5" },
  { img: "/game-monopoly.png",        name: "Slot",       action: "User withdrew", amount: "$0.8" },
  { img: "/game-torox.png",           name: "Monopoly",   action: "User withdrew", amount: "$0.8" },
  { img: "/game-angry-bird.png",      name: "Worldcoin",  action: "User withdrew", amount: "$0.8" },
  { img: "/game-big-giant.png",       name: "Big Giant",  action: "User earned",   amount: "$1.0" },
  // duplicate for seamless loop
  { img: "/game-tile-tap-master.png", name: "Slots",      action: "User withdrew", amount: "$0.8" },
  { img: "/game-slot.png",            name: "Worldcoin",  action: "User withdrew", amount: "$0.5" },
  { img: "/game-monopoly.png",        name: "Slot",       action: "User withdrew", amount: "$0.8" },
  { img: "/game-torox.png",           name: "Monopoly",   action: "User withdrew", amount: "$0.8" },
  { img: "/game-angry-bird.png",      name: "Worldcoin",  action: "User withdrew", amount: "$0.8" },
  { img: "/game-big-giant.png",       name: "Big Giant",  action: "User earned",   amount: "$1.0" },
];

/* ── Icons ───────────────────────────────────────────────────────── */
const IcoBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoCashout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M17.5 10.5C18.88 10.5 20 11.62 20 13V18C20 19.38 18.88 20.5 17.5 20.5H6.5C5.12 20.5 4 19.38 4 18V13C4 11.62 5.12 10.5 6.5 10.5H17.5ZM17.5 3.5C18.88 3.5 20 4.62 20 6V8.5H4V6C4 4.62 5.12 3.5 6.5 3.5H17.5Z" fill="white" />
  </svg>
);
const IcoHeadset = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 12C3 7.03 7.03 3 12 3s9 4.03 9 9v5a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h2v-1a7 7 0 0 0-14 0v1h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5"
      stroke="white" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IcoX = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M1 1L10 10M1 10L10 1" stroke="#1E2133" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/* ── Helpers ─────────────────────────────────────────────────────── */
const isSurveyProvider = (s: string) =>
  /survey|poll|questionnaire|cpx|bitlab|theorem|pollfish|inbrain|research/i.test(s);

const COMPLETION_ENDPOINTS = ["/api/v1/surveys/complete", "/api/v1/survey/complete", "/api/v1/surveys/submit"];

/* ══════════════════════════════════════════════════════════════════ */
export default function SurveysPage() {
  const router = useRouter();

  /* topbar state */
  const [notifCount,    setNotifCount]    = useState(0);
  const [profileInit,   setProfileInit]   = useState("B");
  const [showNotif,     setShowNotif]     = useState(false);

  /* survey state */
  const [providers,      setProviders]      = useState<SurveyProvider[]>([]);
  const [activeId,       setActiveId]       = useState("");
  const [stepIndex,      setStepIndex]      = useState(0);
  const [answers,        setAnswers]        = useState<Record<string, string>>({});
  const [submitting,     setSubmitting]     = useState(false);
  const [redirecting,    setRedirecting]    = useState(false);
  const [doneMsg,        setDoneMsg]        = useState("");
  const timerRef = useRef<number | null>(null);

  const question      = QUESTIONS[stepIndex];
  const answer        = answers[question.id] || "";
  const totalSteps    = QUESTIONS.length;
  const progressWidth = useMemo(() => Math.round((stepIndex / totalSteps) * 100), [stepIndex, totalSteps]);

  /* init profile + notif */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw) as { displayName?: string; username?: string; email?: string };
        const c = (u.displayName || u.username || u.email || "B").charAt(0).toUpperCase();
        if (c) setProfileInit(c);
      }
    } catch {}
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API}/api/v1/user/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d?.notifications)) setNotifCount(d.notifications.filter((n: { read?: boolean }) => !n.read).length); })
      .catch(() => {});
  }, []);

  /* load providers */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res  = await fetch(`${API}/api/v1/offerwalls`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const all: OfferwallApiItem[] = Array.isArray(data?.offerwalls) ? data.offerwalls : Array.isArray(data?.data) ? data.data : [];
        const active = all.filter(o => o.isActive !== false && o.status !== "inactive" && o.status !== "paused");
        const src = active.length > 0 ? active : all;
        const mapped: SurveyProvider[] = src
          .filter(o => isSurveyProvider(`${o.name || ""} ${o.displayName || ""} ${o.type || ""} ${o.category || ""}`))
          .map((o, i) => ({ id: o._id || o.id || `prov-${i}`, name: (o.displayName || o.name || `Provider ${i + 1}`).trim(), logoUrl: o.metadata?.logoUrl || o.logoUrl, launchUrl: o.metadata?.launchUrl || o.metadata?.offerUrl || o.callbackUrl }));
        const final = mapped.length > 0 ? mapped : src.slice(0, 4).map((o, i) => ({ id: o._id || o.id || `prov-${i}`, name: (o.displayName || o.name || `Provider ${i + 1}`).trim() }));
        if (!alive) return;
        setProviders(final);
        setActiveId(prev => prev || final[0]?.id || "");
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const setAnswer = (val: string) => {
    const v = question.numericOnly ? val.replace(/\D/g, "") : val;
    setAnswers(prev => ({ ...prev, [question.id]: v }));
  };

  const goPrev = () => setStepIndex(p => Math.max(0, p - 1));

  const goNext = async () => {
    if (!answer.trim()) { toast.warn("Please answer the question before continuing."); return; }
    if (stepIndex < QUESTIONS.length - 1) { setStepIndex(p => p + 1); return; }

    const provider = providers.find(p => p.id === activeId);
    if (!provider) { toast.warn("No survey provider available. Try again shortly."); return; }

    setSubmitting(true);
    try {
      const token   = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const body = JSON.stringify({ providerId: provider.id, providerName: provider.name, answers, completedAt: new Date().toISOString() });

      let ok = false;
      for (const ep of COMPLETION_ENDPOINTS) {
        const r = await fetch(`${API}${ep}`, { method: "POST", headers, body });
        if (r.status === 404 || r.status === 405) continue;
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d.message || `Error ${r.status}`);
        ok = true;
        setDoneMsg(d.message || "Survey completed! Redirecting…");
        break;
      }
      if (!ok) throw new Error("Completion endpoint unavailable.");
      setRedirecting(true);
      toast.success("Survey completed successfully!");
      timerRef.current = window.setTimeout(() => router.replace(`/tasks?source=survey&surveyCompleted=true`), 1400);
    } catch (e) {
      toast.error((e as Error).message || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const busy = submitting || redirecting;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D1F] text-white">
      <style>{TICKER_CSS}</style>

      {/* ── Mobile header (< md) ───────────────────────────────── */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0D0F1E] border-b border-[#1E2133]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Bell */}
          <button
            onClick={() => setShowNotif(v => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-[8px] bg-[#1E2133] border border-[#30334A]"
            aria-label="Notifications"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C10.62 2 9.5 3.12 9.5 4.5V4.71C7.03 5.43 5.25 7.71 5.25 10.38V15.5L4 16.75V18H20V16.75L18.75 15.5V10.38C18.75 7.71 16.97 5.43 14.5 4.71V4.5C14.5 3.12 13.38 2 12 2ZM10 19.5C10 20.6 10.9 21.5 12 21.5C13.1 21.5 14 20.6 14 19.5H10Z" fill="white" />
            </svg>
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-[14px] h-[14px] rounded-full bg-[#0AC07D] text-[8px] font-bold text-white flex items-center justify-center">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </button>

          {/* Title */}
          <span className="text-white font-bold text-[18px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Survey
          </span>

          {/* X close */}
          <button
            onClick={() => router.back()}
            className="w-7 h-7 flex items-center justify-center rounded-[6px] bg-[#8C8FA8] hover:bg-[#a0a3bb] transition-colors"
            aria-label="Close"
          >
            <IcoX />
          </button>
        </div>
      </div>

      {/* ── Desktop topbar (>= md) ──────────────────────────────── */}
      <div className="hidden md:block sticky top-0 z-40 bg-[#14162A] border-b border-[#1E2133]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-3 flex items-center justify-between gap-3">
          <button onClick={() => router.push("/home")} className="flex-shrink-0" aria-label="Home">
            <img src="/logo-labwards.png" alt="LabWards" className="h-10 md:h-11 w-auto object-contain" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setShowNotif(v => !v)}
              className="relative h-[44px] w-[44px] rounded-[8px] bg-[#1E2133] border border-[#30334A] flex items-center justify-center hover:opacity-90"
              aria-label="Notifications">
              <IcoBell />
              {notifCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-1 rounded-full bg-[#0AC07D] text-[9px] leading-[14px] font-bold text-center text-white">
                  {notifCount > 99 ? "99+" : notifCount}
                </span>
              )}
            </button>
            <button onClick={() => router.push("/wallet")}
              className="h-[44px] rounded-[8px] bg-[#1E2133] border border-[#30334A] px-4 flex items-center gap-2 hover:opacity-90">
              <span className="text-[#B3B6C7] text-[14px] font-bold">$</span>
              <span className="text-white font-bold text-[22px] leading-none">120</span>
              <span className="text-[#B3B6C7] text-[14px]">USD</span>
            </button>
            <button onClick={() => router.push("/cashout")}
              className="h-[44px] rounded-[8px] px-5 flex items-center gap-2 text-white font-bold text-[15px] hover:opacity-90"
              style={{ background: "linear-gradient(12.07deg, rgba(255,255,255,0) 16.27%, rgba(255,255,255,0.4) 93.68%), #099F86", boxShadow: "0px 7px 19px rgba(20,169,144,0.3)" }}>
              <IcoCashout />
              Cashout
            </button>
            <button onClick={() => router.push("/account")}
              className="h-[44px] w-[54px] rounded-[8px] bg-[#1E2133] border border-[#0AC07D] text-white font-bold text-[18px] hover:opacity-90">
              {profileInit}
            </button>
          </div>
        </div>
      </div>

      {/* ── Activity Ticker ─────────────────────────────────────── */}
      <div className="mx-3 sm:mx-6 md:mx-16 mt-3 sm:mt-4 h-[60px] sm:h-[72px] overflow-hidden rounded-[10px] bg-[#151728] border border-[#1E2133] flex items-center shrink-0">
        <div className="survey-ticker px-2 sm:px-3">
          {TICKER_ITEMS.map((t, i) => (
            <div key={i} className="flex items-center gap-[8px] sm:gap-[10px] bg-[#181A2C] px-2 sm:px-3 py-[8px] rounded-[10px] flex-shrink-0 h-[46px] sm:h-[56px]" style={{ minWidth: "160px" }}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#1E2133]">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center gap-[2px]">
                <p className="text-[10px] sm:text-[11px] font-medium text-[#6B6E8A] m-0">{t.action}</p>
                <span className="text-[12px] sm:text-[13px] font-medium text-[#B3B6C7]">{t.name}</span>
              </div>
              <span className="text-[13px] sm:text-[16px] font-bold text-[#0AC07D] ml-auto">{t.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Survey Content ──────────────────────────────────── */}
      <main className="flex-1 flex flex-col w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 pt-5 pb-6 sm:py-10 overflow-hidden">

        {/* Progress */}
        <div className="mb-5 sm:mb-8 w-full">
          <span className="text-[#8C8FA8] text-sm font-medium">{stepIndex}/{totalSteps}</span>
          <div className="mt-2 w-full h-[5px] sm:h-[6px] rounded-full bg-[#1E2133] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progressWidth}%`, background: "linear-gradient(90deg, #0AC07D, #14A990)" }}
            />
          </div>
        </div>

        {/* Question + Input + Buttons — centered in remaining space */}
        <div className="flex-1 flex flex-col items-center justify-center gap-5 sm:gap-8 w-full min-w-0">

          {/* Question */}
          <h1 className="w-full text-center text-[17px] sm:text-[24px] md:text-[30px] font-bold leading-snug break-words px-1">
            {question.prompt}
          </h1>

          {/* Input */}
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            inputMode={question.numericOnly ? "numeric" : "text"}
            placeholder={question.placeholder}
            disabled={busy}
            className="w-full max-w-[460px] h-[46px] sm:h-[52px] rounded-[8px] border border-[#2A2D3E] bg-[#151728] px-4 text-center text-[#8C8FA8] placeholder-[#4A4D63] text-[14px] sm:text-[15px] outline-none focus:border-[#0AC07D]/50 transition-colors disabled:opacity-60"
          />

          {/* Back / Next */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={goPrev}
              disabled={stepIndex === 0 || busy}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-[8px] sm:py-[9px] rounded-[8px] text-[13px] sm:text-[14px] font-semibold text-white border border-[#2A2D3E] bg-[#151728] hover:border-[#0AC07D]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg width="6" height="11" viewBox="0 0 7 12" fill="none"><path d="M6 1L1 6l5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={busy}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-[8px] sm:py-[9px] rounded-[8px] text-[13px] sm:text-[14px] font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #0AC07D 0%, #0BBFA0 100%)", boxShadow: "0 6px 18px rgba(10,192,125,0.3)" }}
            >
              {busy ? (
                <><Loader2 className="w-4 h-4 animate-spin" />{submitting ? "Submitting" : "Redirecting"}</>
              ) : (
                <>
                  {stepIndex === QUESTIONS.length - 1 ? "Start Survey" : "Next"}
                  <svg width="6" height="11" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </>
              )}
            </button>
          </div>

          {/* Redirect notice */}
          {redirecting && (
            <div className="flex items-center gap-2 rounded-[8px] border border-[#0AC07D]/30 bg-[#0AC07D]/10 px-4 py-3 text-sm text-[#0AC07D]">
              <Loader2 className="w-4 h-4 animate-spin" />
              {doneMsg || "Survey completed! Redirecting to offerwalls…"}
            </div>
          )}
        </div>
      </main>

      {/* ── Floating Support Button ──────────────────────────────── */}
      <button
        onClick={() => router.push("/support")}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center rounded-full hover:scale-105 transition-transform"
        style={{ width: 52, height: 52, background: "linear-gradient(135deg, #0AC07D 0%, #0BBFA0 100%)", boxShadow: "0 8px 24px rgba(10,192,125,0.45)" }}
        aria-label="Live Support"
      >
        <IcoHeadset />
      </button>

    </div>
  );
}
