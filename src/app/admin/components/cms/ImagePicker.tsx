"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImagePickerProps {
  onSelect: (url: string) => void;
  currentImage?: string;
}

const DEFAULT_IMAGES = [
  { url: "/hero-1.png", label: "Hero (Intérieur luxe)" },
  { url: "/hero-2.png", label: "Hero (Soin visage)" },
  { url: "/hero-3.png", label: "Hero (Ambiance zen)" },
  { url: "/massage-relaxant.png", label: "Massage Relaxant" },
  { url: "/massage-tonifiant.png", label: "Massage Tonifiant" },
  { url: "/massage-special.png", label: "Massage Spécial Méli" },
  { url: "/pedicure.png", label: "Pédicure" },
  { url: "/manucure.png", label: "Manucure" },
  { url: "/massage-senior.png", label: "Massage Senior" },
];

export default function ImagePicker({ onSelect, currentImage }: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"default" | "library">("default");
  const [libraryImages, setLibraryImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLibraryImages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/upload/list");
      if (res.ok) {
        const data = await res.json();
        setLibraryImages(data);
      }
    } catch (e) {
      console.error("Erreur chargement bibliothèque", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === "library") {
      fetchLibraryImages();
    }
  }, [isOpen, activeTab]);

  const handleDeleteImage = async (url: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette image de la bibliothèque ?")) return;
    
    try {
      const res = await fetch(`/api/admin/upload/delete?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLibraryImages((prev) => prev.filter((img) => img !== url));
        if (currentImage === url) {
          onSelect(""); // Clear selection if deleted
        }
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (e) {
      console.error("Erreur suppression", e);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-400">Choisir une image existante</label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-[#a87f53] hover:underline flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          {isOpen ? "Fermer la bibliothèque" : "Ouvrir la bibliothèque"}
        </button>
      </div>

      {isOpen && (
        <div className="bg-black/40 rounded-xl border border-white/5 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/5 bg-white/5">
            <button
              type="button"
              onClick={() => setActiveTab("default")}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                activeTab === "default" ? "text-[#a87f53] bg-[#a87f53]/10" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Images par défaut
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                activeTab === "library" ? "text-[#a87f53] bg-[#a87f53]/10" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Mes uploads
            </button>
          </div>

          <div className="p-3 max-h-60 overflow-y-auto custom-scrollbar">
            {activeTab === "default" ? (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {DEFAULT_IMAGES.map((img) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => {
                      onSelect(img.url);
                      setIsOpen(false);
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImage === img.url ? "border-[#a87f53]" : "border-transparent hover:border-white/20"
                    }`}
                    title={img.label}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    {currentImage === img.url && (
                      <div className="absolute inset-0 bg-[#a87f53]/20 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <svg className="animate-spin h-5 w-5 text-[#a87f53]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  </div>
                ) : libraryImages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    Aucune image uploadée pour le moment.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {libraryImages.map((url) => (
                      <div key={url} className="group relative aspect-square">
                        <button
                          type="button"
                          onClick={() => {
                            onSelect(url);
                            setIsOpen(false);
                          }}
                          className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all ${
                            currentImage === url ? "border-[#a87f53]" : "border-transparent hover:border-white/20"
                          }`}
                        >
                          <img src={url} alt="Library" className="w-full h-full object-cover" />
                          {currentImage === url && (
                            <div className="absolute inset-0 bg-[#a87f53]/20 flex items-center justify-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(url);
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
