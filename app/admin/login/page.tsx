"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email atau password salah.");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-5">
      <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-[0_6px_24px_-8px_rgba(60,30,10,0.15)] p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Logo size={56} />
          <h1 className="font-display text-xl font-semibold mt-3">Admin Dapur Embun</h1>
          <p className="text-xs text-ink/50 mt-1">Masuk untuk mengelola konten website</p>
        </div>
        <label className="block mb-4">
          <span className="text-xs font-medium text-ink/60">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon/30"
          />
        </label>
        <label className="block mb-6">
          <span className="text-xs font-medium text-ink/60">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-gold/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-maroon/30"
          />
        </label>
        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-maroon hover:bg-maroonDark text-white rounded-lg py-2.5 text-sm font-medium transition disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}
