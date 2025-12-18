"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Cookie, Settings, Shield, BarChart3, Target, Share2, Check } from "lucide-react";

export default function CookiePolicyPage() {
    const lastUpdated = "December 1, 2025";
    const [preferences, setPreferences] = useState({
        essential: true,
        analytics: true,
        marketing: false,
        functional: true,
    });

    const handlePreferenceChange = (key: keyof typeof preferences) => {
        if (key === 'essential') return; // Essential cookies cannot be disabled
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const cookieTypes = [
        {
            icon: <Shield className="w-5 h-5" />,
            key: "essential" as const,
            title: "Essential Cookies",
            description: "Required for the website to function properly. These cookies enable core functionality such as security, authentication, and session management.",
            examples: ["Session ID", "Authentication tokens", "CSRF tokens", "Load balancing"],
            required: true,
            color: "emerald",
        },
        {
            icon: <BarChart3 className="w-5 h-5" />,
            key: "analytics" as const,
            title: "Analytics Cookies",
            description: "Help us understand how visitors interact with our website by collecting and reporting information anonymously.",
            examples: ["Google Analytics", "Page views", "User behavior", "Performance metrics"],
            required: false,
            color: "blue",
        },
        {
            icon: <Target className="w-5 h-5" />,
            key: "marketing" as const,
            title: "Marketing Cookies",
            description: "Used to track visitors across websites to display relevant advertisements based on their browsing habits.",
            examples: ["Ad targeting", "Conversion tracking", "Retargeting pixels", "Social media"],
            required: false,
            color: "purple",
        },
        {
            icon: <Settings className="w-5 h-5" />,
            key: "functional" as const,
            title: "Functional Cookies",
            description: "Enable enhanced functionality and personalization, such as remembering your preferences and settings.",
            examples: ["Language preference", "Theme settings", "Recently viewed", "Form data"],
            required: false,
            color: "orange",
        },
    ];

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
                            <Cookie className="w-6 h-6 text-orange-400" />
                            <h1 className="text-xl font-bold">Cookie Policy</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Cookie Policy</h2>
                    <p className="text-[#9CA3AF]">Last updated: {lastUpdated}</p>
                </div>

                {/* Introduction */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 mb-10">
                    <p className="text-[#9CA3AF]">
                        LabWards uses cookies and similar technologies to enhance your browsing experience, 
                        analyze site traffic, and personalize content. This Cookie Policy explains what cookies 
                        are, how we use them, and your choices regarding their use.
                    </p>
                </div>

                {/* What Are Cookies */}
                <section className="mb-10">
                    <h3 className="text-xl font-bold mb-4">What Are Cookies?</h3>
                    <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                        <p>
                            Cookies are small text files that are stored on your device (computer, tablet, or mobile) 
                            when you visit a website. They help websites remember your preferences and understand 
                            how you interact with the site.
                        </p>
                        <p>
                            We also use similar technologies like web beacons, pixels, and local storage, which 
                            function similarly to cookies. When we refer to &quot;cookies&quot; in this policy, we include 
                            these similar technologies.
                        </p>
                    </div>
                </section>

                {/* Cookie Preferences */}
                <section className="mb-10">
                    <h3 className="text-xl font-bold mb-4">Manage Your Cookie Preferences</h3>
                    <div className="space-y-4">
                        {cookieTypes.map((cookie) => (
                            <div 
                                key={cookie.key}
                                className={`bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 ${preferences[cookie.key] ? `border-l-4 border-l-${cookie.color}-500` : ''}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-lg bg-${cookie.color}-500/20 flex items-center justify-center text-${cookie.color}-400 flex-shrink-0`}>
                                            {cookie.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-bold">{cookie.title}</h4>
                                                {cookie.required && (
                                                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Required</span>
                                                )}
                                            </div>
                                            <p className="text-[#9CA3AF] text-sm mb-3">{cookie.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {cookie.examples.map((example, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-[#252840] text-xs text-[#9CA3AF] rounded">
                                                        {example}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handlePreferenceChange(cookie.key)}
                                        disabled={cookie.required}
                                        className={`flex-shrink-0 w-14 h-8 rounded-full transition-colors relative ${
                                            preferences[cookie.key]
                                                ? 'bg-emerald-500'
                                                : 'bg-[#2A2D3E]'
                                        } ${cookie.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                                            preferences[cookie.key] ? 'translate-x-7' : 'translate-x-1'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        Save Preferences
                    </button>
                </section>

                {/* How We Use Cookies */}
                <section className="mb-10">
                    <h3 className="text-xl font-bold mb-4">How We Use Cookies</h3>
                    <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                        <p>We use cookies to:</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>Keep you signed in to your account</li>
                            <li>Remember your preferences and settings</li>
                            <li>Protect against fraud and unauthorized access</li>
                            <li>Understand how you use our platform</li>
                            <li>Improve our services based on usage data</li>
                            <li>Deliver relevant content and advertisements</li>
                            <li>Measure the effectiveness of our marketing</li>
                        </ul>
                    </div>
                </section>

                {/* Third-Party Cookies */}
                <section className="mb-10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-blue-400" />
                        Third-Party Cookies
                    </h3>
                    <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                        <p>Some cookies on our site are set by third parties, including:</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><strong className="text-white">Google Analytics:</strong> For website analytics and performance tracking</li>
                            <li><strong className="text-white">Advertising Partners:</strong> For task tracking and conversion attribution</li>
                            <li><strong className="text-white">Social Media:</strong> For social login and sharing features</li>
                            <li><strong className="text-white">Payment Processors:</strong> For secure payment functionality</li>
                        </ul>
                        <p className="mt-4">These third parties have their own privacy and cookie policies that govern their use of cookies.</p>
                    </div>
                </section>

                {/* Managing Cookies */}
                <section className="mb-10">
                    <h3 className="text-xl font-bold mb-4">Managing Cookies in Your Browser</h3>
                    <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                        <p>You can control cookies through your browser settings. Here&apos;s how:</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><strong className="text-white">Chrome:</strong> Settings → Privacy and security → Cookies</li>
                            <li><strong className="text-white">Firefox:</strong> Options → Privacy & Security → Cookies</li>
                            <li><strong className="text-white">Safari:</strong> Preferences → Privacy → Cookies</li>
                            <li><strong className="text-white">Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
                        </ul>
                        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <p className="text-yellow-400 text-sm">
                                Note: Blocking or deleting cookies may affect your experience on our site. Some features 
                                may not work properly without essential cookies.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section>
                    <h3 className="text-xl font-bold mb-4">Questions About Cookies?</h3>
                    <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF]">
                        <p>If you have questions about our use of cookies, please contact us:</p>
                        <p className="mt-2">
                            Email: <a href="mailto:support@labwards.com" className="text-orange-400 hover:text-orange-300">support@labwards.com</a>
                        </p>
                    </div>
                </section>

                {/* Related Links */}
                <div className="mt-12 pt-8 border-t border-[#2A2D3E]">
                    <h3 className="font-bold mb-4">Related Policies</h3>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/terms" className="px-4 py-2 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg text-sm hover:bg-[#252840] transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/privacy" className="px-4 py-2 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg text-sm hover:bg-[#252840] transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
