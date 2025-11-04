"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { updateProfileFields } from "@/store/userSlice";

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
    const profile = useSelector((s: RootState) => s.user.profile);
    const dispatch = useDispatch();
    
    const [enabled, setEnabled] = useState<Record<string, boolean>>({
        "Private Profile": false,
        "Activity Bar": false,
        "Display in USD": true,
    });

    // Load initial privacy setting from profile
    useEffect(() => {
        if (profile?.profilePrivacy) {
            setEnabled((prev) => ({
                ...prev,
                "Private Profile": profile.profilePrivacy === "private",
            }));
        }
    }, [profile]);

    const toggleSwitch = async (id: string) => {
        const newValue = !enabled[id];
        setEnabled((prev) => ({ ...prev, [id]: newValue }));

        // If toggling Private Profile, update backend
        if (id === "Private Profile") {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) {
                toast.error("Please sign in to update preferences");
                return;
            }

            try {
                const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const res = await fetch(`${api}/api/v1/user/profile`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        profilePrivacy: newValue ? "private" : "public",
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    dispatch(updateProfileFields({ profilePrivacy: newValue ? "private" : "public" }));
                    toast.success(`Profile is now ${newValue ? "private" : "public"}`);
                } else {
                    toast.error("Failed to update privacy setting");
                    // Revert on error
                    setEnabled((prev) => ({ ...prev, [id]: !newValue }));
                }
            } catch (err) {
                console.error("Error updating privacy:", err);
                toast.error("Failed to update privacy setting");
                // Revert on error
                setEnabled((prev) => ({ ...prev, [id]: !newValue }));
            }
        }
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
