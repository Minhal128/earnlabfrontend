import TopBar from "@/Components/Topbar";
import PageNavigation from "@/Components/Shared/PageNavigation";
import ReferralHub from "@/Components/Referrals/ReferralHub";

export default function ReferralsPage() {
    return (
        <>
            <TopBar />
            <PageNavigation />
            <main className="min-h-screen bg-[#0A0C1A] pb-20 lg:pb-0">
                <ReferralHub />
            </main>
        </>
    );
}
