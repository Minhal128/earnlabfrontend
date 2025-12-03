"use client";

import React from "react";
import { StaticImageData } from "next/image";
import { ClipboardList } from "lucide-react";
import Fe1 from "../../../public/assets/freedom.png";
import Fe2 from "../../../public/assets/kobo.png";
import Fe3 from "../../../public/assets/amaz.png";
import Fe4 from "../../../public/assets/mor.png";
import ModernSection from "../Shared/ModernSection";
import ModernCard from "../Shared/ModernCard";

interface ServeyWallItem {
    image: StaticImageData;
    title: string;
}

const offers: ServeyWallItem[] = [
    { image: Fe1, title: "Vegas Craze" },
    { image: Fe2, title: "The Morning Show" },
    { image: Fe3, title: "Amazon" },
    { image: Fe4, title: "Rakuten Kobo" },
    { image: Fe1, title: "Daily Survey" },
];

const ServeyWalls: React.FC = () => {
    const handleSurveyClick = (survey: ServeyWallItem) => {
        console.log("Clicked survey:", survey.title);
    };

    return (
        <ModernSection
            title="Survey Walls"
            description="Share your opinion and earn rewards"
            icon={<ClipboardList className="text-teal-400" size={20} />}
        >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                {offers.map((offer, index) => (
                    <ModernCard
                        key={index}
                        image={offer.image}
                        title={offer.title}
                        onClick={() => handleSurveyClick(offer)}
                        variant="compact"
                    />
                ))}
            </div>
        </ModernSection>
    );
};

export default ServeyWalls;
