"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

import GoogleImg from "../../../public/assets/g.png";
import FbImg from "../../../public/assets/fb.png";
import WeldImg from "../../../public/assets/weld.png";
import { useSignUp } from "@clerk/nextjs";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function SignUpModal({
  isOpen,
  onClose,
  onSignIn,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isLoaded } = useSignUp();
  const redirectAfter = `${typeof window !== "undefined" ? window.location.origin : ""}/home`;
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

  const [agree, setAgree] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load Google Sign-In script for direct OAuth
  useEffect(() => {
    if (!isOpen || !googleClientId || googleScriptLoaded) return;

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      setGoogleScriptLoaded(true);
      initializeGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleScriptLoaded(true);
      initializeGoogleButton();
    };
    document.body.appendChild(script);
  }, [isOpen, googleScriptLoaded]);

  useEffect(() => {
    if (isOpen && googleScriptLoaded) {
      setTimeout(() => initializeGoogleButton(), 100);
    }
  }, [isOpen, googleScriptLoaded]);

  const initializeGoogleButton = () => {
    if (window.google && googleClientId) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  };

  const handleGoogleClick = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const handleGoogleCallback = async (response: any) => {
    console.log("[SignUp Modal] Google callback received");
    setOauthLoading("google");
    setError(null);

    try {
      const res = await fetch(`${apiBase}/api/v1/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: response.credential,
          clientId: googleClientId,
        }),
      });

      const data = await res.json();
      console.log("[SignUp Modal] Google auth response:", res.status);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        try {
          const evt = new CustomEvent("app-auth-changed", {
            detail: { token: data.token, user: data.user },
          });
          window.dispatchEvent(evt);
        } catch {}
        console.log("[SignUp Modal] ✅ Sign up successful!");
        onClose();
        router.push("/home");
      } else {
        setError(data.message || "Google sign-up failed");
      }
    } catch (err: any) {
      console.error("[SignUp Modal] Google auth error:", err);
      setError("Failed to connect to server");
    } finally {
      setOauthLoading(null);
    }
  };

  // Facebook OAuth via Clerk
  const handleFacebookOAuth = async () => {
    console.debug("Facebook OAuth signup clicked", { isLoaded, signUpPresent: !!signUp });

    if (!isLoaded || !signUp) {
      setError("Authentication system is loading. Please wait a moment and try again.");
      return;
    }

    setOauthLoading("facebook");
    setError(null);
    try {
      console.log("Starting Facebook OAuth signup");
      await signUp.authenticateWithRedirect({
        strategy: "oauth_facebook" as any,
        redirectUrl: redirectAfter,
        redirectUrlComplete: redirectAfter,
      });
    } catch (err: any) {
      console.error("Facebook OAuth signup redirect failed", err);
      let errorMessage = "Sign-up failed. Please try again.";
      if (err?.message) {
        if (err.message.includes("not enabled")) {
          errorMessage = "Facebook sign-up is not enabled. Please contact support.";
        } else if (err.message.includes("popup")) {
          errorMessage = "Pop-up was blocked. Please allow pop-ups and try again.";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setOauthLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-[560px] md:max-w-[940px] max-h-[88vh] bg-[#0D0F1E] border border-[#1C2033] rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.55)]">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[560px] md:min-h-[640px]">
          {/* Left visual panel */}
          <div className="hidden md:block relative bg-[#11172A]">
            <img
              src="/assets/signup.jpeg"
              alt="LabWards sign-up"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,79,89,0.22),rgba(13,15,30,0.55))]" />
          </div>

          {/* Right form panel */}
          <div className="relative bg-[#0D0F1E] px-5 sm:px-7 md:px-10 py-8 md:py-10 flex flex-col overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 w-7 h-7 rounded-full bg-[#1C2033] hover:bg-[#2A2E45] text-[#8C8FA8] hover:text-white transition-colors flex items-center justify-center"
              aria-label="Close sign up modal"
            >
              <X size={14} />
            </button>

            <div className="w-full max-w-[430px] mx-auto pt-6 md:pt-2 flex-1 flex flex-col">
              <h2 className="text-white text-[34px] font-bold leading-tight mb-6">Sign up</h2>

              {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

              <label className="text-white text-[14px] font-medium mb-2">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Choose a username"
                className="w-full h-[48px] px-4 rounded-[10px] bg-[#151828] border border-[#1E2238] text-white placeholder-[#5A5E79] outline-none focus:border-[#0BBFA0] mb-4"
              />

              <label className="text-white text-[14px] font-medium mb-2">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email address"
                className="w-full h-[48px] px-4 rounded-[10px] bg-[#151828] border border-[#1E2238] text-white placeholder-[#5A5E79] outline-none focus:border-[#0BBFA0] mb-4"
              />

              <label className="text-white text-[14px] font-medium mb-2">Password</label>
              <div className="relative mb-4">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full h-[48px] px-4 pr-11 rounded-[10px] bg-[#151828] border border-[#1E2238] text-white placeholder-[#5A5E79] outline-none focus:border-[#0BBFA0]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6E8A] hover:text-[#9BA0C2] transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <label className="text-white text-[14px] font-medium mb-2">Affiliate Code</label>
              <input
                value={affiliateCode}
                onChange={(e) => setAffiliateCode(e.target.value)}
                type="text"
                placeholder="Affiliate code (optional)"
                className="w-full h-[48px] px-4 rounded-[10px] bg-[#151828] border border-[#1E2238] text-white placeholder-[#5A5E79] outline-none focus:border-[#0BBFA0] mb-4"
              />

              <div className="flex items-start gap-2 mt-1 mb-5">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 accent-[#18C3A7] w-4 h-4 cursor-pointer"
                />
                <p className="text-xs text-[#8C8FA8] leading-relaxed">
                  By creating this account, you agree to the{" "}
                  <span className="text-[#18C3A7] cursor-pointer">Terms of Service</span>{" "}
                  and <span className="text-[#18C3A7] cursor-pointer">Policy</span>.
                </p>
              </div>

              <button
                disabled={!agree || loading}
                onClick={async () => {
                  setError(null);
                  if (!agree) return;
                  if (!username || !email || !password) {
                    setError("Please fill username, email and password.");
                    return;
                  }
                  setLoading(true);
                  try {
                    const res = await fetch(`${apiBase}/api/v1/auth/register`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        username,
                        email,
                        password,
                        affiliateCode,
                        agreedToTerms: true,
                      }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      setError(data?.message || "Registration failed");
                      setLoading(false);
                      return;
                    }

                    if (data.token) {
                      if (typeof window !== "undefined") {
                        localStorage.setItem("token", data.token);
                      }
                    }
                    setLoading(false);
                    onClose();
                    router.push("/home");
                  } catch (e: any) {
                    setError(e?.message || "Network error");
                    setLoading(false);
                  }
                }}
                className={`w-full h-[50px] rounded-[10px] font-semibold text-white shadow-[0px_8px_24px_rgba(9,159,134,0.35)] transition-all active:scale-[0.99] ${agree ? "bg-[linear-gradient(135deg,#0BBFA0_0%,#079E85_100%)] hover:opacity-90" : "bg-[#3a3d54]"} ${loading ? "opacity-70 cursor-wait" : "cursor-pointer"}`}
              >
                {loading ? "Creating..." : "Sign up"}
              </button>

              <p className="text-center text-[15px] text-[#6B6E8A] mt-6 mb-6">
                Already have an account?{" "}
                <button onClick={onSignIn} className="text-white font-bold hover:text-[#0BBFA0] transition-colors">
                  Sign in
                </button>
              </p>

              <div className="flex flex-col gap-3 mt-auto">
                <button
                  type="button"
                  className="w-full h-[48px] bg-[#151828] border border-[#1E2238] rounded-[10px] flex items-center justify-center gap-3 hover:border-[#0BBFA055] hover:bg-[#1A1E32] transition-all"
                >
                  <Image src={WeldImg} alt="Worldcoin" width={18} height={18} />
                  <span className="text-[#9093AC] text-[14px] font-medium">Sign up via Worldcoin</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoogleClick}
                  disabled={!googleScriptLoaded || !!oauthLoading}
                  className="w-full h-[48px] bg-[#151828] border border-[#1E2238] rounded-[10px] flex items-center justify-center gap-3 hover:border-[#4285F455] hover:bg-[#1A1E32] transition-all disabled:opacity-60"
                >
                  <Image src={GoogleImg} alt="Google" width={18} height={18} />
                  <span className="text-[#9093AC] text-[14px] font-medium">{oauthLoading === "google" ? "Redirecting..." : "Sign up via Google"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleFacebookOAuth}
                  disabled={!isLoaded || !!oauthLoading}
                  className="w-full h-[48px] bg-[#151828] border border-[#1E2238] rounded-[10px] flex items-center justify-center gap-3 hover:border-[#1877F255] hover:bg-[#1A1E32] transition-all disabled:opacity-60"
                >
                  <Image src={FbImg} alt="Facebook" width={18} height={18} />
                  <span className="text-[#9093AC] text-[14px] font-medium">{oauthLoading === "facebook" ? "Redirecting..." : "Sign up via Facebook"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
