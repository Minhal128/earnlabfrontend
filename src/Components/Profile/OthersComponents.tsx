"use client";
import { useState } from "react";

const OthersComponents = () => {
    const [selected, setSelected] = useState<string>("");

    const options = ["1 Day", "3 Days", "7 Days", "14 Days", "30 Days"];

    return (
        <div className="md:w-[58%] h-96">
            {/* Heading */}
            <h2 className="text-white text-lg font-semibold mb-2">Self-exclusion</h2>
            <p className="text-[#8C8FA8] text-sm mb-6">
                Our self-exclusion feature allows you to take a break from playing
                games at any time. Choose a time-out period, and we will pause your access
                to our games. You can still earn and use all other features
            </p>

            {/* Options */}
            <div className="flex flex-wrap md:gap-3 gap-2 mb-3">
                {options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => setSelected(opt)}
                        className={`md:px-10 px-3 md:py-4 py-2 rounded-md md:text-sm text-xs font-medium transition ${selected === opt
                            ? "bg-teal-500 text-white"
                            : "bg-[#26293E] text-[#B3B6C]"
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {/* Action Button */}
            <button
                disabled={!selected}
                className={'w-full bg-[#9F0909] md:py-4 py-3 cursor-pointer rounded-md font-medium text-white transition'}
            >
                Activate Self-exclusion
            </button>
        </div>
    );
};

export default OthersComponents;
