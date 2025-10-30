"use client";
import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import GoogleImg from "../../../public/assets/g.png";
import FbImg from "../../../public/assets/fb.png";
import WeldImg from "../../../public/assets/weld.png";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { IoMdMail, IoMdLock } from "react-icons/io";
import Link from "next/link";

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

  const redirectAfter = `${typeof window !== "undefined" ? window.location.origin : ""}/home`;

  const handleOAuth = async (strategy: string) => {
    // debug to help trace why clicks may appear to do nothing
    // eslint-disable-next-line no-console
    console.debug("OAuth button clicked", {
      strategy,
      isLoaded,
      signInPresent: !!signIn,
    });

    if (!isLoaded || !signIn) {
      // Clerk not ready yet — surface friendly feedback so user knows why
      // eslint-disable-next-line no-console
      console.warn(
        "Clerk not loaded yet; isLoaded=",
        isLoaded,
        "signIn=",
        !!signIn,
      );
      setError("Authentication system is loading. Please wait a moment and try again.");
      return;
    }

    setOauthLoading(strategy);
    setError(null);
    try {
      // start the OAuth redirect (cast strategy to any to satisfy types)
      // eslint-disable-next-line no-console
      console.log("Starting OAuth for", strategy);
      await signIn.authenticateWithRedirect({
        strategy: strategy as any,
        redirectUrl: redirectAfter,
        redirectUrlComplete: redirectAfter,
      });
      // Note: a successful redirect will leave this page before the finally runs.
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("OAuth redirect failed", err);
      
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
      // If authenticateWithRedirect fails synchronously, clear loading state.
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
          Welcome back!
        </h2>
        <p className="text-sm text-[#8C8FA8] text-center mb-6">
          Log in to access MORE earnings
        </p>

        <div className="flex justify-between gap-3 mb-4">
          <button
            onClick={() => handleOAuth("oauth_google")}
            disabled={!isLoaded || !!oauthLoading}
            className="flex-1 flex items-center cursor-pointer text-xs justify-center gap-2 py-3 rounded-md bg-white text-black font-medium"
          >
            <Image src={GoogleImg} alt="Google" width={16} height={20} />{" "}
            {oauthLoading === "oauth_google" ? "Redirecting..." : "Google"}
          </button>
          <button
            onClick={() => handleOAuth("oauth_facebook")}
            disabled={!isLoaded || !!oauthLoading}
            className="flex-1 flex items-center text-xs cursor-pointer justify-center gap-2 py-3 rounded-md bg-white text-black font-medium"
          >
            <Image src={FbImg} alt="Facebook" width={16} height={20} />{" "}
            {oauthLoading === "oauth_facebook" ? "Redirecting..." : "Facebook"}
          </button>
          <button className="flex-1 flex items-center text-xs cursor-pointer justify-center gap-2 py-3 rounded-md bg-white text-black font-medium">
            <Image src={WeldImg} alt="Worldcoin" width={16} height={20} />{" "}
            Worldcoin
          </button>
        </div>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-[#30334A]"></div>
          <span className="px-3 text-xs text-[#B3B6C7]">Or sign in with</span>
          <div className="flex-1 h-px bg-[#30334A]"></div>
        </div>

        {error && <div className="text-red-400 text-sm mb-3 text-center">{error}</div>}

        <div className="relative mb-3">
          <IoMdMail
            size={18}
            className="absolute left-3 top-3 text-[#18C3A7]"
          />
          <input
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            type="email"
            placeholder="Email address"
            className="w-full pl-10 pr-4 py-3 rounded-md bg-[#26293E] outline-none text-sm"
          />
        </div>

        <div className="relative">
          <IoMdLock
            size={18}
            className="absolute left-3 top-3 text-[#18C3A7]"
          />
          <input
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
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

        <p
          onClick={() => {
            onClose();
            onForgotPassword?.();
          }}
          className="text-sm text-[#18C3A7] cursor-pointer mt-2 mb-4"
        >
          Forgot password?
        </p>

        <button
          onClick={async () => {
            // basic client-side email/password sign in against backend
            if (!emailValue || !passwordValue) {
              setError("Please enter email and password");
              return;
            }
            setLoading(true);
            setError(null);
            try {
              const api =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
              const resp = await fetch(`${api}/api/v1/auth/login`, {
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
                // notify other parts of the app (Topbar, Profile) that auth changed
                // include the returned user in the event detail so listeners can update immediately
                try {
                  const evt = new CustomEvent("app-auth-changed", {
                    detail: { token: data.token, user: data.user },
                  });
                  window.dispatchEvent(evt);
                } catch {}
              }
              // close modal and navigate
              onClose();
              router.push("/home");
            } catch (err: any) {
              // eslint-disable-next-line no-console
              console.error("Login error", err);
              setError(err?.message || "Login failed. Please try again.");
            } finally {
              setLoading(false);
            }
          }}
          className="w-full py-3 bg-[#18C3A7] cursor-pointer rounded-md font-medium"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-[#8C8FA8] mt-4">
          Don’t have an account?{" "}
          <span
            onClick={() => {
              onClose();
              onSignUp();
            }}
            className="text-[#18C3A7] cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
