"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  User, 
  Trophy, 
  Wallet, 
  MessageCircle, 
  Headset,
  LogOut,
  Settings,
  Gift,
  HelpCircle,
  Share2
} from "lucide-react";
import { openLiveChatPanel } from "@/utils/liveChat";

interface MenuTile {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
  color: string;
  bgColor: string;
}

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullScreenMenu: React.FC<FullScreenMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      if (token) {
        try {
          await fetch(`${api}/api/v1/auth/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {
          // ignore
        }
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      onClose();
      router.push("/");
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  const menuTiles: MenuTile[] = [
    {
      id: "account",
      label: "Account",
      icon: <User className="w-6 h-6" />,
      path: "/account",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: <Wallet className="w-6 h-6" />,
      path: "/wallet",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: <Trophy className="w-6 h-6" />,
      path: "/leaderboard",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      id: "rewards",
      label: "Rewards",
      icon: <Gift className="w-6 h-6" />,
      path: "/rewards",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "chat",
      label: "Live Chat",
      icon: <Headset className="w-6 h-6" />,
      action: () => {
        openLiveChatPanel();
        onClose();
      },
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
    {
      id: "support",
      label: "Support",
      icon: <MessageCircle className="w-6 h-6" />,
      path: "/support",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-6 h-6" />,
      path: "/settings",
      color: "text-gray-400",
      bgColor: "bg-gray-500/10",
    },
    {
      id: "help",
      label: "Help",
      icon: <HelpCircle className="w-6 h-6" />,
      path: "/help",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      id: "referral",
      label: "Referral",
      icon: <Share2 className="w-6 h-6" />,
      path: "/referrals",
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
    },
  ];

  const handleTileClick = (tile: MenuTile) => {
    if (tile.action) {
      tile.action();
    } else if (tile.path) {
      router.push(tile.path);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Side Drawer */}
      <div className={`lg:hidden fixed top-0 right-0 h-full w-full sm:w-96 bg-[#0A0C1A] z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1A1D2E]">
          <h2 className="text-2xl font-bold text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">
          {/* Menu Tiles Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {menuTiles.map((tile, index) => (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                className={`relative overflow-hidden rounded-xl ${tile.bgColor} border border-[#2A2D3E] p-6 hover:scale-105 transition-all duration-200 group ${
                  tile.id === 'referral' ? 'col-span-2 w-1/2 mx-auto' : ''
                }`}
              >
                {/* Background glow */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 ${tile.bgColor} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`p-3 rounded-lg ${tile.bgColor} ${tile.color}`}>
                    {tile.icon}
                  </div>
                  <span className={`text-sm font-semibold ${tile.color}`}>
                    {tile.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
            <span className="text-red-400 font-semibold">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default FullScreenMenu;
