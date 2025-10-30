import TopBar from "@/Components/Topbar";
import React from "react";
import ProfileDashboard from "@/Components/Profile/ProfileDashboard";
import FeedBar from "@/Components/HomePage/FeedBar";
import ProfileControls from "@/Components/Profile/ProfileControls";

export default function ProfileMain() {
    return (
        <>
            <TopBar />
            <main className="md:p-6 p-3 bg-[#1E2133] min-h-screen">
                <FeedBar />

                <ProfileControls />

                {/* Page Content */}
                <ProfileDashboard />
            </main>
        </>
    );
}
