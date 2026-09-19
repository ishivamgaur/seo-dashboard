'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { FALLBACK_IMAGES } from '@/lib/site';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@seodashboard.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res && res.success) {
        router.push('/admin');
      } else {
        setError(res?.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eceff3] dark:bg-[#090a0d] text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4 sm:p-6 font-sans antialiased">
      <div className="w-full max-w-3xl rounded-xl bg-[#faf7f2] dark:bg-[#13161c] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden md:block bg-zinc-950">
          <div className="absolute inset-0">
            <Image
              src={FALLBACK_IMAGES.hero}
              alt="Urban Cruise fleet"
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-zinc-950/60" />
          <div className="relative h-full flex flex-col justify-between p-8 min-h-[480px]">
            <Link
              href="/"
              className="text-[15px] font-black font-mono tracking-[0.14em] text-white"
            >
              URBAN <span className="text-teal-400">CRUISE</span>
            </Link>
            <div>
              <span className="inline-block text-xs font-mono text-teal-300 bg-teal-950/60 border border-teal-800/60 px-2.5 py-0.5 rounded font-semibold">
                Admin Console
              </span>
              <p className="mt-3 text-2xl font-bold tracking-tight text-white text-balance leading-snug">
                Manage SEO, fleet and homepage content in one place.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-zinc-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Role-based access · JWT secured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="p-6 sm:p-8">
          <div className="md:hidden mb-6 text-center">
            <Link
              href="/"
              className="text-[15px] font-black font-mono tracking-[0.14em] text-zinc-950 dark:text-white"
            >
              URBAN <span className="text-teal-500 dark:text-teal-400">CRUISE</span>
            </Link>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to access the dashboard.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 px-3.5 py-2.5 rounded-lg text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5"
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
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#f1eee7] dark:bg-[#1a1e27] rounded-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-teal-500 outline-none text-sm border-0"
                  placeholder="admin@seodashboard.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block uppercase font-mono text-[11px] tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5"
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
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 bg-[#f1eee7] dark:bg-[#1a1e27] rounded-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-teal-500 outline-none text-sm border-0"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                className="w-full inline-flex items-center justify-center gap-2 h-10 px-5 bg-teal-600 hover:bg-teal-500 disabled:opacity-70 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
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

          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
              Demo: admin@seodashboard.com / admin123
            </span>
            <Link
              href="/"
              className="text-[11px] font-mono text-teal-600 dark:text-teal-400 hover:underline shrink-0"
            >
              View site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
