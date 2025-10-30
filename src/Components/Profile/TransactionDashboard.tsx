"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const TransactionDashboard: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<string>("Main");

    return (
        <div className="w-full">
            <div className="flex gap-6 border-b border-gray-700">
                {["Main", "Game"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setCurrentTab(tab)}
                        className={`px-4 py-2 w-full md:text-lg text-sm ${currentTab === tab
                            ? "border-b-2 border-[#4DD6C1] text-[#4DD6C1]"
                            : "text-[#B3B6C7]"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="mt-4 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-md" />
                <input
                    type="text"
                    placeholder="Search tasks"
                    className="w-full pl-10 pr-1 py-4 rounded-md bg-[#26293E] text-sm text-gray-300 focus:outline-none focus:border-teal-400"
                />
            </div>

            {["Main", "Game"].map(
                (tab) =>
                    currentTab === tab && (
                        <div key={tab} className="mt-2 overflow-x-auto w-full">
                            <div className="min-w-[1000px]">
                                {/* Header */}
                                <div className="grid grid-cols-6 py-2 bg-[#0D0F1E] text-gray-300 text-sm rounded-md mb-2">
                                    <div className="px-6 py-3 text-center text-xs">ID</div>
                                    <div className="px-6 py-3 text-center text-xs">Type</div>
                                    <div className="px-6 py-3 text-center text-xs">Amount</div>
                                    <div className="px-6 py-3 text-center text-xs">New Balance</div>
                                    <div className="px-6 py-3 text-center text-xs">Date</div>
                                </div>

                                {/* Rows */}
                                {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                    <div
                                        key={i}
                                        className="grid grid-cols-6 py-2 bg-[#1E2133] border border-[#2A2D44] rounded-md hover:bg-[#1b1f30] mb-2"
                                    >
                                        <div className="px-6 py-3 text-center text-xs">
                                            cgr75hf....e7efr
                                        </div>
                                        <div className="px-6 py-3 text-center text-xs">
                                            Misty Island: Cursed hwoe
                                        </div>
                                        <div className="px-6 py-3 text-center text-xs">Torox</div>
                                        <div className="px-6 py-3 text-center text-xs">$23.90</div>
                                        <div className="px-6 py-3 text-center text-xs">
                                            15 Sep 25 | 9:00 AM
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
            )}
        </div>
    );
};

export default TransactionDashboard;
