"use client";

import React, { useState } from "react";
import Image from "next/image";

import Af1 from "../../../public/assets/af1.png";
import Af2 from "../../../public/assets/af2.png";
import Af3 from "../../../public/assets/af3.png";
import Af4 from "../../../public/assets/af4.png";
import tierImg from "../../../public/assets/teir.png";

type Tab = "dashboard" | "codes" | "tiers";

const tiers = [1, 2, 3, 4, 5, 6, 7, 8];

const AffiliateDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>("dashboard");

    return (
        <div className="w-full pt-5 bg-[#1E2133] text-white rounded-lg">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-xl md:text-2xl font-semibold">Affiliate</h2>
                <p className="text-[#B3B6C7] text-sm md:text-base">
                    Become an affiliate and earn money for every referral
                </p>
            </div>

            {/* Tabs */}
            <div className="flex p-2 bg-[#26293E] w-96 rounded-md overflow-hidden mb-6">
                {["dashboard", "codes", "tiers"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as Tab)}
                        className={`flex-1 px-4 py-2 cursor-pointer capitalize transition text-sm md:text-base border-r border-[#2A2D44] last:border-r-0 
              ${activeTab === tab
                                ? "bg-[#3A3E57] rounded-md text-[#B3B6C7]"
                                : "text-gray-400"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === "dashboard" && (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-[#26293E] px-4 py-5 rounded-md flex items-center gap-3">
                            <Image
                                src={Af1}
                                alt="Available Revenue"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                            <div>
                                <h3 className="text-lg md:text-xl font-semibold">$10.70</h3>
                                <p className="text-[#8C8FA8] text-sm">Available Revenue</p>
                            </div>
                        </div>
                        <div className="bg-[#26293E] px-4 py-5 rounded-md flex items-center gap-3">
                            <Image
                                src={Af2}
                                alt="Affiliate Users"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                            <div>
                                <h3 className="text-lg md:text-xl font-semibold">34</h3>
                                <p className="text-[#8C8FA8] text-sm">Affiliate Users</p>
                            </div>
                        </div>
                        <div className="bg-[#26293E] px-4 py-5 rounded-md flex items-center gap-3">
                            <Image
                                src={Af3}
                                alt="Lifetime Revenue"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                            <div>
                                <h3 className="text-lg md:text-xl font-semibold">$10.70</h3>
                                <p className="text-[#8C8FA8] text-sm">Lifetime Revenue</p>
                            </div>
                        </div>
                        <div className="bg-[#26293E] px-4 py-5 rounded-md flex items-center gap-3">
                            <Image
                                src={Af4}
                                alt="Total Earned"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                            <div>
                                <h3 className="text-lg md:text-xl font-semibold">$10.70</h3>
                                <p className="text-[#8C8FA8] text-sm">Total Earned</p>
                            </div>
                        </div>
                    </div>



                    {/* Info Badge */}
                    <div className="mb-6">
                        <span className="px-6 py-2 text-sm rounded-full bg-[#26293E] text-[#18C3A7]">
                            Redeeming awards $0.25 and 3 free boxes
                        </span>
                    </div>

                    <div className="h-[2px] mb-4 w-full bg-[#30334A]"></div>

                    <div className="bg-[#26293E] p-4 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">Redemptions</h3>

                        <div className="overflow-x-auto">
                            <div className="min-w-[600px]">

                                {/* Header */}
                                <div className="grid grid-cols-4 py-2 bg-[#161827] text-gray-300 text-sm rounded-md mb-2">
                                    <div className="px-6 py-3 text-center">User</div>
                                    <div className="px-6 py-3 text-center">Total Earned</div>
                                    <div className="px-6 py-3 text-center">Lifetime Revenue</div>
                                    <div className="px-6 py-3 text-center">Date</div>
                                </div>

                                {/* Rows */}
                                {[1, 2, 3].map((_, i) => (
                                    <div
                                        key={i}
                                        className="grid grid-cols-4 py-2 bg-[#1E2133] border border-[#2A2D44] rounded-md hover:bg-[#1b1f30] mb-2"
                                    >
                                        <div className="px-6 py-3 text-center">Martins</div>
                                        <div className="px-6 py-3 text-center">$20.67</div>
                                        <div className="px-6 py-3 text-center">$400.9</div>
                                        <div className="px-6 py-3 text-center">15 Sep 25 | 9:00 AM</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </>
            )}

            {activeTab === "codes" && (
                <div className="">

                    <div className="flex items-center mb-7 py-2 px-3 bg-[#26293E] rounded-md overflow-hidden w-full max-w-md">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Enter your code"
                            className="bg-transparent outline-none px-3 py-2 text-sm text-white placeholder-gray-400 flex-1"
                            style={{ width: "70%" }}
                        />

                        {/* Search Button */}
                        <button className="bg-[#099F86] text-white px-5 py-3 rounded-md text-sm font-medium">
                            Create code
                        </button>
                    </div>
                    {/* Info Badge */}
                    <div className="mb-6">
                        <span className="px-6 py-2 text-sm rounded-full bg-[#26293E] text-[#18C3A7]">
                            Redeeming awards $0.25 and 3 free boxes
                        </span>
                    </div>

                    <div className="h-[2px] mb-4 w-full bg-[#30334A]"></div>

                    <div className="bg-[#26293E] p-4 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">Redemptions</h3>

                        <div className="overflow-x-auto">
                            <div className="min-w-[600px]">

                                {/* Header */}
                                <div className="grid grid-cols-4 py-2 bg-[#161827] text-gray-300 text-sm rounded-md mb-2">
                                    <div className="px-6 py-3 text-center">User</div>
                                    <div className="px-6 py-3 text-center">Total Earned</div>
                                    <div className="px-6 py-3 text-center">Lifetime Revenue</div>
                                    <div className="px-6 py-3 text-center">Date</div>
                                </div>

                                {/* Rows */}
                                {[1, 2, 3].map((_, i) => (
                                    <div
                                        key={i}
                                        className="grid grid-cols-4 py-2 bg-[#1E2133] border border-[#2A2D44] rounded-md hover:bg-[#1b1f30] mb-2"
                                    >
                                        <div className="px-6 py-3 text-center">Martins</div>
                                        <div className="px-6 py-3 text-center">$20.67</div>
                                        <div className="px-6 py-3 text-center">$400.9</div>
                                        <div className="px-6 py-3 text-center">15 Sep 25 | 9:00 AM</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {activeTab === "tiers" && (
                <div className="">
                    <div className="mb-6">
                        <span className="px-6 py-2 text-sm rounded-full bg-[#26293E] text-[#18C3A7]">
                            Redeeming awards $0.25 and 3 free boxes
                        </span>
                    </div>

                    <div className="h-[2px] mb-4 w-full bg-[#30334A]"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        {tiers.map((tier) => (
                            <div
                                key={tier}
                                className="bg-[#26293E] rounded-xl p-4 shadow-md hover:shadow-lg transition"
                            >

                                <div className="flex items-center gap-2 mb-3">
                                    <Image
                                        src={tierImg}
                                        alt={`Tier ${tier}`}
                                        width={40}
                                        height={40}
                                        className="rounded-md"
                                    />
                                    <h3 className="text-lg font-semibold text-white">
                                        Tier {tier}
                                    </h3>
                                </div>

                                <hr className="border-[#30334A] mb-3" />

                                <p className="text-[#B3B6C7] text-sm mb-2">
                                    Benefits:
                                </p>

                                <p className="text-white text-sm mb-3">
                                    5% commission on Earnings
                                </p>

                                <hr className="border-[#30334A] mb-3" />

                                <p className="text-[#B3B6C7] text-sm mb-2">
                                    Requirements
                                </p>

                                <p className="text-white text-sm mb-3">
                                    $0.00 Total Earned
                                </p>

                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AffiliateDashboard;
