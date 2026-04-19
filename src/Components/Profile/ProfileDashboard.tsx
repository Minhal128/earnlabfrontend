"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BiTask } from "react-icons/bi";
import { RiSettingsLine } from "react-icons/ri";
import { LuArrowUpDown } from "react-icons/lu";
import { BsCreditCard2Back } from "react-icons/bs";
import { Wallet } from "lucide-react";
import { FaSearch, FaChevronDown, FaRegSave } from "react-icons/fa";
import { useSocket } from "@/contexts/SocketProvider";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import {
  setProfile as setProfileAction,
  setToken as setTokenAction,
} from "@/store/userSlice";

import ProfileImg from "../../../public/assets/profile.png";
import Af1 from "../../../public/assets/af1.png";
import Af2 from "../../../public/assets/af2.png";
import Af3 from "../../../public/assets/af3.png";
import Af4 from "../../../public/assets/af4.png";

import SettingsDashboard from "./SettingsDashboard";
import TransactionDashboard from "./TransactionDashboard";
import WithdrawDashboard from "./WithdrawDashboard";
import ProfileOverview from "./ProfileOverview";

interface TabProps {
  currentTab: string;
  setCurrentTab: (t: string) => void;
  tasks: any[];
  onUserClick?: (userId: string) => void;
}

