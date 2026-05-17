"use client";

import { useState } from "react";
import type { Reservation } from "../page";

type Props = {
  reservations: Reservation[];
  onUpdateStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "Nouveau", color: "#60a5fa", bg: "rgba(59,130,246,0.12)" },
  confirmed: { label: "Confirmé", color: "#4ade80", bg: "rgba(34,197,94,0.12)" },
  completed: { label: "Terminé", color: "#a87f53", bg: "rgba(168,127,83,0.12)" },
  cancelled: { label: "Annulé", color: "#f87171", bg: "rgba(239,68,68,0.12)" },
};

export default function ReservationsPanel({ reservations, onUpdateStatus, onDelete }: Props) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = reservations.filter((r) => {
    const matchFilter = filter === "all" || r.status === filter;
    const receiptId = `ME-REV-${String(r.id).padStart(4, "0")}`.toLowerCase();
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search) || r.service.toLowerCase().includes(search.toLowerCase()) ||
      receiptId.includes(search.toLowerCase()) || String(r.id).includes(search);
    return matchFilter && matchSearch;
  });

  const selected = reservations.find((r) => r.id === selectedId) || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "#f0e6d8" }}>Réservations</h1>
          <p className="text-sm mt-0.5" style={{ color: "#6b6b80" }}>{reservations.length} réservation(s) au total</p>
        </div>
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#4a4a5a" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl text-sm outline-none w-64"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e0e0e8" }}
          />
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "new", "confirmed", "completed", "cancelled"].map((s) => (
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
            {s === "all" ? "Tous" : statusConfig[s]?.label}
            {s !== "all" && (
              <span className="ml-1.5">({reservations.filter(r => r.status === s).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-sm italic" style={{ color: "#4a4a5a" }}>Aucune réservation trouvée</p>
            </div>
          ) : filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedId(selectedId === r.id ? null : r.id)}
              className="w-full text-left rounded-2xl p-5 transition-all duration-200 cursor-pointer"
              style={{
                background: selectedId === r.id ? "rgba(168,127,83,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${selectedId === r.id ? "rgba(168,127,83,0.3)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: statusConfig[r.status]?.color || "#6b6b80" }} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm truncate" style={{ color: "#f0e6d8" }}>{r.name}</p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider shrink-0" style={{ background: "rgba(168,127,83,0.12)", color: "#d4a574" }}>
                        #ME-REV-{String(r.id).padStart(4, "0")}
                      </span>
                    </div>
                    <p className="text-xs truncate" style={{ color: "#6b6b80" }}>{r.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs" style={{ color: "#4a4a5a" }}>{r.date}</span>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase"
                    style={{ background: statusConfig[r.status]?.bg, color: statusConfig[r.status]?.color }}>
                    {statusConfig[r.status]?.label}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="rounded-2xl p-6 sticky top-8" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg" style={{ color: "#f0e6d8" }}>{selected.name}</h3>
                  <p className="text-sm" style={{ color: "#a87f53" }}>{selected.phone}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase"
                  style={{ background: statusConfig[selected.status]?.bg, color: statusConfig[selected.status]?.color }}>
                  {statusConfig[selected.status]?.label}
                </span>
              </div>

              <div className="space-y-4 text-sm">
                {[
                  { label: "Numéro de reçu", value: `#ME-REV-${String(selected.id).padStart(4, "0")}` },
                  { label: "Soin demandé", value: selected.service },
                  { label: "Date souhaitée", value: selected.date },
                  { label: "Heure", value: selected.time },
                  { label: "Message", value: selected.message || "—" },
                  { label: "Reçu le", value: new Date(selected.createdAt).toLocaleString("fr-FR") },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#4a4a5a" }}>{label}</p>
                    <p style={{ color: "#c0c0cc" }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-2">
                <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "#4a4a5a" }}>Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  {selected.status === "new" && (
                    <button onClick={() => onUpdateStatus(selected.id, "confirmed")} className="py-2 rounded-xl text-xs font-bold uppercase cursor-pointer transition-all"
                      style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
                      ✓ Confirmer
                    </button>
                  )}
                  {selected.status === "confirmed" && (
                    <button onClick={() => onUpdateStatus(selected.id, "completed")} className="py-2 rounded-xl text-xs font-bold uppercase cursor-pointer"
                      style={{ background: "rgba(168,127,83,0.12)", color: "#d4a574", border: "1px solid rgba(168,127,83,0.2)" }}>
                      ✓ Terminé
                    </button>
                  )}
                  {selected.status !== "cancelled" && (
                    <button onClick={() => onUpdateStatus(selected.id, "cancelled")} className="py-2 rounded-xl text-xs font-bold uppercase cursor-pointer"
                      style={{ background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.15)" }}>
                      Annuler
                    </button>
                  )}
                </div>
                <a href={`https://wa.me/${selected.phone.replace(/\s+/g, "")}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-bold uppercase"
                  style={{ background: "rgba(37,211,102,0.1)", color: "#25d366", border: "1px solid rgba(37,211,102,0.2)" }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contacter via WhatsApp
                </a>
                <button onClick={() => { onDelete(selected.id); setSelectedId(null); }}
                  className="w-full py-2 rounded-xl text-xs font-bold uppercase cursor-pointer"
                  style={{ background: "rgba(239,68,68,0.06)", color: "#f87171", border: "1px solid rgba(239,68,68,0.1)" }}>
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-12 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.06)" }}>
              <p className="text-sm" style={{ color: "#4a4a5a" }}>Cliquez sur une réservation pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
