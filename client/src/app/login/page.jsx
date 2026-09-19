'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@seodashboard.com');
  const [password, setPassword] = useState('admin123');
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
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d10] text-zinc-900 dark:text-zinc-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-4">
          <span className="text-xl font-extrabold tracking-wider font-mono text-zinc-950 dark:text-white">
            URBAN <span className="text-teal-500 dark:text-teal-400">CRUISE</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Admin Authentication
        </h1>
        <p className="mt-1 text-xs text-zinc-500 font-mono">
          Sign in to access SEO configurations and fleet management.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#121418] py-8 px-6 sm:px-8 shadow-sm rounded-2xl border border-zinc-200/90 dark:border-zinc-800">
          <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-3.5 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block uppercase font-mono font-semibold text-zinc-500 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="h-4 w-4 stroke-[1.75]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none text-xs font-mono"
                  placeholder="admin@seodashboard.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block uppercase font-mono font-semibold text-zinc-500 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="h-4 w-4 stroke-[1.75]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none text-xs font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-[background-color,transform] duration-150 ease-out active:scale-[0.98] shadow-xs cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <span className="text-[11px] font-mono text-zinc-500">
              Default Admin: admin@seodashboard.com / admin123
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-mono transition-colors"
          >
            Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
