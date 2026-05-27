"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogoMark } from "@/components/member/LogoMark";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signIn(email, password);
    if (error) {
      setError("Invalid email or password. Try member@test.com / password");
      setLoading(false);
      return;
    }

    const staffEmails = ["staff@test.com", "owner@test.com"];
    if (staffEmails.includes(email)) {
      router.push("/staff/dashboard");
    } else {
      router.push("/member/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-onyx flex flex-col items-center justify-center px-6">
      <motion.div
        className="w-full max-w-sm flex flex-col items-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6"
        >
          <LogoMark color="#E6E7D7" size={72} />
        </motion.div>

        <h1 className="font-heading font-bold text-cream text-3xl tracking-tight mb-2 text-center">
          Embers + Ice
        </h1>

        <p className="font-accent italic text-slate text-lg mb-10 text-center">
          Relax. Recover. Reconnect.
        </p>

        <form onSubmit={handleSignIn} className="w-full flex flex-col gap-4">
          {error && (
            <div className="bg-ember/15 border border-ember/30 rounded-xl px-4 py-3 text-ember text-sm font-body">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-slate text-xs font-body uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-onyx border border-slate/30 rounded-xl px-4 py-3.5 text-cream font-body text-base placeholder:text-slate/50 focus:outline-none focus:border-ember/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate text-xs font-body uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-onyx border border-slate/30 rounded-xl px-4 py-3.5 text-cream font-body text-base placeholder:text-slate/50 focus:outline-none focus:border-ember/60 transition-colors"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
            className="mt-2"
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <div className="w-full mt-4">
          <Button variant="ghost" size="lg" fullWidth>
            Create Account
          </Button>
        </div>

        <button className="mt-6 text-slate text-sm font-body hover:text-cream transition-colors">
          Forgot password?
        </button>
      </motion.div>
    </div>
  );
}
