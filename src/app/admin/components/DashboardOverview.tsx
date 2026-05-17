"use client";

import type { Stats } from "../page";

type Props = {
  stats: Stats | null;
  setActiveTab: (tab: string) => void;
};

const gold = "#a87f53";

export default function DashboardOverview({ stats, setActiveTab }: Props) {
  if (!stats) return null;

  const statCards = [
    { label: "Nouvelles Réservations", value: stats.reservations.new, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", tab: "reservations" },
    { label: "Confirmées", value: stats.reservations.confirmed, color: "#22c55e", bg: "rgba(34,197,94,0.1)", tab: "reservations" },
    { label: "Total Réservations", value: stats.reservations.total, color: gold, bg: "rgba(168,127,83,0.1)", tab: "reservations" },
    { label: "Avis en Attente", value: stats.comments.pending, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", tab: "comments" },
    { label: "Avis Approuvés", value: stats.comments.approved, color: "#22c55e", bg: "rgba(34,197,94,0.1)", tab: "comments" },
    { label: "Total Avis", value: stats.comments.total, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", tab: "comments" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "#f0e6d8" }}>
          Tableau de bord
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6b6b80" }}>
          Vue d&apos;ensemble de votre activité
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <button
            key={card.label}
            onClick={() => setActiveTab(card.tab)}
            className="text-left rounded-2xl p-5 transition-all duration-200 cursor-pointer group"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${card.color}33`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: card.bg }}>
              <span className="text-lg font-bold" style={{ color: card.color }}>{card.value}</span>
            </div>
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#6b6b80" }}>{card.label}</p>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: "#f0e6d8" }}>Dernières Réservations</h2>
            <button onClick={() => setActiveTab("reservations")} className="text-xs cursor-pointer" style={{ color: gold }}>Tout voir →</button>
          </div>
          <div className="space-y-3">
            {stats.recentReservations.length === 0 ? (
              <p className="text-sm italic py-6 text-center" style={{ color: "#4a4a5a" }}>Aucune réservation</p>
            ) : (
              stats.recentReservations.map((r) => (
                <div key={r.id} className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: r.status === "new" ? "#3b82f6" : "#22c55e" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#e0e0e8" }}>{r.name}</p>
                    <p className="text-xs" style={{ color: "#6b6b80" }}>{r.service} — {r.date}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full shrink-0" style={{
                    background: r.status === "new" ? "rgba(59,130,246,0.12)" : "rgba(34,197,94,0.12)",
                    color: r.status === "new" ? "#60a5fa" : "#4ade80",
                  }}>
                    {r.status === "new" ? "Nouveau" : "Confirmé"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: "#f0e6d8" }}>Derniers Avis</h2>
            <button onClick={() => setActiveTab("comments")} className="text-xs cursor-pointer" style={{ color: gold }}>Tout voir →</button>
          </div>
          <div className="space-y-3">
            {stats.recentComments.length === 0 ? (
              <p className="text-sm italic py-6 text-center" style={{ color: "#4a4a5a" }}>Aucun avis</p>
            ) : (
              stats.recentComments.map((c) => (
                <div key={c.id} className="flex items-start gap-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: "rgba(168,127,83,0.12)", color: gold }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium" style={{ color: "#e0e0e8" }}>{c.name}</p>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <svg key={s} className="w-3 h-3" fill={s <= c.rating ? "#f59e0b" : "#2a2a35"} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: "#6b6b80" }}>"{c.text}"</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full shrink-0" style={{
                    background: c.status === "pending" ? "rgba(245,158,11,0.12)" : c.status === "approved" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                    color: c.status === "pending" ? "#fbbf24" : c.status === "approved" ? "#4ade80" : "#f87171",
                  }}>
                    {c.status === "pending" ? "Attente" : c.status === "approved" ? "OK" : "Rejeté"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
