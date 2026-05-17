"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ImagePicker from "./ImagePicker";

type HeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
};

export default function HeroManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    badge: "",
    description: "",
    image: "",
    order: 0,
    isActive: true,
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSlides = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/hero");
      const data = await res.json();
      setSlides(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Erreur chargement slides", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openAddModal = () => {
    setEditingSlide(null);
    setFormData({
      title: "",
      subtitle: "",
      badge: "",
      description: "",
      image: "",
      order: 0,
      isActive: true,
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      badge: slide.badge,
      description: slide.description,
      image: slide.image,
      order: slide.order,
      isActive: slide.isActive,
    });
    setSelectedFile(null);
    setPreviewUrl(slide.image);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const saveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let finalImageUrl = formData.image;

      // 1. Upload image if a new file is selected
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadData,
        });
        
        if (!uploadRes.ok) throw new Error("Échec de l'upload de l'image");
        const uploadJson = await uploadRes.json();
        finalImageUrl = uploadJson.url;
      }

      if (!finalImageUrl) {
          alert("Veuillez fournir une image pour le slide.");
          setIsSaving(false);
          return;
      }

      // 2. Save Slide
      const payload = { ...formData, image: finalImageUrl };
      const url = "/api/admin/hero";
      const method = editingSlide ? "PATCH" : "POST";
      
      const saveRes = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSlide ? { id: editingSlide.id, ...payload } : payload),
      });

      if (!saveRes.ok) throw new Error("Erreur lors de l'enregistrement du slide");
      
      await fetchSlides();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (slide: HeroSlide) => {
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slide.id, isActive: !slide.isActive }),
      });
      if (res.ok) {
        setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, isActive: !s.isActive } : s));
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut", error);
    }
  };

  const deleteSlide = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce slide ?")) return;
    
    try {
      await fetch(`/api/admin/hero?id=${id}`, { method: "DELETE" });
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  if (isLoading) {
    return <div className="text-gray-400">Chargement du slider...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold" style={{ color: "#f0e6d8" }}>Gestion du Slider (Accueil)</h2>
        <button 
          onClick={openAddModal}
          className="px-4 py-2 rounded-lg bg-green-600/20 text-green-400 border border-green-600/30 text-sm font-medium hover:bg-green-600/30 transition-colors"
        >
          + Ajouter un Slide
        </button>
      </div>

      {/* Slides Grid */}
      {slides.length === 0 ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center text-gray-400">
          Aucun slide configuré.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#a87f53]/50 transition-colors flex flex-col group">
              {/* Image Background Banner */}
              <div className="h-56 relative bg-black flex items-center justify-center p-6">
                {slide.image ? (
                  <>
                    <img src={slide.image} alt="Slide Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gray-800"></div>
                )}
                
                {/* Overlay Text Preview */}
                <div className="relative z-10 text-center w-full">
                    <p className="text-[#a87f53] text-sm uppercase tracking-widest font-semibold mb-2">{slide.subtitle}</p>
                    <h3 className="font-bold text-2xl text-white line-clamp-2" style={{ fontFamily: "Cinzel, serif" }}>{slide.title}</h3>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); toggleStatus(slide); }}
                  className={`absolute top-3 right-3 text-[10px] px-2 py-1 rounded border uppercase font-bold tracking-wider transition-all shadow-lg z-20 ${
                    slide.isActive 
                    ? "bg-green-500/80 text-white border-green-400 hover:bg-green-600" 
                    : "bg-red-500/80 text-white border-red-400 hover:bg-red-600"
                  }`}
                >
                  {slide.isActive ? "Actif" : "Inactif"}
                </button>
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white border border-white/20 text-xs px-2 py-1 rounded z-20">
                    Ordre: {slide.order}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 p-4 bg-[#1a1a24]">
                <button 
                  onClick={() => openEditModal(slide)}
                  className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors"
                >
                  Modifier
                </button>
                <button 
                  onClick={() => deleteSlide(slide.id)}
                  className="flex-1 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-sm text-red-400 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#1a1a24] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#f0e6d8]">
                {editingSlide ? "Modifier le Slide" : "Ajouter un Slide"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <form onSubmit={saveSlide} className="p-6 space-y-6">
              
              {/* Image Picker */}
              <ImagePicker 
                currentImage={formData.image} 
                onSelect={(url) => {
                  setFormData({ ...formData, image: url });
                  setPreviewUrl(url);
                  setSelectedFile(null); // Reset file if default is chosen
                }} 
              />

              {/* Image Upload Area (16:9 ratio style) */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Ou uploader une nouvelle image *</label>
                <div 
                  className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-[#a87f53]/50 transition-colors cursor-pointer relative overflow-hidden group aspect-video max-h-64"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden" 
                  />
                  
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium">Changer l'image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-6">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a87f53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-3"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <p className="text-[#e0e0e8]">Cliquez pour uploader une image</p>
                      <p className="text-xs text-gray-500 mt-1">L'image doit être de haute qualité (format paysage). Max 5MB.</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sous-titre (Surligné / Doré)</label>
                <input 
                  type="text" 
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[#a87f53] font-medium tracking-wide focus:outline-none focus:border-[#a87f53]"
                  placeholder="Ex: EXPÉRIENCE RELAXANTE"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Badge (Texte au dessus du titre)</label>
                <input 
                  type="text" 
                  value={formData.badge}
                  onChange={(e) => setFormData({...formData, badge: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-medium focus:outline-none focus:border-[#a87f53]"
                  placeholder="Ex: Spa à Domicile • Abidjan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Titre principal (Gros texte) *</label>
                <textarea 
                  required
                  rows={2}
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-[#a87f53] resize-none"
                  placeholder="Ex: Bienvenue au Méli Empire"
                  style={{ fontFamily: "Cinzel, serif" }}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description (Texte sous le titre)</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#a87f53] resize-none"
                  placeholder="Ex: Méli Empire déplace l'ambiance..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Ordre d'affichage</label>
                  <input 
                    type="number" 
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                  />
                </div>

                 <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10 h-11 mt-7">
                    <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#a87f53]"></div>
                    </label>
                    <span className="text-sm font-medium text-white">Slide Actif</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-white/10">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition-colors"
                  disabled={isSaving}
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-lg bg-[#a87f53] text-white text-sm font-medium hover:bg-[#b88c5d] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Enregistrement...
                    </>
                  ) : "Sauvegarder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
