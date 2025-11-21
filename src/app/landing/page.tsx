"use client";

import React, { useState, useEffect } from "react";
import Image, { type StaticImageData } from "next/image";
import { ChevronDown, Menu, X, Sparkles, TrendingUp, Users, Target, Gift, Star, Zap } from "lucide-react";
import { IoMdArrowDropdown } from "react-icons/io";
import CountryFlag from "react-country-flag";

import PayPalImg from "../../../public/assets/paypal.png";
import SteamImg from "../../../public/assets/cb.png";
import VenmoImg from "../../../public/assets/v.png";
import AppleImg from "../../../public/assets/apple.png";
import DotsBg from "../../../public/assets/drop.png";
import LogoImg from "../../../public/assets/logo.png";
import HeroIcon from "../../../public/assets/top.png";
import CenterImg from "../../../public/assets/center.png";
import BottomImg from "../../../public/assets/bottom.png";
import PayPalIcon from "../../../public/assets/paypal.png";
import BitcoinIcon from "../../../public/assets/bit.png";
import VisaIcon from "../../../public/assets/visa.png";
import VenmoIcon from "../../../public/assets/venmo.png";
import WorldIcon from "../../../public/assets/world.png";
import SteamIcon from "../../../public/assets/cb.png";

import WhyChooseUs from "@/Components/Landing/WhyChooseUs";
import Testimonials from "@/Components/Landing/Testimonials";
import Question from "@/Components/Landing/Questions";
import Benefits from "@/Components/Landing/Benifits";
import Verify from "@/Components/Landing/Verify";
import Footer from "@/Components/Landing/Footer";

import SignInModal from "../../Components/HomePage/SigninModal";
import SignUpModal from "../../Components/HomePage/SignupModal";
import ForgotPasswordModal from "../../Components/HomePage/ForgotPasswordModal";
import EarningsTicker from "@/Components/Shared/EarningsTicker";
import PayoutMethods from "@/Components/Shared/PayoutMethods";
import LiveStatsToggle from "@/Components/Shared/LiveStatsToggle";
import ModernAuthButtons from "@/Components/Shared/ModernAuthButtons";

interface Notification {
    id: number;
    icon: StaticImageData;
    title: string;
    subtitle: string;
}

const notifications: Notification[] = [
    { id: 1, icon: PayPalImg, title: "Maria earned $5.00", subtitle: "3 Minutes ago" },
    { id: 2, icon: SteamImg, title: "Jacob withdrew $10.70", subtitle: "3 Minutes ago" },
    { id: 3, icon: VenmoImg, title: "Sandra earned $15.00", subtitle: "3 Minutes ago" },
    { id: 4, icon: AppleImg, title: "Jacob withdrew $10.70", subtitle: "3 Minutes ago" },
    { id: 5, icon: PayPalImg, title: "Maria earned $5.00", subtitle: "3 Minutes ago" },
    { id: 6, icon: SteamImg, title: "Jacob withdrew $10.70", subtitle: "3 Minutes ago" },
    { id: 7, icon: VenmoImg, title: "Sandra earned $15.00", subtitle: "3 Minutes ago" },
    { id: 8, icon: AppleImg, title: "Jacob withdrew $10.70", subtitle: "3 Minutes ago" },
];

