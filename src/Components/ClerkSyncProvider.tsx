"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useAuth, useUser, useSession } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * ClerkSyncProvider
 * 
 * This component handles syncing Clerk OAuth users with the backend.
 * 
 * Key insight: With development keys on production, Clerk's hooks (useUser, useAuth)
 * may not properly populate. However, after OAuth redirect:
 * 1. The user data IS briefly available in the component state
 * 2. We need to capture it immediately and sync with backend
 * 
 * Strategy:
 * - Use polling to repeatedly check for Clerk user data
 * - As soon as we detect a valid user, sync and save token
 * - Stop polling once synced
 */
function ClerkSyncProviderInner({ children }: { children: React.ReactNode }) {
  const { getToken, userId, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { session, isLoaded: sessionLoaded } = useSession();
  const pathname = usePathname();
  
  const syncAttempted = useRef(false);
  const [syncComplete, setSyncComplete] = useState(false);

  // Check if we just came from OAuth (check URL or session storage)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Mark that we're coming from OAuth if on callback routes
    if (pathname?.includes("sso-callback") || pathname?.includes("sign-in")) {
      sessionStorage.setItem("clerk_oauth_pending", "true");
    }
  }, [pathname]);

  // Main sync effect - runs repeatedly until successful
  useEffect(() => {
    if (syncComplete) return;
    if (!userLoaded || !sessionLoaded) return;

    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      console.log("[ClerkSync] Already have token");
      setSyncComplete(true);
      return;
    }

    const attemptSync = async () => {
      // Log all state for debugging
      console.log("[ClerkSync] Checking state:", {
        isSignedIn,
        userId,
        hasUser: !!user,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
        hasSession: !!session,
        pathname,
      });

      // Get email from any available source
      let email: string | null = null;
      let name: string | null = null;
      let avatar: string | null = null;

      // Try from Clerk user object
      if (user) {
        email = user.primaryEmailAddress?.emailAddress ||
               user.emailAddresses?.[0]?.emailAddress ||
               (user as any).email;
        name = user.fullName || 
               `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
               user.username;
        avatar = user.imageUrl;
      }

      // Try from session
      if (!email && session) {
        const sessionUser = (session as any)?.user;
        if (sessionUser) {
          email = sessionUser.primaryEmailAddress?.emailAddress ||
                 sessionUser.emailAddresses?.[0]?.emailAddress;
          name = sessionUser.fullName || sessionUser.firstName;
          avatar = sessionUser.imageUrl;
        }
      }

      // Try getToken and decode it
      if (!email) {
        try {
          const token = await getToken();
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            email = payload.email || null;
            console.log("[ClerkSync] Got email from token:", email);
          }
        } catch (e) {
          // Token not available
        }
      }

      if (!email) {
        console.log("[ClerkSync] No email found yet");
        return false;
      }

      // We have email - do the sync!
      console.log("[ClerkSync] 🚀 Found email, syncing:", email);
      
      try {
        let clerkToken: string | null = null;
        try {
          clerkToken = await getToken();
        } catch (e) {}

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (clerkToken) {
          headers["X-Clerk-Token"] = clerkToken;
        }

        const resp = await fetch(`${apiBase}/api/v1/auth/clerk-sync`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            email,
            name: name || email.split('@')[0],
            avatarUrl: avatar,
            clerkUserId: userId || `clerk_${email}`,
          }),
        });

        const data = await resp.json();
        console.log("[ClerkSync] Response:", resp.status, data);

        if (resp.ok && data?.token) {
          localStorage.setItem("token", data.token);
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          console.log("[ClerkSync] ✅ Token saved!");
          sessionStorage.removeItem("clerk_oauth_pending");
          setSyncComplete(true);
          
          // Notify other components
          window.dispatchEvent(new CustomEvent('clerk-synced', { detail: { token: data.token } }));
          
          // Reload to refresh state
          setTimeout(() => window.location.reload(), 500);
          return true;
        } else {
          console.error("[ClerkSync] Sync failed:", data);
          return false;
        }
      } catch (err) {
        console.error("[ClerkSync] Error:", err);
        return false;
      }
    };

    // Try sync immediately
    attemptSync();

    // Also poll every 2 seconds in case Clerk is slow to populate
    const oauthPending = sessionStorage.getItem("clerk_oauth_pending");
    if (oauthPending && !syncAttempted.current) {
      console.log("[ClerkSync] OAuth pending, starting polling...");
      syncAttempted.current = true;
      
      let attempts = 0;
      const maxAttempts = 10;
      
      const pollInterval = setInterval(async () => {
        attempts++;
        console.log(`[ClerkSync] Polling attempt ${attempts}/${maxAttempts}`);
        
        const success = await attemptSync();
        if (success || attempts >= maxAttempts) {
          clearInterval(pollInterval);
          if (!success) {
            console.log("[ClerkSync] Max attempts reached, giving up");
            sessionStorage.removeItem("clerk_oauth_pending");
          }
        }
      }, 2000);

      return () => clearInterval(pollInterval);
    }
  }, [userLoaded, sessionLoaded, isSignedIn, user, session, userId, getToken, syncComplete, pathname]);

  // Manual sync trigger
  useEffect(() => {
    const handleManualSync = () => {
      syncAttempted.current = false;
      setSyncComplete(false);
      localStorage.removeItem("token");
      sessionStorage.setItem("clerk_oauth_pending", "true");
    };

    window.addEventListener('force-clerk-sync', handleManualSync);
    return () => window.removeEventListener('force-clerk-sync', handleManualSync);
  }, []);

  return <>{children}</>;
}

export default function ClerkSyncProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <ClerkSyncProviderInner>{children}</ClerkSyncProviderInner>
    </Suspense>
  );
}
