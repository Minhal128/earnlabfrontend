"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, DollarSign, CheckSquare, FileText, MessageCircle, Menu } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import FullScreenMenu from "./FullScreenMenu";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const BottomNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  // Check for authentication
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token || isSignedIn) {
      // User is authenticated, you could fetch username here if needed
      setUsername(user?.username || "user");
    } else {
      setUsername(null);
    }
  }, [user, isSignedIn]);

  // Only show authenticated navigation items when user is logged in
  const navItems: NavItem[] = (username || isSignedIn) ? [
    {
      id: "home",
      label: "Home",
      icon: <Home className="w-5 h-5" />,
      path: "/home",
    },
    {
      id: "earn",
      label: "Earn",
      icon: <DollarSign className="w-5 h-5" />,
      path: "/earn",
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: <CheckSquare className="w-5 h-5" />,
      path: "/tasks",
    },
    {
      id: "surveys",
      label: "Surveys",
      icon: <FileText className="w-5 h-5" />,
      path: "/servey",
    },
    {
      id: "chat",
      label: "Chat",
      icon: <MessageCircle className="w-5 h-5" />,
      path: "/chat",
    },
  ] : [];

  const handleNavClick = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0C1A] border-t border-[#1A1D2E] shadow-2xl">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                isActive(item.path)
                  ? "text-emerald-400 bg-emerald-500/10"
                  : "text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E]"
              }`}
            >
              <div className={`transition-transform duration-200 ${isActive(item.path) ? "scale-110" : ""}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive(item.path) && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
              )}
            </button>
          ))}
          
          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px] text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E]"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu */}
      <FullScreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default BottomNavigation;
