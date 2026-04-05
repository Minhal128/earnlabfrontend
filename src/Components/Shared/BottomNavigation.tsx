"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DollarSign, CheckSquare, FileText, Menu, X, Wallet, Users, User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { clearUser } from "@/store/userSlice";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  isAction?: boolean;
}

const BottomNavigation: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const dispatch = useDispatch();
  const profile = useSelector((s: RootState) => s.user.profile);
  const token = useSelector((s: RootState) => s.user.token);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  // Check for authentication
  useEffect(() => {
    const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsAuthenticated(!!localToken);
  }, [token]);

  // Fetch notification count
  useEffect(() => {
    const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!localToken) return;
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${api}/api/v1/user/notifications`, { headers: { Authorization: `Bearer ${localToken}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.notifications)) {
          const unread = data.notifications.filter((n: any) => !n.read).length;
          setNotificationCount(unread);
        }
      })
      .catch(() => { });
  }, [token]);

  const handleSignOut = async () => {
    try {
      const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      if (localToken) {
        try { await fetch(`${api}/api/v1/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${localToken}` } }); } catch { }
      }
      if (typeof window !== "undefined") { localStorage.removeItem("token"); localStorage.removeItem("user"); }
      setIsAuthenticated(false);
      setIsMenuOpen(false);
      dispatch(clearUser());
      try { router.push("/"); } catch { }
    } catch { }
  };

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      icon: (
        <div className="relative flex items-center justify-center w-[22px] h-[22px] rounded-full bg-[#E5484D] text-white font-medium text-[11px] uppercase">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt="User" className="w-[22px] h-[22px] rounded-full object-cover" />
          ) : (
            (profile?.displayName?.[0] || profile?.username?.[0] || "?")
          )}
          {notificationCount > 0 && (
            <span className="absolute -top-[3px] -right-[3px] w-[9px] h-[9px] bg-white border border-[#16192E] rounded-full shadow-sm"></span>
          )}
        </div>
      ),
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
      path: "/surveys",
    },
    {
      id: "menu",
      label: "Menu",
      icon: <Menu className="w-5 h-5" />,
      path: "#",
      isAction: true,
    },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.isAction) {
      if (item.id === "menu") {
        setIsMenuOpen(!isMenuOpen);
      }
      return;
    }
    setIsMenuOpen(false);
    router.push(item.path);
  };

  const isActive = (path: string) => {
    if (path === "#") return false;
    return pathname === path || pathname.startsWith(path + '/');
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed bottom-[60px] left-0 right-0 z-[45] bg-[#151728] border-t border-[#1E2133] animate-in slide-in-from-bottom-2 duration-200 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-xl overflow-hidden pb-safe">
          <div className="flex justify-between items-center px-5 py-4 border-b border-[#1E2133]">
            <span className="text-white font-bold font-['Manrope']">Menu</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-[#8C8FA8] hover:text-white transition-colors bg-[#26293E] p-1 rounded-md">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col p-2 max-h-[60vh] overflow-y-auto">
            {[
              { label: "Account", path: "/account", icon: <User className="w-[18px] h-[18px]" /> },
              { label: "Rewards", path: "/rewards", icon: <DollarSign className="w-[18px] h-[18px]" /> },
              { label: "Leaderboard", path: "/leaderboard", icon: <Users className="w-[18px] h-[18px]" /> },
              { label: "Referrals", path: "/referrals", icon: <Users className="w-[18px] h-[18px]" /> },
              { label: "Chat", path: "/chat", icon: <FileText className="w-[18px] h-[18px]" /> },
              { label: "Support", path: "/support", icon: <FileText className="w-[18px] h-[18px]" /> },
              { label: "Settings", path: "/settings", icon: <FileText className="w-[18px] h-[18px]" /> },
              { label: "Cashout", path: "/cashout", icon: <Wallet className="w-[18px] h-[18px]" /> },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push(item.path);
                }}
                className="flex items-center gap-3 px-4 py-3.5 text-[#B3B6C7] hover:bg-[#1E2133] hover:text-white rounded-lg transition-colors font-medium"
              >
                {item.icon} {item.label}
              </button>
            ))}
            <div className="h-[1px] bg-[#1E2133] my-1 mx-2"></div>
            <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3.5 text-[#F87171] hover:bg-[#1E2133] rounded-lg transition-colors font-medium">
              <LogOut className="w-[18px] h-[18px]" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0D0F1E] border-t border-[#1C1E32] pb-safe">
        <div className="flex items-center justify-between h-[60px] px-2">
          {navItems.map((item) => {
            const active = isActive(item.path) && !item.isAction;
            // The menu is active if it's open
            const isMenuActive = item.id === 'menu' && isMenuOpen;
            const displayActive = active || isMenuActive;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-[3px] transition-colors duration-200 ${
                  displayActive ? "text-[#0AC07D]" : "text-[#6B6E8A] hover:text-[#B3B6C7]"
                }`}
              >
                <div className={`transition-transform duration-200 flex items-center justify-center ${displayActive ? "scale-110" : "scale-100"} ${item.id === "home" && displayActive ? "" : ""}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-medium leading-none ${displayActive ? "text-[#0AC07D]" : "text-[#6B6E8A]"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomNavigation;