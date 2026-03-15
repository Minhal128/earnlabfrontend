"use client";

import React, { useState } from "react";

interface TickerEvent {
  id: number;
  username: string;
  amount: string;
  type: "earned" | "withdrew";
  category: string;
  icon?: string;
}

const EarningsTicker: React.FC = () => {
  const [events] = useState<TickerEvent[]>([
    { id: 1, username: "User", type: "withdrew", amount: "$0.8", category: "Slots", icon: "/assets/18918.png" },
    { id: 2, username: "User", type: "withdrew", amount: "$0.8", category: "Worldcoin", icon: "/assets/0CNf0QJUenb2.png" },
    { id: 3, username: "User", type: "withdrew", amount: "$0.8", category: "Slot", icon: "/assets/17365.png" },
    { id: 4, username: "User", type: "withdrew", amount: "$0.8", category: "Monopoly", icon: "/assets/17065.png" },
    { id: 5, username: "User", type: "withdrew", amount: "$0.8", category: "Worldcoin", icon: "/assets/0CNf0QJUenb2.png" },
  ]);

  // Triple duplicate for seamless infinite scroll
  const duplicatedEvents = [...events, ...events, ...events];

  return (
    <div className="w-full bg-[#0D0F1E] py-4 overflow-hidden border-b border-[#1E2133]">
      <div className="flex animate-scroll-left gap-[15px] px-16">
        {duplicatedEvents.map((event, index) => (
          <div
            key={`${event.id}-${index}`}
            className="flex-shrink-0 flex items-center gap-[10px] p-[8px] rounded-[10px] bg-[#181A2C]"
            style={{ width: 260, height: 72 }}
          >
            {/* Image Container */}
            <div
              className="w-[56px] h-[56px] rounded-[3px] bg-cover bg-center shrink-0"
              style={{ backgroundImage: `url(${event.icon})` }}
            />

            {/* Text Information */}
            <div className="flex flex-col justify-center gap-[8px]">
              <span className="text-[#6B6E8A] text-[17px] leading-[20px] font-medium tracking-[-0.01em]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                {event.type === "earned" ? "User earned" : "User withdrew"}
              </span>
              <div className="flex items-center gap-[8px]">
                <span className="text-[#B3B6C7] text-[20px] leading-[20px] font-medium tracking-[-0.01em]" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {event.category}
                </span>
                <span
                  className="text-[24px] leading-[24px] font-bold tracking-[0.02em] bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(337.7deg, rgba(255, 255, 255, 0) 40.23%, rgba(255, 255, 255, 0.6) 125.94%), #0AC07D",
                    fontFamily: "var(--font-manrope)",
                    textShadow: "0px 1.38px 2.42px rgba(26, 50, 66, 0.3)"
                  }}
                >
                  {event.amount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarningsTicker;
