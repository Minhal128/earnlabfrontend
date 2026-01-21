"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DollarSign, Users, MessageCircle, User, Wallet } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  isCenter?: boolean;
}

const BottomNavigation: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check for authentication
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsAuthenticated(!!token);
  }, []);

  // Navigation items matching the reference design: Cashout, Referrals, Earn (center), Profile, Chat
  const navItems: NavItem[] = [
    {
      id: "cashout",
      label: "Cashout",
      icon: <Wallet className="w-5 h-5" />,
      path: "/cashout",
    },
    {
      id: "referrals",
      label: "Referrals",
      icon: <Users className="w-5 h-5" />,
      path: "/referrals",
    },
    {
      id: "earn",
      label: "Earn",
      icon: <DollarSign className="w-6 h-6" />,
      path: "/earn",
      isCenter: true, // Center button with special styling
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="w-5 h-5" />,
      path: "/profile",
    },
    {
      id: "chat",
      label: "Chat",
      icon: <MessageCircle className="w-5 h-5" />,
      path: "/chat",
    },
  ];

  const handleNavClick = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Only render navbar if user is authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0C1A]/95 backdrop-blur-lg border-t border-[#1A1D2E] shadow-2xl">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center justify-center transition-all duration-200 ${
                item.isCenter 
                  ? "relative -mt-6" // Lift center button up
                  : "gap-0.5 px-2 py-1.5 min-w-[56px]"
              } ${
                isActive(item.path)
                  ? "text-emerald-400"
                  : "text-[#6B7280] hover:text-white"
              }`}
            >
              {item.isCenter ? (
                // Center Earn button with special circular design
                <>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40"
                      : "bg-emerald-500 text-white hover:bg-emerald-400"
                  }`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-medium mt-1 ${
                    isActive(item.path) ? "text-emerald-400" : "text-emerald-400"
                  }`}>
                    {item.label}
                  </span>
                </>
              ) : (
                // Regular nav items
                <>
                  <div className={`relative p-1.5 rounded-lg transition-all duration-200 ${
                    isActive(item.path) 
                      ? "bg-emerald-500/15" 
                      : "hover:bg-[#1A1D2E]"
                  }`}>
                    <div className={`transition-transform duration-200 ${isActive(item.path) ? "scale-110" : ""}`}>
                      {item.icon}
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium ${isActive(item.path) ? "text-emerald-400" : ""}`}>
                    {item.label}
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation;
