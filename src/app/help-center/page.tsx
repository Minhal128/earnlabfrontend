"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Book, FileText, ChevronRight, Zap, Shield } from "lucide-react";

const categories = [
    {
        icon: <Book className="w-6 h-6" />,
        title: "Getting Started",
        description: "Learn the basics of using LabWards",
        articles: 12,
        color: "blue",
        items: [
            "How to create your account",
            "Setting up your profile",
            "Completing your first task",
            "Understanding the reward system",
            "Payment methods overview",
        ],
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Earning & Tasks",
        description: "Everything about earning money",
        articles: 18,
        color: "emerald",
        items: [
            "Types of tasks available",
            "How to maximize earnings",
            "Task completion tips",
            "Why tasks may not credit",
            "Reporting missing credits",
        ],
    },
    {
        icon: <FileText className="w-6 h-6" />,
        title: "Payments & Withdrawals",
        description: "Manage your earnings and cash out",
        articles: 15,
        color: "purple",
        items: [
            "Minimum withdrawal amounts",
            "Withdrawal processing times",
            "Supported payment methods",
            "Verifying your identity",
            "Tax information",
        ],
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Account & Security",
        description: "Keep your account safe",
        articles: 10,
        color: "orange",
        items: [
            "Changing your password",
            "Two-factor authentication",
            "Account verification",
            "Recovering your account",
            "Privacy settings",
        ],
    },
];

export default function HelpCenterPage() {
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

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
                            <HelpCircle className="w-6 h-6 text-blue-400" />
                            <h1 className="text-xl font-bold">Help Center</h1>
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
                    <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        How can we help you?
                    </h2>
                    <p className="text-lg text-[#9CA3AF]">
                        Browse categories below to find the help you need
                    </p>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-8 px-4 bg-[#0D0F1E]/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-2xl font-bold text-white mb-1">55+</div>
                            <div className="text-sm text-[#9CA3AF]">Help Articles</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-2xl font-bold text-white mb-1">24/7</div>
                            <div className="text-sm text-[#9CA3AF]">Support</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-2xl font-bold text-white mb-1">&lt;1hr</div>
                            <div className="text-sm text-[#9CA3AF]">Avg. Response</div>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                            <div className="text-2xl font-bold text-white mb-1">98%</div>
                            <div className="text-sm text-[#9CA3AF]">Satisfaction</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8">Browse by Category</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        {categories.map((category, idx) => (
                            <div 
                                key={idx} 
                                className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] overflow-hidden hover:border-blue-500/50 transition-all duration-300"
                            >
                                <div 
                                    className="p-6 cursor-pointer"
                                    onClick={() => setExpandedCategory(expandedCategory === idx ? null : idx)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-lg bg-${category.color}-500/10 flex items-center justify-center text-${category.color}-400`}>
                                            {category.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-lg font-bold">{category.title}</h4>
                                                <ChevronRight className={`w-5 h-5 transition-transform ${expandedCategory === idx ? 'rotate-90' : ''}`} />
                                            </div>
                                            <p className="text-sm text-[#9CA3AF] mt-1">{category.description}</p>
                                            <span className="text-xs text-blue-400 mt-2 block">{category.articles} articles</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {expandedCategory === idx && (
                                    <div className="px-6 pb-6 border-t border-[#2A2D3E] pt-4">
                                        <ul className="space-y-2">
                                            {category.items.map((item, itemIdx) => (
                                                <li key={itemIdx}>
                                                    <a href="#" className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-blue-400 transition-colors">
                                                        <ChevronRight className="w-4 h-4" />
                                                        {item}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
