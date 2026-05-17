"use client";

import { useState, useEffect, useRef } from "react";

export default function MediaLibrary() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/upload/list");
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (e) {
      console.error("Erreur chargement images", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          await fetchImages();
        } else {
          alert("Erreur lors de l'upload");
        }
      } catch (e) {
        console.error("Erreur upload", e);
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (url: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette image ?")) return;
    
    try {
      const res = await fetch(`/api/admin/upload/delete?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img !== url));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (e) {
      console.error("Erreur suppression", e);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Lien copié dans le presse-papier !");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "#f0e6d8" }}>Médiathèque</h2>
          <p className="text-sm text-gray-500">Gérez toutes les images uploadées sur le serveur</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-4 py-2 rounded-lg bg-[#a87f53] text-white text-sm font-medium hover:bg-[#b88c5d] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Upload en cours...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Uploader une image
            </>
          )}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      {isLoading ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-12 flex justify-center">
          <svg className="animate-spin h-8 w-8 text-[#a87f53]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center text-gray-400">
          Aucune image dans la médiathèque.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((url) => (
            <div key={url} className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#a87f53]/50 transition-all aspect-square">
              <img src={url} alt="Media" className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <button 
                  onClick={() => copyToClipboard(url)}
                  className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors"
                >
                  Copier le lien
                </button>
                <button 
                  onClick={() => handleDelete(url)}
                  className="w-full py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-xs text-red-400 border border-red-500/30 transition-colors"
                >
                  Supprimer
                </button>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-[10px] text-gray-400 truncate">{url.split("/").pop()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