const TaskTabs: React.FC<TabProps> = ({ currentTab, setCurrentTab, tasks, onUserClick }) => {
  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-700">
        {["Completed", "On Hold", "Started"].map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`px-4 py-2 w-full md:text-lg text-sm ${
              currentTab === tab
                ? "border-b-2 border-[#4DD6C1] text-[#4DD6C1]"
                : "text-[#B3B6C7]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mt-4 relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-md" />
        <input
          type="text"
          placeholder="Search tasks"
          className="w-full pl-10 pr-1 py-4 rounded-md bg-[#26293E] text-sm text-gray-300 focus:outline-none focus:border-teal-400"
        />
      </div>

      {/* Table */}
      {["Completed", "On Hold", "Started"].map((tab) =>
        currentTab === tab ? (
          <div key={tab} className="mt-2 overflow-x-auto w-full">
            <div className="min-w-[1000px]">
              {/* Header */}
              <div className="grid grid-cols-6 py-2 bg-[#0D0F1E] text-gray-300 text-sm rounded-md mb-2">
                <div className="px-6 py-3 text-center text-xs">ID</div>
                <div className="px-6 py-3 text-center text-xs">Name</div>
                <div className="px-6 py-3 text-center text-xs">Provider</div>
                {tab === "Completed" ? (
                  <div className="px-6 py-3 text-center text-xs">Status</div>
                ) : (
                  <div className="px-6 py-3 text-center text-xs">
                    Completion time
                  </div>
                )}
                <div className="px-6 py-3 text-center text-xs">Reward</div>
                <div className="px-6 py-3 text-center text-xs">Date</div>
              </div>

              {/* Rows: render tasks filtered by tab */}
              {(() => {
                const matchesTab = (status: string | undefined) => {
                  if (!status) return tab !== "Completed"; // fallback
                  if (tab === "Completed") return status === "completed";
                  if (tab === "Started") return status === "in_progress";
                  // On Hold -> anything not completed or in_progress (available/failed/cancelled)
                  return status !== "completed" && status !== "in_progress";
                };

                const filtered = (tasks || []).filter((t) =>
                  matchesTab(t.status),
                );

                if (filtered.length === 0) {
                  return (
                    <div className="text-sm text-[#8C8FA8] p-4">
                      No tasks in this section
                    </div>
                  );
                }

                return filtered.map((task) => (
                  <div
                    key={task._id || task.id}
                    className="grid grid-cols-6 py-2 bg-[#1E2133] border border-[#2A2D44] rounded-md hover:bg-[#1b1f30] mb-2"
                  >
                    <div className="px-6 py-3 text-center text-xs">
                      {String(task._id ?? task.id ?? "").slice(0, 10)}
                    </div>
                    <div className="px-6 py-3 text-center text-xs">
                      {task.title ?? task.name ?? "Untitled"}
                    </div>
                    <div className="px-6 py-3 text-center text-xs">
                      {(task.metadata &&
                        (task.metadata.provider ||
                          task.metadata.providerName)) ||
                        task.externalId ||
                        "—"}
                    </div>
                    {tab === "Completed" ? (
                      <div className="px-2 rounded-md py-3 text-center bg-[#151728] text-[#18C3A7] text-xs">
                        Completed
                      </div>
                    ) : (
                      <div className="px-2 rounded-md py-3 text-center bg-[#151728] text-[#18C3A7] text-xs">
                        {task.status === "in_progress"
                          ? "In progress"
                          : (task.status ?? "—")}
                      </div>
                    )}
                    <div className="px-6 py-3 text-center text-xs">
                      {typeof (task.rewardCents ?? task.reward) === "number"
                        ? `$${((task.rewardCents ?? task.reward) / 100).toFixed(2)}`
                        : `${task.reward ?? task.rewardCents ?? "--"}`}
                    </div>
                    <div className="px-6 py-3 text-center text-xs">
                      {task.completedAt
                        ? new Date(task.completedAt).toLocaleString()
                        : task.createdAt
                          ? new Date(task.createdAt).toLocaleDateString()
                          : "--"}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
};

const ProfileDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState("Overview");
  const [currentTab, setCurrentTab] = useState("Completed");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const storeProfile = useSelector((s: RootState) => s.user.profile);
  const storeToken = useSelector((s: RootState) => s.user.token);
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [tasks, setTasks] = useState<any[]>([]);
  const { socket } = useSocket();

  // Check auth on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsAuthenticated(!!token);
  }, []);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (storeProfile) {
      setProfile(storeProfile);
      setStats({
        totalEarnedCents:
          storeProfile.totalEarnedCents ?? storeProfile.balanceCents ?? 0,
        last30DaysCents: storeProfile.last30DaysCents ?? 0,
        lifetimeRevenueCents: storeProfile.lifetimeRevenueCents ?? 0,
        onHoldCents: storeProfile.onHoldCents ?? 0,
      });
    } else if (token) {
      // Fetch profile if not in Redux store but token exists
      fetch(`${api}/api/v1/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.profile) {
            setProfile(data.profile);
            setStats({
              totalEarnedCents: data.profile.balanceCents ?? 0,
              last30DaysCents: 0,
              lifetimeRevenueCents: data.profile.balanceCents ?? 0,
              onHoldCents: 0,
            });
            // Also update Redux store
            dispatch(setProfileAction(data.profile));
          }
        })
        .catch(() => {});
    }
  }, [storeProfile, token, api, dispatch]);

  useEffect(() => {
    if (!token) return;
    fetch(`${api}/api/v1/tasks?limit=200`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.tasks)) setTasks(data.tasks);
      })
      .catch(() => {});
  }, [token, api]);

  // Clean up Facebook's legacy redirect fragment `#_=_` which can appear after OAuth
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#_=_") {
      // remove the hash without causing a reload
      try {
        history.replaceState(
          null,
          document.title,
          window.location.pathname + window.location.search,
        );
      } catch (e) {
        // fallback: clear hash
        window.location.hash = "";
      }
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onNotif = (n: any) => {
      if (n && typeof n.newBalanceCents === "number") {
        setProfile((p: any) =>
          p ? { ...p, balanceCents: n.newBalanceCents } : p,
        );
        setStats((s: any) => ({ ...s, totalEarnedCents: n.newBalanceCents }));
      }
      if (n && (n.type === "task.completed" || n.type === "feed.event")) {
        const ttoken = token;
        fetch(`${api}/api/v1/tasks?limit=200`, {
          headers: ttoken ? { Authorization: `Bearer ${ttoken}` } : undefined,
        })
          .then((r) => r.json())
          .then((data) => {
            if (data && Array.isArray(data.tasks)) setTasks(data.tasks);
          })
          .catch(() => {});
      }
    };

    const onFeed = (f: any) => {
      const ttoken = token;
      fetch(`${api}/api/v1/tasks?limit=200`, {
        headers: ttoken ? { Authorization: `Bearer ${ttoken}` } : undefined,
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && Array.isArray(data.tasks)) setTasks(data.tasks);
        })
        .catch(() => {});
    };

    const onProfileUpdate = (p: any) => {
      if (p && p.updatedFields) {
        setProfile((prev: any) =>
          prev ? { ...prev, ...p.updatedFields } : prev,
        );
      }
    };

    try {
      socket.on("notification", onNotif);
    } catch {}
    try {
      socket.on("feed:event", onFeed);
    } catch {}
    try {
      socket.on("profile:update", onProfileUpdate);
    } catch {}

    return () => {
      try {
        socket.off("notification", onNotif);
      } catch {}
      try {
        socket.off("feed:event", onFeed);
      } catch {}
      try {
        socket.off("profile:update", onProfileUpdate);
      } catch {}
    };
  }, [socket, token]);

  const router = useRouter();

  const sections = [
    { name: "Overview", icon: <BiTask className="text-lg" /> },
    { name: "My Wallet", icon: <Wallet className="text-lg" />, action: () => router.push('/wallet') },
    { name: "Settings", icon: <RiSettingsLine className="text-lg" /> },
    { name: "Transactions", icon: <LuArrowUpDown className="text-lg" /> },
    { name: "Withdrawals", icon: <BsCreditCard2Back className="text-lg" /> },
  ];

  // derive display fields from backend profile
  const displayName = profile?.displayName ?? profile?.username ?? "User";

  const joinedAt = profile?.joinedAt
    ? new Date(profile.joinedAt)
    : null;
  const displayId = profile?._id ?? null;

  // determine profile image from backend
  const profileImage = profile?.avatarUrl ?? null;

  // Wait for profile to load
  if (!isAuthenticated || !profile) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-[#1E2133] text-white">
        <div className="w-full bg-[#151728] border border-[#30334A] mt-7 py-8 px-6 shadow-md">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  // dev debug: expose profile object to console to help diagnose missing fields
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("Backend profile in ProfileDashboard:", profile);
    console.debug("Derived displayName:", displayName);
    console.debug("Derived joinedAt:", joinedAt);
    console.debug("Derived profileImage:", profileImage);
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#1E2133] text-white">
      <div className="w-full bg-[#151728] border border-[#30334A] mt-7 py-8 px-6 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {profileImage ? (
              // use plain img for external avatar URLs (backend or Clerk)
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profileImage as string}
                alt="Profile"
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
              />
            ) : (
              // emoji placeholder when no avatar available
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-2xl sm:text-3xl">
                {profile?.emoji || '😊'}
              </div>
            )}
            <div className="text-center sm:text-left">
              <h2 className="text-base sm:text-lg md:text-xl text-white pb-1 sm:pb-2 font-semibold">
                {displayName}
              </h2>
              <p className="text-xs sm:text-sm text-[#8C8FA8] pb-1 sm:pb-2">
                {joinedAt
                  ? `Joined ${joinedAt.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`
                  : "Joined -"}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="flex items-center justify-between text-xs bg-[#1E2133] rounded-md py-1 px-4 gap-3 text-gray-500">
                  <span className="text-[#8C8FA8]">
                    ID:{" "}
                    {displayId
                      ? String(displayId).slice(0, 8) +
                        "..." +
                        String(displayId).slice(-4)
                      : "—"}
                  </span>
                  <FaRegSave className="ml-2 text-gray-400 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between text-xs bg-[#1E2133] rounded-md py-1 px-4 gap-3 text-gray-500">
                  <span className="text-[#8C8FA8]">
                    Earn ID: {profile?.earnId ?? "—"}
                  </span>
                  <FaRegSave className="ml-2 text-gray-400 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="flex justify-center w-full text-xs text-white font-semibold mb-2">
              <span className="text-lg text-white">Silver</span>
            </div>
            <div className="w-full border-t border-6 rounded-md border-[#30334A]"></div>
            <div className="flex justify-between w-full text-xs text-gray-400 mt-3">
              <span className="text-[#8C8FA8]">0 XP</span>
              <span className="text-[#8C8FA8]">100,000 XP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 mt-5 gap-4 mb-6">
        <div className="bg-[#26293E] px-4 py-5 rounded-md flex items-center gap-3">
          <Image src={Af1} alt="Available Revenue" width={32} height={32} />
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              {(stats.totalEarnedCents ?? 0) / 100 >= 0
                ? "$" + ((stats.totalEarnedCents ?? 0) / 100).toFixed(2)
                : "--"}
            </h3>
            <p className="text-[#8C8FA8] text-sm">Total Earned</p>
          </div>
        </div>
        <div className="bg-[#26293E] px-4 py-5 rounded-md flex items-center gap-3">
          <Image src={Af2} alt="Affiliate Users" width={32} height={32} />
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              {(stats.last30DaysCents ?? 0) / 100 >= 0
                ? "$" + ((stats.last30DaysCents ?? 0) / 100).toFixed(2)
                : "--"}
            </h3>
            <p className="text-[#8C8FA8] text-sm">Last 30 days Earned</p>
          </div>
        </div>
        <div className="bg-[#26293E] px-4 py-5 rounded-md flex items-center gap-3">
          <Image src={Af3} alt="Lifetime Revenue" width={32} height={32} />
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              {(stats.lifetimeRevenueCents ?? 0) / 100 >= 0
                ? "$" + ((stats.lifetimeRevenueCents ?? 0) / 100).toFixed(2)
                : "--"}
            </h3>
            <p className="text-[#8C8FA8] text-sm">Lifetime Revenue</p>
          </div>
        </div>
        <div className="bg-[#26293E] px-4 py-5 rounded-md flex items-center gap-3">
          <Image src={Af4} alt="Total Earned" width={32} height={32} />
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              {(profile?.balanceCents ?? 0) / 100 >= 0
                ? "$" + ((profile?.balanceCents ?? 0) / 100).toFixed(2)
                : "--"}
            </h3>
            <p className="text-[#8C8FA8] text-sm">Total Earned</p>
          </div>
        </div>
        <div className="bg-[#26293E] px-4 py-5 rounded-md flex items-center gap-3">
          <Image src={Af2} alt="Lifetime Revenue" width={32} height={32} />
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              {(stats.onHoldCents ?? 0) / 100 >= 0
                ? "$" + ((stats.onHoldCents ?? 0) / 100).toFixed(2)
                : "--"}
            </h3>
            <p className="text-[#8C8FA8] text-sm">Earnings on hold</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <aside className="hidden md:flex w-full md:w-1/6 rounded-md bg-[#151728] p-4 flex-col gap-1">
          {sections.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if ((item as any).action) {
                  (item as any).action();
                } else {
                  setActiveSection(item.name);
                }
              }}
              className={`flex items-center cursor-pointer gap-2 text-left px-3 py-3 rounded-md w-full ${
                activeSection === item.name
                  ? "bg-[#0D0F1E] text-white"
                  : "text-gray-400"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </aside>

        <div className="md:hidden bg-[#151728] rounded-md p-3 mb-3">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-between w-full px-3 py-2 rounded-md bg-[#0D0F1E] text-white"
          >
            <span className="flex items-center gap-2">
              {sections.find((s) => s.name === activeSection)?.icon}
              {activeSection}
            </span>
            <FaChevronDown
              className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          {dropdownOpen && (
            <div className="mt-2 flex flex-col gap-2">
              {sections
                .filter((s) => s.name !== activeSection)
                .map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      if ((item as any).action) {
                        (item as any).action();
                      } else {
                        setActiveSection(item.name);
                      }
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-400 hover:bg-[#0D0F1E] hover:text-white"
                  >
                    {item.icon}
                    {item.name}
                  </button>
                ))}
            </div>
          )}
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="bg-[#151728] px-6 pt-3 pb-20 md:pb-6 rounded-xl shadow-md">
            {activeSection === "Overview" && <ProfileOverview />}
            {activeSection === "Settings" && <SettingsDashboard />}
            {activeSection === "Transactions" && <TransactionDashboard />}
            {activeSection === "Withdrawals" && <WithdrawDashboard />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileDashboard;
