"use client";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import NotificationDropdown from "../Components/HomePage/NotificationDropdown";
import WalletDropdown from "../Components/HomePage/WalletDropdown";
import { IoMdPerson } from "react-icons/io";
import { MdContactSupport } from "react-icons/md";
import { FaSignOutAlt } from "react-icons/fa";
import AffeImg from "../../public/assets/affi.png";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import ProfileInfo from "./ProfileInfo";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import {
  setProfile,
  setToken,
  clearUser,
  updateProfileFields,
} from "@/store/userSlice";
import { toast } from "react-toastify";
import SupportChat from "../Components/HomePage/SupportChat";
import { useSocket } from "@/contexts/SocketProvider";
import EarningsTicker from "./Shared/EarningsTicker";
import PayoutMethods from "./Shared/PayoutMethods";
import LiveStatsToggle from "./Shared/LiveStatsToggle";

import LogoImg from "../../public/assets/logo.png";
import DolarImg from "../../public/assets/dolar.png";
import WalletImg from "../../public/assets/wallet.png";
import Earn from "../../public/assets/earn.png";
import Task from "../../public/assets/task.png";
import Servey from "../../public/assets/servey.png";
import Reward from "../../public/assets/reward.png";
import Leaderboard from "../../public/assets/leader.png";

import EarnActive from "../../public/assets/earnactive.png";
import TaskActive from "../../public/assets/taskactive.png";
import ServeyActive from "../../public/assets/serveyactive.png";
import RewardActive from "../../public/assets/rewardsactive.png";
import Home from "../../public/assets/home.png";
import HomeActive from "../../public/assets/homeactive.png";

const TopBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const [chatOpen, setChatOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [liveStatsEnabled, setLiveStatsEnabled] = useState(true);
  const storeProfile = useSelector((s: RootState) => s.user.profile);
  const storeToken = useSelector((s: RootState) => s.user.token);
  const dispatch = useDispatch();
  const { user, isSignedIn } = useUser();
  const { socket } = useSocket();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const router = useRouter();
  const { signOut } = useClerk();
  
  // Force refresh profile function (can be called from console)
  const refreshProfile = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      console.log("[Topbar] No token found, cannot refresh profile");
      return;
    }
    
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    console.log("[Topbar] Force refreshing profile...");
    
    try {
      const r = await fetch(`${api}/api/v1/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("[Topbar] Profile response status:", r.status);
      const data = await r.json();
      console.log("[Topbar] Profile data:", data);
      
      if (data && data.profile) {
        if (typeof data.profile.balanceCents === "number") {
          setBalance(data.profile.balanceCents);
        }
        const displayName = data.profile.displayName || data.profile.username;
        console.log("[Topbar] Setting username to:", displayName);
        if (displayName) {
          setUsername(displayName);
          dispatch(setProfile({ ...data.profile, displayName }));
        }
        if (data.profile.avatarUrl) {
          setAvatarUrl(data.profile.avatarUrl);
          dispatch(updateProfileFields({ avatarUrl: data.profile.avatarUrl }));
        }
      }
    } catch (err) {
      console.error("[Topbar] Error refreshing profile:", err);
    }
  }, [dispatch]);
  
  // Expose refreshProfile to window for console access
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).refreshProfile = refreshProfile;
      console.log("[Topbar] You can call window.refreshProfile() to manually refresh the profile");
    }
  }, [refreshProfile]);

  const handleSignOut = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      if (token) {
        // best-effort: notify backend to revoke the session
        try {
          await fetch(`${api}/api/v1/auth/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {
          // ignore network errors
        }
      }

      // remove local token
      if (typeof window !== "undefined") localStorage.removeItem("token");

      // sign out Clerk session
      try {
        await signOut();
      } catch (e) {
        // ignore clerk signout errors
      }

      setUsername(null);
      setProfileOpen(false);
      // redirect to homepage
      try {
        router.push("/");
      } catch {}
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Sign out failed", err);
    }
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    console.log("[Topbar] Fetching profile from:", `${api}/api/v1/user/profile`);
    
    fetch(`${api}/api/v1/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        console.log("[Topbar] Profile response status:", r.status);
        return r.json();
      })
      .then((data) => {
        console.log("[Topbar] Profile data received:", data);
        if (data && data.profile) {
          if (typeof data.profile.balanceCents === "number") {
            setBalance(data.profile.balanceCents);
          }
          // Prefer displayName for social sign-ins, fallback to username
          const displayName = data.profile.displayName || data.profile.username;
          console.log("[Topbar] Setting username to:", displayName);
          if (displayName) {
            setUsername(displayName);
            dispatch(setProfile({ ...data.profile, displayName }));
          }
          if (data.profile.avatarUrl) {
            setAvatarUrl(data.profile.avatarUrl);
            dispatch(
              updateProfileFields({ avatarUrl: data.profile.avatarUrl }),
            );
          }
        }
      })
      .catch((err) => {
        console.error("[Topbar] Error fetching profile:", err);
      });
  }, [storeToken, dispatch]);

  // react to auth changes triggered by SigninModal (or other parts of the app)
  useEffect(() => {
    const handler = (ev?: Event | CustomEvent) => {
      // if event includes detail with user/token, use it to update UI immediately
      const custom = ev as CustomEvent | undefined;
      if (custom && custom.detail) {
        try {
          const u = custom.detail.user;
          if (u) {
            // Prefer displayName from backend (which includes social sign-in names), fallback to username
            const displayName = u.displayName || u.clerk?.fullName || u.username;
            if (displayName) setUsername(displayName);
            // Prefer avatarUrl from backend, fallback to Clerk profileImageUrl
            const avatar = u.avatarUrl || u.clerk?.profileImageUrl;
            if (avatar) {
              setAvatarUrl(avatar);
              dispatch(updateProfileFields({ avatarUrl: avatar }));
            }
            // if backend returns balanceCents in user, update it too
            if (typeof u.balanceCents === "number") setBalance(u.balanceCents);
          }
        } catch (e) {}
        return;
      }

      // fallback: re-fetch profile from backend using stored token
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setUsername(null);
        setAvatarUrl(null);
        dispatch(clearUser());
        return;
      }
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      fetch(`${api}/api/v1/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.profile) {
            if (typeof data.profile.balanceCents === "number")
              setBalance(data.profile.balanceCents);
            const displayName =
              data.profile.displayName || data.profile.username;
            if (displayName) setUsername(displayName);
            if (data.profile.avatarUrl) setAvatarUrl(data.profile.avatarUrl);
          }
        })
        .catch(() => {});
    };

    window.addEventListener("app-auth-changed", handler as EventListener);
    return () =>
      window.removeEventListener("app-auth-changed", handler as EventListener);
  }, []);

  // If a Clerk user exists and we don't yet have backend username/avatar, prefer Clerk data
  useEffect(() => {
    if (!user) return;
    // use Clerk user fields as fallback
    try {
      const cName =
        (user as any)?.fullName ||
        (user as any)?.firstName ||
        (user as any)?.username ||
        null;
      const cAvatar = (user as any)?.profileImageUrl || null;
      if (!username && cName) setUsername(cName);
      if (!avatarUrl && cAvatar) setAvatarUrl(cAvatar);
      // also write Clerk data to Redux so other components can use it
      dispatch(
        updateProfileFields({
          username: cName ?? undefined,
          avatarUrl: cAvatar ?? undefined,
        }),
      );
    } catch (e) {}
  }, [user]);

  // When a Clerk user exists (social sign-in), ensure the backend has a corresponding
  // app session/token by calling the server-side helper `/api/v1/auth/clerk-sync`.
  // The backend will create or update the app user from Clerk public info and
  // return the app JWT the frontend uses for protected API calls.
  useEffect(() => {
    // only run when Clerk reports a signed-in user
    if (!isSignedIn || !user) return;

    // don't run repeatedly for the same Clerk user in this browser session
    try {
      const clerkId = (user as any)?.id || (user as any)?.userId || null;
      if (clerkId) {
        const key = `clerkSyncDone_${clerkId}`;
        if (
          typeof sessionStorage !== "undefined" &&
          sessionStorage.getItem(key)
        )
          return;
      }
    } catch (e) {}

    // if we already have an app token, skip sync
    const existing =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (existing) {
      // make sure redux token matches
      if (!storeToken) dispatch(setToken(existing));
      return;
    }

    // try to obtain an email address from the Clerk user object (robust)
    const maybeEmail =
      (user as any)?.primaryEmailAddress?.emailAddress ||
      (user as any)?.emailAddresses?.[0]?.emailAddress ||
      (user as any)?.emailAddresses?.[0]?.email ||
      (user as any)?.email ||
      (user as any)?.emails?.[0];
    if (!maybeEmail) {
      // show a non-blocking toast so you can notice missing email cases
      try {
        toast.warn(
          "Clerk signed-in user has no email address; clerk-sync skipped.",
        );
      } catch {}
      return; // nothing we can do without email
    }

    (async () => {
      try {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        // Extract name and avatar from Clerk user to send as fallbacks
        const clerkName = (user as any)?.fullName || 
                         `${(user as any)?.firstName || ""} ${(user as any)?.lastName || ""}`.trim() ||
                         (user as any)?.username || null;
        const clerkAvatar = (user as any)?.imageUrl || (user as any)?.profileImageUrl || null;
        
        const resp = await fetch(`${api}/api/v1/auth/clerk-sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: maybeEmail,
            name: clerkName,
            avatarUrl: clerkAvatar
          }),
        });
        const data = await resp.json();
        console.log("clerk-sync response data:", data);
        if (resp.ok && data?.token) {
          try {
            localStorage.setItem("token", data.token);
          } catch {}
          dispatch(setToken(data.token));
          if (data.user) {
            console.log("Dispatching user from clerk-sync:", data.user);
            dispatch(setProfile(data.user));
            // Immediately update local state with displayName and avatarUrl
            const displayName = data.user.displayName || data.user.username;
            if (displayName) setUsername(displayName);
            if (data.user.avatarUrl) setAvatarUrl(data.user.avatarUrl);
          }
          // mark done for this Clerk user in this session to avoid repeats
          try {
            const clerkId = (user as any)?.id || (user as any)?.userId || null;
            if (clerkId && typeof sessionStorage !== "undefined")
              sessionStorage.setItem(`clerkSyncDone_${clerkId}`, "1");
          } catch (e) {}

          // notify the rest of the app that auth changed (Topbar listens to this too)
          try {
            const evt = new CustomEvent("app-auth-changed", {
              detail: { token: data.token, user: data.user },
            });
            window.dispatchEvent(evt);
          } catch {}

          try {
            toast.success("Signed in via Google — synced with app account.");
          } catch {}
        } else {
          // surface a visible error so it's easier to diagnose in dev
          // eslint-disable-next-line no-console
          console.error("clerk-sync failed", data);
          try {
            toast.error(
              "Failed to synchronise Clerk user with backend (check console).",
            );
          } catch {}
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("clerk-sync error", err);
        try {
          toast.error(
            "Error contacting backend for clerk-sync (check console).",
          );
        } catch {}
      }
    })();
  }, [isSignedIn, user]);
  // fetch notification count and subscribe to socket updates
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${api}/api/v1/user/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.notifications)) {
          const unread = data.notifications.filter((n: any) => !n.read).length;
          setNotificationCount(unread);
        }
      })
      .catch(() => {});

    if (!socket) return;

    const onNotif = (n: any) => {
      setNotificationCount((c) => c + 1);
      // if the server included new balance info in the notification payload, update wallet UI
      if (n && typeof n.newBalanceCents === "number") {
        setBalance(n.newBalanceCents);
      }
    };
    const onRead = () => {
      setNotificationCount(0);
    };

    socket.on("notification", onNotif);
    socket.on("notifications:read", onRead);

    return () => {
      try {
        socket.off("notification", onNotif);
        socket.off("notifications:read", onRead);
      } catch {}
    };
  }, [socket]);

  return (
    <header className="w-full bg-[#0A0C1A] text-white shadow-lg">
      {/* Earnings Ticker - Top Bar */}
      <EarningsTicker isVisible={liveStatsEnabled} />
      
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Left Side */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>

            {/* Logo */}
            <Link href="/home" className="flex-shrink-0">
              <Image
                src={LogoImg}
                alt="Logo"
                className="h-6 sm:h-8 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </Link>

            {/* Payout Methods Section */}
            <div className="hidden xl:flex">
              <PayoutMethods isLoggedIn={!!username} />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-6">
              <Link
                href="/home"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E] transition-all"
              >
                <Image src={Earn} alt="Earn" width={16} height={16} />
                Earn
              </Link>
              <Link
                href="/tasks"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E] transition-all"
              >
                <Image src={Task} alt="Tasks" width={16} height={16} />
                Tasks
              </Link>
              <Link
                href="/servey"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E] transition-all"
              >
                <Image src={Servey} alt="Surveys" width={16} height={16} />
                Surveys
              </Link>
              <Link
                href="/rewards"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E] transition-all"
              >
                <Image src={Reward} alt="Rewards" width={16} height={16} />
                Rewards
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E] transition-all"
              >
                <Image src={Leaderboard} alt="Leaderboard" width={16} height={16} />
                Leaderboard
              </Link>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Live Stats Toggle */}
            <div className="hidden lg:flex">
              <LiveStatsToggle 
                defaultEnabled={liveStatsEnabled}
                onChange={setLiveStatsEnabled}
              />
            </div>
            {/* Notification */}
            <button
              onClick={() => setOpen(!open)}
              className="relative cursor-pointer flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors"
            >
              <Bell size={16} className="sm:w-[18px] sm:h-[18px]" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] text-white rounded-full min-w-[16px] h-[16px] sm:min-w-[18px] sm:h-[18px] flex items-center justify-center font-semibold">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Dropdowns */}
            {open && <NotificationDropdown onClose={() => setOpen(false)} />}
            {walletOpen && (
              <WalletDropdown onClose={() => setWalletOpen(false)} />
            )}

            <div className="flex items-center gap-1 sm:gap-2 h-8 sm:h-9 px-1.5 sm:px-2.5 rounded-md bg-[#1A1D2E] border border-[#2A2D3E]">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <Image
                  src={DolarImg}
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                  alt=""
                />
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {balance !== null ? "$" + (balance / 100).toFixed(2) : "--"}
                </span>
              </div>
              <span className="h-3 sm:h-4 w-[1px] bg-[#2A2D3E]"></span>
              <button
                onClick={() => setWalletOpen(!walletOpen)}
                className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium flex items-center gap-0.5 sm:gap-1 transition-colors"
              >
                <Image
                  src={WalletImg}
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 object-contain"
                  alt=""
                />
                <span className="hidden sm:inline">Wallet</span>
              </button>
            </div>

            <div className="relative flex">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center h-8 sm:h-9 px-1.5 sm:px-2.5 rounded-md bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] gap-1 sm:gap-2 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <ProfileInfo
                    size={24}
                    username={username}
                    avatarUrl={avatarUrl}
                  />
                </div>
                <ChevronDown
                  size={12}
                  className="hidden sm:flex cursor-pointer sm:w-[14px] sm:h-[14px]"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-12 px-2 py-3 w-52 bg-[#1E2133] rounded-md shadow-lg z-50">
                  {/* Close Button */}
                  <div className="flex justify-end items-center px-3 py-2">
                    <button
                      onClick={() => setProfileOpen(false)}
                      className="border bg-[#8C8FA8] text-black p-0.5 rounded-md"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Options */}
                  <nav className="flex flex-col p-2 space-y-2 text-sm text-[#B3B6C7]">
                    <Link
                      href="/profile"
                      className="flex items-center text-white gap-2"
                    >
                      <IoMdPerson size={16} /> Profile
                    </Link>

                    <div className="border-t border-[#30334A] my-1"></div>

                    <Link
                      href="/Affiliate"
                      className="flex text-white items-center gap-2"
                    >
                      <Image
                        src={AffeImg}
                        alt="Affiliate"
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                      Affiliate
                    </Link>

                    <div className="border-t border-[#30334A] my-1"></div>

                    <button
                      onClick={() => setChatOpen(true)}
                      className="flex items-center text-white gap-2"
                    >
                      <MdContactSupport size={16} /> Support
                    </button>
                    <div className="border-t border-[#30334A] my-1"></div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-red-400 text-left"
                    >
                      <FaSignOutAlt size={16} /> Sign Out
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Support Bubble (opens the SupportChat) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setChatOpen(true)}
          aria-label="Open support chat"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#3B3F5A] shadow-lg hover:bg-[#474a67]"
        >
          <MdContactSupport size={20} className="text-white" />
        </button>
        <SupportChat isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-[#0A0C1A] border-r border-[#1A1D2E] shadow-2xl p-5 z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center mb-8">
          <Image
            src={LogoImg}
            alt="Logo"
            className="h-8 w-auto object-contain"
          />
          <button 
            onClick={() => setMenuOpen(false)}
            className="p-1.5 rounded-md bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center py-2.5 px-3 rounded-md gap-2.5 text-sm font-medium transition-all ${
              pathname === "/"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E]"
            }`}
          >
            <Image
              src={pathname === "/" ? HomeActive : Home}
              alt="Home"
              width={18}
              height={18}
            />
            Home
          </Link>
          <Link
            href="/home"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center py-2.5 px-3 rounded-md gap-2.5 text-sm font-medium transition-all ${
              pathname === "/home"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E]"
            }`}
          >
            <Image
              src={pathname === "/home" ? EarnActive : Earn}
              alt="Earn"
              width={18}
              height={18}
            />
            Earn
          </Link>

          <Link
            href="/tasks"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center py-2.5 px-3 rounded-md gap-2.5 text-sm font-medium transition-all ${
              pathname === "/tasks"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E]"
            }`}
          >
            <Image
              src={pathname === "/tasks" ? TaskActive : Task}
              alt="Tasks"
              width={18}
              height={18}
            />
            Tasks
          </Link>

          <Link
            href="/servey"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center py-2.5 px-3 rounded-md gap-2.5 text-sm font-medium transition-all ${
              pathname === "/servey"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E]"
            }`}
          >
            <Image
              src={pathname === "/servey" ? ServeyActive : Servey}
              alt="Surveys"
              width={18}
              height={18}
            />
            Surveys
          </Link>

          <Link
            href="/rewards"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center py-2.5 px-3 rounded-md gap-2.5 text-sm font-medium transition-all ${
              pathname === "/rewards"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E]"
            }`}
          >
            <Image
              src={pathname === "/rewards" ? RewardActive : Reward}
              alt="Rewards"
              width={18}
              height={18}
            />
            Rewards
          </Link>

          <Link
            href="/leaderboard"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center py-2.5 px-3 rounded-md gap-2.5 text-sm font-medium transition-all ${
              pathname === "/leaderboard"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-[#9CA3AF] hover:text-white hover:bg-[#1A1D2E]"
            }`}
          >
            <Image
              src={pathname === "/leaderboard" ? Leaderboard : Leaderboard}
              alt="Leaderboard"
              width={18}
              height={18}
            />
            Leaderboard
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default TopBar;

