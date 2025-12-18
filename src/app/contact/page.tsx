"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Mail, Clock, ExternalLink } from "lucide-react";
import { FaTelegramPlane, FaDiscord, FaTwitter } from "react-icons/fa";

const socialLinks = [
    {
        name: "Discord",
        description: "Join our community for instant support and chat with other users",
        icon: <FaDiscord className="w-8 h-8" />,
        link: "https://discord.gg/htr9C8EjKG",
        color: "from-[#5865F2] to-[#7289DA]",
        hoverColor: "hover:border-[#5865F2]",
        members: "5,000+",
        responseTime: "Instant",
    },
    {
        name: "Telegram",
        description: "Get announcements and quick support through Telegram",
        icon: <FaTelegramPlane className="w-8 h-8" />,
        link: "https://t.me/labwardscom",
        color: "from-[#0088cc] to-[#00a8e8]",
        hoverColor: "hover:border-[#0088cc]",
        members: "3,000+",
        responseTime: "< 1 hour",
    },
    {
        name: "Twitter / X",
        description: "Follow us for updates, promotions, and quick announcements",
        icon: <FaTwitter className="w-8 h-8" />,
        link: "https://x.com/labwards?s=21",
        color: "from-[#1DA1F2] to-[#0d8bd9]",
        hoverColor: "hover:border-[#1DA1F2]",
        members: "2,500+",
        responseTime: "< 4 hours",
    },
];

const supportOptions = [
    {
        icon: <Mail className="w-6 h-6" />,
        title: "Email Support",
        description: "Send us an email for detailed inquiries",
        value: "support@labwards.com",
        action: "mailto:support@labwards.com",
        responseTime: "24-48 hours",
    },
    {
        icon: <MessageCircle className="w-6 h-6" />,
        title: "Live Chat",
        description: "Chat with our support team in real-time",
        value: "Available 24/7",
        action: "#",
        responseTime: "< 5 minutes",
    },
];

export default function ContactPage() {
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
                            <MessageCircle className="w-6 h-6 text-emerald-400" />
                            <h1 className="text-xl font-bold">Contact Us</h1>
                        </div>
                    </div>
                    <Link href="/help-center" className="px-4 py-2 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg font-semibold text-sm hover:bg-[#252840] transition-all">
                        Help Center
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-16 px-4 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Get In Touch
                    </h2>
                    <p className="text-lg text-[#9CA3AF] mb-4">
                        We&apos;re here to help! Reach out through any of our social channels 
                        or support options below.
                    </p>
                    <p className="text-sm text-[#9CA3AF]">
                        For the fastest response, join our Discord community.
                    </p>
                </div>
            </section>

            {/* Social Links */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 text-center">Connect With Us</h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        {socialLinks.map((social, idx) => (
                            <a 
                                key={idx}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6 ${social.hoverColor} transition-all duration-300 hover:scale-105`}
                            >
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${social.color} flex items-center justify-center mb-4 text-white`}>
                                    {social.icon}
                                </div>
                                <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    {social.name}
                                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                </h4>
                                <p className="text-sm text-[#9CA3AF] mb-4">{social.description}</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <span>Members:</span>
                                        <span className="text-white">{social.members}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <Clock className="w-4 h-4" />
                                        <span>{social.responseTime}</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Support Options */}
            <section className="py-16 px-4 bg-[#0D0F1E]/50">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold mb-8 text-center">Other Ways to Reach Us</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        {supportOptions.map((option, idx) => (
                            <div key={idx} className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        {option.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold mb-1">{option.title}</h4>
                                        <p className="text-sm text-[#9CA3AF] mb-2">{option.description}</p>
                                        {option.action.startsWith('mailto:') ? (
                                            <a href={option.action} className="text-emerald-400 hover:text-emerald-300 font-medium">
                                                {option.value}
                                            </a>
                                        ) : (
                                            <span className="text-white font-medium">{option.value}</span>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-[#9CA3AF] mt-2">
                                            <Clock className="w-4 h-4" />
                                            <span>Response time: {option.responseTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
