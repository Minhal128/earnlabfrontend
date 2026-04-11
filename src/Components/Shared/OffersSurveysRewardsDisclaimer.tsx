import React from "react";

interface OffersSurveysRewardsDisclaimerProps {
  className?: string;
}

const OffersSurveysRewardsDisclaimer: React.FC<OffersSurveysRewardsDisclaimerProps> = ({ className = "" }) => {
  return (
    <section
      className={`rounded-xl border border-[#2A2D3E] bg-[#111425] p-4 sm:p-5 ${className}`.trim()}
      aria-label="Offers, Surveys, and Rewards Disclaimer"
    >
      <h2 className="text-sm sm:text-base font-semibold text-white">
        Offers, Surveys, and Rewards Disclaimer
      </h2>

      <div className="mt-2 space-y-2 text-xs sm:text-sm leading-relaxed text-[#9CA3AF]">
        <p>
          By using our platform, you acknowledge and agree that all offers, surveys, and reward opportunities are provided by
          third-party advertisers and partners. We do not control, manage, or guarantee the availability, accuracy,
          completion, or payment of any offers, surveys, or rewards.
        </p>
        <p>
          Rewards are granted solely at the discretion of the respective advertiser or partner. We are not responsible or
          liable for any offers, surveys, or rewards that are not credited, delayed, rejected, or otherwise unpaid. If a
          reward is not received, users must contact the respective advertiser or offer provider directly for support and
          resolution.
        </p>
        <p>
          By participating in any offers or surveys, you agree that we shall not be held responsible for any missing,
          delayed, or uncredited rewards, and you release us from any liability related to third-party advertiser payments
          or offer completions.
        </p>
      </div>
    </section>
  );
};

export default OffersSurveysRewardsDisclaimer;