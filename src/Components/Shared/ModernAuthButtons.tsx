"use client";

import { LogIn, UserPlus } from "lucide-react";

interface ModernAuthButtonsProps {
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  variant?: "default" | "compact";
}

const ModernAuthButtons: React.FC<ModernAuthButtonsProps> = ({ 
  onSignInClick, 
  onSignUpClick,
  variant = "default"
}) => {
  const isCompact = variant === "compact";

  return (
    <div className={`flex items-center gap-3 ${isCompact ? "flex-col sm:flex-row" : ""}`}>
      {/* Sign In Button */}
      <button
        onClick={onSignInClick}
        className="px-6 py-2.5 rounded-lg bg-transparent border-2 border-[#2A2D3E] text-white font-semibold text-sm hover:bg-[#1A1D2E] hover:border-emerald-400 transition-all duration-200 whitespace-nowrap"
      >
        <span className="flex items-center justify-center gap-2">
          <LogIn className="w-4 h-4" />
          Sign In
        </span>
      </button>

      {/* Register Button */}
      <button
        onClick={onSignUpClick}
        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/30 whitespace-nowrap"
      >
        <span className="flex items-center justify-center gap-2">
          <UserPlus className="w-4 h-4" />
          Register
        </span>
      </button>
    </div>
  );
};

export default ModernAuthButtons;
