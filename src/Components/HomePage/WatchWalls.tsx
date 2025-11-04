"use client";

import React from "react";
import { StaticImageData } from "next/image";
import { Play } from "lucide-react";
import Fe1 from "../../../public/assets/freedom.png";
import Fe2 from "../../../public/assets/kobo.png";
import Fe3 from "../../../public/assets/amaz.png";
import ModernSection from "../Shared/ModernSection";
import ModernCard from "../Shared/ModernCard";

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
    const handleVideoClick = (video: WatchWallItem) => {
        console.log("Clicked video:", video.title);
    };

    return (
        <ModernSection
            title="Watch Walls"
            description="Watch videos and earn rewards"
            icon={<Play className="text-teal-400" size={20} />}
        >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                {offers.map((offer, index) => (
                    <ModernCard
                        key={index}
                        image={offer.image}
                        title={offer.title}
                        onClick={() => handleVideoClick(offer)}
                        variant="compact"
                    />
                ))}
            </div>
        </ModernSection>
    );
};

export default WatchWalls;
