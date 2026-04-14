"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or wait for resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loader

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Animated Logo Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
             <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-white/5 flex items-center justify-center rounded-3xl shrink-0 p-2">
                 {/* Simple elegant CSS pulse ring representing the Glow/SPA vibe */}
                 <motion.div 
                    animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.4, 0.1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-3xl border border-primary/30"
                 />
                 <Image 
                   src="/logo.svg" 
                   alt="Logo Méli Empire SPA"
                   width={256}
                   height={256}
                   className="object-contain relative z-10 w-full h-full drop-shadow-2xl"
                   priority
                 />
            </div>
            
            <div className="overflow-hidden">
                <motion.h1 
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="font-heading text-2xl tracking-widest uppercase text-primary font-bold"
                >
                    Méli Empire
                </motion.h1>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
