"use client";

import React, { useState, useCallback } from "react";
import { Lock, Shield, Eye, EyeOff, Trash2, KeyRound } from "lucide-react";
import TopBar from "@/Components/Topbar";
import TickerBar from "@/Components/Shared/TickerBar";
import { toast } from "@/utils/toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const Switch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`relative h-[24px] w-[44px] rounded-full transition-all duration-300 ease-in-out focus:outline-none ${
      enabled ? "bg-[#18C3A7]" : "bg-[#2A2E3F]"
    }`}
    aria-pressed={enabled}
  >
    <span
      className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all duration-300 ease-in-out ${
        enabled ? "left-[23px]" : "left-[3px]"
      }`}
    />
  </button>
);

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(false);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleChangePassword = useCallback(async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warn("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Please sign in first");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API}/api/v1/user/change-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Could not change password");
    } finally {
      setSaving(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  return (
    <div className="min-h-screen bg-[#0D0F1E] text-white">
      <TopBar />
      <TickerBar />

      <main className="mx-auto w-full max-w-[900px] px-4 py-6 md:px-8">
        <h1 className="text-[30px] font-bold tracking-[0.02em] text-white mb-6">
          Settings
        </h1>

        <div className="flex flex-col gap-5">
          {/* Change Password */}
          <section className="rounded-[10px] border border-[#1E2133] bg-[#111324] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-[#14A28A]" />
              <h2 className="text-[20px] font-bold">Change Password</h2>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[14px] text-[#6B6E8A] mb-1">Current Password</label>
                <div className="flex items-center gap-2 rounded-[10px] border border-[#262A3A] bg-[#151828] p-2">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-transparent px-1 text-[16px] text-white outline-none placeholder:text-[#3A3D55]"
                  />
                  <button type="button" onClick={() => setShowCurrent((v) => !v)} className="text-[#6B6E8A] hover:text-white">
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-[#6B6E8A] mb-1">New Password</label>
                <div className="flex items-center gap-2 rounded-[10px] border border-[#262A3A] bg-[#151828] p-2">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-transparent px-1 text-[16px] text-white outline-none placeholder:text-[#3A3D55]"
                  />
                  <button type="button" onClick={() => setShowNew((v) => !v)} className="text-[#6B6E8A] hover:text-white">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-[#6B6E8A] mb-1">Confirm New Password</label>
                <div className="flex items-center gap-2 rounded-[10px] border border-[#262A3A] bg-[#151828] p-2">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-transparent px-1 text-[16px] text-white outline-none placeholder:text-[#3A3D55]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={saving}
                className="w-full py-3 rounded-[10px] text-[14px] font-semibold text-white disabled:opacity-60 transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0AC07D 0%, #0BBFA0 100%)" }}
              >
                {saving ? "Saving…" : "Update Password"}
              </button>
            </div>
          </section>

          {/* Security */}
          <section className="rounded-[10px] border border-[#1E2133] bg-[#111324] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-[#14A28A]" />
              <h2 className="text-[20px] font-bold">Security</h2>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-[10px] border border-[#262A3A] bg-[#151828] px-4 py-3">
                <KeyRound className="h-5 w-5 text-[#14A28A] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] text-white font-medium">Two-Factor Authentication</p>
                  <p className="text-[13px] text-[#6B6E8A]">Add an extra layer of security to your account</p>
                </div>
                <Switch enabled={twoFAEnabled} onToggle={() => {
                  setTwoFAEnabled((v) => !v);
                  toast.info("2FA setup will be available soon");
                }} />
              </div>

              <div className="flex items-center gap-3 rounded-[10px] border border-[#262A3A] bg-[#151828] px-4 py-3">
                <Shield className="h-5 w-5 text-[#14A28A] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] text-white font-medium">Login Alerts</p>
                  <p className="text-[13px] text-[#6B6E8A]">Get notified of new logins to your account</p>
                </div>
                <Switch enabled={loginAlerts} onToggle={() => setLoginAlerts((v) => !v)} />
              </div>

              <div className="flex items-center gap-3 rounded-[10px] border border-[#262A3A] bg-[#151828] px-4 py-3">
                <Lock className="h-5 w-5 text-[#14A28A] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] text-white font-medium">Auto Session Timeout</p>
                  <p className="text-[13px] text-[#6B6E8A]">Sign out automatically after 30 minutes of inactivity</p>
                </div>
                <Switch enabled={sessionTimeout} onToggle={() => setSessionTimeout((v) => !v)} />
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="rounded-[10px] border border-[#3D1A1A] bg-[#111324] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="h-5 w-5 text-[#FF383C]" />
              <h2 className="text-[20px] font-bold text-[#FF383C]">Danger Zone</h2>
            </div>

            <p className="text-[14px] text-[#6B6E8A] mb-4">
              Once you delete your account, all your data including balance, history, and profile will be permanently removed. This action cannot be undone.
            </p>

            <button
              type="button"
              className="w-full py-3 rounded-[10px] border border-[#FF383C] text-[14px] font-semibold text-[#FF383C] hover:bg-[#FF383C]/10 transition-all"
              onClick={() => toast.warn("To delete your account, please contact support@earnlab.com")}
            >
              Delete Account
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
