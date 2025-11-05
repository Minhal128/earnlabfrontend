"use client";

import React, { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { IoMdArrowDropdown } from "react-icons/io";

import PayPalImg from "../../../public/assets/paypal.png";
import SteamImg from "../../../public/assets/cb.png";
import VenmoImg from "../../../public/assets/v.png";
import AppleImg from "../../../public/assets/apple.png";
import DotsBg from "../../../public/assets/drop.png";
import LogoImg from "../../../public/assets/logo.png";
import EngFlag from "../../../public/assets/flag.png";
import EsFlag from "../../../public/assets/flag.png";
import FrFlag from "../../../public/assets/flag.png";
import DeFlag from "../../../public/assets/flag.png";
import HeroIcon from "../../../public/assets/top.png";
import CenterImg from "../../../public/assets/center.png";
import BottomImg from "../../../public/assets/bottom.png";

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

    const [currentLang, setCurrentLang] = useState({
        name: "English",
        code: "ENG",
        flag: EngFlag,
    });

    const languages = [
        { name: "English", code: "ENG", flag: EngFlag },
        { name: "Spanish", code: "ESP", flag: EsFlag },
        { name: "French", code: "FRA", flag: FrFlag },
        { name: "German", code: "GER", flag: DeFlag },
    ];

    const handleLanguageChange = (lang: { name: string; code: string; flag: StaticImageData }) => {
        setCurrentLang(lang);
        setLangOpen(false);
    };

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
                            <Image src={currentLang.flag} alt={currentLang.code} width={18} height={12} />
                            <span className="text-xs font-medium text-[#9CA3AF]">{currentLang.code}</span>
                            <IoMdArrowDropdown size={14} />
                        </button>
                        {langOpen && (
                            <div className="absolute right-0 mt-2 w-36 bg-[#1A1D2E] border border-[#2A2D3E] rounded-lg z-20 shadow-xl">
                                <ul className="py-1 text-sm">
                                    {languages.map((lang) => (
                                        <li key={lang.code}>
                                            <button
                                                onClick={() => handleLanguageChange(lang)}
                                                className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                                                    currentLang.code === lang.code
                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                        : "text-[#9CA3AF] hover:bg-[#252840] hover:text-white"
                                                    }`}
                                            >
                                                <Image src={lang.flag} alt={lang.name} width={18} height={12} />
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
                                    <Image src={currentLang.flag} alt={currentLang.code} width={18} height={12} />
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
                                                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${currentLang.code === lang.code
                                                        ? "bg-emerald-500/10 text-emerald-400"
                                                        : "text-[#9CA3AF] hover:bg-[#252840] hover:text-white"
                                                        }`}
                                                >
                                                    <Image src={lang.flag} alt={lang.name} width={18} height={12} />
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
            <section className="relative z-10 px-4 md:px-6 py-12 md:py-20 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-center items-center gap-3 md:mb-3 mb-5 md:mt-18 mt-10">
                        <Image src={HeroIcon} alt="Hero icon" width={32} height={32} />
                        <p className="md:text-xl">Join 50,000+ users already earning daily</p>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold md:mb-6 mb-3 flex flex-wrap justify-center items-center gap-2">
                        <span>Turn Your Time Into</span>
                        <span>Real</span>
                        <Image src={CenterImg} alt="Reward Icon" className="object-contain mt-3 w-12 h-12" />
                        <span>Rewards</span>
                    </h1>
                    <p className="md:text-2xl text-sm text-[#B3B6C7] md:mb-10 mb-5 max-w-2xl mx-auto">
                        Earn cash, crypto, or gift cards by completing simple tasks, surveys, and games.
                        Join thousands already getting paid.
                    </p>
                    <button className="md:px-15 md:py-4 px-5 py-2 bg-[#099F86] rounded-full md:text-lg text-sm font-semibold transition-colors">
                        Start Earning
                    </button>
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

            {/* Bottom Image Section */}
            <section className="relative z-10 px-4 md:px-0 md:py-10">
                <div className="md:mt-12 mt-10">
                    <Image src={BottomImg} alt="Bottom Full Image" className="w-full h-full object-cover rounded-xl" />
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
