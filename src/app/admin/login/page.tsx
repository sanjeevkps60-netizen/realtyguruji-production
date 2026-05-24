"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AdminLogin() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await createClient().auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="font-display text-2xl font-bold">
            Realty <span className="text-gradient-gold">Guruji</span>
          </Link>
          <p className="mt-1 text-sm text-muted">Admin Panel</p>
        </div>

        {!configured ? (
          <div className="card-rg p-8">
            <h1 className="font-display text-xl font-bold text-cream">Supabase not connected yet</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Add <code className="text-gold-bright">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="text-gold-bright">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your Vercel
              project (and <code className="text-gold-bright">.env.local</code> for local dev), run{" "}
              <code className="text-gold-bright">supabase/schema.sql</code>, then create your admin
              user in Supabase → Authentication. See <code className="text-gold-bright">DEPLOY.md</code>.
            </p>
            <Link href="/" className="btn-ghost mt-6 w-full">Back to site</Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="card-rg p-8">
            <h1 className="font-display text-xl font-bold text-cream">Sign in</h1>
            <p className="mt-1 text-sm text-muted">Manage your Realty Guruji listings & leads.</p>

            {error && <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">{error}</div>}

            <label className="mt-5 block text-sm text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="mt-1.5 w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
            />
            <label className="mt-4 block text-sm text-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="mt-1.5 w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
            />
            <button type="submit" disabled={loading} className="btn-gold mt-6 w-full disabled:opacity-60">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
