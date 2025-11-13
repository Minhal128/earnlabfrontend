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

            {/* Cards Grid - 3 surveys per row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {surveys.slice(0, 3).map((survey) => (
                    <div
                        key={survey.id}
                        className="bg-gradient-to-br from-[#1E2133] to-[#26293E] rounded-xl overflow-hidden p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-[#2C2F44]"
                    >
                        {/* Image Box */}
                        <div className="w-full h-40 flex items-center rounded-lg justify-center bg-gradient-to-br from-[#26293E] to-[#1E2133] mb-4">
                            <Image
                                src={SurveyIcon}
                                alt={survey.title}
                                className="object-contain w-24 h-24"
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                            {/* Title */}
                            <h3 className="text-lg font-semibold text-white">
                                {survey.title}
                            </h3>

                            {/* Time and Reward */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={TimeIcon}
                                        alt="time icon"
                                        width={16}
                                        height={16}
                                        className="object-contain"
                                    />
                                    <span className="text-sm text-[#8C8FA8]">{survey.time}</span>
                                </div>
                                <div className="text-emerald-400 font-semibold text-sm">
                                    $0.50 - $2.00
                                </div>
                            </div>

                            {/* Action Button */}
                            <button className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all">
                                Start Survey
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedSurvey;
