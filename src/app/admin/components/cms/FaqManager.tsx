"use client";

import { useState, useEffect } from "react";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
};

export default function FaqManager() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    order: 0,
    isActive: true,
  });

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/faq");
      const data = await res.json();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Erreur chargement FAQ", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openAddModal = () => {
    setEditingFaq(null);
    setFormData({
      question: "",
      answer: "",
      order: 0,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FaqItem) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
      isActive: faq.isActive,
    });
    setIsModalOpen(true);
  };

  const saveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const url = "/api/admin/faq";
      const method = editingFaq ? "PATCH" : "POST";
      
      const saveRes = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingFaq ? { id: editingFaq.id, ...formData } : formData),
      });

      if (!saveRes.ok) throw new Error("Erreur lors de l'enregistrement de la FAQ");
      
      await fetchFaqs();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (faq: FaqItem) => {
    try {
      const res = await fetch("/api/admin/faq", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: faq.id, isActive: !faq.isActive }),
      });
      if (res.ok) {
        setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, isActive: !f.isActive } : f));
      }
    } catch (error) {
      console.error("Erreur lors du changement de statut", error);
    }
  };

  const deleteFaq = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette question ?")) return;
    
    try {
      await fetch(`/api/admin/faq?id=${id}`, { method: "DELETE" });
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  if (isLoading) {
    return <div className="text-gray-400">Chargement de la FAQ...</div>;
  }

  // Sort FAQs by order for display
  const sortedFaqs = [...faqs].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold" style={{ color: "#f0e6d8" }}>Gestion de la Foire Aux Questions (FAQ)</h2>
        <button 
          onClick={openAddModal}
          className="px-4 py-2 rounded-lg bg-green-600/20 text-green-400 border border-green-600/30 text-sm font-medium hover:bg-green-600/30 transition-colors"
        >
          + Ajouter une Question
        </button>
      </div>

      {/* FAQ List */}
      {sortedFaqs.length === 0 ? (
        <div className="bg-white/5 rounded-xl border border-white/10 p-12 text-center text-gray-400">
          Aucune question configurée dans la FAQ.
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="divide-y divide-white/10">
            {sortedFaqs.map((faq) => (
              <div key={faq.id} className={`p-6 transition-colors hover:bg-white/5 flex flex-col md:flex-row gap-6 ${!faq.isActive ? 'opacity-60' : ''}`}>
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#a87f53]/20 text-[#a87f53] flex items-center justify-center text-xs font-bold mt-0.5">
                      Q
                    </span>
                    <h3 className="font-semibold text-lg text-white">{faq.question}</h3>
                    <button
                      onClick={() => toggleStatus(faq)}
                      className={`ml-auto text-[10px] px-2 py-1 rounded border uppercase font-bold tracking-wider transition-colors ${
                        faq.isActive 
                        ? "bg-green-500/20 text-green-400 border-green-500/20 hover:bg-green-500/30" 
                        : "bg-red-500/20 text-red-400 border-red-500/20 hover:bg-red-500/30"
                      }`}
                      title={faq.isActive ? "Désactiver" : "Activer"}
                    >
                      {faq.isActive ? "Actif" : "Inactif"}
                    </button>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 text-gray-400 flex items-center justify-center text-xs font-bold mt-0.5">
                      R
                    </span>
                    <p className="text-gray-400 whitespace-pre-line">{faq.answer}</p>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500 pl-9">
                    Ordre d'affichage : {faq.order}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex md:flex-col gap-2 shrink-0 md:w-32">
                  <button 
                    onClick={() => openEditModal(faq)}
                    className="flex-1 py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 transition-colors"
                  >
                    Modifier
                  </button>
                  <button 
                    onClick={() => deleteFaq(faq.id)}
                    className="flex-1 py-2 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-sm text-red-400 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#1a1a24] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#f0e6d8]">
                {editingFaq ? "Modifier la Question" : "Ajouter une Question"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <form onSubmit={saveFaq} className="p-6 space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Question (Titre) *</label>
                <input 
                  required
                  type="text" 
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-lg font-medium focus:outline-none focus:border-[#a87f53]"
                  placeholder="Ex: Doit-on fournir les serviettes ?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Réponse (Contenu) *</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-[#a87f53] resize-y"
                  placeholder="Ex: Non, le Méli Empire fournit tout le linge de maison nécessaire..."
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
                  <p className="text-xs text-gray-500 mt-1">Un nombre plus petit s'affichera en premier.</p>
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
                    <span className="text-sm font-medium text-white">Question visible sur le site</span>
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
