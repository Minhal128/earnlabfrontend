"use client";

import React from "react";
import Image from "next/image";
import { FaStar, FaTelegramPlane, FaDiscord } from "react-icons/fa";
import Logo from "../../../public/assets/logo.png";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b mt-10 from-[#0A0F1C] to-[#151728] text-gray-300 px-6 md:px-12 lg:px-20 py-10">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-10 border-b border-gray-700 pb-8">

                <div className="max-w-xs">
                    <Image
                        src={Logo}
                        alt="LabWards Logo"
                        width={190}
                        height={10}
                        className="object-contain"
                    />

                    <p className="mt-4 text-sm text-gray-400">
                        Sign up today and grab your instant bonus. Every task completed puts
                        money in your pocket.
                    </p>
                </div>

                <div className="w-full md:w-auto flex flex-col md:flex-row md:space-x-20 gap-6">

                    <div className="flex w-full justify-between md:hidden">
                        {/* Support Links */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Support</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white transition">
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition">
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Features Links */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Features</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white transition">
                                        Games
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition">
                                        Rewards
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition">
                                        Tasks
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Social Icons */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Connect With Us</h3>
                            <div className="flex space-x-3">
                                <a
                                    href="#"
                                    className="bg-[#1B1F2E] p-3 rounded-md hover:bg-[#099F86] transition"
                                >
                                    <FaStar className="text-white text-lg" />
                                </a>
                                <a
                                    href="#"
                                    className="bg-[#1B1F2E] p-3 rounded-md hover:bg-[#099F86] transition"
                                >
                                    <FaTelegramPlane className="text-white text-lg" />
                                </a>
                                <a
                                    href="#"
                                    className="bg-[#1B1F2E] p-3 rounded-md hover:bg-[#099F86] transition"
                                >
                                    <FaDiscord className="text-white text-lg" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:flex md:space-x-20">
                        {/* Support Links */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Support</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white transition">
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition">
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Features Links */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Features</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-white transition">
                                        Games
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition">
                                        Rewards
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition">
                                        Tasks
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Social Icons */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Connect With Us</h3>
                            <div className="flex space-x-3">
                                <a
                                    href="#"
                                    className="bg-[#1B1F2E] p-3 rounded-md hover:bg-[#099F86] transition"
                                >
                                    <FaStar className="text-white text-lg" />
                                </a>
                                <a
                                    href="#"
                                    className="bg-[#1B1F2E] p-3 rounded-md hover:bg-[#099F86] transition"
                                >
                                    <FaTelegramPlane className="text-white text-lg" />
                                </a>
                                <a
                                    href="#"
                                    className="bg-[#1B1F2E] p-3 rounded-md hover:bg-[#099F86] transition"
                                >
                                    <FaDiscord className="text-white text-lg" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 mt-6 gap-3">
                <p>©2025 LabWards, All Rights Reserved</p>
                <div className="flex space-x-6">
                    <a href="#" className="hover:text-white transition">
                        Terms of Use
                    </a>
                    <a href="#" className="hover:text-white transition">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-white transition">
                        Cookie Policy
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
