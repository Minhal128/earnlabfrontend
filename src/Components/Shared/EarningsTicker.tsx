"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TickerEvent {
  id: number;
  username: string;
  amount: string;
  type: "earned" | "withdrew";
}

interface EarningsTickerProps {
  isVisible?: boolean;
}

const EarningsTicker: React.FC<EarningsTickerProps> = ({ isVisible = true }) => {
  const [events] = useState<TickerEvent[]>([
    { id: 1, username: "Maria", amount: "$5.00", type: "earned" },
    { id: 2, username: "Jacob", amount: "$10.70", type: "withdrew" },
    { id: 3, username: "Sandra", amount: "$15.00", type: "earned" },
    { id: 4, username: "Anonymous", amount: "$8.50", type: "withdrew" },
    { id: 5, username: "Alex", amount: "$12.30", type: "earned" },
    { id: 6, username: "Emma", amount: "$20.00", type: "withdrew" },
    { id: 7, username: "Anonymous", amount: "$6.75", type: "earned" },
    { id: 8, username: "Michael", amount: "$9.99", type: "withdrew" },
  ]);

  if (!isVisible) return null;

  // Triple duplicate for seamless infinite scroll
  const duplicatedEvents = [...events, ...events, ...events];

  return (
    <div className="w-full bg-[#0A0C1A] border-b border-[#1A1D2E] overflow-hidden">
      <div className="relative h-9 flex items-center">
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0A0C1A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0A0C1A] to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling content */}
        <div className="flex animate-scroll-left">
          {duplicatedEvents.map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className="flex items-center gap-2 px-5 whitespace-nowrap"
            >
              <div className="flex items-center gap-1.5">
                {event.type === "earned" ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span className="text-xs text-[#9CA3AF]">
                  <span className="text-white font-medium">{event.username}</span>
                  {" "}
                  <span className={event.type === "earned" ? "text-emerald-400" : "text-blue-400"}>
                    {event.type}
                  </span>
                  {" "}
                  <span className="text-[#10B981] font-semibold">{event.amount}</span>
                </span>
              </div>
              <span className="text-[#374151] text-xs">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarningsTicker;
