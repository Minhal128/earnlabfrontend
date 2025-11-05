"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Lock, Globe, Moon, Smartphone } from "lucide-react";
import TopBar from "@/Components/Topbar";

export default function SettingsPage() {
  const router = useRouter();

  const settingsSections = [
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      items: [
        { label: "Push Notifications", type: "toggle", enabled: true },
        { label: "Email Notifications", type: "toggle", enabled: false },
        { label: "SMS Notifications", type: "toggle", enabled: false },
      ],
    },
    {
      title: "Privacy & Security",
      icon: <Lock className="w-5 h-5" />,
      items: [
        { label: "Two-Factor Authentication", type: "toggle", enabled: false },
        { label: "Show Profile Publicly", type: "toggle", enabled: true },
      ],
    },
    {
      title: "Preferences",
      icon: <Globe className="w-5 h-5" />,
      items: [
        { label: "Language", type: "select", value: "English" },
        { label: "Currency", type: "select", value: "USD" },
        { label: "Dark Mode", type: "toggle", enabled: true },
      ],
    },
  ];

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
            {settingsSections.map((section, index) => (
              <div key={index} className="rounded-2xl bg-[#1A1D2E] border border-[#2A2D3E] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    {section.icon}
                  </div>
                  <h2 className="text-lg font-bold text-white">{section.title}</h2>
                </div>

                <div className="space-y-3">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-[#252840]">
                      <span className="text-sm text-white font-medium">{item.label}</span>
                      {item.type === "toggle" && (
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.enabled ? "bg-emerald-500" : "bg-[#374151]"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.enabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      )}
                      {item.type === "select" && (
                        <span className="text-sm text-emerald-400">{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
