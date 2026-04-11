"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/Components/Topbar";
import OffersSurveysRewardsDisclaimer from "@/Components/Shared/OffersSurveysRewardsDisclaimer";
import TickerBar from "@/Components/Shared/TickerBar";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "@/utils/toast";

type SurveyProvider = {
    id: string;
    name: string;
    logoUrl?: string;
    launchUrl?: string;
};

type OfferwallApiItem = {
    _id?: string;
    id?: string;
    name?: string;
    displayName?: string;
    type?: string;
    category?: string;
    logoUrl?: string;
    callbackUrl?: string;
    isActive?: boolean;
    status?: string;
    metadata?: {
        logoUrl?: string;
        launchUrl?: string;
        offerUrl?: string;
        referralUrl?: string;
    };
};

type SurveyQuestion = {
    id: string;
    prompt: string;
    placeholder: string;
    helperText?: string;
    numericOnly?: boolean;
};

const SURVEY_QUESTIONS: SurveyQuestion[] = [
    {
        id: "householdIncome",
        prompt: "My household earns approximately $ per year?",
        placeholder: "Only numbers",
        helperText: "Only numbers",
        numericOnly: true,
    },
    {
        id: "ageRange",
        prompt: "Which age range best describes me?",
        placeholder: "Example: 25-34",
    },
    {
        id: "occupation",
        prompt: "My current occupation is?",
        placeholder: "Example: Full-time employee",
    },
];

const isLikelySurveyProvider = (input: string): boolean => {
    return /survey|poll|questionnaire|cpx|bitlab|theorem|pollfish|inbrain|research/i.test(input);
};

