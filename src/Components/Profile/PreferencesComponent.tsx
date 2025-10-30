"use client";
import { useState } from "react";

interface PreferenceItem {
    id: string;
    title: string;
    subtitle: string;
}

const preferences: PreferenceItem[] = [
    {
        id: "Private Profile",
        title: "Private Profile",
        subtitle: "Hides your activity, username, and statistics from other users",
    },
    {
        id: "Activity Bar",
        title: "Activity Bar",
        subtitle: "Display a feed of recent activities and interactions",
    },
    {
        id: "Display in USD",
        title: "Display in USD",
        subtitle: "Show all amounts in USD for easy reference",
    },
];

const PreferencesComponent = () => {
    const [enabled, setEnabled] = useState<Record<string, boolean>>({
        notifications: false,
        darkMode: true,
        autoUpdate: false,
    });

    const toggleSwitch = (id: string) => {
        setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="w-full rounded-lg h-96 shadow-md divide-y divide-gray-700">
            {preferences.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center justify-between py-4"
                >
                    <div className="flex flex-col gap-2">
                        <span className="text-white font-medium text-sm md:text-base">
                            {item.title}
                        </span>
                        <span className="text-[#8C8FA8] text-xs md:text-sm">
                            {item.subtitle}
                        </span>
                    </div>

                    <button
                        onClick={() => toggleSwitch(item.id)}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${enabled[item.id] ? "bg-teal-500" : "bg-gray-500"
                            }`}
                    >
                        <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${enabled[item.id] ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default PreferencesComponent;
