"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, ChevronDown } from "lucide-react";

const faqCategories = [
    {
        title: "Getting Started",
        faqs: [
            {
                question: "How do I create an account?",
                answer: "Creating an account is easy! Click on 'Sign Up' and you can register using your email address or sign up instantly with Google, Facebook, or Apple. Complete your profile to start earning rewards."
            },
            {
                question: "Is LabWards free to use?",
                answer: "Yes! LabWards is completely free to use. There are no signup fees, membership costs, or hidden charges. You earn money by completing tasks, and we only take a small commission from advertisers."
            },
            {
                question: "How old do I need to be to use LabWards?",
                answer: "You must be at least 18 years old to create an account and use LabWards. This is required for legal and payment processing reasons."
            },
            {
                question: "Is LabWards available in my country?",
                answer: "LabWards is available in most countries worldwide. However, task availability may vary by region. Create an account to see what opportunities are available in your area."
            },
        ]
    },
    {
        title: "Earning & Tasks",
        faqs: [
            {
                question: "How do I earn money on LabWards?",
                answer: "You can earn money by completing various tasks including: playing mobile games, taking surveys, downloading and testing apps, signing up for offers, watching videos, and more. Each task shows the reward amount before you start."
            },
            {
                question: "Why didn't my task credit?",
                answer: "Tasks may not credit for several reasons: using a VPN, not following instructions exactly, clearing cookies/cache during the task, or the advertiser rejecting the completion. If you believe there's an error, contact our support team with proof of completion."
            },
            {
                question: "How long does it take for rewards to credit?",
                answer: "Most rewards credit instantly or within a few minutes. Some tasks may take up to 24-48 hours depending on advertiser verification. Game tasks may take longer as they require milestone completion."
            },
            {
                question: "Can I complete the same task multiple times?",
                answer: "Most tasks can only be completed once per user. However, new tasks are added daily, and some recurring tasks (like daily surveys) can be completed regularly."
            },
        ]
    },
    {
        title: "Payments & Withdrawals",
        faqs: [
            {
                question: "What is the minimum withdrawal amount?",
                answer: "The minimum withdrawal amount is $5 for most payment methods including PayPal and gift cards. Some methods like cryptocurrency may have higher minimums due to network fees."
            },
            {
                question: "How long do withdrawals take?",
                answer: "PayPal and gift card withdrawals are typically processed instantly or within a few hours. Bank transfers may take 1-3 business days. Cryptocurrency withdrawals are usually processed within 24 hours."
            },
            {
                question: "What payment methods are available?",
                answer: "We offer multiple payment options including PayPal, bank transfer, cryptocurrency (Bitcoin, Ethereum, Litecoin), and gift cards (Amazon, Steam, iTunes, and more)."
            },
            {
                question: "Are there any withdrawal fees?",
                answer: "We don't charge withdrawal fees for most payment methods. However, some cryptocurrency withdrawals may have network fees, and certain payment providers may have their own fees."
            },
        ]
    },
    {
        title: "Account & Security",
        faqs: [
            {
                question: "How do I reset my password?",
                answer: "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link within a few minutes. Check your spam folder if you don't see it."
            },
            {
                question: "Why was my account suspended?",
                answer: "Accounts may be suspended for violating our Terms of Service, including using VPNs, creating multiple accounts, providing false information, or attempting to fraud the system. Contact support if you believe this was an error."
            },
            {
                question: "Is my personal information safe?",
                answer: "Yes! We use industry-standard encryption to protect your data. We never sell your personal information to third parties. Read our Privacy Policy for more details on how we handle your data."
            },
            {
                question: "How do I delete my account?",
                answer: "To delete your account, go to Settings > Account > Delete Account. Please note that account deletion is permanent and you will lose any pending earnings. Make sure to withdraw your balance first."
            },
        ]
    },
    {
        title: "Referrals",
        faqs: [
            {
                question: "How does the referral program work?",
                answer: "Share your unique referral link with friends. When they sign up and complete their first task, you both earn a bonus! You also earn a percentage of their lifetime earnings."
            },
            {
                question: "How much can I earn from referrals?",
                answer: "You earn 10% of your referrals' earnings for life! There's no limit to how many people you can refer. Top referrers earn hundreds of dollars monthly just from referral commissions."
            },
            {
                question: "When do referral bonuses credit?",
                answer: "Referral signup bonuses credit once your referral completes their first qualifying task. Commission earnings are credited in real-time as your referrals earn."
            },
        ]
    },
];

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

    const toggleItem = (categoryIdx: number, faqIdx: number) => {
        const key = `${categoryIdx}-${faqIdx}`;
        setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A0C1A] via-[#0D0F1E] to-[#0A0C1A] text-white">
            {/* Header */}
            <div className="bg-[#0A0C1A] border-b border-[#2A2D3E] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/landing" className="p-2 rounded-lg bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <HelpCircle className="w-6 h-6 text-purple-400" />
                            <h1 className="text-xl font-bold">FAQ</h1>
                        </div>
                    </div>
                    <Link href="/contact" className="px-4 py-2 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg font-semibold text-sm hover:bg-[#252840] transition-all">
                        Contact Us
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-16 px-4 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-[#9CA3AF]">
                        Find answers to the most common questions about LabWards
                    </p>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {faqCategories.map((category, categoryIdx) => (
                        <div key={categoryIdx} className="mb-10">
                            <h3 className="text-xl font-bold mb-4 text-purple-400">{category.title}</h3>
                            <div className="space-y-3">
                                {category.faqs.map((faq, faqIdx) => {
                                    const isOpen = openItems[`${categoryIdx}-${faqIdx}`];
                                    return (
                                        <div 
                                            key={faqIdx}
                                            className="rounded-xl bg-[#1A1D2E] border border-[#2A2D3E] overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleItem(categoryIdx, faqIdx)}
                                                className="w-full flex items-center justify-between p-4 text-left hover:bg-[#252840] transition-colors"
                                            >
                                                <span className="font-medium pr-4">{faq.question}</span>
                                                <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {isOpen && (
                                                <div className="px-4 pb-4 text-[#9CA3AF] border-t border-[#2A2D3E] pt-4">
                                                    {faq.answer}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
