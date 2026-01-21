"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Lock, Globe, Moon, Smartphone, HelpCircle, ChevronRight, Check, Loader, Shield, Copy, X, Key } from "lucide-react";
import TopBar from "@/Components/Topbar";
import { toast } from "react-toastify";

interface UserSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  twoFactorAuth: boolean;
  profilePublic: boolean;
  language: string;
  currency: string;
  darkMode: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings>({
    pushNotifications: true,
    emailNotifications: true,
    twoFactorAuth: false,
    profilePublic: true,
    language: "English",
    currency: "USD",
    darkMode: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  
  // 2FA states
  const [twoFAModalOpen, setTwoFAModalOpen] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<"setup" | "verify" | "backup" | "disable">("setup");
  const [twoFASecret, setTwoFASecret] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [twoFAError, setTwoFAError] = useState("");

  const languages = ["English", "Spanish", "French", "German", "Portuguese", "Chinese", "Japanese"];
  const currencies = ["USD", "EUR", "GBP", "CAD", "AUD"];

  // Load settings from localStorage or API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Try to load from localStorage first
        const savedSettings = localStorage.getItem("userSettings");
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }

        // Also try to load from API
        const token = localStorage.getItem("token");
        if (token) {
          const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
          
          // Get profile settings
          const res = await fetch(`${api}/api/v1/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.profile?.settings) {
              setSettings(prev => ({ ...prev, ...data.profile.settings }));
            }
            if (data.profile?.profilePrivacy) {
              setSettings(prev => ({ ...prev, profilePublic: data.profile.profilePrivacy === 'public' }));
            }
          }
          
          // Get 2FA status
          const twoFARes = await fetch(`${api}/api/v1/user/2fa/status`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (twoFARes.ok) {
            const twoFAData = await twoFARes.json();
            setSettings(prev => ({ ...prev, twoFactorAuth: twoFAData.enabled }));
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Save settings
  const saveSettings = async (newSettings: UserSettings) => {
    setSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem("userSettings", JSON.stringify(newSettings));
      
      // Also save to API
      const token = localStorage.getItem("token");
      if (token) {
        const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        await fetch(`${api}/api/v1/user/settings`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            settings: newSettings,
            profilePrivacy: newSettings.profilePublic ? 'public' : 'private'
          }),
        });
      }
      toast.success("Settings saved");
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Toggle setting
  const toggleSetting = (key: keyof UserSettings) => {
    // Special handling for 2FA
    if (key === 'twoFactorAuth') {
      if (settings.twoFactorAuth) {
        // Disable 2FA
        setTwoFAStep("disable");
        setTwoFACode("");
        setTwoFAError("");
        setTwoFAModalOpen(true);
      } else {
        // Enable 2FA - start setup
        handle2FASetup();
      }
      return;
    }
    
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Update setting value
  const updateSetting = (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // 2FA Setup
  const handle2FASetup = async () => {
    setTwoFALoading(true);
    setTwoFAError("");
    try {
      const token = localStorage.getItem("token");
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const res = await fetch(`${api}/api/v1/user/2fa/setup`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setTwoFASecret(data.secret);
        setTwoFAStep("setup");
        setTwoFACode("");
        setTwoFAModalOpen(true);
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to setup 2FA");
      }
    } catch (err) {
      toast.error("Failed to setup 2FA");
    } finally {
      setTwoFALoading(false);
    }
  };

  // 2FA Verify
  const handle2FAVerify = async () => {
    if (twoFACode.length !== 6) {
      setTwoFAError("Please enter a 6-digit code");
      return;
    }
    
    setTwoFALoading(true);
    setTwoFAError("");
    try {
      const token = localStorage.getItem("token");
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const res = await fetch(`${api}/api/v1/user/2fa/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: twoFACode }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setBackupCodes(data.backupCodes);
        setTwoFAStep("backup");
        setSettings(prev => ({ ...prev, twoFactorAuth: true }));
        toast.success("Two-factor authentication enabled!");
      } else {
        const error = await res.json();
        setTwoFAError(error.message || "Invalid code");
      }
    } catch (err) {
      setTwoFAError("Failed to verify code");
    } finally {
      setTwoFALoading(false);
    }
  };

  // 2FA Disable
  const handle2FADisable = async () => {
    if (twoFACode.length < 6) {
      setTwoFAError("Please enter your verification code");
      return;
    }
    
    setTwoFALoading(true);
    setTwoFAError("");
    try {
      const token = localStorage.getItem("token");
      const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      const res = await fetch(`${api}/api/v1/user/2fa/disable`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: twoFACode }),
      });
      
      if (res.ok) {
        setSettings(prev => ({ ...prev, twoFactorAuth: false }));
        setTwoFAModalOpen(false);
        toast.success("Two-factor authentication disabled");
      } else {
        const error = await res.json();
        setTwoFAError(error.message || "Invalid code");
      }
    } catch (err) {
      setTwoFAError("Failed to disable 2FA");
    } finally {
      setTwoFALoading(false);
    }
  };

  // Copy backup codes
  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    toast.success("Backup codes copied to clipboard");
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <div className="min-h-screen bg-[#0A0C1A] flex items-center justify-center">
          <Loader className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div className="min-h-screen bg-[#0A0C1A] pb-20 lg:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="lg:hidden p-2 rounded-lg bg-[#1A1D2E] border border-[#2A2D3E] hover:bg-[#252840] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-sm text-[#9CA3AF]">Manage your account preferences</p>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Notifications Section */}
            <div className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Bell className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Notifications</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#252840]">
                  <span className="text-sm text-white font-medium">Push Notifications</span>
                  <button
                    onClick={() => toggleSetting('pushNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.pushNotifications ? "bg-emerald-500" : "bg-[#374151]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.pushNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#252840]">
                  <span className="text-sm text-white font-medium">Email Notifications</span>
                  <button
                    onClick={() => toggleSetting('emailNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.emailNotifications ? "bg-emerald-500" : "bg-[#374151]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.emailNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy & Security Section */}
            <div className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Privacy & Security</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#252840]">
                  <span className="text-sm text-white font-medium">Two-Factor Authentication</span>
                  <button
                    onClick={() => toggleSetting('twoFactorAuth')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.twoFactorAuth ? "bg-emerald-500" : "bg-[#374151]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.twoFactorAuth ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#252840]">
                  <span className="text-sm text-white font-medium">Show Profile Publicly</span>
                  <button
                    onClick={() => toggleSetting('profilePublic')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.profilePublic ? "bg-emerald-500" : "bg-[#374151]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.profilePublic ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Preferences</h2>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setLanguageModalOpen(true)}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#252840] w-full hover:bg-[#2A2D3E] transition-colors"
                >
                  <span className="text-sm text-white font-medium">Language</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-emerald-400">{settings.language}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </button>
                <button
                  onClick={() => setCurrencyModalOpen(true)}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#252840] w-full hover:bg-[#2A2D3E] transition-colors"
                >
                  <span className="text-sm text-white font-medium">Currency</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-emerald-400">{settings.currency}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </button>
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#252840]">
                  <span className="text-sm text-white font-medium">Dark Mode</span>
                  <button
                    onClick={() => toggleSetting('darkMode')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.darkMode ? "bg-emerald-500" : "bg-[#374151]"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.darkMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Support & Help Section */}
            <div className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Support & Help</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-[#252840]">
                  <span className="text-sm text-white font-medium">Withdrawal Times</span>
                  <span className="text-xs text-[#9CA3AF] text-right max-w-xs">
                    Under $5: Instant | $10-15: 15 days | $15-25: 25 days | $25+: 35 days
                  </span>
                </div>
                <button
                  onClick={() => router.push("/support")}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#252840] w-full hover:bg-[#2A2D3E] transition-colors"
                >
                  <span className="text-sm text-white font-medium">Contact Support</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-emerald-400">Visit Support Center</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </button>
                <button
                  onClick={() => router.push("/help-center")}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#252840] w-full hover:bg-[#2A2D3E] transition-colors"
                >
                  <span className="text-sm text-white font-medium">Help Center</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-emerald-400">FAQs & Guides</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </button>
                <button
                  onClick={() => router.push("/faq")}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#252840] w-full hover:bg-[#2A2D3E] transition-colors"
                >
                  <span className="text-sm text-white font-medium">FAQ</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-emerald-400">Common Questions</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Selection Modal */}
      {languageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1D2E] rounded-2xl border border-[#2A2D3E] max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-white mb-4">Select Language</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    updateSetting('language', lang);
                    setLanguageModalOpen(false);
                  }}
                  className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                    settings.language === lang
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-[#252840] text-white hover:bg-[#2A2D3E]"
                  }`}
                >
                  <span>{lang}</span>
                  {settings.language === lang && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setLanguageModalOpen(false)}
              className="w-full mt-4 py-3 rounded-lg bg-[#252840] text-white hover:bg-[#2A2D3E] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Currency Selection Modal */}
      {currencyModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1D2E] rounded-2xl border border-[#2A2D3E] max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-white mb-4">Select Currency</h3>
            <div className="space-y-2">
              {currencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    updateSetting('currency', curr);
                    setCurrencyModalOpen(false);
                  }}
                  className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                    settings.currency === curr
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-[#252840] text-white hover:bg-[#2A2D3E]"
                  }`}
                >
                  <span>{curr}</span>
                  {settings.currency === curr && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrencyModalOpen(false)}
              className="w-full mt-4 py-3 rounded-lg bg-[#252840] text-white hover:bg-[#2A2D3E] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication Modal */}
      {twoFAModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1D2E] rounded-2xl border border-[#2A2D3E] max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                {twoFAStep === "setup" && "Setup Two-Factor Authentication"}
                {twoFAStep === "verify" && "Verify Code"}
                {twoFAStep === "backup" && "Save Backup Codes"}
                {twoFAStep === "disable" && "Disable Two-Factor Authentication"}
              </h3>
              <button
                onClick={() => setTwoFAModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {twoFAError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 text-red-400 text-sm">
                {twoFAError}
              </div>
            )}

            {/* Setup Step */}
            {twoFAStep === "setup" && (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.) or enter the secret key manually.
                </p>
                
                {/* QR Code placeholder - In production, generate actual QR */}
                <div className="bg-white p-4 rounded-lg mx-auto w-fit">
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center">
                    QR Code<br/>
                    (Use secret key below)
                  </div>
                </div>

                {/* Secret Key */}
                <div className="bg-[#252840] rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Secret Key:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-emerald-400 font-mono text-sm break-all">
                      {twoFASecret}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(twoFASecret);
                        toast.success("Secret copied!");
                      }}
                      className="p-2 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setTwoFAStep("verify")}
                  className="w-full py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Continue to Verification
                </button>
              </div>
            )}

            {/* Verify Step */}
            {twoFAStep === "verify" && (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Enter the 6-digit code from your authenticator app to verify setup.
                </p>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Verification Code</label>
                  <input
                    type="text"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="w-full bg-[#252840] border border-[#3A3D4E] rounded-lg px-4 py-3 text-white text-center text-2xl font-mono tracking-widest focus:border-emerald-500 focus:outline-none"
                    maxLength={6}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setTwoFAStep("setup")}
                    className="flex-1 py-3 rounded-lg bg-[#252840] text-white hover:bg-[#2A2D3E] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handle2FAVerify}
                    disabled={twoFALoading || twoFACode.length !== 6}
                    className="flex-1 py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    {twoFALoading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : "Verify & Enable"}
                  </button>
                </div>
              </div>
            )}

            {/* Backup Codes Step */}
            {twoFAStep === "backup" && (
              <div className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-yellow-400 text-sm">
                  <strong>Important!</strong> Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
                </div>
                
                <div className="bg-[#252840] rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="font-mono text-white text-sm bg-[#1A1D2E] rounded px-2 py-1 text-center">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={copyBackupCodes}
                  className="w-full py-3 rounded-lg bg-[#252840] text-white hover:bg-[#2A2D3E] transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Backup Codes
                </button>

                <button
                  onClick={() => setTwoFAModalOpen(false)}
                  className="w-full py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Done
                </button>
              </div>
            )}

            {/* Disable Step */}
            {twoFAStep === "disable" && (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Enter your 6-digit authenticator code or a backup code to disable two-factor authentication.
                </p>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Verification Code</label>
                  <input
                    type="text"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase())}
                    placeholder="000000"
                    className="w-full bg-[#252840] border border-[#3A3D4E] rounded-lg px-4 py-3 text-white text-center text-xl font-mono tracking-widest focus:border-red-500 focus:outline-none"
                    maxLength={8}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setTwoFAModalOpen(false)}
                    className="flex-1 py-3 rounded-lg bg-[#252840] text-white hover:bg-[#2A2D3E] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handle2FADisable}
                    disabled={twoFALoading || twoFACode.length < 6}
                    className="flex-1 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {twoFALoading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : "Disable 2FA"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
