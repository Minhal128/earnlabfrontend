"use client";
import { useState } from "react";
import Image from "next/image";
import DateImg from '../../../public/assets/date.png'
import SecurityComponent from "./SecurityComponent";
import PreferencesComponent from "./PreferencesComponent";
import OthersComponents from "./OthersComponents";

type Tab = "personal" | "security" | "preferences" | "others";

const SettingsDashboard = () => {
    const [activeTab, setActiveTab] = useState<Tab>("personal");

    return (
        <div className="w-full bg-[#151728] flex justify-center items-start">

            <div className="w-full bg-[#151728] rounded-xl">
                {/* Tabs */}
                <div className="flex border-b border-gray-700 mb-6">
                    {[
                        { key: "personal", label: "Personal Information" },
                        { key: "security", label: "Security" },
                        { key: "preferences", label: "Preferences" },
                        { key: "others", label: "Others" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as Tab)}
                            className={`flex-1 py-3 text-center md:text-lg text-xs font-medium transition-all ${activeTab === tab.key
                                ? "text-[#4DD6C1] border-b-2 border-[#4DD6C1]"
                                : "text-gray-400 hover:text-gray-200"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div>
                    {activeTab === "personal" && <PersonalInformation />}
                    {activeTab === "security" && <Security />}
                    {activeTab === "preferences" && <Preferences />}
                    {activeTab === "others" && <Others />}
                </div>
            </div>
        </div>
    );
};

export default SettingsDashboard;

const Input = ({
    label,
    type = "text",
    placeholder,
    value,
}: {
    label: string;
    type?: string;
    placeholder?: string;
    value?: string;
}) => (
    <div className="flex flex-col gap-2 mb-4">
        <label className="text-[#B3B6C7] text-md">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            className="w-full px-4 py-3 rounded-md bg-[#26293E] text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
    </div>
);

const PersonalInformation = () => {
    return (
        <form className="space-y-4">
            <Input label="Username" />
            <Input label="Email Address" type="email" />
            <div className="flex flex-col gap-2 mb-4">
                <label className="text-gray-300 text-sm">Date of birth</label>
                <div className="relative">
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-md bg-[#26293E] text-gray-200 focus:outline-none"
                    />
                    <span className="absolute right-3 top-3 text-gray-400">
                        <Image
                            src={DateImg}
                            alt="Profile"
                            width={20}
                            height={20}
                            className="rounded-full"
                        />
                    </span>
                </div>
            </div>
            <Input label="Post code" value="37590232" />
            <button
                type="submit"
                className="w-full py-4 rounded-md bg-gradient-to-t cursor-pointer from-[#099F86] to-[#0EA88F] text-white font-medium transition"
            >
                Save
            </button>
        </form>
    );
};

const Security = () => (
    <SecurityComponent />
);

const Preferences = () => (
    <PreferencesComponent />
);

const Others = () => (
    <OthersComponents />
);
