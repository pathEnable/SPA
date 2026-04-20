"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileNavProps {
  onLoginClick: () => void;
}

export default function MobileNav({ onLoginClick }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="p-2 text-primary hover:bg-primary/10 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-90"
        aria-label="Menu"
      >
        {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-20 left-0 w-full bg-background/95 backdrop-blur-md border-b border-primary/10 shadow-xl p-6 flex flex-col gap-2 z-50 overflow-y-auto max-h-[calc(100vh-5rem)]"
          >
            <a 
              href="#home" 
              onClick={() => setIsOpen(false)} 
              className="text-lg font-heading font-bold uppercase tracking-widest text-center py-4 rounded-xl hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none transition-colors"
            >
              Accueil
            </a>
            <a 
              href="#story" 
              onClick={() => setIsOpen(false)} 
              className="text-lg font-heading font-bold uppercase tracking-widest text-center py-4 rounded-xl hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none transition-colors"
            >
              À Propos
            </a>
            <a 
              href="#services" 
              onClick={() => setIsOpen(false)} 
              className="text-lg font-heading font-bold uppercase tracking-widest text-center py-4 rounded-xl hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none transition-colors"
            >
              Services
            </a>
            <a 
              href="#about" 
              onClick={() => setIsOpen(false)} 
              className="text-lg font-heading font-bold uppercase tracking-widest text-center py-4 rounded-xl hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none transition-colors"
            >
              Concept
            </a>
            <a 
              href="#contact" 
              onClick={() => setIsOpen(false)} 
              className="text-lg font-heading font-bold uppercase tracking-widest text-center py-4 rounded-xl hover:bg-primary/5 focus-visible:bg-primary/5 focus-visible:outline-none transition-colors"
            >
              Contact
            </a>
            
            <div className="pt-4 mt-2 border-t border-primary/10">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onLoginClick();
                }}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Se connecter
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
