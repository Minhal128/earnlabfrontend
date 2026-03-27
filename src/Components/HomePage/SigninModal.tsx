"use client";
import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import GoogleImg from "../../../public/assets/g.png";
import FbImg from "../../../public/assets/fb.png";
import WeldImg from "../../../public/assets/weld.png";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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

export default function SignInModal({
  isOpen,
  onClose,
  onForgotPassword,
  onSignUp,
}: {
  isOpen: boolean;
  onClose: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

  const redirectAfter = `${typeof window !== "undefined" ? window.location.origin : ""}/home`;

  // Load Google Sign-In script for direct OAuth
  useEffect(() => {
    if (!isOpen || !googleClientId || googleScriptLoaded) return;

    // Check if script already exists
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

  // Re-initialize Google button when modal opens
  useEffect(() => {
    if (isOpen && googleScriptLoaded) {
      // Small delay to ensure DOM is ready
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
    console.log("[SignIn Modal] Google callback received");
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
      console.log("[SignIn Modal] Google auth response:", res.status);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        // Dispatch auth event
        try {
          const evt = new CustomEvent("app-auth-changed", {
            detail: { token: data.token, user: data.user },
          });
          window.dispatchEvent(evt);
        } catch {}
        console.log("[SignIn Modal] ✅ Login successful!");
        onClose();
        router.push("/home");
      } else {
        setError(data.message || "Google sign-in failed");
      }
    } catch (err: any) {
      console.error("[SignIn Modal] Google auth error:", err);
      setError("Failed to connect to server");
    } finally {
      setOauthLoading(null);
    }
  };

  // Facebook OAuth via Clerk
  const handleFacebookOAuth = async () => {
    console.debug("Facebook OAuth button clicked", { isLoaded, signInPresent: !!signIn });

    if (!isLoaded || !signIn) {
      setError("Authentication system is loading. Please wait a moment and try again.");
      return;
    }

    setOauthLoading("facebook");
    setError(null);
    try {
      console.log("Starting Facebook OAuth");
      await signIn.authenticateWithRedirect({
        strategy: "oauth_facebook" as any,
        redirectUrl: redirectAfter,
        redirectUrlComplete: redirectAfter,
      });
    } catch (err: any) {
      console.error("Facebook OAuth redirect failed", err);
      let errorMessage = "Sign-in failed. Please try again.";
      if (err?.message) {
        if (err.message.includes("not enabled")) {
          errorMessage = "Facebook sign-in is not enabled. Please contact support.";
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
      <div className="relative w-full max-w-[1020px] bg-[#0D0F1E] border border-[#1C2033] rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.55)]">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[620px] md:min-h-[680px]">
          {/* Left visual panel */}
          <div className="hidden md:block relative bg-[#11172A]">
            <img
              src="/assets/sigin.jpeg"
              alt="LabWards sign-in"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,79,89,0.22),rgba(13,15,30,0.55))]" />
          </div>

          {/* Right form panel */}
          <div className="relative bg-[#0D0F1E] px-5 sm:px-7 md:px-10 py-8 md:py-10 flex flex-col">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 w-7 h-7 rounded-full bg-[#1C2033] hover:bg-[#2A2E45] text-[#8C8FA8] hover:text-white transition-colors flex items-center justify-center"
              aria-label="Close sign in modal"
            >
              <X size={14} />
            </button>

            <div className="w-full max-w-[430px] mx-auto pt-6 md:pt-2 flex-1 flex flex-col">
              <h2 className="text-white text-[34px] font-bold leading-tight mb-6">Sign in</h2>

              {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

              <label className="text-white text-[14px] font-medium mb-2">Email Address</label>
              <input
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                type="email"
                placeholder="Enter your email address"
                className="w-full h-[48px] px-4 rounded-[10px] bg-[#151828] border border-[#1E2238] text-white placeholder-[#5A5E79] outline-none focus:border-[#0BBFA0] mb-4"
              />

              <label className="text-white text-[14px] font-medium mb-2">Password</label>
              <div className="relative mb-4">
                <input
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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

              <button
                onClick={async () => {
                  if (!emailValue || !passwordValue) {
                    setError("Please enter email and password");
                    return;
                  }
                  setLoading(true);
                  setError(null);
                  try {
                    const resp = await fetch(`${apiBase}/api/v1/auth/login`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: emailValue,
                        password: passwordValue,
                      }),
                    });
                    const data = await resp.json();
                    if (!resp.ok) {
                      setError(data?.message || "Login failed");
                      setLoading(false);
                      return;
                    }
                    if (data?.token) {
                      try {
                        localStorage.setItem("token", data.token);
                      } catch {}
                      try {
                        const evt = new CustomEvent("app-auth-changed", {
                          detail: { token: data.token, user: data.user },
                        });
                        window.dispatchEvent(evt);
                      } catch {}
                    }
                    onClose();
                    router.push("/home");
                  } catch (err: any) {
                    console.error("Login error", err);
                    setError(err?.message || "Login failed. Please try again.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full h-[50px] rounded-[10px] font-semibold text-white shadow-[0px_8px_24px_rgba(9,159,134,0.35)] hover:opacity-90 transition-all active:scale-[0.99]"
                style={{ background: "linear-gradient(135deg, #0BBFA0 0%, #079E85 100%)" }}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="flex items-center justify-center gap-1 text-[15px] leading-6 text-[#6B6E8A] mt-5 mb-6">
                <span>Don't have an account yet?</span>
                <button
                  onClick={() => {
                    onClose();
                    onSignUp();
                  }}
                  className="text-white font-semibold hover:text-[#0BBFA0] transition-colors"
                >
                  Sign up
                </button>
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                <button
                  type="button"
                  className="w-full h-[48px] bg-[#151828] border border-[#1E2238] rounded-[10px] flex items-center justify-center gap-3 hover:border-[#0BBFA055] hover:bg-[#1A1E32] transition-all"
                >
                  <Image src={WeldImg} alt="Worldcoin" width={18} height={18} />
                  <span className="text-[#9093AC] text-[14px] font-medium">Sign in via Worldcoin</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoogleClick}
                  disabled={!googleScriptLoaded || !!oauthLoading}
                  className="w-full h-[48px] bg-[#151828] border border-[#1E2238] rounded-[10px] flex items-center justify-center gap-3 hover:border-[#4285F455] hover:bg-[#1A1E32] transition-all disabled:opacity-60"
                >
                  <Image src={GoogleImg} alt="Google" width={18} height={18} />
                  <span className="text-[#9093AC] text-[14px] font-medium">{oauthLoading === "google" ? "Redirecting..." : "Sign in via Google"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleFacebookOAuth}
                  disabled={!isLoaded || !!oauthLoading}
                  className="w-full h-[48px] bg-[#151828] border border-[#1E2238] rounded-[10px] flex items-center justify-center gap-3 hover:border-[#1877F255] hover:bg-[#1A1E32] transition-all disabled:opacity-60"
                >
                  <Image src={FbImg} alt="Facebook" width={18} height={18} />
                  <span className="text-[#9093AC] text-[14px] font-medium">{oauthLoading === "facebook" ? "Redirecting..." : "Sign in via Facebook"}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onForgotPassword?.();
                }}
                className="self-start mt-4 text-[13px] text-[#18C3A7] hover:text-[#3CE6CC] transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
