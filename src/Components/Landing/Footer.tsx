"use client";

import React from "react";
import Image from "next/image";
import { FaTelegramPlane, FaDiscord, FaTwitter } from "react-icons/fa";
import { Zap, Heart, ArrowRight, Mail, MapPin } from "lucide-react";
import Logo from "../../../public/assets/logo.png";

const Footer = () => {
    return (
        <footer className="w-full bg-gradient-to-b from-[#0A0C1A] via-[#0D0F1E] to-[#000000] text-white px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* CTA Section */}
                <div className="mb-16 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl border border-emerald-500/20 p-8 md:p-12 hover:border-emerald-500/50 transition-all duration-300">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Ready to Start Earning?</h3>
                            <p className="text-[#9CA3AF]">Join thousands of users making real money today</p>
                        </div>
                        <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-lg font-semibold whitespace-nowrap transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/20">
                            Get Started <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-[#2A2D3E] pb-12 mb-12">

                {/* Brand Column */}
                <div>
                    <Image
                        src={Logo}
                        alt="LabWards Logo"
                        width={160}
                        height={40}
                        className="object-contain mb-4"
                    />
                    <p className="text-sm text-[#9CA3AF] leading-relaxed mb-6">
                        Turn your free time into real rewards. Complete tasks, surveys, and offers to earn money.
                    </p>
                    <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
                        <Heart className="w-4 h-4 text-emerald-400" />
                        <span>Made with passion for our community</span>
                    </div>
                </div>

                {/* Product Links */}
                <div>
                    <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-emerald-400" />
                        Product
                    </h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#" className="text-[#9CA3AF] hover:text-emerald-400 transition-colors">Games</a></li>
                        <li><a href="#" className="text-[#9CA3AF] hover:text-emerald-400 transition-colors">Tasks</a></li>
                        <li><a href="#" className="text-[#9CA3AF] hover:text-emerald-400 transition-colors">Surveys</a></li>
                        <li><a href="#" className="text-[#9CA3AF] hover:text-emerald-400 transition-colors">Rewards</a></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div>
                    <h4 className="text-white font-bold mb-6">Support</h4>
                    <ul className="space-y-3 text-sm">
                        <li><a href="#" className="text-[#9CA3AF] hover:text-emerald-400 transition-colors">Help Center</a></li>
                        <li><a href="#" className="text-[#9CA3AF] hover:text-emerald-400 transition-colors">Contact Us</a></li>
                        <li><a href="#" className="text-[#9CA3AF] hover:text-emerald-400 transition-colors">FAQ</a></li>
                        <li><a href="#" className="text-[#9CA3AF] hover:text-emerald-400 transition-colors">Status</a></li>
                    </ul>
                </div>

                {/* Social & Contact */}
                <div>
                    <h4 className="text-white font-bold mb-6">Connect</h4>
                    <div className="flex gap-3 mb-6">
                        <a href="#" className="w-10 h-10 rounded-lg bg-[#1A1D2E] border border-[#2A2D3E] flex items-center justify-center text-[#9CA3AF] hover:text-emerald-400 hover:border-emerald-400 transition-all">
                            <FaTelegramPlane className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-lg bg-[#1A1D2E] border border-[#2A2D3E] flex items-center justify-center text-[#9CA3AF] hover:text-emerald-400 hover:border-emerald-400 transition-all">
                            <FaDiscord className="w-5 h-5" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-lg bg-[#1A1D2E] border border-[#2A2D3E] flex items-center justify-center text-[#9CA3AF] hover:text-emerald-400 hover:border-emerald-400 transition-all">
                            <FaTwitter className="w-5 h-5" />
                        </a>
                    </div>
                    <div className="space-y-2 text-sm text-[#9CA3AF]">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>support@labwards.com</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[#9CA3AF] mt-12 pt-8 gap-4">
                <p>© 2025 LabWards. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a>
                </div>
            </div>
            </div>
        </footer>
    );
};

export default Footer;
