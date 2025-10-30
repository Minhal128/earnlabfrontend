import TopBar from "@/Components/Topbar";
import React from "react";
import ServeyWalls from "@/Components/Servey/ServeyWalls";
import FeedBar from "@/Components/HomePage/FeedBar";


export default function ProfileMain() {
    return (
        <>
            <TopBar />
            <main className="md:p-6 p-3 bg-[#1E2133] min-h-screen">
                <FeedBar />
                <ServeyWalls />
            </main>
        </>
    );
}
