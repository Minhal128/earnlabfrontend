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

            {/* Navigation */}
            <nav className="relative z-20 bg-[#0D0F1E] pt-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
                    {/* Main Nav Box */}
                    <div className="flex-1 py-[8px] px-5 rounded-full bg-[#151728] flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Image src={LogoImg} alt="Logo" width={160} height={10} className="object-contain" />
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex flex-1 justify-center space-x-8">
                            <a href="#" className="text-white hover:text-gray-300 font-medium">Games</a>
                            <a href="#" className="text-white hover:text-gray-300 font-medium">Tasks</a>
                            <a href="#" className="text-white hover:text-gray-300 font-medium">Rewards</a>
                            <a href="#" className="text-white hover:text-gray-300 font-medium">Contact</a>
                        </div>

                        {/* Buttons */}
                        <div className="hidden md:flex items-center space-x-2">
                            <button
                                onClick={() => setOpen(true)}
                                className="text-[#151728] cursor-pointer rounded-full bg-[#FFFFFF] font-medium px-6 py-2"
                            >
                                Sign in
                            </button>
                            <button
                                onClick={() => setSignUpOpen(true)}
                                className="bg-[#099F86] cursor-pointer text-white font-medium px-6 py-2 rounded-full transition-colors"
                            >
                                Sign up
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

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setMenuOpen(!menuOpen)}>
                                {menuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>

                    {/* Language Selector */}
                    <div className="hidden md:block ml-4 relative px-3 py-4 rounded-full bg-[#151728]">
                        <button
                            className="flex items-center gap-2 rounded-md transition-colors"
                            onClick={() => setLangOpen((prev) => !prev)}
                        >
                            <Image src={currentLang.flag} alt={currentLang.code} width={20} height={14} />
                            <span className="text-sm font-medium">{currentLang.code}</span>
                            <IoMdArrowDropdown size={16} />
                        </button>
                        {langOpen && (
                            <div className="absolute right-0 mt-5 w-30 bg-[#26293E] rounded-xl z-20 shadow-md">
                                <ul className="py-2 px-2 text-sm">
                                    {languages.map((lang) => (
                                        <li key={lang.code}>
                                            <button
                                                onClick={() => handleLanguageChange(lang)}
                                                className={`w-full flex rounded-xl items-center gap-2 px-3 py-2 text-left ${currentLang.code === lang.code
                                                    ? "bg-[#099F86] text-white"
                                                    : "hover:bg-[#33354d]"
                                                    }`}
                                            >
                                                <Image src={lang.flag} alt={lang.name} width={20} height={14} />
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
                    className={`md:hidden fixed top-0 left-0 w-full h-full bg-[#0D0F1E] z-30 transition-all duration-300 ease-in-out ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
                        }`}
                >
                    <div className="absolute top-5 right-5">
                        <button onClick={() => setMenuOpen(false)} className="border rounded-md p-1">
                            <X size={20} className="text-white" />
                        </button>
                    </div>
                    <div className="p-6 space-y-6 mt-10 overflow-y-auto h-full">
                        <a href="#" className="block text-lg text-white hover:text-gray-300 font-medium">Games</a>
                        <a href="#" className="block text-lg text-white hover:text-gray-300 font-medium">Tasks</a>
                        <a href="#" className="block text-lg text-white hover:text-gray-300 font-medium">Rewards</a>
                        <a href="#" className="block text-lg text-white hover:text-gray-300 font-medium">Contact</a>

                        <div className="space-y-6">
                            <button
                                onClick={() => setOpen(true)}
                                className="w-full text-[#151728] cursor-pointer rounded-full bg-[#FFFFFF] font-medium px-6 py-3"
                            >
                                Sign in
                            </button>
                            <button
                                onClick={() => setSignUpOpen(true)}
                                className="w-full bg-[#099F86] cursor-pointer text-white font-medium px-6 py-3 rounded-full transition-colors"
                            >
                                Sign up
                            </button>
                        </div>

                        {/* Mobile Language Selector */}
                        <div className="relative mt-2">
                            <button
                                className="flex items-center justify-between w-full rounded-full px-3 py-4 bg-[#26293E]"
                                onClick={() => setLangOpen((prev) => !prev)}
                            >
                                <div className="flex items-center gap-2">
                                    <Image src={currentLang.flag} alt={currentLang.code} width={20} height={14} />
                                </div>
                                <span className="flex-1 text-center text-sm font-medium">{currentLang.code}</span>
                                <ChevronDown size={16} className="ml-auto" />
                            </button>
                            {langOpen && (
                                <div className="absolute mt-2 w-full bg-[#26293E] rounded-xl z-40 shadow-md">
                                    <ul className="py-1 text-sm">
                                        {languages.map((lang) => (
                                            <li key={lang.code}>
                                                <button
                                                    onClick={() => handleLanguageChange(lang)}
                                                    className={`w-full flex rounded-xl items-center justify-between px-3 py-2 text-left ${currentLang.code === lang.code
                                                        ? "bg-[#099F86] text-white"
                                                        : "hover:bg-[#33354d]"
                                                        }`}
                                                >
                                                    <Image src={lang.flag} alt={lang.name} width={20} height={14} />
                                                    <span className="flex-1 text-center">{lang.name}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
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