export default function SurveysPage() {
    const router = useRouter();

    const [providers, setProviders] = useState<SurveyProvider[]>([]);
    const [loadingProviders, setLoadingProviders] = useState(true);
    const [activeProviderId, setActiveProviderId] = useState<string>("");
    const [stepIndex, setStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const currentQuestion = SURVEY_QUESTIONS[stepIndex];
    const currentAnswer = answers[currentQuestion.id] || "";

    const progressPct = useMemo(() => {
        if (SURVEY_QUESTIONS.length <= 1) return 100;
        return Math.round((stepIndex / (SURVEY_QUESTIONS.length - 1)) * 100);
    }, [stepIndex]);

    useEffect(() => {
        let mounted = true;

        const loadSurveyProviders = async () => {
            setLoadingProviders(true);

            try {
                const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const res = await fetch(`${api}/api/v1/offerwalls`, { cache: "no-store" });

                if (!res.ok) {
                    throw new Error("Unable to load survey providers.");
                }

                const data = await res.json();
                const offerwalls: OfferwallApiItem[] = Array.isArray(data?.offerwalls)
                    ? data.offerwalls
                    : Array.isArray(data?.data)
                        ? data.data
                        : [];

                const activeOfferwalls = offerwalls.filter(
                    (ow) => ow.isActive !== false && ow.status !== "inactive" && ow.status !== "paused",
                );

                const source = activeOfferwalls.length > 0 ? activeOfferwalls : offerwalls;

                const mappedSurveyProviders = source
                    .filter((ow) => {
                        const hint = `${ow.name || ""} ${ow.displayName || ""} ${ow.type || ""} ${ow.category || ""}`;
                        return isLikelySurveyProvider(hint);
                    })
                    .map((ow, idx) => {
                        const name = (ow.displayName || ow.name || `Survey Provider ${idx + 1}`).trim();
                        return {
                            id: ow._id || ow.id || `${name}-${idx}`,
                            name,
                            logoUrl: ow.metadata?.logoUrl || ow.logoUrl,
                            launchUrl:
                                ow.metadata?.launchUrl ||
                                ow.metadata?.offerUrl ||
                                ow.metadata?.referralUrl ||
                                ow.callbackUrl,
                        } as SurveyProvider;
                    });

                const fallbackSurveyProviders = source
                    .slice(0, 4)
                    .map((ow, idx) => {
                        const name = (ow.displayName || ow.name || `Survey Provider ${idx + 1}`).trim();
                        return {
                            id: ow._id || ow.id || `${name}-${idx}`,
                            name,
                            logoUrl: ow.metadata?.logoUrl || ow.logoUrl,
                            launchUrl:
                                ow.metadata?.launchUrl ||
                                ow.metadata?.offerUrl ||
                                ow.metadata?.referralUrl ||
                                ow.callbackUrl,
                        } as SurveyProvider;
                    });

                const finalProviders = mappedSurveyProviders.length > 0
                    ? mappedSurveyProviders
                    : fallbackSurveyProviders;

                if (!mounted) return;

                setProviders(finalProviders);
                setActiveProviderId((prev) => prev || finalProviders[0]?.id || "");
            } catch {
                if (!mounted) return;
                setProviders([]);
                setActiveProviderId("");
            } finally {
                if (mounted) {
                    setLoadingProviders(false);
                }
            }
        };

        loadSurveyProviders();

        return () => {
            mounted = false;
        };
    }, []);

    const selectedProvider = providers.find((provider) => provider.id === activeProviderId) || null;

    const setCurrentAnswer = (value: string) => {
        const normalized = currentQuestion.numericOnly ? value.replace(/[^\d]/g, "") : value;
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: normalized,
        }));
    };

    const goPrev = () => {
        setStepIndex((prev) => Math.max(0, prev - 1));
    };

    const goNext = async () => {
        if (!currentAnswer.trim()) {
            toast.warn("Please answer the current question before continuing.");
            return;
        }

        const isFinalStep = stepIndex >= SURVEY_QUESTIONS.length - 1;
        if (!isFinalStep) {
            setStepIndex((prev) => Math.min(SURVEY_QUESTIONS.length - 1, prev + 1));
            return;
        }

        if (!selectedProvider) {
            toast.warn("No survey provider is currently available. Please try again shortly.");
            return;
        }

        setSubmitting(true);
        try {
            if (selectedProvider.launchUrl && /^https?:\/\//i.test(selectedProvider.launchUrl)) {
                window.open(selectedProvider.launchUrl, "_blank", "noopener,noreferrer");
                return;
            }

            const providerQuery = encodeURIComponent(selectedProvider.name);
            router.push(`/tasks?offerwall=${providerQuery}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#0D0F1E] min-h-screen text-white">
            <TopBar />
            <TickerBar />

            <main className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
                <div className="max-w-[980px] mx-auto">
                    <section className="rounded-2xl border border-[#2A2D3E] bg-[#131629] p-5 sm:p-7 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                        <div className="mb-7">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs sm:text-sm text-[#8C8FA8]">
                                    Survey step {stepIndex + 1} of {SURVEY_QUESTIONS.length}
                                </p>
                                <p className="text-xs sm:text-sm text-emerald-400 font-semibold">{progressPct}%</p>
                            </div>

                            <div className="h-2 rounded-full bg-[#1E2133] overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                        </div>

                        <div className="text-center mb-6 sm:mb-8">
                            <h1 className="text-xl sm:text-3xl font-bold leading-tight tracking-[0.01em]">
                                {currentQuestion.prompt}
                            </h1>
                        </div>

                        <div className="max-w-[460px] mx-auto">
                            <input
                                type="text"
                                value={currentAnswer}
                                onChange={(event) => setCurrentAnswer(event.target.value)}
                                inputMode={currentQuestion.numericOnly ? "numeric" : "text"}
                                placeholder={currentQuestion.placeholder}
                                className="w-full h-12 sm:h-14 rounded-lg border border-[#2A2D3E] bg-[#1A1D2E] px-4 text-center text-white text-base sm:text-lg outline-none focus:border-emerald-500/60 transition-colors"
                            />
                            <p className="text-center text-[#8C8FA8] text-xs sm:text-sm mt-2 min-h-[20px]">
                                {currentQuestion.helperText || ""}
                            </p>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={goPrev}
                                disabled={stepIndex === 0 || submitting}
                                className="inline-flex items-center gap-1 rounded-md border border-[#2A2D3E] bg-[#1A1D2E] px-4 py-2 text-sm font-medium text-[#B3B6C7] hover:text-white hover:border-[#3A3E57] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </button>

                            <button
                                type="button"
                                onClick={goNext}
                                disabled={submitting}
                                className="inline-flex items-center gap-1 rounded-md px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Opening
                                    </>
                                ) : (
                                    <>
                                        {stepIndex === SURVEY_QUESTIONS.length - 1 ? "Start Survey" : "Next"}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#1E2133]">
                            <p className="text-[#8C8FA8] text-xs sm:text-sm mb-3 text-center">Survey provider</p>

                            {loadingProviders ? (
                                <div className="flex items-center justify-center py-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                                </div>
                            ) : providers.length === 0 ? (
                                <p className="text-center text-xs sm:text-sm text-[#8C8FA8]">
                                    No survey providers available right now.
                                </p>
                            ) : (
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                    {providers.map((provider) => {
                                        const isActive = provider.id === activeProviderId;

                                        return (
                                            <button
                                                key={provider.id}
                                                type="button"
                                                onClick={() => setActiveProviderId(provider.id)}
                                                className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs sm:text-sm transition-colors ${
                                                    isActive
                                                        ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                                                        : "border-[#2A2D3E] bg-[#1A1D2E] text-[#B3B6C7] hover:text-white hover:border-[#3A3E57]"
                                                }`}
                                            >
                                                {provider.logoUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={provider.logoUrl}
                                                        alt={provider.name}
                                                        className="w-4 h-4 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="w-4 h-4 rounded-full bg-[#30334A]" />
                                                )}
                                                {provider.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <OffersSurveysRewardsDisclaimer className="mt-7" />
                    </section>
                </div>
            </main>
        </div>
    );
}
