"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Mot de passe incorrect");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0f0f13 0%, #1a1a2e 50%, #0f0f13 100%)" }}
    >
      {/* Subtle background glow */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,127,83,0.08) 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div
            className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: "linear-gradient(135deg, #a87f53 0%, #d4a574 100%)",
              boxShadow: "0 8px 32px rgba(168,127,83,0.3)",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1
            className="text-3xl font-bold tracking-tight mb-2"
            style={{ fontFamily: "var(--font-heading)", color: "#f0e6d8" }}
          >
            Administration
          </h1>
          <p className="text-sm" style={{ color: "#6b6b80" }}>
            Panneau de gestion Méli Empire
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
          }}
        >
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: "#8a8a9a" }}
              >
                Mot de passe
              </label>
              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-13 px-4 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#f0e6d8",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(168,127,83,0.5)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(168,127,83,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.08)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {error && (
              <div
                className="text-center text-sm py-2 px-4 rounded-lg"
                style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 rounded-xl font-bold uppercase tracking-[0.15em] text-sm transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #a87f53 0%, #c49a6c 100%)",
                color: "#0f0f13",
                boxShadow: "0 4px 20px rgba(168,127,83,0.25)",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) (e.target as HTMLButtonElement).style.boxShadow = "0 6px 30px rgba(168,127,83,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(168,127,83,0.25)";
              }}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#4a4a5a" }}>
          © {new Date().getFullYear()} Méli Empire — Accès réservé
        </p>
      </div>
    </div>
  );
}
