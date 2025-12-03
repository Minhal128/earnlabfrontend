import { redirect } from "next/navigation";

// Redirect Affiliate page to Referrals
export default function AffiliateMain() {
    redirect('/referrals');
}
