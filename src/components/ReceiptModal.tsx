"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, MessageCircle, Clock, Calendar, User, Phone, Check, CreditCard, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: any;
  servicesList: any[];
  siteSettings: Record<string, string>;
}

export default function ReceiptModal({ isOpen, onClose, reservation, servicesList, siteSettings }: ReceiptModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !reservation) return null;

  // Récupérer le prix et la durée réels à partir de la liste des soins en BDD
  const matchedService = servicesList?.find(
    (s) => s.title?.toLowerCase() === reservation.service?.toLowerCase()
  );
  
  const price = matchedService?.price || "À convenir";
  const duration = matchedService?.duration || "À convenir";
  const receiptId = `#ME-REV-${String(reservation.id).padStart(4, "0")}`;
  const dateFormatted = new Date(reservation.createdAt || Date.now()).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const whatsappPhone = siteSettings?.contact_phone?.replace(/[^0-9]/g, "") || "2250575957587";

  const handleWhatsAppRedirect = () => {
    let text = `Bonjour Méli Empire ! Je souhaite finaliser ma réservation.\n\n`;
    text += `*Reçu N° :* ${receiptId}\n`;
    text += `*Nom :* ${reservation.name}\n`;
    text += `*Téléphone :* ${reservation.phone}\n`;
    text += `*Soin :* ${reservation.service}\n`;
    if (reservation.date) text += `*Date :* ${reservation.date}\n`;
    if (reservation.time) text += `*Heure :* ${reservation.time}\n`;
    if (reservation.message) text += `\n*Précisions :* ${reservation.message}`;

    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${whatsappPhone}?text=${encodedText}`;
    window.open(waUrl, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  // Portal to ensure modal stays at root body level for reliable printing
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div id="print-receipt-portal" className="fixed inset-0 z-[120]">
          {/* Backdrop (hidden in print) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f0f1c]/80 backdrop-blur-md z-[121] no-print"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[122] p-4 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="w-full max-w-xl bg-background border border-[#a87f53]/25 rounded-[2rem] shadow-2xl pointer-events-auto shadow-black/40 overflow-hidden relative my-8 print-receipt-card"
            >
              {/* Dynamic Print CSS Injector */}
              <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                  body {
                    background: white !important;
                    color: black !important;
                  }
                  /* Hide loader, navbar, standard client-side components */
                  body > *:not(#print-receipt-portal) {
                    display: none !important;
                  }
                  #print-receipt-portal {
                    display: block !important;
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    height: auto !important;
                    background: white !important;
                    color: black !important;
                    padding: 0 !important;
                    margin: 0 !important;
                  }
                  .print-receipt-card {
                    background: white !important;
                    border: 2px solid #a87f53 !important;
                    color: black !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    box-shadow: none !important;
                    margin: 0 !important;
                    padding: 24px !important;
                    border-radius: 0 !important;
                  }
                  .no-print {
                    display: none !important;
                  }
                  .print-text-primary {
                    color: #a87f53 !important;
                  }
                  .print-text-dark {
                    color: #111111 !important;
                  }
                  .print-bg-light {
                    background: #faf8f5 !important;
                  }
                  .print-border-dashed {
                    border-style: dashed !important;
                    border-color: #a87f53 !important;
                  }
                }
              `}} />

              {/* Close Button (no-print) */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full text-foreground/40 hover:text-foreground hover:bg-secondary/20 transition-all z-10 no-print"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Receipt Body */}
              <div className="p-6 sm:p-10 space-y-6">
                
                {/* Brand Header */}
                <div className="text-center pb-6 border-b border-[#a87f53]/15 print-border-dashed">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#a87f53]/10 text-[#a87f53] mb-3">
                    <Sparkles className="w-6 h-6 animate-pulse print-text-primary" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-primary uppercase tracking-widest print-text-primary">Méli Empire</h2>
                  <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 print-text-dark">Spa Mobile d'Exception • Abidjan</p>
                </div>

                {/* Receipt Details Indicator */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-[#a87f53]/5 px-4 py-3 rounded-2xl gap-2 print-bg-light">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider print-text-dark">N° de Réservation</span>
                    <p className="text-sm font-bold text-[#a87f53] tracking-wide print-text-primary">{receiptId}</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider print-text-dark">Date d'Émission</span>
                    <p className="text-sm font-semibold text-foreground/80 print-text-dark">{dateFormatted}</p>
                  </div>
                  <div className="no-print">
                    <span className="inline-flex items-center gap-1 bg-[#3b82f6]/10 text-[#3b82f6] text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-[#3b82f6]/20">
                      Provisoire
                    </span>
                  </div>
                </div>

                {/* Warning note (no-print) */}
                <div className="flex items-start gap-3 bg-[#e0f2fe] border border-[#bae6fd] p-4 rounded-xl no-print">
                  <AlertCircle className="w-5 h-5 text-[#0284c7] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#0369a1] leading-relaxed">
                    <span className="font-bold">Dernière étape requise :</span> Pour bloquer définitivement votre créneau, vous devez envoyer le message automatique sur WhatsApp en cliquant sur le bouton vert ci-dessous.
                  </div>
                </div>

                {/* Main Client Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#a87f53] pb-2 border-b border-border/50 print-text-primary print-border-dashed">Informations Client</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-foreground/80 print-text-dark">
                      <User className="w-4 h-4 text-muted-foreground shrink-0 print-text-primary" />
                      <span><strong className="font-semibold text-foreground print-text-dark">Nom :</strong> {reservation.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80 print-text-dark">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0 print-text-primary" />
                      <span><strong className="font-semibold text-foreground print-text-dark">Tél :</strong> {reservation.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Prestation Details Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#a87f53] pb-2 border-b border-border/50 print-text-primary print-border-dashed">Détail du Soin</h4>
                  <div className="bg-card/50 rounded-2xl border border-border/50 overflow-hidden shadow-sm print-bg-light">
                    <div className="p-4 border-b border-border/50 flex justify-between items-center print-border-dashed">
                      <div>
                        <p className="font-bold text-foreground text-sm sm:text-base print-text-dark">{reservation.service}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground uppercase font-bold mt-1 print-text-dark">
                          <Clock className="w-3 h-3 print-text-primary" /> {duration}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-muted-foreground block uppercase print-text-dark">Tarif indicatif</span>
                        <p className="font-heading font-extrabold text-lg text-[#a87f53] tracking-tight print-text-primary">{price}</p>
                      </div>
                    </div>
                    {reservation.date && (
                      <div className="p-4 bg-muted/20 grid grid-cols-2 gap-4 text-sm print-bg-light">
                        <div className="flex items-center gap-2 text-foreground/80 print-text-dark">
                          <Calendar className="w-4 h-4 text-[#a87f53] shrink-0 print-text-primary" />
                          <span>{new Date(reservation.date).toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/80 print-text-dark">
                          <Clock className="w-4 h-4 text-[#a87f53] shrink-0 print-text-primary" />
                          <span>Prévu à : {reservation.time || "Non spécifiée"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Client message if exists */}
                {reservation.message && (
                  <div className="bg-secondary/10 p-4 rounded-xl text-xs leading-relaxed text-muted-foreground print-bg-light print-text-dark">
                    <strong className="font-bold text-foreground block mb-1 uppercase tracking-wider text-[9px] print-text-dark">Note Client :</strong>
                    "{reservation.message}"
                  </div>
                )}

                {/* Accepted Payment methods */}
                <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/50 pt-4 print-border-dashed">
                  <span className="uppercase font-bold tracking-wider print-text-dark">Paiement : Wave / Mobile Money</span>
                  <div className="flex items-center gap-1.5 font-semibold text-primary print-text-primary">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Règlement post-service</span>
                  </div>
                </div>

                {/* CTA Action Buttons (no-print) */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50 no-print">
                  <Button
                    onClick={handleWhatsAppRedirect}
                    className="flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#25D366] text-white hover:bg-[#20ba59] border-none shadow-md shadow-[#25D366]/20 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Finaliser sur WhatsApp
                  </Button>
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="h-12 px-6 rounded-xl text-xs font-bold uppercase tracking-wider border-[#a87f53]/25 text-[#a87f53] hover:bg-[#a87f53]/5 hover:text-[#a87f53] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    PDF / Imprimer
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    className="h-12 px-5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-secondary/15 transition-all text-muted-foreground cursor-pointer"
                  >
                    Fermer
                  </Button>
                </div>

                {/* Print Footer Notice (visible only in print) */}
                <div className="hidden print:block text-center text-[10px] text-muted-foreground pt-6 border-t border-border/50 border-dashed">
                  <p>Méli Empire Spa Mobile • Cocody / Marcory • Abidjan, Côte d'Ivoire</p>
                  <p className="mt-1 font-semibold">Merci de présenter ce document lors du rendez-vous.</p>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
