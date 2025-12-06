"use client";
import React, { useState, useEffect } from "react";

interface StoredUser {
  id?: string;
  email?: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
}

export default function ProfileInfo({
  size = 40,
  username: propUsername,
  avatarUrl: propAvatarUrl,
  showEmail = false,
}: {
  size?: number,
  username?: string | null,
  avatarUrl?: string | null,
  showEmail?: boolean,
}) {
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    
    if (token) {
      setIsAuthenticated(true);
      if (userStr) {
        try {
          setStoredUser(JSON.parse(userStr));
        } catch {
          // Invalid JSON
        }
      }
    }
  }, []);

  // Use props first, then stored user data
  const fullName = propUsername || storedUser?.displayName || storedUser?.username || "";
  const email = storedUser?.email || "";
  const imageUrl = propAvatarUrl || storedUser?.avatarUrl || null;

  if (!isAuthenticated && !propUsername) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: size, height: size, borderRadius: 999, background: "#2A2D44" }} />
        <div style={{ display: "none" }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={fullName || "avatar"} width={size} height={size} style={{ borderRadius: 999, objectFit: "cover" }} />
      ) : (
        <div style={{ width: size, height: size, borderRadius: 999, background: "#2A2D44" }} />
      )}
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{fullName || "User"}</span>
        {showEmail && email && <span style={{ fontSize: 12, color: "#9AA0B5" }}>{email}</span>}
      </div>
    </div>
  );
}
