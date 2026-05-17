"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Phone, CalendarCheck, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reservation: any) => void;
}

export default function LookupModal({ isOpen, onClose, onSuccess }: LookupModalProps) {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !phone.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/reservations/lookup?code=${encodeURIComponent(code)}&phone=${encodeURIComponent(phone)}`
      );
      
      const data = await response.json();
      
      if (response.ok) {
        // Appeler le callback de succès avec les données de la réservation
        onSuccess(data);
        // Réinitialiser les champs et fermer
        setCode("");
        setPhone("");
        onClose();
      } else {
        setError(data.error || "Une erreur est survenue lors de la recherche.");
      }
    } catch (err) {
      console.error("Erreur de recherche :", err);
      setError("Impossible de contacter le serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] no-print">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0f0f1c]/70 backdrop-blur-md z-[111]"
        />

        {/* Modal Wrapper */}
        <div className="fixed inset-0 flex items-center justify-center z-[112] p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-background/95 border border-[#a87f53]/20 rounded-3xl shadow-2xl pointer-events-auto p-6 sm:p-8 space-y-6 relative overflow-hidden"
          >
            {/* Header branding line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/30 via-[#a87f53] to-primary/30" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-foreground/40 hover:text-foreground hover:bg-secondary/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#a87f53]/10 text-[#a87f53] mb-1">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground">Suivre ma Réservation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                Saisissez vos identifiants pour retrouver votre reçu et voir l'état de votre soin.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {/* Code input */}
              <div className="space-y-1.5">
                <Label htmlFor="lookup-code" className="uppercase font-bold tracking-widest text-[10px] text-[#a87f53]">
                  Numéro de Réservation *
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a87f53]/70 font-mono text-sm pointer-events-none">
                    #
                  </span>
                  <Input
                    id="lookup-code"
                    type="text"
                    placeholder="ME-REV-0002 ou 0002"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="pl-8 h-12 rounded-xl border-[#a87f53]/20 focus-visible:ring-primary font-mono text-sm bg-background/50 shadow-inner"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone input */}
              <div className="space-y-1.5">
                <Label htmlFor="lookup-phone" className="uppercase font-bold tracking-widest text-[10px] text-[#a87f53]">
                  Téléphone associé *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="lookup-phone"
                    type="tel"
                    placeholder="ex: 0707070707"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-[#a87f53]/20 focus-visible:ring-primary bg-background/50 shadow-inner"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Error feedback */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/20 p-3.5 rounded-xl text-xs text-destructive leading-relaxed"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#a87f53] text-white hover:bg-[#967147] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#a87f53]/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Recherche en cours...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Rechercher mon reçu
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
