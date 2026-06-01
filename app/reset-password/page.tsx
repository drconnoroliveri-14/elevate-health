"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import Image from "next/image";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    // Parse the URL hash for legacy implicit-flow tokens
    // e.g. #access_token=xxx&refresh_token=yyy&type=recovery
    const hash = window.location.hash.slice(1); // strip leading #
    if (!hash) {
      // PKCE flow: session was already set server-side via exchangeCodeForSession;
      // just verify we have an active session.
      getSupabase()
        .auth.getSession()
        .then(({ data }) => {
          if (data.session) {
            setSessionReady(true);
          } else {
            setSessionError("This reset link has expired. Please request a new one.");
          }
        });
      return;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setSessionError("This reset link has expired. Please request a new one.");
      return;
    }

    // Establish a client-side session from the implicit-flow tokens
    getSupabase()
      .auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error: sessionErr }) => {
        if (sessionErr) {
          console.error("[reset-password] setSession error:", sessionErr.message);
          setSessionError("This reset link has expired. Please request a new one.");
        } else {
          // Clear the hash so tokens are not visible in the address bar
          history.replaceState(null, "", window.location.pathname);
          setSessionReady(true);
        }
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await getSupabase().auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => router.push("/login?message=Password+updated!+Please+log+in."), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo.PNG" alt="Elevate Health" width={140} height={70} unoptimized style={{ height: "70px", width: "auto" }} />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Set a new password</h1>
          <p className="text-gray-500 text-sm mt-1">Choose something you&apos;ll remember.</p>
        </div>

        {sessionError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-4 text-center">
            <p className="text-red-700 text-sm mb-3">{sessionError}</p>
            <Link href="/login" className="text-teal-600 hover:underline text-sm font-medium">
              Back to login →
            </Link>
          </div>
        ) : !sessionReady ? (
          <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
            <div className="animate-spin h-5 w-5 border-2 border-teal-500 border-t-transparent rounded-full mr-2" />
            Verifying your link…
          </div>
        ) : success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-4 text-center">
            <p className="text-green-700 font-medium">Password updated!</p>
            <p className="text-green-600 text-sm mt-1">Redirecting you to login…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm New Password
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat your new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? "Updating…" : "Set New Password"}
            </button>
          </form>
        )}

        {!sessionError && (
          <p className="text-center text-sm text-gray-400 mt-6">
            <Link href="/login" className="text-teal-600 hover:underline">
              Back to login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
