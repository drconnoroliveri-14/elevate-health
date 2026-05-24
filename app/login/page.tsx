"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import Image from "next/image";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white inline-block"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const linkExpired = searchParams.get("error") === "link_expired";

  const [mode, setMode] = useState<"login" | "forgot">("login");

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const { error: authError } = await getSupabase().auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.push("/dashboard");
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      const { error } = await getSupabase().auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: "https://www.elevatehealthtampa.com/auth/callback",
      });
      if (error) throw error;
      setForgotSent(true);
    } catch (err: unknown) {
      setForgotError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  }

  function switchToForgot() {
    // Pre-fill the forgot email with whatever is in the login email field
    setForgotEmail(email);
    setForgotError("");
    setForgotSent(false);
    setMode("forgot");
  }

  function switchToLogin() {
    setLoginError("");
    setMode("login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo.PNG" alt="Elevate Health" width={140} height={70} unoptimized className="mx-auto block" style={{ height: "70px", width: "auto" }} />
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            {mode === "login" ? "Sign in to your student portal" : "Reset your password"}
          </p>
        </div>

        {/* ── Login mode ── */}
        {mode === "login" && (
          <>
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5">
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}

            {linkExpired && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-5">
                <p className="text-yellow-700 text-sm">
                  That reset link has expired. Use &ldquo;Forgot password?&rdquo; below to get a new one.
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={switchToForgot}
                    className="text-xs text-teal-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-red-700 text-sm">{loginError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-teal-500 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loginLoading ? <><Spinner /> Signing in…</> : "Log In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-6">
              Having trouble?{" "}
              <a href="mailto:droliveri@elevatehealthtampa.com" className="text-teal-600 hover:underline">
                Contact support
              </a>
            </p>
          </>
        )}

        {/* ── Forgot password mode ── */}
        {mode === "forgot" && (
          <>
            {forgotSent ? (
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-5 text-center">
                <svg className="w-8 h-8 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <p className="text-green-700 font-semibold mb-1">Check your email</p>
                <p className="text-green-600 text-sm">
                  We sent a password reset link to <strong>{forgotEmail}</strong>
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="flex flex-col gap-5">
                <p className="text-sm text-gray-500 -mt-2">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    autoFocus
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {forgotError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <p className="text-red-700 text-sm">{forgotError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-teal-500 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {forgotLoading ? <><Spinner /> Sending…</> : "Send Reset Link"}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={switchToLogin}
              className="block w-full text-center text-sm text-teal-600 hover:underline mt-6"
            >
              ← Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
