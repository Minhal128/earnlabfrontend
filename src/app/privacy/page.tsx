"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Mail, Globe, Trash2 } from "lucide-react";

export default function PrivacyPolicyPage() {
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
                            <Shield className="w-6 h-6 text-emerald-400" />
                            <h1 className="text-xl font-bold">Privacy Policy</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h2>
                    <p className="text-[#9CA3AF]">Last updated: {lastUpdated}</p>
                </div>

                {/* Introduction */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 mb-10">
                    <p className="text-[#9CA3AF]">
                        At LabWards, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                        disclose, and protect your personal information when you use our services. By using LabWards, 
                        you consent to the practices described in this policy.
                    </p>
                </div>

                {/* Privacy Content */}
                <div className="space-y-8">
                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Database className="w-5 h-5 text-blue-400" />
                            </div>
                            Information We Collect
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p className="font-medium text-white">Personal Information:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>Name, email address, and date of birth</li>
                                <li>Payment information (PayPal email, crypto wallet address)</li>
                                <li>Profile information you choose to provide</li>
                                <li>Phone number (if provided for verification)</li>
                            </ul>
                            
                            <p className="font-medium text-white mt-6">Automatically Collected Information:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>Device information (browser type, operating system)</li>
                                <li>IP address and approximate location</li>
                                <li>Usage data (pages visited, tasks completed, time spent)</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>

                            <p className="font-medium text-white mt-6">Information from Third Parties:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>Social login information (Google, Facebook, Apple)</li>
                                <li>Task completion data from advertising partners</li>
                                <li>Fraud prevention and verification services</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Eye className="w-5 h-5 text-purple-400" />
                            </div>
                            How We Use Your Information
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p>We use your information to:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Process transactions and send related information</li>
                                <li>Verify your identity and prevent fraud</li>
                                <li>Match you with relevant tasks and surveys</li>
                                <li>Communicate with you about updates, promotions, and support</li>
                                <li>Analyze usage patterns to improve user experience</li>
                                <li>Comply with legal obligations</li>
                                <li>Protect the security and integrity of our platform</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-orange-400" />
                            </div>
                            Information Sharing
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p>We may share your information with:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li><strong className="text-white">Advertising Partners:</strong> To verify task completions and process rewards</li>
                                <li><strong className="text-white">Payment Processors:</strong> To process withdrawals and payments</li>
                                <li><strong className="text-white">Service Providers:</strong> Who assist in operating our platform (hosting, analytics, support)</li>
                                <li><strong className="text-white">Legal Authorities:</strong> When required by law or to protect our rights</li>
                            </ul>
                            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <p className="text-emerald-400">
                                    We do NOT sell your personal information to third parties for their marketing purposes.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-cyan-400" />
                            </div>
                            Data Security
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p>We implement industry-standard security measures to protect your data:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>SSL/TLS encryption for all data transmission</li>
                                <li>Secure, encrypted storage for sensitive information</li>
                                <li>Regular security audits and vulnerability assessments</li>
                                <li>Access controls and authentication for our systems</li>
                                <li>Employee training on data protection practices</li>
                            </ul>
                            <p className="mt-4">While we strive to protect your information, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                                <Globe className="w-5 h-5 text-pink-400" />
                            </div>
                            Your Rights & Choices
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p>You have the right to:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
                                <li><strong className="text-white">Correct:</strong> Update inaccurate or incomplete information</li>
                                <li><strong className="text-white">Delete:</strong> Request deletion of your personal data</li>
                                <li><strong className="text-white">Opt-out:</strong> Unsubscribe from marketing communications</li>
                                <li><strong className="text-white">Export:</strong> Receive your data in a portable format</li>
                                <li><strong className="text-white">Restrict:</strong> Limit how we use your data</li>
                            </ul>
                            <p className="mt-4">To exercise these rights, contact us at <a href="mailto:support@labwards.com" className="text-emerald-400 hover:text-emerald-300">support@labwards.com</a></p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-400" />
                            </div>
                            Data Retention
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF] space-y-4">
                            <p>We retain your personal information for as long as:</p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>Your account remains active</li>
                                <li>Necessary to provide our services</li>
                                <li>Required by law (tax records, legal obligations)</li>
                                <li>Needed to resolve disputes or enforce agreements</li>
                            </ul>
                            <p className="mt-4">After account deletion, we may retain certain information in anonymized form for analytics purposes or as required by law.</p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-yellow-400" />
                            </div>
                            Contact Us
                        </h3>
                        <div className="bg-[#1A1D2E] border border-[#2A2D3E] rounded-xl p-6 text-[#9CA3AF]">
                            <p>If you have questions about this Privacy Policy or our data practices, contact us:</p>
                            <div className="mt-4 space-y-2">
                                <p>Email: <a href="mailto:support@labwards.com" className="text-emerald-400 hover:text-emerald-300">support@labwards.com</a></p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Related Links */}
                <div className="mt-12 pt-8 border-t border-[#2A2D3E]">
                    <h3 className="font-bold mb-4">Related Policies</h3>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/terms" className="px-4 py-2 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg text-sm hover:bg-[#252840] transition-colors">
                            Terms of Service
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
