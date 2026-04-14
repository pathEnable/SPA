"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, UserPlus, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-background/95 backdrop-blur-2xl border border-primary/10 rounded-3xl overflow-hidden shadow-2xl pointer-events-auto shadow-black/20"
            >
              {/* Header */}
              <div className="relative h-32 bg-primary flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-secondary rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
                </div>
                <div className="relative z-10 text-center">
                    <h2 className="text-2xl font-heading font-bold text-white uppercase tracking-[0.2em]">Espace Membre</h2>
                    <p className="text-white/70 text-xs uppercase tracking-widest mt-1">Méli Empire SPA</p>
                </div>
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                       <Mail className="w-3 h-3" /> Email
                    </Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="votre@email.com" 
                      className="h-12 border-primary/10 bg-primary/5 focus:ring-primary focus:border-primary rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="pass" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                           <Lock className="w-3 h-3" /> Mot de passe
                        </Label>
                        <button className="text-[10px] uppercase font-bold text-primary hover:underline">Oublié ?</button>
                    </div>
                    <Input 
                      id="pass" 
                      type="password" 
                      placeholder="••••••••" 
                      className="h-12 border-primary/10 bg-primary/5 focus:ring-primary focus:border-primary rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Button className="w-full h-12 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg hover:shadow-primary/20 transition-all flex gap-2">
                        <LogIn className="w-4 h-4" /> Se connecter
                    </Button>
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-primary/5"></div></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-bold text-muted-foreground">
                            <span className="bg-background px-4">Ou</span>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full h-12 rounded-xl text-sm font-bold uppercase tracking-widest border-primary/20 hover:bg-primary/5 transition-all flex gap-2">
                        <UserPlus className="w-4 h-4" /> Créer un compte
                    </Button>
                </div>

                <p className="text-[10px] text-center text-muted-foreground px-4">
                    En vous connectant, vous acceptez nos conditions générales de vente et notre politique de confidentialité.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
