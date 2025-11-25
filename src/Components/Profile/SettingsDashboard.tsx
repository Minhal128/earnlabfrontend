"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DateImg from '../../../public/assets/date.png'
import SecurityComponent from "./SecurityComponent";
import PreferencesComponent from "./PreferencesComponent";
import OthersComponents from "./OthersComponents";

type Tab = "personal" | "security" | "preferences" | "others" | "support";

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
                        { key: "support", label: "Support" },
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
                    {activeTab === "support" && <Support />}
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

const Support = () => {
    const router = useRouter();
    const [activeChannel, setActiveChannel] = useState<"faq" | "chat">("faq");

    const channels = [
        { id: "General", label: "General", online: true },
        { id: "Support", label: "Support", online: false },
    ];

    return (
        <div className="w-full h-auto">
            {/* Channel Switcher */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveChannel("faq")}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        activeChannel === "faq"
                            ? "bg-[#099F86] text-white"
                            : "bg-[#26293E] text-[#9CA3AF] hover:text-white"
                    }`}
                >
                    FAQ
                </button>
                <button
                    onClick={() => setActiveChannel("chat")}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        activeChannel === "chat"
                            ? "bg-[#099F86] text-white"
                            : "bg-[#26293E] text-[#9CA3AF] hover:text-white"
                    }`}
                >
                    Chat
                </button>
            </div>

            {/* FAQ Tab */}
            {activeChannel === "faq" && (
                <div className="space-y-6">
                    {/* Withdrawal Times */}
                    <div className="bg-[#26293E] rounded-lg p-6 border border-[#30334A]">
                        <h3 className="text-lg font-semibold text-white mb-4">Withdrawal Times</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-[#30334A]">
                                <span className="text-[#9CA3AF]">Under $5</span>
                                <span className="text-white font-medium">Instant</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[#30334A]">
                                <span className="text-[#9CA3AF]">$10-15</span>
                                <span className="text-white font-medium">15 days</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[#30334A]">
                                <span className="text-[#9CA3AF]">$15-25</span>
                                <span className="text-white font-medium">25 days</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-[#9CA3AF]">$25+</span>
                                <span className="text-white font-medium">35 days</span>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-[#26293E] rounded-lg p-6 border border-[#30334A]">
                        <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-white font-medium mb-2">How do I withdraw my earnings?</h4>
                                <p className="text-[#9CA3AF] text-sm">Go to your Wallet, select a withdrawal method, and follow the instructions. Minimum withdrawal is $5.</p>
                            </div>
                            <div className="border-t border-[#30334A] pt-4">
                                <h4 className="text-white font-medium mb-2">Why is my task pending?</h4>
                                <p className="text-[#9CA3AF] text-sm">Tasks may take 24-48 hours to verify. Make sure you completed all requirements and submitted proof if requested.</p>
                            </div>
                            <div className="border-t border-[#30334A] pt-4">
                                <h4 className="text-white font-medium mb-2">How do I increase my daily streak?</h4>
                                <p className="text-[#9CA3AF] text-sm">Log in daily and complete at least one task or survey to maintain your streak.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Tab */}
            {activeChannel === "chat" && (
                <div className="bg-[#26293E] rounded-lg p-6 border border-[#30334A]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Chat Channels</h3>
                            <p className="text-sm text-[#9CA3AF]">2 Users online</p>
                        </div>
                    </div>

                    <div className="space-y-2 mb-6">
                        {channels.map((channel) => (
                            <div
                                key={channel.id}
                                className="flex items-center gap-3 p-3 rounded-lg bg-[#1C1F33] hover:bg-[#252840] cursor-pointer transition"
                            >
                                <div className={`w-2 h-2 rounded-full ${channel.online ? "bg-emerald-400" : "bg-gray-500"}`}></div>
                                <span className="text-white font-medium">{channel.label}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => router.push("/chat")}
                        className="w-full py-3 bg-gradient-to-t from-[#099F86] to-[#0EA88F] text-white font-medium rounded-lg hover:opacity-90 transition"
                    >
                        Open Full Chat
                    </button>
                </div>
            )}
        </div>
    );
};
