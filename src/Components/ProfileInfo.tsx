"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";

export default function ProfileInfo({
  size = 40,
  username: propUsername,
  avatarUrl: propAvatarUrl,
}: {
  size?: number,
  username?: string | null,
  avatarUrl?: string | null,
}) {
  const { isSignedIn, user } = useUser();

  // Fallback to Clerk user data if props are not provided
  const clerkUser = isSignedIn ? user : null;
  const fullName = propUsername || (clerkUser as any)?.fullName || `${(clerkUser as any)?.firstName || ""} ${(clerkUser as any)?.lastName || ""}`.trim();
  const email = (clerkUser as any)?.primaryEmailAddress?.emailAddress || (clerkUser as any)?.emailAddresses?.[0]?.emailAddress || (clerkUser as any)?.email;
  const imageUrl = propAvatarUrl || (clerkUser as any)?.profileImageUrl || (clerkUser as any)?.imageUrl || null;

  if (!isSignedIn && !propUsername) {
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
        {email && <span style={{ fontSize: 12, color: "#9AA0B5" }}>{email}</span>}
      </div>
    </div>
  );
}
