"use client";

import { useState, useEffect } from "react";
import { Activity } from "lucide-react";

interface LiveStatsToggleProps {
  onChange?: (isEnabled: boolean) => void;
  defaultEnabled?: boolean;
}

const LiveStatsToggle: React.FC<LiveStatsToggleProps> = ({ 
  onChange, 
  defaultEnabled = true 
}) => {
  const [isEnabled, setIsEnabled] = useState(defaultEnabled);

  useEffect(() => {
    // Load saved preference from localStorage
    const saved = localStorage.getItem("liveStatsEnabled");
    if (saved !== null) {
      setIsEnabled(saved === "true");
    }
  }, []);

  const handleToggle = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem("liveStatsEnabled", String(newValue));
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#1A1D2E] border border-[#2A2D3E]">
      <Activity className={`w-3.5 h-3.5 ${
        isEnabled ? "text-emerald-400" : "text-gray-500"
      } transition-colors`} />
      <span className="text-xs text-[#9CA3AF] font-medium hidden lg:inline">Live</span>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0A0C1A] ${
          isEnabled ? "bg-emerald-500" : "bg-[#374151]"
        }`}
        role="switch"
        aria-checked={isEnabled}
        aria-label="Toggle live stats"
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
            isEnabled ? "translate-x-4.5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
};

export default LiveStatsToggle;
