"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@seodashboard.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res && res.success) {
        router.push("/admin");
      } else {
        setError(res?.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 font-sans antialiased">
      <div className="relative bg-zinc-950 overflow-hidden min-h-[320px] md:min-h-screen">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-teal-500/20 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-emerald-400/10 blur-[100px]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #5eead4 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div aria-hidden="true" className="absolute inset-x-0 top-[26%] hidden px-10 md:block">
          <svg viewBox="0 0 640 220" className="mx-auto w-full">
            <defs>
              <linearGradient id="uc-glass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fcd34d" stopOpacity="0.55" />
                <stop offset="0.45" stopColor="#5eead4" stopOpacity="0.35" />
                <stop offset="1" stopColor="#134e4a" />
              </linearGradient>
              <linearGradient id="uc-beam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fbbf24" stopOpacity="0.4" />
                <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
              </linearGradient>
              <g id="uc-bus">
                <g transform="translate(-170,-112)">
                  <ellipse cx="170" cy="128" rx="150" ry="8" fill="#2dd4bf" opacity="0.12" />
                  <polygon points="332,86 372,66 372,112" fill="url(#uc-beam)" />
                  <rect
                    x="8"
                    y="20"
                    width="324"
                    height="82"
                    rx="12"
                    fill="#101415"
                    stroke="#2dd4bf"
                    strokeWidth="2"
                  />
                  <circle cx="60" cy="24" r="1.5" fill="#fbbf24" />
                  <circle cx="170" cy="24" r="1.5" fill="#fbbf24" />
                  <circle cx="280" cy="24" r="1.5" fill="#fbbf24" />
                  <rect
                    x="24"
                    y="32"
                    width="52"
                    height="30"
                    rx="4"
                    fill="url(#uc-glass)"
                    stroke="#2dd4bf"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="82"
                    y="32"
                    width="52"
                    height="30"
                    rx="4"
                    fill="url(#uc-glass)"
                    stroke="#2dd4bf"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="140"
                    y="32"
                    width="52"
                    height="30"
                    rx="4"
                    fill="url(#uc-glass)"
                    stroke="#2dd4bf"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="198"
                    y="32"
                    width="40"
                    height="30"
                    rx="4"
                    fill="url(#uc-glass)"
                    stroke="#2dd4bf"
                    strokeWidth="1.5"
                  />
                  <circle cx="40" cy="38" r="1.5" fill="#fde68a" />
                  <circle cx="98" cy="38" r="1.5" fill="#fde68a" />
                  <circle cx="156" cy="38" r="1.5" fill="#fde68a" />
                  <circle cx="212" cy="38" r="1.5" fill="#fde68a" />
                  <rect
                    x="246"
                    y="28"
                    width="32"
                    height="74"
                    rx="4"
                    fill="none"
                    stroke="#2dd4bf"
                    strokeWidth="1.5"
                    opacity="0.7"
                  />
                  <rect x="249" y="32" width="26" height="30" rx="3" fill="url(#uc-glass)" />
                  <rect
                    x="250"
                    y="103"
                    width="24"
                    height="3"
                    rx="1.5"
                    fill="#fbbf24"
                    opacity="0.6"
                  />
                  <rect x="318" y="98" width="9" height="5" rx="1" fill="#e7e5e4" opacity="0.9" />
                  <polygon
                    points="288,32 318,32 328,70 288,70"
                    fill="#0f766e"
                    stroke="#5eead4"
                    strokeWidth="1.5"
                  />
                  <rect x="290" y="18" width="30" height="9" rx="2" fill="#fbbf24" opacity="0.9" />
                  <line
                    x1="8"
                    y1="88"
                    x2="332"
                    y2="88"
                    stroke="#2dd4bf"
                    strokeWidth="1.5"
                    opacity="0.35"
                  />
                  <line x1="330" y1="44" x2="340" y2="36" stroke="#2dd4bf" strokeWidth="2" />
                  <rect
                    x="336"
                    y="30"
                    width="8"
                    height="12"
                    rx="2"
                    fill="#101415"
                    stroke="#2dd4bf"
                    strokeWidth="1.5"
                  />
                  <ellipse cx="329" cy="92" rx="4" ry="6" fill="#fbbf24" />
                  <circle cx="329" cy="92" r="9" fill="#fbbf24" opacity="0.2" />
                  <rect x="8" y="84" width="4" height="10" fill="#f87171" />
                  <path
                    d="M56,104 A24,24 0 0 1 104,104"
                    fill="none"
                    stroke="#2dd4bf"
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                  <path
                    d="M236,104 A24,24 0 0 1 284,104"
                    fill="none"
                    stroke="#2dd4bf"
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                  <g className="animate-wheel">
                    <circle
                      cx="80"
                      cy="106"
                      r="20"
                      fill="#0c0d10"
                      stroke="#5eead4"
                      strokeWidth="2.5"
                    />
                    <circle cx="80" cy="106" r="9" fill="none" stroke="#5eead4" strokeWidth="2" />
                    <line x1="80" y1="97" x2="80" y2="115" stroke="#5eead4" strokeWidth="2" />
                    <line x1="72" y1="101" x2="88" y2="111" stroke="#5eead4" strokeWidth="2" />
                    <line x1="72" y1="111" x2="88" y2="101" stroke="#5eead4" strokeWidth="2" />
                  </g>
                  <g className="animate-wheel">
                    <circle
                      cx="260"
                      cy="106"
                      r="20"
                      fill="#0c0d10"
                      stroke="#5eead4"
                      strokeWidth="2.5"
                    />
                    <circle cx="260" cy="106" r="9" fill="none" stroke="#5eead4" strokeWidth="2" />
                    <line x1="260" y1="97" x2="260" y2="115" stroke="#5eead4" strokeWidth="2" />
                    <line x1="252" y1="101" x2="268" y2="111" stroke="#5eead4" strokeWidth="2" />
                    <line x1="252" y1="111" x2="268" y2="101" stroke="#5eead4" strokeWidth="2" />
                  </g>
                </g>
              </g>
            </defs>
            <path
              d="M-20,158 Q320,112 660,158"
              fill="none"
              stroke="#0f1a18"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M-20,158 Q320,112 660,158"
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="2"
              strokeDasharray="10 12"
              strokeLinecap="round"
              className="animate-road-stream"
              opacity="0.8"
            />
            <use href="#uc-bus">
              <animateMotion
                dur="12s"
                repeatCount="indefinite"
                rotate="auto"
                path="M-380,158 Q320,112 1020,158"
              />
            </use>
            <use href="#uc-bus" opacity="0.45">
              <animateMotion
                dur="12s"
                begin="-6s"
                repeatCount="indefinite"
                rotate="auto"
                path="M-380,158 Q320,112 1020,158"
              />
            </use>
          </svg>
        </div>

        <div className="relative h-full flex flex-col justify-between p-8 sm:p-12 min-h-[320px] md:min-h-screen">
          <Link href="/" className="text-[15px] font-black font-mono tracking-[0.14em] text-white">
            URBAN <span className="text-teal-400">CRUISE</span>
          </Link>
          <div className="mt-16 md:mt-0">
            <span className="inline-block text-xs font-mono text-teal-300 bg-teal-950/60 border border-teal-800/60 px-2.5 py-0.5 rounded font-semibold">
              Admin Console
            </span>
            <p className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance leading-tight max-w-md">
              Manage SEO, fleet and homepage content in one place.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-zinc-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Role-based access · JWT secured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#eceff3] dark:bg-[#090a0d] flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to access the dashboard.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 px-3.5 py-2.5 rounded-lg text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white dark:bg-[#1a1e27] rounded-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-teal-500 outline-none text-sm border-0"
                  placeholder="admin@seodashboard.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 bg-white dark:bg-[#1a1e27] rounded-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-teal-500 outline-none text-sm border-0"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 h-8 px-4 bg-teal-600 hover:bg-teal-500 disabled:opacity-70 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-4 border-t border-zinc-200/70 dark:border-zinc-800/60 space-y-1.5">
            <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              Demo admin: admin@seodashboard.com / admin123
            </p>
            <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              Demo editor: editor@seodashboard.com / editor123
            </p>
            <Link
              href="/"
              className="inline-block mt-1 text-[11px] font-mono text-teal-600 dark:text-teal-400 hover:underline"
            >
              View site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
