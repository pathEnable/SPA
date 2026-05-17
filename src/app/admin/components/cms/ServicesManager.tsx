"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ImagePicker from "./ImagePicker";

type Service = {
  id: number;
  title: string;
  price: string;
  duration: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
};

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    duration: "",
    description: "",
    image: "",
    order: 0,
    isActive: true,
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Erreur chargement services", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      title: "",
      price: "",
      duration: "",
      description: "",
      image: "",
      order: 0,
      isActive: true,
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      price: service.price,
      duration: service.duration,
      description: service.description,
      image: service.image,
      order: service.order,
      isActive: service.isActive,
    });
    setSelectedFile(null);
    setPreviewUrl(service.image);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const saveService = async (e: React.FormEvent) => {
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

      // 2. Save Service
      const payload = { ...formData, image: finalImageUrl };
      const url = "/api/admin/services";
      const method = editingService ? "PATCH" : "POST";
      
      const saveRes = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService ? { id: editingService.id, ...payload } : payload),
      });

      if (!saveRes.ok) throw new Error("Erreur lors de l'enregistrement du service");
      
      await fetchServices();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (service: Service) => {
    try {
      const res = await fetch("/api/admin/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: service.id, isActive: !service.isActive }),
      });
      if (res.ok) {
        setServices(prev => prev.map(s => s.id === service.id ? { ...s, isActive: !s.isActive } : s));
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut", error);
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce service ?")) return;
    
    try {
      await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  if (isLoading) {
    return <div className="text-gray-400">Chargement des services...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold" style={{ color: "#f0e6d8" }}>Gestion des Soins & Services</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2 ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <span className="hidden sm:inline">Grille</span>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2 ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              <span className="hidden sm:inline">Liste</span>
            </button>
          </div>
          <button 
            onClick={openAddModal}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-green-600/20 text-green-400 border border-green-600/30 text-sm font-medium hover:bg-green-600/30 transition-colors"
          >
            + Ajouter
          </button>
        </div>
      </div>

      {/* Services Content */}
      {services.length === 0 ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center text-gray-400">
          Aucun service n'est encore configuré.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#a87f53]/50 transition-colors flex flex-col">
              {/* Image Banner */}
              <div className="h-40 relative bg-black/50">
                {service.image ? (
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">Sans image</div>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleStatus(service); }}
                  className={`absolute top-2 right-2 text-[10px] px-2 py-1 rounded border uppercase font-bold tracking-wider transition-all shadow-lg ${
                    service.isActive 
                    ? "bg-green-500/80 text-white border-green-400 hover:bg-green-600" 
                    : "bg-red-500/80 text-white border-red-400 hover:bg-red-600"
                  }`}
                >
                  {service.isActive ? "Actif" : "Inactif"}
                </button>
              </div>
              
              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-[#f0e6d8] line-clamp-1">{service.title}</h3>
                  <span className="text-[#a87f53] font-medium whitespace-nowrap ml-3">{service.price}</span>
                </div>
                <div className="text-xs text-gray-400 mb-3 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {service.duration}
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{service.description}</p>
                
                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                  <button 
                    onClick={() => openEditModal(service)}
                    className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors"
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => deleteService(service.id)}
                    className="flex-1 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-sm text-red-400 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300 min-w-[600px]">
            <thead className="bg-white/5 border-b border-white/10 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-3 py-2 w-14">Image</th>
                <th className="px-2 py-2 min-w-[100px] w-1/3">Titre</th>
                <th className="px-2 py-2 min-w-[120px]">Prix & Durée</th>
                <th className="px-2 py-2 min-w-[80px]">Statut</th>
                <th className="px-3 py-2 text-right sticky right-0 bg-black/20 backdrop-blur-md z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.1)] w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {services.map(service => (
                <tr key={service.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-3 py-2">
                    <div className="w-10 h-10 bg-black/50 rounded-md overflow-hidden relative">
                      {service.image ? (
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] flex h-full items-center justify-center text-gray-500">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2 font-medium text-white">{service.title}</td>
                  <td className="px-2 py-2">
                    <div className="text-[#a87f53] font-medium">{service.price}</div>
                    <div className="text-xs text-gray-400">{service.duration}</div>
                  </td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => toggleStatus(service)}
                      className={`text-[10px] px-2 py-1 rounded border uppercase font-bold tracking-wider transition-colors ${
                        service.isActive 
                        ? "bg-green-500/20 text-green-400 border-green-500/20 hover:bg-green-500/30" 
                        : "bg-red-500/20 text-red-400 border-red-500/20 hover:bg-red-500/30"
                      }`}
                      title={service.isActive ? "Désactiver" : "Activer"}
                    >
                      {service.isActive ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-right sticky right-0 bg-black/20 backdrop-blur-md z-10 shadow-[-4px_0_15px_rgba(0,0,0,0.1)]">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEditModal(service)} className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors" title="Modifier">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={() => deleteService(service.id)} className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded transition-colors" title="Supprimer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#1a1a24] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#f0e6d8]">
                {editingService ? "Modifier le Service" : "Ajouter un Service"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <form onSubmit={saveService} className="p-6 space-y-6">
              
              {/* Image Picker */}
              <ImagePicker 
                currentImage={formData.image} 
                onSelect={(url) => {
                  setFormData({ ...formData, image: url });
                  setPreviewUrl(url);
                  setSelectedFile(null); // Reset file if default is chosen
                }} 
              />

              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Ou uploader une nouvelle image</label>
                <div 
                  className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-[#a87f53]/50 transition-colors cursor-pointer relative overflow-hidden group"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ minHeight: "160px" }}
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
                      <p className="text-xs text-gray-500 mt-1">Format recommandé: JPG, PNG. Max 5MB.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nom du service *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                    placeholder="Ex: Massage Suédois"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Prix *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                    placeholder="Ex: 80€ / 120 CHF"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Durée *</label>
                  <input 
                    required
                    type="text" 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                    placeholder="Ex: 60 min"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Ordre d'affichage</label>
                  <input 
                    type="number" 
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description *</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#a87f53] resize-none"
                  placeholder="Décrivez les bienfaits du soin..."
                ></textarea>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#a87f53]"></div>
                </label>
                <span className="text-sm font-medium text-white">Service Actif (visible sur le site)</span>
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
