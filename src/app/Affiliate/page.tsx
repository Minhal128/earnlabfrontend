import TopBar from "@/Components/Topbar";
import Image, { type StaticImageData } from "next/image";
import React from "react";
import Link from "next/link";

import PayPalImg from "../../../public/assets/paypal.png";
import SteamImg from "../../../public/assets/cb.png";
import VenmoImg from "../../../public/assets/v.png";
import AppleImg from "../../../public/assets/apple.png";
import AffiliateDashboard from "@/Components/Affiliate/AffiliateDashboad";

interface Notification {
    id: number;
    icon: StaticImageData;
    title: string;
    subtitle: string;
}

const notifications: Notification[] = [
    {
        id: 1,
        icon: PayPalImg,
        title: "Maria earned $5.00",
        subtitle: "3 Minutes ago",
    },
    {
        id: 2,
        icon: SteamImg,
        title: "Jacob withdrew $10.70",
        subtitle: "3 Minutes ago",
    },
    {
        id: 3,
        icon: VenmoImg,
        title: "Sandra earned $15.00",
        subtitle: "3 Minutes ago",
    },
    {
        id: 4,
        icon: AppleImg,
        title: "Jacob withdrew $10.70",
        subtitle: "3 Minutes ago",
    },
    {
        id: 5,
        icon: PayPalImg,
        title: "Maria earned $5.00",
        subtitle: "3 Minutes ago",
    },
    {
        id: 6,
        icon: SteamImg,
        title: "Jacob withdrew $10.70",
        subtitle: "3 Minutes ago",
    },
    {
        id: 7,
        icon: VenmoImg,
        title: "Sandra earned $15.00",
        subtitle: "3 Minutes ago",
    },
    {
        id: 8,
        icon: AppleImg,
        title: "Jacob withdrew $10.70",
        subtitle: "3 Minutes ago",
    },
];

export default function AffiliateMain() {
    return (
        <>
            <TopBar />
            <main className="md:p-6 p-3 bg-[#1E2133] min-h-screen">
                {/* Navigation Tabs */}
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                    <Link
                        href="/home"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#26293E] transition-colors whitespace-nowrap"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/earn"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#26293E] transition-colors whitespace-nowrap"
                    >
                        Earn
                    </Link>
                    <Link
                        href="/tasks"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#26293E] transition-colors whitespace-nowrap"
                    >
                        Tasks
                    </Link>
                    <Link
                        href="/servey"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#26293E] transition-colors whitespace-nowrap"
                    >
                        Surveys
                    </Link>
                    <Link
                        href="/rewards"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#26293E] transition-colors whitespace-nowrap"
                    >
                        Rewards
                    </Link>
                    <Link
                        href="/leaderboard"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#26293E] transition-colors whitespace-nowrap"
                    >
                        Leaderboard
                    </Link>
                    <div className="px-4 py-2 rounded-lg text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 whitespace-nowrap">
                        Affiliate
                    </div>
                </div>

                {/* Notification Bar */}
                <div className="overflow-x-auto scrollbar-hide mb-6">
                    <div className="flex gap-4 md:min-w-max">
                        {notifications.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center cursor-pointer gap-3 bg-[#26293E] text-white rounded-lg md:px-6 md:py-4 px-4 py-3 md:min-w-[250px] min-w-[200px] shadow-md"
                            >
                                <div className="flex-shrink-0">
                                    <Image
                                        src={item.icon}
                                        alt={item.title}
                                        className="object-contain md:w-8 md:h-8 w-6 h-6"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <span className="font-semibold md:text-sm text-xs leading-tight">
                                        {item.title}
                                    </span>
                                    <span className="text-xs text-gray-400 leading-tight">
                                        {item.subtitle}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Page Content */}
                <AffiliateDashboard />
            </main>
        </>
    );
}
