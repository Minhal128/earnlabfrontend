"use client";

import React from "react";
import Image from "next/image";

import SurveyIcon from "../../../public/assets/fesur.png";
import TimeIcon from "../../../public/assets/time.png";

interface SurveyItem {
    id: number;
    title: string;
    time: string;
}

const surveys: SurveyItem[] = [
    { id: 1, title: "Survey 1", time: "2 Minutes" },
    { id: 2, title: "Survey 2", time: "2 Minutes" },
    { id: 3, title: "Survey 3", time: "2 Minutes" },
    { id: 4, title: "Survey 4", time: "2 Minutes" },
    { id: 5, title: "Survey 5", time: "2 Minutes" },
];

const FeaturedSurvey: React.FC = () => {
    return (
        <div className="w-full bg-[#0f172a] mt-5 md:px-6 md:py-6 px-3 py-5 rounded-lg text-white border border-[0.1px] border-[#50536F]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <h2 className="md:text-lg text-sm font-semibold">Featured Survey</h2>
                    <p className="md:text-sm text-[10px] text-[#8C8FA8]">
                        Complete the featured task to earn bigger rewards
                    </p>
                </div>
                <button className="md:text-sm text-xs text-[#4DD6C1] cursor-pointer font-semibold">
                    See More
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {surveys.map((survey) => (
                    <div
                        key={survey.id}
                        className="bg-[#1E2133] rounded-md overflow-hidden px-3 pt-3 shadow hover:shadow-lg transition flex flex-col"
                    >
                        {/* Image Box */}
                        <div className="w-full md:h-48 h-32 flex items-center rounded-md justify-center bg-[#26293E]">
                            <Image
                                src={SurveyIcon}
                                alt={survey.title}
                                className="object-contain md:w-28 md:h-28 w-20 h-20"
                            />
                        </div>

                        {/* Title */}
                        <div className="px-1 py-2 border-b border-[#2C2F44]">
                            <p className="md:text-sm text-xs font-medium text-white">
                                {survey.title}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 px-1 py-2">
                            <Image
                                src={TimeIcon}
                                alt="time icon"
                                width={16}
                                height={16}
                                className="object-contain"
                            />
                            <p className="md:text-xs text-[10px] text-[#8C8FA8]">{survey.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedSurvey;
