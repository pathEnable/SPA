"use client";

import { useState, useEffect } from "react";

type SettingsData = {
  [key: string]: string;
};

export default function SettingsManager() {
  const [settings, setSettings] = useState<SettingsData>({
    contact_phone: "",
    contact_email: "",
    social_instagram: "",
    social_whatsapp: "",
    concept_title: "",
    concept_text: "",
    site_title: "",
    site_description: "",
    site_keywords: "",
    opening_hours: "",
    booking_notice: "",
    google_analytics_id: "",
    promo_banner_active: "false",
    promo_banner_text: "",
    footer_copyright: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        // Merge fetched data with default keys
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error("Erreur chargement paramètres", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return <div className="text-gray-400">Chargement des paramètres...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold" style={{ color: "#f0e6d8" }}>Paramètres Généraux du Site</h2>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-lg bg-[#a87f53] text-white text-sm font-medium hover:bg-[#b88c5d] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Enregistrement...
            </>
          ) : "Sauvegarder les modifications"}
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Paramètres enregistrés avec succès ! Le site a été mis à jour.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SEO & Méta-données */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="bg-black/20 px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-[#f0e6d8] flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a87f53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              SEO & Référencement
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Titre du site (Meta Title)</label>
              <input 
                type="text" 
                value={settings.site_title || ""}
                onChange={(e) => handleChange("site_title", e.target.value)}
                className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                placeholder="Ex: Méli Empire - Spa à Domicile Abidjan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Description pour Google (Meta Description)</label>
              <textarea 
                rows={3}
                value={settings.site_description || ""}
                onChange={(e) => handleChange("site_description", e.target.value)}
                className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-[#a87f53] resize-y"
                placeholder="Ex: Réservez votre séance de massage professionnel à domicile..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Mots-clés (séparés par des virgules)</label>
              <input 
                type="text" 
                value={settings.site_keywords || ""}
                onChange={(e) => handleChange("site_keywords", e.target.value)}
                className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                placeholder="Ex: spa, massage, abidjan, bien-être, domicile"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="bg-black/20 px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-[#f0e6d8] flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a87f53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Coordonnées de Contact
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Numéro de téléphone</label>
              <input 
                type="text" 
                value={settings.contact_phone || ""}
                onChange={(e) => handleChange("contact_phone", e.target.value)}
                className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                placeholder="Ex: +41 78 123 45 67"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Adresse Email</label>
              <input 
                type="email" 
                value={settings.contact_email || ""}
                onChange={(e) => handleChange("contact_email", e.target.value)}
                className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                placeholder="Ex: contact@meli-empire.com"
              />
            </div>
          </div>
        </div>

        {/* Réseaux Sociaux & Horaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden h-fit">
            <div className="bg-black/20 px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-[#f0e6d8] flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a87f53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                Réseaux Sociaux
                </h3>
            </div>
            <div className="p-6 space-y-6">
                <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Lien Instagram</label>
                <input 
                    type="url" 
                    value={settings.social_instagram || ""}
                    onChange={(e) => handleChange("social_instagram", e.target.value)}
                    className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                    placeholder="https://instagram.com/votre.compte"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Lien WhatsApp</label>
                <input 
                    type="url" 
                    value={settings.social_whatsapp || ""}
                    onChange={(e) => handleChange("social_whatsapp", e.target.value)}
                    className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                    placeholder="https://wa.me/41781234567"
                />
                </div>
            </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden h-fit">
            <div className="bg-black/20 px-6 py-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-[#f0e6d8] flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a87f53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Horaires & Opérations
                </h3>
            </div>
            <div className="p-6 space-y-6">
                <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Horaires d'ouverture</label>
                <input 
                    type="text" 
                    value={settings.opening_hours || ""}
                    onChange={(e) => handleChange("opening_hours", e.target.value)}
                    className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                    placeholder="Ex: Lun - Dim : 08h00 - 22h00"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Délai de prévenance (Réservation)</label>
                <input 
                    type="text" 
                    value={settings.booking_notice || ""}
                    onChange={(e) => handleChange("booking_notice", e.target.value)}
                    className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                    placeholder="Ex: Réservation minimum 2h à l'avance"
                />
                </div>
            </div>
            </div>
        </div>

        {/* Marketing & Analytics */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="bg-black/20 px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-[#f0e6d8] flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a87f53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
              Marketing & Bannière Promo
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Bannière Promotionnelle d'En-tête</label>
              <div className="flex items-center gap-4 mb-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.promo_banner_active === "true"}
                        onChange={(e) => handleChange("promo_banner_active", e.target.checked ? "true" : "false")}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#a87f53]"></div>
                  </label>
                  <span className="text-sm text-gray-300">Activer la bannière (s'affiche en haut du site)</span>
              </div>
              {settings.promo_banner_active === "true" && (
                  <input 
                    type="text" 
                    value={settings.promo_banner_text || ""}
                    onChange={(e) => handleChange("promo_banner_text", e.target.value)}
                    className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                    placeholder="Ex: PROMO : -20% sur votre premier massage ce mois-ci !"
                  />
              )}
            </div>
            
            <hr className="border-white/10" />

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Google Analytics ID</label>
              <input 
                type="text" 
                value={settings.google_analytics_id || ""}
                onChange={(e) => handleChange("google_analytics_id", e.target.value)}
                className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                placeholder="Ex: G-XXXXXXXXXX"
              />
              <p className="text-xs text-gray-500 mt-2">Sera utilisé pour le suivi des visites si renseigné.</p>
            </div>
          </div>
        </div>

        {/* Concept Text */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="bg-black/20 px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-[#f0e6d8] flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a87f53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Section "Notre Concept" (Page d'accueil)
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Titre du concept</label>
              <input 
                type="text" 
                value={settings.concept_title || ""}
                onChange={(e) => handleChange("concept_title", e.target.value)}
                className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                style={{ fontFamily: "Cinzel, serif" }}
                placeholder="L'Excellence du Spa à Domicile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Texte de présentation</label>
              <textarea 
                rows={6}
                value={settings.concept_text || ""}
                onChange={(e) => handleChange("concept_text", e.target.value)}
                className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-[#a87f53] resize-y"
                placeholder="Décrivez votre concept..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Légal */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="bg-black/20 px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-[#f0e6d8] flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a87f53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Légal & Bas de page (Footer)
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Texte de Copyright</label>
              <input 
                type="text" 
                value={settings.footer_copyright || ""}
                onChange={(e) => handleChange("footer_copyright", e.target.value)}
                className="w-full bg-[#1a1a24] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#a87f53]"
                placeholder="Ex: © 2024 Méli Empire. Tous droits réservés."
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
