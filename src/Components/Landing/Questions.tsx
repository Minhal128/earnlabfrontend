"use client";

import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Image from "next/image";
import IconTop from "../../../public/assets/question.png";

type FAQ = {
    id: number;
    question: string;
    answer: string | string[];
};

const faqs: FAQ[] = [
    {
        id: 1,
        question: "How do I start earning on Labwards?",
        answer: [
            "Create a free account and log in.",
            "Choose from available tasks — surveys, games, app sign-ups, or daily check-ins.",
            "Complete the task as instructed to earn rewards instantly.",
            'Track your progress in the "My Tasks" section, and once you hit the minimum, you can cash out via your preferred payment method.',
        ],
    },
    {
        id: 2,
        question: "What payout methods are available?",
        answer:
            "We offer multiple payout options including PayPal, Visa, Amazon Gift Cards, Worldcoin, Bitcoin, Litecoin, Dogecoin, and Solana. Choose the method that works best for you!",
    },
    {
        id: 3,
        question: "How long does it take to receive my payment?",
        answer:
            "Most payments are processed instantly! Crypto withdrawals are typically completed within minutes, while PayPal and gift cards may take up to 24 hours during peak times.",
    },
    {
        id: 4,
        question: "How does the referral program work?",
        answer:
            "Invite friends using your unique referral link and earn 10% of everything they earn — forever! There's no limit to how many friends you can refer or how much you can earn.",
    },
    {
        id: 5,
        question: "Is Labwards free to use?",
        answer:
            "Absolutely! Labwards is 100% free to join and use. There are no hidden fees, subscriptions, or costs. You earn real money simply by completing tasks.",
    },
];

const Question: React.FC = () => {
    const [openId, setOpenId] = useState<number | null>(null);

    const toggleFAQ = (id: number) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0f0f1a] text-white">
            {/* Header */}
            <div className="text-center max-w-5xl md:mt-20 mb-10">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <Image
                        src={IconTop}
                        alt="Why Choose Us Icon"
                        width={30}
                        height={24}
                        className="object-contain"
                    />
                    <span className="uppercase tracking-wide text-md font-medium text-white">
                        BENEFITS
                    </span>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                    We&apos;ve Got the Answers You Need
                </h2>
                <p className="text-gray-400 md:px-42">
                    Find quick answers to the most common questions about earning, payouts,
                    referrals, and more
                </p>
            </div>

            <div className="w-full max-w-4xl bg-[#151728] rounded-xl shadow-lg md:p-4 p-1 sm:p-6">
                {faqs.map((faq, index) => (
                    <div key={faq.id}>
                        <div
                            className="rounded-lg transition-all duration-300"
                        >
                            <button
                                type="button"
                                onClick={() => toggleFAQ(faq.id)}
                                className="w-full flex items-center justify-between p-4 text-left focus:outline-none transition-colors duration-200"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="bg-[#1E2133] text-white text-sm font-bold px-3 py-2 rounded">
                                        {faq.id.toString().padStart(2, "0")}
                                    </span>
                                    <span className="font-medium md:text-lg text-xs">{faq.question}</span>
                                </div>
                                {openId === faq.id ? (
                                    <FaMinus className="md:w-4 md:h-4 h-3 w-3 text-[#fff] flex-shrink-0" />
                                ) : (
                                    <FaPlus className="md:w-4 md:h-4 h-3 w-3 text-[#fff] flex-shrink-0" />
                                )}
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openId === faq.id
                                    ? "max-h-[500px] opacity-100 md:pb-4"
                                    : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="px-6">
                                    {Array.isArray(faq.answer) ? (
                                        <ul className="list-decimal pl-5 space-y-3 text-gray-300 md:text-sm text-xs leading-relaxed">
                                            {faq.answer.map((line, idx) => (
                                                <li key={idx} className="pl-2">{line}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-300 text-base leading-relaxed pl-3">
                                            {faq.answer}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {index !== faqs.length - 1 && (
                            <div className="h-[1px] w-full bg-gradient-to-r from-[] via-[#B3B6C7]/40 to-transparent my-4"></div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Question;
