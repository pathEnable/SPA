"use client";

import { useState } from "react";
import type { Comment } from "../page";

type Props = {
  comments: Comment[];
  onUpdateStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "En attente", color: "#fbbf24", bg: "rgba(245,158,11,0.12)" },
  approved: { label: "Approuvé", color: "#4ade80", bg: "rgba(34,197,94,0.12)" },
  rejected: { label: "Rejeté", color: "#f87171", bg: "rgba(239,68,68,0.12)" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-3.5 h-3.5" fill={s <= rating ? "#f59e0b" : "#2a2a35"} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function CommentsPanel({ comments, onUpdateStatus, onDelete }: Props) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = comments.filter((c) => {
    const matchFilter = filter === "all" || c.status === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.text.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const avgRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "#f0e6d8" }}>Livre d&apos;Or</h1>
          <p className="text-sm mt-0.5" style={{ color: "#6b6b80" }}>
            {comments.length} avis — Note moyenne : <span style={{ color: "#f59e0b" }}>★ {avgRating}</span>
          </p>
        </div>
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#4a4a5a" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un avis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl text-sm outline-none w-64"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e0e0e8" }}
          />
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
            style={{
              background: filter === s ? "rgba(168,127,83,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${filter === s ? "rgba(168,127,83,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: filter === s ? "#d4a574" : "#6b6b80",
            }}
          >
            {s === "all" ? `Tous (${comments.length})` : `${statusConfig[s].label} (${comments.filter(c => c.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Comments Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-sm italic" style={{ color: "#4a4a5a" }}>Aucun avis trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${
                  c.status === "pending" ? "rgba(245,158,11,0.2)" :
                  c.status === "approved" ? "rgba(34,197,94,0.15)" :
                  "rgba(239,68,68,0.12)"
                }`,
              }}
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: "rgba(168,127,83,0.12)", color: "#a87f53" }}
                  >
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "#f0e6d8" }}>{c.name}</p>
                    <StarRating rating={c.rating} />
                  </div>
                </div>
                <span
                  className="text-[9px] font-bold uppercase px-2 py-1 rounded-full shrink-0"
                  style={{ background: statusConfig[c.status]?.bg, color: statusConfig[c.status]?.color }}
                >
                  {statusConfig[c.status]?.label}
                </span>
              </div>

              {/* Text */}
              <p className="text-sm italic leading-relaxed flex-1" style={{ color: "#8a8a9a" }}>
                &ldquo;{c.text}&rdquo;
              </p>

              {/* Date */}
              <p className="text-[10px]" style={{ color: "#4a4a5a" }}>
                {new Date(c.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                {c.status !== "approved" && (
                  <button
                    onClick={() => onUpdateStatus(c.id, "approved")}
                    className="flex-1 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer transition-all"
                    style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}
                  >
                    ✓ Approuver
                  </button>
                )}
                {c.status !== "rejected" && (
                  <button
                    onClick={() => onUpdateStatus(c.id, "rejected")}
                    className="flex-1 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer transition-all"
                    style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)" }}
                  >
                    ✕ Rejeter
                  </button>
                )}
                {c.status === "approved" && (
                  <button
                    onClick={() => onUpdateStatus(c.id, "pending")}
                    className="flex-1 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer transition-all"
                    style={{ background: "rgba(245,158,11,0.08)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.15)" }}
                  >
                    ↩ Mettre en attente
                  </button>
                )}
                <button
                  onClick={() => onDelete(c.id)}
                  className="w-9 flex items-center justify-center rounded-xl cursor-pointer transition-all"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#4a4a5a" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#4a4a5a"; }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
