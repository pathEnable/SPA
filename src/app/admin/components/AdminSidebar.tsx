"use client";

import { useState } from "react";
import type { Stats } from "../page";

const gold = "#a87f53";
const goldLight = "#d4a574";

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  stats: Stats | null;
};

const navItems = [
  { id: "overview", label: "Tableau de bord", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { id: "reservations", label: "Réservations", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "comments", label: "Livre d'Or", icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" },
  { id: "services", label: "Soins & Services", icon: "M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" },
  { id: "hero", label: "Slider Accueil", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "media", label: "Médiathèque", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "faq", label: "Questions FAQ", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "settings", label: "Paramètres Site", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

export default function AdminSidebar({ activeTab, setActiveTab, onLogout, stats }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0 sticky top-0 h-screen"
        style={{ background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Brand */}
        <div className="p-6 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#0f0f13" }}
          >
            ME
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#f0e6d8", fontFamily: "var(--font-heading)" }}>Méli Empire</p>
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "#6b6b80" }}>Administration</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: activeTab === item.id ? "rgba(168,127,83,0.12)" : "transparent",
                color: activeTab === item.id ? goldLight : "#8a8a9a",
                borderLeft: activeTab === item.id ? `3px solid ${gold}` : "3px solid transparent",
              }}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
              {item.id === "reservations" && stats && stats.reservations.new > 0 && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>
                  {stats.reservations.new}
                </span>
              )}
              {item.id === "comments" && stats && stats.comments.pending > 0 && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24" }}>
                  {stats.comments.pending}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <a
            href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors duration-200"
            style={{ color: "#6b6b80" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#a0a0b0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b80")}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Voir le site
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors duration-200 cursor-pointer"
            style={{ color: "#6b6b80" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b80")}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-center px-4 h-16"
        style={{ background: "rgba(15,15,19,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ background: `linear-gradient(135deg, ${gold}, ${goldLight})`, color: "#0f0f13" }}>ME</div>
          <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#f0e6d8" }}>Admin</span>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 flex items-center justify-around px-2"
        style={{ background: "rgba(15,15,19,0.98)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Dashboard */}
        <button
          onClick={() => { setActiveTab("overview"); setIsMobileMenuOpen(false); }}
          className="flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer transition-colors"
          style={{ color: activeTab === "overview" && !isMobileMenuOpen ? goldLight : "#6b6b80" }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={activeTab === "overview" && !isMobileMenuOpen ? 2 : 1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={navItems[0].icon} />
          </svg>
          <span className="text-[10px] font-medium">Accueil</span>
        </button>

        {/* Reservations */}
        <button
          onClick={() => { setActiveTab("reservations"); setIsMobileMenuOpen(false); }}
          className="flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer transition-colors relative"
          style={{ color: activeTab === "reservations" && !isMobileMenuOpen ? goldLight : "#6b6b80" }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={activeTab === "reservations" && !isMobileMenuOpen ? 2 : 1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={navItems[1].icon} />
          </svg>
          <span className="text-[10px] font-medium">Résas</span>
          {stats && stats.reservations.new > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full" style={{ background: "#3b82f6" }}></span>
          )}
        </button>

        {/* Comments */}
        <button
          onClick={() => { setActiveTab("comments"); setIsMobileMenuOpen(false); }}
          className="flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer transition-colors relative"
          style={{ color: activeTab === "comments" && !isMobileMenuOpen ? goldLight : "#6b6b80" }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={activeTab === "comments" && !isMobileMenuOpen ? 2 : 1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={navItems[2].icon} />
          </svg>
          <span className="text-[10px] font-medium">Avis</span>
          {stats && stats.comments.pending > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full" style={{ background: "#fbbf24" }}></span>
          )}
        </button>

        {/* More Menu */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex flex-col items-center justify-center w-16 h-full gap-1 cursor-pointer transition-colors"
          style={{ color: isMobileMenuOpen ? goldLight : "#6b6b80" }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isMobileMenuOpen ? 2 : 1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>

      {/* Mobile Menu Overlay (Drawer) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-[#0f0f13] flex flex-col pt-16 pb-16">
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-4">
            {navItems.slice(3).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-base font-medium transition-colors"
                style={{
                  background: activeTab === item.id ? "rgba(168,127,83,0.12)" : "transparent",
                  color: activeTab === item.id ? goldLight : "#e0e0e8",
                  borderLeft: activeTab === item.id ? `3px solid ${gold}` : "3px solid transparent",
                }}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* Mobile Footer */}
          <div className="p-4 space-y-3 mb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <a
              href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3 rounded-xl text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.05)", color: "#e0e0e8" }}
            >
              Voir le site public
            </a>
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-3 w-full py-3 rounded-xl text-sm font-medium text-red-400"
              style={{ background: "rgba(239,68,68,0.1)" }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </>
  );
}
