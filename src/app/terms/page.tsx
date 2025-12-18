"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Shield, AlertTriangle, Users, CreditCard, Scale } from "lucide-react";

export default function TermsOfServicePage() {
    const lastUpdated = "December 1, 2025";

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
                            <FileText className="w-6 h-6 text-blue-400" />
                            <h1 className="text-xl font-bold">Terms of Service</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Terms of Service</h2>
                    <p className="text-[#9CA3AF]">Last updated: {lastUpdated}</p>
                </div>

                {/* Quick Navigation */}
                <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 mb-10">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-blue-400" />
                        Quick Navigation
                    </h3>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm">
                        <li><a href="#acceptance" className="text-[#9CA3AF] hover:text-blue-400">1. Acceptance of Terms</a></li>
                        <li><a href="#eligibility" className="text-[#9CA3AF] hover:text-blue-400">2. Eligibility</a></li>
                        <li><a href="#account" className="text-[#9CA3AF] hover:text-blue-400">3. Account Registration</a></li>
                        <li><a href="#services" className="text-[#9CA3AF] hover:text-blue-400">4. Services</a></li>
                        <li><a href="#earnings" className="text-[#9CA3AF] hover:text-blue-400">5. Earnings & Payments</a></li>
                        <li><a href="#conduct" className="text-[#9CA3AF] hover:text-blue-400">6. User Conduct</a></li>
                        <li><a href="#termination" className="text-[#9CA3AF] hover:text-blue-400">7. Termination</a></li>
                        <li><a href="#liability" className="text-[#9CA3AF] hover:text-blue-400">8. Limitation of Liability</a></li>
                    </ul>
                </div>

                {/* Terms Content */}
                <div className="prose prose-invert max-w-none space-y-8">
                    <section id="acceptance">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">1</span>
                            Acceptance of Terms
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p>By accessing or using LabWards (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not use the Service.</p>
                            <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service constitutes acceptance of the modified Terms.</p>
                        </div>
                    </section>

                    <section id="eligibility">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">2</span>
                            Eligibility
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p>To use LabWards, you must:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>Be at least 18 years of age</li>
                                <li>Have the legal capacity to enter into binding agreements</li>
                                <li>Not be prohibited from using the Service under applicable laws</li>
                                <li>Provide accurate and complete registration information</li>
                            </ul>
                            <p>The Service may not be available in all jurisdictions. It is your responsibility to ensure compliance with local laws.</p>
                        </div>
                    </section>

                    <section id="account">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">3</span>
                            Account Registration
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p>When creating an account, you agree to:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>Provide accurate, current, and complete information</li>
                                <li>Maintain and update your information as needed</li>
                                <li>Keep your password secure and confidential</li>
                                <li>Accept responsibility for all activities under your account</li>
                                <li>Create only one account per person</li>
                            </ul>
                            <p>We reserve the right to suspend or terminate accounts that violate these requirements or are suspected of fraudulent activity.</p>
                        </div>
                    </section>

                    <section id="services">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">4</span>
                            Services
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p>LabWards provides a platform where users can earn rewards by completing various tasks, including but not limited to:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>Completing surveys</li>
                                <li>Playing mobile games</li>
                                <li>Testing applications</li>
                                <li>Watching videos</li>
                                <li>Signing up for offers</li>
                                <li>Referring new users</li>
                            </ul>
                            <p>Task availability, rewards, and terms may vary and are subject to change without notice. Third-party offers are governed by the respective third party&apos;s terms and conditions.</p>
                        </div>
                    </section>

                    <section id="earnings">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">5</span>
                            Earnings & Payments
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p>Regarding earnings and payments:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>Earnings are credited upon successful task completion and verification</li>
                                <li>Minimum withdrawal amounts apply and may vary by payment method</li>
                                <li>We reserve the right to adjust earnings if fraud or errors are detected</li>
                                <li>Pending earnings may be forfeited if your account is terminated for violations</li>
                                <li>You are responsible for any taxes applicable to your earnings</li>
                            </ul>
                            <p>Payment processing times vary depending on the payment method selected. We are not responsible for delays caused by third-party payment processors.</p>
                        </div>
                    </section>

                    <section id="conduct">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">6</span>
                            User Conduct
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p>You agree NOT to:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>Create multiple accounts or use fake identities</li>
                                <li>Use VPNs, proxies, or tools to mask your location</li>
                                <li>Use bots, scripts, or automated methods to complete tasks</li>
                                <li>Provide false information or submit fraudulent completions</li>
                                <li>Attempt to manipulate or exploit the referral system</li>
                                <li>Share account access or sell your account</li>
                                <li>Harass, abuse, or harm other users or staff</li>
                                <li>Violate any applicable laws or third-party rights</li>
                            </ul>
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 flex items-start gap-2">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>Violations may result in account suspension, forfeiture of earnings, and permanent ban from the platform.</span>
                                </p>
                            </div>
                        </div>
                    </section>

                    <section id="termination">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">7</span>
                            Termination
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p>We may terminate or suspend your account at any time, with or without cause, with or without notice. Reasons for termination may include:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>Violation of these Terms</li>
                                <li>Fraudulent or suspicious activity</li>
                                <li>Prolonged inactivity</li>
                                <li>Request by law enforcement or government agency</li>
                            </ul>
                            <p>You may also terminate your account at any time through your account settings. Upon termination, you must withdraw any eligible earnings within 30 days.</p>
                        </div>
                    </section>

                    <section id="liability">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">8</span>
                            Limitation of Liability
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p>THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>We disclaim all warranties, express or implied</li>
                                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                                <li>Our total liability shall not exceed the amount you have earned in the past 12 months</li>
                                <li>We are not responsible for third-party services or offers</li>
                            </ul>
                        </div>
                    </section>

                    <section id="contact">
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF]">
                            <p>If you have questions about these Terms, please contact us at:</p>
                            <p className="mt-2">
                                <a href="mailto:support@labwards.com" className="text-blue-400 hover:text-blue-300">support@labwards.com</a>
                            </p>
                        </div>
                    </section>
                </div>

                {/* Related Links */}
                <div className="mt-12 pt-8 border-t border-[#2A2D3E]">
                    <h3 className="font-bold mb-4">Related Policies</h3>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/privacy" className="px-4 py-2 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg text-sm hover:bg-[#252840] transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/cookies" className="px-4 py-2 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg text-sm hover:bg-[#252840] transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
