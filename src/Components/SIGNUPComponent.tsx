"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

// ── Utility icons ─────────────────────────────────────────────────────────────
function EyeIcon() {
  return (
    <svg width="18" height="13" viewBox="-0 0 18.3322 13.3333">
      <path d="M9.1664 0C12.7414 0 15.7189 2.02417 18.0539 5.96167L18.2372 6.2775L18.2747 6.36083L18.2997 6.43L18.3114 6.47583L18.3231 6.54417L18.3322 6.6275L18.3322 6.71917L18.3206 6.81167C18.3151 6.84261 18.3078 6.87321 18.2989 6.90333L18.2664 6.99333L18.2364 7.05583L18.2231 7.08083C15.9197 11.1108 12.9731 13.2308 9.42723 13.33L9.1664 13.3333C5.50306 13.3333 2.4689 11.2092 0.109731 7.08C0.0378225 6.95411 0 6.81164 0 6.66667C0 6.52169 0.0378225 6.37922 0.109731 6.25333C2.4689 2.12417 5.50306 0 9.1664 0ZM9.1664 4.16667C8.50336 4.16667 7.86747 4.43006 7.39863 4.8989C6.92979 5.36774 6.6664 6.00363 6.6664 6.66667C6.6664 7.32971 6.92979 7.96559 7.39863 8.43443C7.86747 8.90327 8.50336 9.16667 9.1664 9.16667C9.82944 9.16667 10.4653 8.90327 10.9342 8.43443C11.403 7.96559 11.6664 7.32971 11.6664 6.66667C11.6664 6.00363 11.403 5.36774 10.9342 4.8989C10.4653 4.43006 9.82944 4.16667 9.1664 4.16667Z" fill="rgb(85,95,146)" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path d="M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM14.3 14.3C13.91 14.68 13.27 14.68 12.89 14.3L10 11.41L7.11 14.3C6.72 14.68 6.09 14.68 5.7 14.3C5.31 13.91 5.31 13.28 5.7 12.89L8.59 10L5.7 7.11C5.31 6.72 5.31 6.09 5.7 5.7C6.09 5.31 6.72 5.31 7.11 5.7L10 8.59L12.89 5.7C13.28 5.31 13.91 5.31 14.3 5.7C14.68 6.09 14.68 6.72 14.3 7.11L11.41 10L14.3 12.89C14.68 13.27 14.68 13.91 14.3 14.3Z" fill="rgb(107,110,138)" />
    </svg>
  );
}
function WorldcoinBtnIcon() {
  return (
    <svg width="22" height="22" viewBox="-1.0592 -0.6124 25.5305 25.7496">
      <path fillRule="evenodd" fill="rgb(115,223,206)" d="M11.4311 8.79856C11.3607 8.86911 11.2761 8.91144 11.1774 8.92555C11.0646 8.92555 10.9518 8.86911 10.8673 8.78445C9.68307 7.21832 8.82312 0.742126 11.403 0.0789866C14.2365 -0.612372 15.4066 3.40879 15.9705 5.35588C16.0128 5.49698 16.041 5.60985 16.0833 5.72273C14.8145 4.97493 13.3484 4.6222 11.8823 4.70685C11.7131 6.23066 11.6003 7.69804 11.5439 8.55871C11.5298 8.64336 11.4875 8.72802 11.4311 8.79856ZM14.2929 9.4617C14.2506 9.41938 14.2224 9.36294 14.2083 9.3065C14.1943 9.25006 14.1943 9.17952 14.2083 9.12308C14.6595 7.21832 18.7618 2.16717 21.2853 4.07193C23.6536 5.86382 21.2289 9.33472 20.087 10.9855C20.0165 11.0984 19.946 11.1972 19.8755 11.2818C19.6359 9.82855 18.9874 8.47405 18.0288 7.35941C16.9855 8.02255 16.0128 8.68569 15.3079 9.16541C15.1247 9.29239 14.9555 9.40527 14.8004 9.51814L14.7863 9.53225C14.7581 9.54636 14.7441 9.56047 14.7159 9.56047L14.7018 9.56047C14.6454 9.57458 14.589 9.58869 14.5326 9.58869C14.5185 9.58869 14.5044 9.58869 14.4903 9.57458L14.4762 9.57458C14.4057 9.54636 14.3493 9.50403 14.2929 9.4617ZM16.0551 11.9873L15.9 12.1002L15.8155 12.2695C15.8155 12.2836 15.8155 12.2977 15.8155 12.3118L15.8155 12.34C15.8155 12.4106 15.8437 12.4811 15.8718 12.5517C15.9282 12.6363 16.0128 12.6927 16.1115 12.7069L16.5203 12.8338L16.5485 12.8479C17.3803 13.1019 18.5786 13.4688 19.7909 13.892C19.5372 15.3312 18.8746 16.6716 17.8878 17.7439C17.9865 17.7439 18.0992 17.7298 18.212 17.7298C20.1998 17.6169 24.4713 17.377 24.4008 14.4C24.3162 11.7333 17.8032 11.1548 16.0551 11.9873ZM14.8709 15.176C14.8991 15.1901 14.9273 15.1901 14.9414 15.2042C16.7036 16.0508 20.7214 21.243 18.2825 23.2465C15.9846 25.1372 13.151 21.9485 11.8259 20.467C11.7554 20.3823 11.6708 20.2977 11.6003 20.213C13.0524 20.3118 14.5044 20.0014 15.7873 19.31C15.3079 17.8991 14.8004 16.6151 14.4762 15.8109L14.4339 15.698C14.3916 15.6134 14.3916 15.5146 14.4198 15.4158L14.4339 15.4017L14.448 15.3876L14.4621 15.3735C14.5044 15.303 14.5608 15.2606 14.6172 15.2324C14.6736 15.2042 14.73 15.1901 14.7863 15.1901C14.8004 15.1619 14.8286 15.176 14.8709 15.176ZM11.7413 16.3471C11.7272 16.2906 11.699 16.2342 11.6567 16.1919C11.6285 16.1495 11.5721 16.1072 11.5157 16.0931C11.4311 16.0508 11.3325 16.0508 11.2479 16.0931C11.1633 16.1213 11.0787 16.1778 11.0364 16.2624C10.6135 16.9961 9.88043 18.2659 9.06278 19.5781C7.70942 19.0137 6.56753 18.0684 5.74988 16.855L5.70759 17.0666L5.69349 17.1513C5.34105 19.1125 4.59389 23.3594 7.52616 23.9661C10.1342 24.4741 12.136 18.2377 11.7413 16.3471ZM8.95 14.4C8.9359 14.4564 8.90771 14.5128 8.86541 14.5552C7.61074 16.0649 1.49245 18.3647 0.280068 16.0084C-1.05919 13.3277 2.74712 11.2395 4.46701 10.2942C4.5516 10.2518 4.63618 10.1954 4.72076 10.1531C4.29784 11.5499 4.28374 13.0455 4.66437 14.4564C6.201 14.2871 7.63894 14.0614 8.51298 13.9203C8.61166 13.9061 8.69625 13.9344 8.78083 13.9908C8.86541 14.0331 8.9218 14.1178 8.95 14.2024C8.9641 14.273 8.9641 14.3294 8.95 14.4ZM8.45659 11.183C8.51298 11.1972 8.58347 11.183 8.63986 11.1548C8.69625 11.1266 8.73854 11.0702 8.76673 11.0137C8.82312 10.9432 8.85132 10.8444 8.83722 10.7598C8.82312 10.661 8.78083 10.5763 8.71034 10.5058C8.09005 9.94142 7.01865 8.95377 5.94724 7.85324C6.79309 6.65394 7.97728 5.73684 9.34473 5.21479L9.09097 5.11602C7.2724 4.3259 3.25463 2.61867 2.01405 5.35588C0.928551 7.7968 6.51114 11.1548 8.45659 11.183Z" />
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
      <path d="M16.671 15.469l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.513V4.922S15.97 4.687 14.658 4.687c-2.741 0-4.533 1.662-4.533 4.669v2.643H7.078v3.47h3.047v8.385a12.1 12.1 0 003.75 0v-8.385h2.796z" fill="white" />
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const SIGNUPComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

  const router = useRouter();
  const { signUp, isLoaded } = useSignUp();
  const redirectAfter = typeof window !== "undefined" ? `${window.location.origin}/home` : "/home";

  useEffect(() => {
    if (!googleClientId || googleScriptLoaded) return;
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) { setGoogleScriptLoaded(true); initGoogleBtn(); return; }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true; s.defer = true;
    s.onload = () => { setGoogleScriptLoaded(true); initGoogleBtn(); };
    document.body.appendChild(s);
  }, [googleScriptLoaded]);

  const initGoogleBtn = () => {
    if ((window as any).google && googleClientId) {
      (window as any).google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    }
  };

  const handleGoogleClick = () => {
    if ((window as any).google) (window as any).google.accounts.id.prompt();
  };

  const handleGoogleCallback = async (response: any) => {
    setOauthLoading("google"); setError(null);
    try {
      const res = await fetch(`${apiBase}/api/v1/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential, clientId: googleClientId }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new CustomEvent("app-auth-changed", { detail: { token: data.token, user: data.user } }));
        router.push("/home");
      } else { setError(data.message || "Google sign-up failed"); }
    } catch { setError("Failed to connect to server"); }
    finally { setOauthLoading(null); }
  };

  const handleFacebookOAuth = async () => {
    if (!isLoaded || !signUp) { setError("Auth system loading, try again."); return; }
    setOauthLoading("facebook"); setError(null);
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_facebook" as any,
        redirectUrl: redirectAfter,
        redirectUrlComplete: redirectAfter,
      });
    } catch (err: any) {
      setError(err?.message || "Facebook sign-up failed");
    } finally { setOauthLoading(null); }
  };

  const handleSignUp = async () => {
    if (!username || !email || !password) { setError("Please fill in all fields"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true); setError(null);
    try {
      const resp = await fetch(`${apiBase}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, agreedToTerms: true }),
      });
      const data = await resp.json();
      if (!resp.ok) { setError(data?.message || "Registration failed"); return; }
      if (data?.token) {
        localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new CustomEvent("app-auth-changed", { detail: { token: data.token, user: data.user } }));
      }
      router.push("/home");
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0D0F1E]">

      {/* ══════════════════════════════════════════
          LEFT PANEL — Hero Image
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex w-1/2 h-full items-center justify-center bg-[#0D0F1E] shrink-0 overflow-hidden">
        <Image
          src="/assets/signup.jpeg"
          alt="EarnLab"
          width={480}
          height={400}
          className="object-cover object-center"
          style={{ transform: "translateX(-20px)" }}
          priority
        />
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Form
      ══════════════════════════════════════════ */}
      <div className="w-full lg:w-1/2 bg-[#0D0F1E] flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-[580px] mx-auto px-6 py-10 flex flex-col gap-5" style={{ transform: "translateX(-90px)" }}>

          {/* ── Heading row ── */}
          <div className="flex items-center justify-between">
            <h1 className="text-white text-[28px] font-bold tracking-tight">Sign up</h1>
            <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1C2033] hover:bg-[#252840] transition-colors text-[#6B6E8A] hover:text-white">
              <CloseIcon />
            </Link>
          </div>

          {/* ── Social proof banner ── */}
          <div className="flex items-center gap-3 bg-[#151728] border border-[#1C2033] rounded-[6px] px-3 py-2">
            <div className="flex items-center shrink-0">
              <img src="/img22.png" alt="" className="w-8 h-8 rounded-full object-cover border-2 border-[#151728]" />
              <img src="/img23.png" alt="" className="w-8 h-8 rounded-full object-cover border-2 border-[#151728] -ml-2.5" />
              <img src="/img24.png" alt="" className="w-8 h-8 rounded-full object-cover border-2 border-[#151728] -ml-2.5" />
            </div>
            <p className="text-[#8C8FA8] text-[13px] font-medium leading-tight">Thousands just earned — don&apos;t miss your first payout 🚀</p>
          </div>

          {/* ── Username ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-[14px] font-medium">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#151828] border border-[#1C2033] rounded-lg px-4 py-3 text-white text-[14px] placeholder-[#383B52] focus:outline-none focus:border-[#099F86] focus:ring-1 focus:ring-[#099F86]/30 transition-all"
            />
          </div>

          {/* ── Email ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-[14px] font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#151828] border border-[#1C2033] rounded-lg px-4 py-3 text-white text-[14px] placeholder-[#383B52] focus:outline-none focus:border-[#099F86] focus:ring-1 focus:ring-[#099F86]/30 transition-all"
            />
          </div>

          {/* ── Password ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-[14px] font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#151828] border border-[#1C2033] rounded-lg px-4 py-3 text-white text-[14px] placeholder-[#383B52] focus:outline-none focus:border-[#099F86] focus:ring-1 focus:ring-[#099F86]/30 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#383B52] hover:text-[#099F86] transition-colors"
                aria-label="Toggle password visibility"
              >
                <EyeIcon />
              </button>
            </div>
          </div>

          {/* ── Sign up CTA ── */}
          {error && <p className="text-red-400 text-[13px] text-center -mt-2">{error}</p>}
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="w-full h-[50px] rounded-lg font-semibold text-[15px] text-white shadow-[0px_8px_24px_rgba(9,159,134,0.30)] hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #0BBFA0 0%, #079E85 100%)" }}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>

          {/* ── Account link ── */}
          <p className="text-center text-[14px] text-[#6B6E8A]">
            Already have an account yet?{" "}
            <Link href="/signin" className="text-white font-bold hover:text-[#0BBFA0] transition-colors">
              Sign in
            </Link>
          </p>

          {/* ── Social Buttons ── */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="w-full h-[48px] bg-[#151828] border border-[#1C2033] rounded-lg flex items-center justify-center gap-3 hover:border-[#099F86]/40 hover:bg-[#1C2033] transition-all group"
            >
              <span className="flex items-center justify-center w-[20px] h-[20px] shrink-0"><WorldcoinBtnIcon /></span>
              <span className="text-[#9093AC] text-[13px] font-medium group-hover:text-white transition-colors">Sign up via Worldcoin</span>
            </button>

            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={!googleScriptLoaded || !!oauthLoading}
              className="w-full h-[48px] bg-[#151828] border border-[#1C2033] rounded-lg flex items-center justify-center gap-3 hover:border-[#4285F4]/40 hover:bg-[#1C2033] transition-all group disabled:opacity-60"
            >
              <span className="flex items-center justify-center w-[20px] h-[20px] shrink-0"><GoogleIcon /></span>
              <span className="text-[#9093AC] text-[13px] font-medium group-hover:text-white transition-colors">{oauthLoading === "google" ? "Redirecting..." : "Sign up via Google"}</span>
            </button>

            <button
              type="button"
              onClick={handleFacebookOAuth}
              disabled={!isLoaded || !!oauthLoading}
              className="w-full h-[48px] bg-[#151828] border border-[#1C2033] rounded-lg flex items-center justify-center gap-3 hover:border-[#1877F2]/40 hover:bg-[#1C2033] transition-all group disabled:opacity-60"
            >
              <span className="flex items-center justify-center w-[20px] h-[20px] shrink-0"><FacebookIcon /></span>
              <span className="text-[#9093AC] text-[13px] font-medium group-hover:text-white transition-colors">{oauthLoading === "facebook" ? "Redirecting..." : "Sign up via Facebook"}</span>
            </button>
          </div>

          {/* ── TrustScore ── */}
          <div className="flex flex-col items-center gap-1.5 pt-1">
            <div className="flex items-center gap-1">
              {/* 4 full stars */}
              {[0,1,2,3].map((i) => (
                <svg key={i} width="24" height="24" viewBox="0 0 24 24">
                  <rect width="24" height="24" rx="3" fill="#00B67A" />
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="white" />
                </svg>
              ))}
              {/* half star */}
              <svg width="24" height="24" viewBox="0 0 24 24">
                <rect width="24" height="24" rx="3" fill="#303346" />
                <clipPath id="half-clip">
                  <rect x="0" y="0" width="12" height="24" />
                </clipPath>
                <rect width="24" height="24" rx="3" fill="#00B67A" clipPath="url(#half-clip)" />
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="white" />
              </svg>
            </div>
            <p className="text-[#B3B6C7] text-[13px] font-bold">
              TrustScore 4.5&nbsp;&nbsp;|&nbsp;&nbsp;200 reviews
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SIGNUPComponent;
