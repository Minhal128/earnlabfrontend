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
    <div className={`flex items-center ${isCompact ? "gap-2" : "gap-2"}`}>
      {/* Sign In Button */}
      <button
        onClick={onSignInClick}
        className="px-4 py-2 rounded-md bg-transparent border border-[#2A2D3E] text-white font-medium text-sm hover:bg-[#1A1D2E] hover:border-emerald-400 transition-all duration-200"
      >
        <span className="flex items-center gap-1.5">
          <LogIn className="w-4 h-4" />
          Sign In
        </span>
      </button>

      {/* Register Button */}
      <button
        onClick={onSignUpClick}
        className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-all duration-200 shadow-sm"
      >
        <span className="flex items-center gap-1.5">
          <UserPlus className="w-4 h-4" />
          Register
        </span>
      </button>
    </div>
  );
};

export default ModernAuthButtons;
