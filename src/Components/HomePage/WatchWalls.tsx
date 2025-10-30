"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import Fe1 from "../../../public/assets/freedom.png";
import Fe2 from "../../../public/assets/kobo.png";
import Fe3 from "../../../public/assets/amaz.png";

interface WatchWallItem {
    image: StaticImageData;
    title: string;
}

const offers: WatchWallItem[] = [
    { image: Fe1, title: "Vegas Craze" },
    { image: Fe2, title: "The Morning Show" },
    { image: Fe3, title: "Amazon" },
];

const WatchWalls: React.FC = () => {
    return (
        <div className="w-full bg-[#0f172a] mt-5 md:px-6 md:py-6 px-3 py-5 rounded-lg text-white border border-[0.1px] border-[#50536F]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <h2 className="md:text-lg text-sm font-semibold">Watch Walls</h2>
                    <p className="md:text-sm text-[10px] text-[#8C8FA8]">
                        Complete the featured task to earn bigger rewards
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {offers.map((offer, index) => (
                    <div
                        key={index}
                        className="overflow-hidden space-y-2 shadow hover:shadow-lg transition flex flex-col items-center"
                    >
                        <div className="relative w-full h-24 rounded-md flex items-center justify-center bg-[#1E2133]">
                            <Image
                                src={offer.image}
                                alt={offer.title}
                                width={150}
                                height={80}
                                className="object-contain"
                            />
                        </div>

                        <div className="w-full text-center py-2 rounded-md border-t border-[#2C2F44] bg-[#1E2133]">
                            <p className="text-xs font-medium">{offer.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WatchWalls;
