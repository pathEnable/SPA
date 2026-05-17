"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import DashboardOverview from "./components/DashboardOverview";
import ReservationsPanel from "./components/ReservationsPanel";
import CommentsPanel from "./components/CommentsPanel";

import ServicesManager from "./components/cms/ServicesManager";
import HeroManager from "./components/cms/HeroManager";
import FaqManager from "./components/cms/FaqManager";
import SettingsManager from "./components/cms/SettingsManager";
import MediaLibrary from "./components/cms/MediaLibrary";

export type Reservation = {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
  status: string;
  createdAt: string;
};

export type Comment = {
  id: number;
  name: string;
  rating: number;
  text: string;
  status: string;
  createdAt: string;
};

export type Stats = {
  reservations: { total: number; new: number; confirmed: number };
  comments: { total: number; pending: number; approved: number; rejected: number };
  recentReservations: Reservation[];
  recentComments: Comment[];
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const router = useRouter();

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setDbError(false);

    // Timeout de sécurité : libère le spinner après 8s quoi qu'il arrive
    const safetyTimer = setTimeout(() => setIsLoading(false), 8000);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const [statsRes, resRes, comRes] = await Promise.all([
        fetch("/api/admin/stats", { signal: controller.signal }),
        fetch("/api/admin/reservations", { signal: controller.signal }),
        fetch("/api/admin/comments", { signal: controller.signal }),
      ]);
      clearTimeout(timeoutId);

      if (statsRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!statsRes.ok || !resRes.ok || !comRes.ok) {
        setDbError(true);
        return;
      }

      setStats(await statsRes.json());
      setReservations(await resRes.json());
      setComments(await comRes.json());
    } catch (e) {
      console.error("Fetch error", e);
      setDbError(true);
    } finally {
      clearTimeout(safetyTimer);
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const updateReservation = async (id: number, status: string) => {
    await fetch("/api/admin/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    fetchAll();
  };

  const updateComment = async (id: number, status: string) => {
    await fetch("/api/admin/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    fetchAll();
  };

  const deleteReservation = async (id: number) => {
    if (!confirm("Supprimer cette réservation ?")) return;
    await fetch(`/api/admin/reservations?id=${id}`, { method: "DELETE" });
    setReservations((prev) => prev.filter((r) => r.id !== id));
    fetchAll();
  };

  const deleteComment = async (id: number) => {
    if (!confirm("Supprimer ce commentaire ?")) return;
    await fetch(`/api/admin/comments?id=${id}`, { method: "DELETE" });
    setComments((prev) => prev.filter((c) => c.id !== id));
    fetchAll();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0f13" }}>
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10" style={{ color: "#a87f53" }} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p style={{ color: "#6b6b80" }} className="text-sm">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#0f0f13", color: "#e0e0e8" }}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} stats={stats} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 pt-20 pb-24 md:p-8 max-w-7xl mx-auto">
          {dbError && (
            <div
              className="mb-6 p-4 rounded-xl text-sm flex items-center gap-3"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>Connexion base de données indisponible. Les données ne peuvent pas être chargées.</span>
              <button
                onClick={fetchAll}
                className="ml-auto text-xs px-3 py-1 rounded-lg cursor-pointer"
                style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}
              >
                Réessayer
              </button>
            </div>
          )}
          
          {activeTab === "overview" && <DashboardOverview stats={stats} setActiveTab={setActiveTab} />}
          {activeTab === "services" && <ServicesManager />}
          {activeTab === "hero" && <HeroManager />}
          {activeTab === "media" && <MediaLibrary />}
          {activeTab === "faq" && <FaqManager />}
          {activeTab === "settings" && <SettingsManager />}
          
          {activeTab === "reservations" && (
            <ReservationsPanel
              reservations={reservations}
              onUpdateStatus={updateReservation}
              onDelete={deleteReservation}
            />
          )}
          {activeTab === "comments" && (
            <CommentsPanel
              comments={comments}
              onUpdateStatus={updateComment}
              onDelete={deleteComment}
            />
          )}
        </div>
      </main>
    </div>
  );
}
