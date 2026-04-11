"use client";
import { Bell, Menu, Users, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import NotificationDropdown from "../Components/HomePage/NotificationDropdown";
import { IoMdPerson } from "react-icons/io";
import { FaSignOutAlt } from "react-icons/fa";
import AffeImg from "../../public/assets/affi.png";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import {
  setProfile,
  clearUser,
  updateProfileFields,
} from "@/store/userSlice";
import { useSocket } from "@/contexts/SocketProvider";
import LogoImg from "../../public/assets/logo.png";

const TopBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarImageBroken, setAvatarImageBroken] = useState(false);
  const storeProfile = useSelector((s: RootState) => s.user.profile);
  const storeToken = useSelector((s: RootState) => s.user.token);
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsAuthenticated(!!token);
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      const r = await fetch(`${api}/api/v1/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      if (data && data.profile) {
        if (typeof data.profile.balanceCents === "number") setBalance(data.profile.balanceCents);
        const displayName = data.profile.displayName || data.profile.username;
        if (displayName) { setUsername(displayName); dispatch(setProfile({ ...data.profile, displayName })); }
        if (data.profile.avatarUrl) { setAvatarUrl(data.profile.avatarUrl); dispatch(updateProfileFields({ avatarUrl: data.profile.avatarUrl })); }
      }
    } catch { }
  }, [dispatch]);

  useEffect(() => {
    if (typeof window !== "undefined") (window as any).refreshProfile = refreshProfile;
  }, [refreshProfile]);

  useEffect(() => {
    setAvatarImageBroken(false);
  }, [avatarUrl]);

  const handleSignOut = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      if (token) {
        try { await fetch(`${api}/api/v1/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }); } catch { }
      }
      if (typeof window !== "undefined") { localStorage.removeItem("token"); localStorage.removeItem("user"); }
      setUsername(null); setProfileOpen(false); setIsAuthenticated(false); dispatch(clearUser());
      try { router.push("/"); } catch { }
    } catch { }
  };

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${api}/api/v1/user/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.profile) {
          if (typeof data.profile.balanceCents === "number") setBalance(data.profile.balanceCents);
          const displayName = data.profile.displayName || data.profile.username;
          if (displayName) { setUsername(displayName); dispatch(setProfile({ ...data.profile, displayName })); }
          if (data.profile.avatarUrl) { setAvatarUrl(data.profile.avatarUrl); dispatch(updateProfileFields({ avatarUrl: data.profile.avatarUrl })); }
        }
      })
      .catch(() => { });
  }, [storeToken, dispatch]);

  useEffect(() => {
    const handler = (ev?: Event | CustomEvent) => {
      const custom = ev as CustomEvent | undefined;
      if (custom && custom.detail) {
        try {
          const u = custom.detail.user;
          if (u) {
            const displayName = u.displayName || u.clerk?.fullName || u.username;
            if (displayName) setUsername(displayName);
            const avatar = u.avatarUrl || u.clerk?.profileImageUrl;
            if (avatar) { setAvatarUrl(avatar); dispatch(updateProfileFields({ avatarUrl: avatar })); }
            if (typeof u.balanceCents === "number") setBalance(u.balanceCents);
          }
        } catch { }
        return;
      }
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) { setUsername(null); setAvatarUrl(null); dispatch(clearUser()); return; }
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      fetch(`${api}/api/v1/user/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.profile) {
            if (typeof data.profile.balanceCents === "number") setBalance(data.profile.balanceCents);
            const displayName = data.profile.displayName || data.profile.username;
            if (displayName) setUsername(displayName);
            if (data.profile.avatarUrl) setAvatarUrl(data.profile.avatarUrl);
          }
        })
        .catch(() => { });
    };
    window.addEventListener("app-auth-changed", handler as EventListener);
    return () => window.removeEventListener("app-auth-changed", handler as EventListener);
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${api}/api/v1/user/notifications`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.notifications)) {
          const unread = data.notifications.filter((n: any) => !n.read).length;
          setNotificationCount(unread);
        }
      })
      .catch(() => { });

    if (!socket) return;
    const onNotif = (n: any) => {
      setNotificationCount((c) => c + 1);
      if (n && typeof n.newBalanceCents === "number") setBalance(n.newBalanceCents);
    };
    const onRead = () => setNotificationCount(0);
    socket.on("notification", onNotif);
    socket.on("notifications:read", onRead);
    return () => {
      try { socket.off("notification", onNotif); socket.off("notifications:read", onRead); } catch { }
    };
  }, [socket]);

  /* ── derived ── */
  const initial = (username || "?")[0].toUpperCase();
  const balanceDisplay = balance !== null ? `$${(balance / 100).toFixed(2)}` : "$0.00";

  return (
    <header
      className="w-full flex items-center justify-between px-3 sm:px-6 md:px-10 lg:px-16 shrink-0"
      style={{ height: 60, background: "#16192E" }}
    >
      {/* Logo */}
      <Link href="/home" className="flex-shrink-0">
        <Image src={LogoImg} alt="LabWards" className="h-6 sm:h-7 md:h-9 w-auto object-contain" />
      </Link>

      {/* Right controls */}
      <div className="flex items-center gap-1 sm:gap-2">

        {/* Desktop menu */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => setDesktopMenuOpen((v) => !v)}
            className="flex items-center justify-center rounded-[5px] transition-colors hover:opacity-80"
            style={{ width: 40, height: 40, background: "#1E2133", border: "1.5px solid #30334A" }}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>

          {desktopMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-[10px] shadow-xl z-50 overflow-hidden" style={{ background: "#151728", border: "1px solid #1E2133" }}>
              <div className="py-2">
                {[
                  { href: "/rewards", label: "Rewards" },
                  { href: "/leaderboard", label: "Leaderboard" },
                  { href: "/referrals", label: "Referrals" },
                  { href: "/chat", label: "Chat" },
                  { href: "/profile", label: "Profiles" },
                  { href: "/support", label: "Support" },
                  { href: "/settings", label: "Settings" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDesktopMenuOpen(false)}
                    className="block px-4 py-2.5 text-[#B3B6C7] hover:text-white hover:bg-[#1E2133] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bell */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center rounded-[5px] transition-colors hover:opacity-80"
            style={{ width: 40, height: 40, background: "#1E2133", border: "1.5px solid #30334A" }}
            aria-label="Notifications"
          >
            <div className="relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
                <path d="M12 2C10.6193 2 9.5 3.11929 9.5 4.5V4.70833C7.03197 5.43265 5.25 7.712 5.25 10.375V15.5L4 16.75V18H20V16.75L18.75 15.5V10.375C18.75 7.712 16.968 5.43265 14.5 4.70833V4.5C14.5 3.11929 13.3807 2 12 2ZM10 19.5C10 20.6046 10.8954 21.5 12 21.5C13.1046 21.5 14 20.6046 14 19.5H10Z" fill="white" />
              </svg>
              {notificationCount > 0 && (
                <div
                  className="absolute -top-1 -right-1 flex items-center justify-center"
                  style={{ width: 10.5, height: 10.5, background: "linear-gradient(337.7deg, rgba(255, 255, 255, 0) 40.23%, rgba(255, 255, 255, 0.6) 125.94%), #0AC07D", borderRadius: "50%", boxShadow: "0px 1.38px 2.42px rgba(26, 50, 66, 0.3)" }}
                >
                  <span className="text-white font-bold text-[6.47px]" style={{ fontFamily: "var(--font-manrope)" }}>
                    {notificationCount}
                  </span>
                </div>
              )}
            </div>
          </button>
          {open && <NotificationDropdown onClose={() => setOpen(false)} />}
        </div>

        {/* Balance */}
        <div
          className="flex items-center gap-1 sm:gap-2 px-1 sm:px-1.5 py-1 sm:py-1.5"
          style={{ height: 40, minWidth: 100, background: "#1E2133", border: "1.5px solid #30334A", borderRadius: 5 }}
        >
          <div
            className="flex items-center justify-center rounded-[5px]"
            style={{ width: 32, height: 28, background: "#26293E" }}
          >
            <span className="text-[#B4B6C9] font-semibold text-[18px] sm:text-[24px] leading-[20px]" style={{ fontFamily: "var(--font-manrope)" }}>$</span>
          </div>
          <span className="text-white font-bold text-[14px] sm:text-[18px] leading-[20px] whitespace-nowrap" style={{ fontFamily: "var(--font-manrope)" }}>
            {balanceDisplay}
          </span>
        </div>

        {/* Cashout */}
        <Link
          href="/cashout"
          className="hidden sm:flex items-center justify-center gap-[4px] sm:gap-[6px] px-2 sm:px-[9.85px] py-2 sm:py-[19.7px] rounded-[8px] sm:rounded-[10px] font-bold text-white transition-opacity hover:opacity-90"
          style={{ height: 40, width: 100, background: "linear-gradient(12.07deg, rgba(255, 255, 255, 0) 16.27%, rgba(255, 255, 255, 0.4) 93.68%), #099F86", boxShadow: "0px 9.05px 23.88px rgba(20, 169, 144, 0.3)", fontFamily: "var(--font-manrope)", fontSize: "14px" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sm:w-5 sm:h-5">
            <path d="M17.5 10.5C18.8807 10.5 20 11.6193 20 13V18C20 19.3807 18.8807 20.5 17.5 20.5H6.5C5.11929 20.5 4 19.3807 4 18V13C4 11.6193 5.11929 10.5 6.5 10.5H17.5ZM12 12.5C11.1716 12.5 10.5 13.1716 10.5 14C10.5 14.8284 11.1716 15.5 12 15.5C12.8284 15.5 13.5 14.8284 13.5 14C13.5 13.1716 12.8284 12.5 12 12.5ZM17.5 3.5C18.8807 3.5 20 4.61929 20 6V8.5H4V6C4 4.61929 5.11929 3.5 6.5 3.5H17.5Z" fill="white" />
          </svg>
          <span className="hidden md:inline">Cashout</span>
        </Link>

        {/* Avatar + dropdown */}
        <div className="relative">
          <div className="flex items-center" style={{ height: 40 }}>
            {/* Avatar */}
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center justify-center font-bold text-white text-[20px] sm:text-[24px] rounded-[5px] transition-opacity hover:opacity-80"
              style={{
                width: 40, height: 40,
                background: "#1E2133",
                border: "1.5px solid #30334A",
                fontFamily: "var(--font-manrope)",
                overflow: "hidden",
              }}
            >
              {avatarUrl && !avatarImageBroken ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={username || "User"}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={() => setAvatarImageBroken(true)}
                />
              ) : (
                <span>{initial}</span>
              )}
            </button>
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-[10px] shadow-xl z-50 overflow-hidden" style={{ background: "#151728", border: "1px solid #1E2133" }}>
              <div className="flex justify-end px-3 pt-3">
                <button onClick={() => setProfileOpen(false)} className="flex items-center justify-center rounded-[6px] text-[#8C8FA8] hover:opacity-80" style={{ width: 26, height: 26, background: "#26293E", border: "1px solid #30334A" }}>
                  <X size={14} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 px-3 pb-3 text-sm">
                <Link href="/account" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-white hover:bg-[#1E2133] transition-colors">
                  <IoMdPerson size={16} /> Account
                </Link>
                <div style={{ height: 1, background: "#1E2133" }} />
                <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-white hover:bg-[#1E2133] transition-colors">
                  <Users size={16} /> Profiles
                </Link>
                <div style={{ height: 1, background: "#1E2133" }} />
                <Link href="/referrals" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-white hover:bg-[#1E2133] transition-colors">
                  <Image src={AffeImg} alt="Referrals" width={16} height={16} className="object-contain" />
                  Referrals
                </Link>
                <div style={{ height: 1, background: "#1E2133" }} />
                <button onClick={handleSignOut} className="flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-red-400 hover:bg-[#1E2133] transition-colors text-left w-full">
                  <FaSignOutAlt size={16} /> Sign Out
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default TopBar;