export default function Landing() {
    const [open, setOpen] = useState(false);
    const [signUpOpen, setSignUpOpen] = useState(false);
    const [forgotOpen, setForgotOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [liveStatsEnabled, setLiveStatsEnabled] = useState(true);
    
    // Dynamic counters state
    const [totalPaid, setTotalPaid] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);
    const [isCountingUp, setIsCountingUp] = useState(false);

    const [currentLang, setCurrentLang] = useState({
        name: "English",
        code: "GB",
    });

    const languages = [
        { name: "English", code: "GB" },
        { name: "Spanish", code: "ES" },
        { name: "French", code: "FR" },
        { name: "German", code: "DE" },
    ];

    const handleLanguageChange = (lang: { name: string; code: string }) => {
        setCurrentLang(lang);
        setLangOpen(false);
    };

    // Dynamic counter animation effect
    useEffect(() => {
        const animateCounters = () => {
            setIsCountingUp(true);
            
            // Simulate fetching real-time data and animate counters
            const targetPaid = 2847392; // Target: $28,473.92
            const targetUsers = 52847;
            const targetTasks = 1247;
            
            const duration = 2000; // 2 seconds
            const steps = 60;
            const interval = duration / steps;
            
            let currentStep = 0;
            
            const timer = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;
                
                setTotalPaid(Math.floor(targetPaid * progress));
                setTotalUsers(Math.floor(targetUsers * progress));
                setTotalTasks(Math.floor(targetTasks * progress));
                
                if (currentStep >= steps) {
                    clearInterval(timer);
                    setIsCountingUp(false);
                }
            }, interval);
        };
        
        // Start animation after component mounts
        const timeout = setTimeout(animateCounters, 500);
        
        return () => {
            clearTimeout(timeout);
        };
    }, []);

    // Simulate real-time updates (this would connect to your API in production)
    useEffect(() => {
        const updateCounters = () => {
            // Simulate small increments based on user activity
            setTotalPaid(prev => prev + Math.floor(Math.random() * 500) + 100);
            setTotalUsers(prev => prev + Math.floor(Math.random() * 3) + 1);
            setTotalTasks(prev => prev + Math.floor(Math.random() * 2) + 1);
        };
        
        // Update every 30 seconds
        const interval = setInterval(updateCounters, 30000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#0D0F1E] text-white">
            {/* Background Dots */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${DotsBg.src})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                }}
            />

            {/* Earnings Ticker - Top Bar */}
            <EarningsTicker isVisible={liveStatsEnabled} />

            {/* Navigation */}
            <nav className="relative z-20 bg-[#0A0C1A] pt-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Main Nav Box */}
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#1A1D2E] border border-[#2A2D3E]">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <Image src={LogoImg} alt="Logo" className="h-7 w-auto object-contain hover:opacity-80 transition-opacity" />
                            
                            {/* Payout Methods Section */}
                            <div className="hidden xl:flex">
                                <PayoutMethods isLoggedIn={false} />
                            </div>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            <a href="#games" className="px-3 py-1.5 rounded-md text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#252840] transition-all">Games</a>
                            <a href="#tasks" className="px-3 py-1.5 rounded-md text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#252840] transition-all">Tasks</a>
                            <a href="#rewards" className="px-3 py-1.5 rounded-md text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#252840] transition-all">Rewards</a>
                            <a href="#contact" className="px-3 py-1.5 rounded-md text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#252840] transition-all">Contact</a>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-2">
                            {/* Live Stats Toggle */}
                            <div className="hidden lg:flex">
                                <LiveStatsToggle 
                                    defaultEnabled={liveStatsEnabled}
                                    onChange={setLiveStatsEnabled}
                                />
                            </div>

                            {/* Modern Auth Buttons */}
                            <div className="hidden md:flex">
                                <ModernAuthButtons 
                                    onSignInClick={() => setOpen(true)}
                                    onSignUpClick={() => setSignUpOpen(true)}
                                />
                            </div>

                            {/* Mobile Menu Button */}
                            <button 
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="md:hidden p-2 rounded-md bg-[#252840] border border-[#2A2D3E] hover:bg-[#2A2D3E] transition-colors"
                            >
                                {menuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>

                        {/* Auth Modals */}
                        <SignInModal
                            isOpen={open}
                            onClose={() => setOpen(false)}
                            onForgotPassword={() => {
                                setOpen(false);
                                setForgotOpen(true);
                            }}
                            onSignUp={() => {
                                setOpen(false);
                                setSignUpOpen(true);
                            }}
                        />
                        <SignUpModal
                            isOpen={signUpOpen}
                            onClose={() => setSignUpOpen(false)}
                            onSignIn={() => { 
                                setSignUpOpen(false);
                                setOpen(true);
                            }}
                        />
                        <ForgotPasswordModal isOpen={forgotOpen} onClose={() => setForgotOpen(false)} />

                    </div>

                    {/* Language Selector - Separate from main nav */}
                    <div className="hidden md:block absolute right-4 top-6 px-3 py-2 rounded-lg bg-[#1A1D2E] border border-[#2A2D3E]">
                        <button
                            className="flex items-center gap-2 rounded-md hover:bg-[#252840] px-2 py-1 transition-colors"
                            onClick={() => setLangOpen((prev) => !prev)}
                        >
                            <CountryFlag countryCode={currentLang.code} svg style={{ width: '18px', height: '12px' }} />
                            <span className="text-xs font-medium text-[#9CA3AF]">{currentLang.code}</span>
                            <IoMdArrowDropdown size={14} />
                        </button>
                        {langOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg z-20 shadow-xl">
                                <ul className="py-1 text-sm">
                                    {languages.map((lang) => (
                                        <li key={lang.code}>
                                            <button
                                                onClick={() => handleLanguageChange(lang)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                                                    currentLang.code === lang.code
                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                        : "text-[#9CA3AF] hover:bg-[#252840] hover:text-white"
                                                    }`}
                                            >
                                                <CountryFlag countryCode={lang.code} svg style={{ width: '20px', height: '14px' }} />
                                                {lang.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden fixed top-0 left-0 w-72 h-full bg-[#0A0C1A] border-r border-[#1A1D2E] shadow-2xl z-50 transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="flex justify-between items-center p-5 border-b border-[#1A1D2E]">
                        <Image src={LogoImg} alt="Logo" className="h-7 w-auto object-contain" />
                        <button 
                            onClick={() => setMenuOpen(false)} 
                            className="p-1.5 rounded-md bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    
                    <div className="p-5 space-y-6 overflow-y-auto h-[calc(100%-80px)]">
                        {/* Navigation Links */}
                        <nav className="space-y-1">
                            <a href="#games" onClick={() => setMenuOpen(false)} className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E] transition-all">Games</a>
                            <a href="#tasks" onClick={() => setMenuOpen(false)} className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E] transition-all">Tasks</a>
                            <a href="#rewards" onClick={() => setMenuOpen(false)} className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E] transition-all">Rewards</a>
                            <a href="#contact" onClick={() => setMenuOpen(false)} className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E] transition-all">Contact</a>
                        </nav>

                        {/* Auth Buttons */}
                        <div className="pt-4 border-t border-[#1A1D2E]">
                            <ModernAuthButtons 
                                onSignInClick={() => {
                                    setMenuOpen(false);
                                    setOpen(true);
                                }}
                                onSignUpClick={() => {
                                    setMenuOpen(false);
                                    setSignUpOpen(true);
                                }}
                            />
                        </div>

                        {/* Live Stats Toggle */}
                        <div className="pt-4 border-t border-[#1A1D2E]">
                            <LiveStatsToggle 
                                defaultEnabled={liveStatsEnabled}
                                onChange={setLiveStatsEnabled}
                            />
                        </div>

                        {/* Language Selector */}
                        <div className="pt-4 border-t border-[#1A1D2E]">
                            <button
                                className="flex items-center justify-between w-full px-3 py-2.5 rounded-md bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors"
                                onClick={() => setLangOpen((prev) => !prev)}
                            >
                                <div className="flex items-center gap-2">
                                    <CountryFlag countryCode={currentLang.code} svg style={{ width: '20px', height: '14px' }} />
                                    <span className="text-sm font-medium text-[#9CA3AF]">{currentLang.name}</span>
                                </div>
                                <ChevronDown size={16} className="text-[#9CA3AF]" />
                            </button>
                            {langOpen && (
                                <div className="mt-2 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg shadow-xl">
                                    <ul className="py-1">
                                        {languages.map((lang) => (
                                            <li key={lang.code}>
                                                <button
                                                    onClick={() => {
                                                        handleLanguageChange(lang);
                                                        setMenuOpen(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${currentLang.code === lang.code
                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                        : "text-[#9CA3AF] hover:bg-[#252840] hover:text-white"
                                                        }`}
                                                >
                                                    <CountryFlag countryCode={lang.code} svg style={{ width: '20px', height: '14px' }} />
                                                    {lang.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Mobile Menu Overlay */}
                {menuOpen && (
                    <div 
                        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setMenuOpen(false)}
                    />
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 px-4 md:px-6 py-12 md:py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center text-center">
                        {/* Centered Content */}
                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-medium text-emerald-400">Start Earning Today</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                                <span className="block">Turn Gaming Into</span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">$500+ Monthly Income</span>
                            </h1>

                            <p className="text-lg text-[#9CA3AF] mb-8 mx-auto max-w-2xl leading-relaxed">
                                Join 20,000+ gamers already earning real money. Play mobile games, complete simple tasks, and cash out instantly. Average user earns <strong>$127</strong> in first week!
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
                                <button 
                                    onClick={() => setSignUpOpen(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full text-lg font-semibold text-white hover:from-emerald-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
                                >
                                    Start Earning Now
                                </button>
                                <button 
                                    onClick={() => setOpen(true)}
                                    className="px-6 py-3 bg-transparent border-2 border-emerald-500/30 rounded-full text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-all"
                                >
                                    Sign In
                                </button>
                            </div>

                            {/* Stats Row */}
                            <div className="flex flex-wrap gap-6 items-center justify-center">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl font-bold text-white">20K+</div>
                                    <div className="text-sm text-[#9CA3AF]">Active Users</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl font-bold text-white">$127</div>
                                    <div className="text-sm text-[#9CA3AF]">Avg First Week</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl font-bold text-white">24/7</div>
                                    <div className="text-sm text-[#9CA3AF]">Instant Payout</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Stats Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mb-16 mt-16">
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <TrendingUp className="w-8 h-8 text-emerald-400" />
                                <div className="text-3xl md:text-4xl font-bold text-white">
                                    ${isCountingUp ? (totalPaid / 100).toFixed(0) : (totalPaid / 100).toFixed(2)}
                                </div>
                            </div>
                            <p className="text-emerald-400 font-semibold text-lg">Total Paid</p>
                            <p className="text-[#9CA3AF] text-sm mt-1">To our amazing users</p>
                        </div>
                        
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Users className="w-8 h-8 text-blue-400" />
                                <div className="text-3xl md:text-4xl font-bold text-white">
                                    {totalUsers.toLocaleString()}+
                                </div>
                            </div>
                            <p className="text-blue-400 font-semibold text-lg">Active Users</p>
                            <p className="text-[#9CA3AF] text-sm mt-1">Earning daily rewards</p>
                        </div>
                        
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Target className="w-8 h-8 text-purple-400" />
                                <div className="text-3xl md:text-4xl font-bold text-white">
                                    {totalTasks.toLocaleString()}+
                                </div>
                            </div>
                            <p className="text-purple-400 font-semibold text-lg">Tasks Completed</p>
                            <p className="text-[#9CA3AF] text-sm mt-1">This month alone</p>
                        </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center p-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                                <Gift className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Instant Rewards</h3>
                            <p className="text-[#9CA3AF] text-sm">Get paid instantly to your preferred payment method</p>
                        </div>
                        
                        <div className="flex flex-col items-center p-4">
                            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                                <Star className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Top Rated</h3>
                            <p className="text-[#9CA3AF] text-sm">Trusted by thousands with 4.8/5 star rating</p>
                        </div>
                        
                        <div className="flex flex-col items-center p-4">
                            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                                <Zap className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Easy Tasks</h3>
                            <p className="text-[#9CA3AF] text-sm">Simple tasks that anyone can complete in minutes</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Notifications Section */}
            <section className="relative z-10 py-0">
                <div className="overflow-x-auto scrollbar-hide md:pl-20 pl-5">
                    <div className="flex gap-4 md:min-w-max">
                        {notifications.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center cursor-pointer gap-3 bg-[#26293E] text-white rounded-lg md:px-8 md:py-4 px-4 py-3 md:min-w-[250px] min-w-[200px] shadow-md"
                            >
                                <div className="flex-shrink-0">
                                    <Image src={item.icon} alt={item.title} className="object-contain md:w-10 md:h-10 w-6 h-6" />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <span className="font-semibold md:text-sm text-xs leading-tight">{item.title}</span>
                                    <span className="text-xs text-gray-400 leading-tight">{item.subtitle}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Payment icons row - centered */}
            <section className="relative z-10 mt-10 px-4 md:px-0">
                <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 flex-wrap">
                    {[PayPalIcon, VisaIcon, BitcoinIcon, VenmoIcon, WorldIcon, SteamIcon].map((ic, i) => (
                        <div key={i} className="w-14 h-14 rounded-lg bg-[#0D0F1E] border border-[#21242E] flex items-center justify-center shadow-md">
                            <Image src={ic} alt={`pay-${i}`} width={36} height={36} className="object-contain" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Other Sections */}
            <WhyChooseUs />
            <Testimonials />
            <Question />
            <Benefits />
            <Verify />
            <Footer />
        </div>
    );
}
