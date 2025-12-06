"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

import GoogleImg from "../../../public/assets/g.png";
import FbImg from "../../../public/assets/fb.png";
import WeldImg from "../../../public/assets/weld.png";
import { useSignUp } from "@clerk/nextjs";
import { IoMdMail } from "react-icons/io";
import { IoMdLock } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { FaCodeMerge } from "react-icons/fa6";

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-[#1E2133] text-white rounded-xl w-[90%] max-w-md md:p-10 px-5 py-6 relative">
        <button
          onClick={onClose}
          className="absolute right-3 cursor-pointer bg-[#8C8FA8] top-3 text-black rounded-md p-1"
        >
          <X size={14} />
        </button>

        <h2 className="text-2xl text-[#E6FAF6] mb-2 font-semibold mt-5 text-center">
          Create an account
        </h2>
        <p className="text-sm text-[#8C8FA8] text-center mb-6">
          Sign up to start earning
        </p>

        <div className="flex justify-between gap-3 mb-4">
          {/* Google - Direct OAuth */}
          <button
            onClick={handleGoogleClick}
            disabled={!googleScriptLoaded || !!oauthLoading}
            className="flex-1 flex items-center text-xs cursor-pointer justify-center gap-2 py-3 rounded-md bg-white text-black font-medium"
          >
            <Image src={GoogleImg} alt="Google" width={16} height={20} />
            {oauthLoading === "google" ? "Redirecting..." : "Google"}
          </button>

          {/* Facebook - Clerk OAuth */}
          <button
            onClick={handleFacebookOAuth}
            disabled={!isLoaded || !!oauthLoading}
            className="flex-1 flex items-center text-xs cursor-pointer justify-center gap-2 py-3 rounded-md bg-white text-black font-medium"
          >
            <Image src={FbImg} alt="Facebook" width={16} height={20} />
            {oauthLoading === "facebook" ? "Redirecting..." : "Facebook"}
          </button>

          {/* Worldcoin - Static for now */}
          <button className="flex-1 flex items-center text-xs cursor-pointer justify-center gap-2 py-3 rounded-md bg-white text-black font-medium">
            <Image src={WeldImg} alt="Worldcoin" width={16} height={20} />
            Worldcoin
          </button>
        </div>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-[#30334A]"></div>
          <span className="px-3 text-xs text-[#B3B6C7]">Or sign up with</span>
          <div className="flex-1 h-px bg-[#30334A]"></div>
        </div>

        <div className="relative mb-3">
          <FaUser size={18} className="absolute left-3 top-3 text-[#18C3A7]" />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="w-full pl-10 pr-4 py-3 rounded-md bg-[#26293E] outline-none text-sm"
          />
        </div>

        <div className="relative mb-3">
          <IoMdMail size={18} className="absolute left-3 top-3 text-[#18C3A7]" />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email address"
            className="w-full pl-10 pr-4 py-3 rounded-md bg-[#26293E] outline-none text-sm"
          />
        </div>

        <div className="relative mb-3">
          <IoMdLock size={18} className="absolute left-3 top-3 text-[#18C3A7]" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-3 rounded-md bg-[#26293E] outline-none text-sm"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-[#6B6E8A] cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <div className="relative mb-3">
          <FaCodeMerge size={18} className="absolute left-3 top-3 text-[#18C3A7]" />
          <input
            value={affiliateCode}
            onChange={(e) => setAffiliateCode(e.target.value)}
            type="text"
            placeholder="Affiliate code"
            className="w-full pl-10 pr-4 py-3 rounded-md bg-[#26293E] outline-none text-sm"
          />
        </div>

        {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

        <div className="flex items-start gap-2 mt-3 mb-5">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 accent-[#18C3A7] w-4 h-4 cursor-pointer"
          />
          <p className="text-xs text-[#8C8FA8]">
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
          className={`w-full py-3 rounded-md font-medium ${agree ? "bg-[#18C3A7]" : "bg-[#3a3d54]"} ${loading ? "opacity-70 cursor-wait" : "cursor-pointer"}`}
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="text-center text-sm text-[#8C8FA8] mt-4">
          Already have an account?{" "}
          <span onClick={onSignIn} className="text-[#18C3A7] cursor-pointer">
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
