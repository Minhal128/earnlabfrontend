import TopBar from "@/Components/Topbar";
import React from "react";
import FeaturedTask from "@/Components/HomePage/FeaturedTask";
import Tasks from "@/Components/Tasks/Tasks";
import FeedBar from "@/Components/HomePage/FeedBar";

export default function Task() {
    return (
        <>
            <TopBar />
            <main className="md:p-6 p-3 bg-[#1E2133] min-h-screen">
                <FeedBar />

                {/* Page Content */}
                <FeaturedTask />
                <Tasks />
            </main>
        </>
    );
}
