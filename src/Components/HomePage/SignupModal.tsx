"use client";
import { useState } from "react";
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

  const handleOAuthSignUp = async (strategy: string) => {
    // debug info to help trace clicks/loads
    // eslint-disable-next-line no-console
    console.debug("OAuth signup button clicked", {
      strategy,
      isLoaded,
      signUpPresent: !!signUp,
    });

    if (!isLoaded || !signUp) {
      // Clerk not ready yet — surface friendly feedback so user knows why
      // eslint-disable-next-line no-console
      console.warn(
        "Clerk not loaded yet; isLoaded=",
        isLoaded,
        "signUp=",
        !!signUp,
      );
      setError("Authentication system is loading. Please wait a moment and try again.");
      return;
    }

    setOauthLoading(strategy);
    setError(null);
    try {
      // start the OAuth redirect
      // eslint-disable-next-line no-console
      console.log("Starting OAuth signup for", strategy);
      await signUp.authenticateWithRedirect({
        strategy: strategy as any,
        redirectUrl: redirectAfter,
        redirectUrlComplete: redirectAfter,
      });
      // If redirect succeeds the page will navigate away.
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("OAuth signup redirect failed", err);
      
      // Provide user-friendly error messages
      let errorMessage = "Sign-in failed. Please try again.";
      if (err?.message) {
        if (err.message.includes("not enabled")) {
          errorMessage = `${strategy.replace('oauth_', '').charAt(0).toUpperCase() + strategy.replace('oauth_', '').slice(1)} sign-in is not enabled. Please contact support.`;
        } else if (err.message.includes("popup")) {
          errorMessage = "Pop-up was blocked. Please allow pop-ups and try again.";
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      // If authenticateWithRedirect fails synchronously, clear loading.
      setOauthLoading(null);
    }
  };
  const [agree, setAgree] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
          <button
            onClick={() => handleOAuthSignUp("oauth_google")}
            disabled={!isLoaded || !!oauthLoading}
            className="flex-1 flex items-center cursor-pointer text-xs justify-center gap-2 py-3 rounded-md bg-white text-black font-medium"
          >
            <Image src={GoogleImg} alt="Google" width={16} height={20} />
            {oauthLoading === "oauth_google" ? "Redirecting..." : "Google"}
          </button>

          <button
            onClick={() => handleOAuthSignUp("oauth_facebook")}
            disabled={!isLoaded || !!oauthLoading}
            className="flex-1 flex items-center text-xs cursor-pointer justify-center gap-2 py-3 rounded-md bg-white text-black font-medium"
          >
            <Image src={FbImg} alt="Facebook" width={16} height={20} />
            {oauthLoading === "oauth_facebook" ? "Redirecting..." : "Facebook"}
          </button>

          <button className="flex-1 flex items-center text-xs cursor-pointer justify-center gap-2 py-3 rounded-md bg-white text-black font-medium">
            <Image src={WeldImg} alt="Worldcoin" width={16} height={20} />
            Worldcoin
          </button>
        </div>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-[#30334A]"></div>
          <span className="px-3 text-xs text-[#B3B6C7]">Or sign in with</span>
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
          <IoMdMail
            size={18}
            className="absolute left-3 top-3 text-[#18C3A7]"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email address"
            className="w-full pl-10 pr-4 py-3 rounded-md bg-[#26293E] outline-none text-sm"
          />
        </div>

        <div className="relative mb-3">
          <IoMdLock
            size={18}
            className="absolute left-3 top-3 text-[#18C3A7]"
          />
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
          <FaCodeMerge
            size={18}
            className="absolute left-3 top-3 text-[#18C3A7]"
          />
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
            <span className="text-[#18C3A7] cursor-pointer">
              Terms of Service
            </span>{" "}
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
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/auth/register`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    username,
                    email,
                    password,
                    affiliateCode,
                    agreedToTerms: true,
                  }),
                },
              );
              const data = await res.json();
              if (!res.ok) {
                setError(data?.message || "Registration failed");
                setLoading(false);
                return;
              }

              // store token and navigate
              if (data.token) {
                if (typeof window !== "undefined") {
                  localStorage.setItem("token", data.token);
                }
              }
              setLoading(false);
              onClose();
              // navigate to home
              router.push("/home");
            } catch (e: any) {
              setError(e?.message || "Network error");
              setLoading(false);
            }
          }}
          className={`w-full py-3 rounded-md font-medium
                    ${agree ? "bg-[#18C3A7]" : "bg-[#3a3d54]"} ${loading ? "opacity-70 cursor-wait" : "cursor-pointer"}`}
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
