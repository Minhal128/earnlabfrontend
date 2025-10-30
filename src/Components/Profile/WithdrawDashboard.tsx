"use client";

import React from "react";
import { FaSearch } from "react-icons/fa";

const WithdrawDashboard: React.FC = () => {

    return (
        <div className="w-full h-96">

            {/* Search */}
            <div className="mt-4 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-md" />
                <input
                    type="text"
                    placeholder="Search tasks"
                    className="w-full pl-10 pr-1 py-4 rounded-md bg-[#26293E] text-sm text-gray-300 focus:outline-none focus:border-teal-400"
                />
            </div>

            {/* Table */}
            <div className="mt-2 overflow-x-auto w-full">
                <div className="min-w-[1000px]">
                    {/* Header */}
                    <div className="grid grid-cols-6 py-2 bg-[#0D0F1E] text-gray-300 text-sm rounded-md mb-2">
                        <div className="px-6 py-3 text-center text-xs">ID</div>
                        <div className="px-6 py-3 text-center text-xs">Payout methods</div>
                        <div className="px-6 py-3 text-center text-xs">Status</div>
                        <div className="px-6 py-3 text-center text-xs">Total</div>
                        <div className="px-6 py-3 text-center text-xs">Date</div>
                    </div>

                    {/* Rows */}
                    {[1, 2].map((_, i) => (
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
                            <div className="px-2 rounded-md py-3 text-center bg-[#151728] text-[#18C3A7] text-xs">
                                Completed
                            </div>
                            <div className="px-6 py-3 text-center text-xs">$23.90</div>
                            <div className="px-6 py-3 text-center text-xs">
                                15 Sep 25 | 9:00 AM
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WithdrawDashboard;
