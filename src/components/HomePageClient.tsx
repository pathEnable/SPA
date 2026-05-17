"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";
import LoginModal from "@/components/LoginModal";
import ReceiptModal from "@/components/ReceiptModal";
import LookupModal from "@/components/LookupModal";
import CommentsSection from "@/components/CommentsSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Phone, MapPin, Clock, Star, ShieldCheck, Quote, ChevronDown, ExternalLink, Leaf, Droplets, Sparkles, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function HomePageClient({ 
  heroSlides, 
  servicesList, 
  faqItems, 
  siteSettings 
}: { 
  heroSlides: any[], 
  servicesList: any[], 
  faqItems: any[], 
  siteSettings: Record<string, string> 
}) {
  const [activeSection, setActiveSection] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeReservation, setActiveReservation] = useState<any>(null);

  const whatsappPhone = siteSettings?.contact_phone?.replace(/[^0-9]/g, "") || "2250575957587";
  const contactPhone = siteSettings?.contact_phone || "+225 05 75 95 75 87";
  const contactEmail = siteSettings?.contact_email || "contact@meli-empire.com";
  const conceptTitle = siteSettings?.concept_title || "L'Excellence du Spa à Domicile";
  const conceptText = siteSettings?.concept_text || "Méli Empire redéfinit le bien-être avec une approche exclusive du spa à domicile. Nous apportons chez vous tout le raffinement et l'expertise des plus grands spas de palace.";
  const instagramUrl = siteSettings?.social_instagram || "https://instagram.com/meli_empire";
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent("Bonjour Méli Empire, je souhaite réserver un soin.")}`; 

  const [bookingFormData, setBookingFormData] = useState({
    name: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: ""
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enregistrer dans la base de données interne
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingFormData),
      });
      if (response.ok) {
        const data = await response.json();
        // Ouvrir la modal de reçu provisoire avec la réservation créée
        setActiveReservation(data);
        // Réinitialiser le formulaire
        setBookingFormData({
          name: "",
          phone: "",
          service: "",
          date: "",
          time: "",
          message: ""
        });
      } else {
        const errData = await response.json();
        console.error("Erreur API de réservation :", errData.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la réservation", error);
    }
  }; 

  const activeSlides = heroSlides?.filter(s => s.isActive) || [];
  const slides = activeSlides.length ? activeSlides : [
    {
      image: "/hero-1.png",
      badge: "Spa à Domicile • Abidjan",
      title: "L'excellence du Spa,",
      subtitle: "partout à Abidjan.",
      description: "Méli Empire déplace l'ambiance et le savoir-faire d'un institut prestigieux directement chez vous, de Marcory à Cocody en passant par Bassam."
    },
    {
      image: "/hero-2.png",
      badge: "Beauté & Éclat • Côte d'Ivoire",
      title: "Révélez votre éclat",
      subtitle: "sans sortir de chez vous.",
      description: "Profitez de nos soins professionnels (Massage, Pédicure, Manucure) dans le confort et l'intimité de votre foyer à Abidjan."
    },
    {
      image: "/hero-3.png",
      badge: "Bien-être Absolu • 7j/7",
      title: "Votre cocon privé,",
      subtitle: "où que vous soyez.",
      description: "Nous intervenons dans toutes les communes d'Abidjan et Bassam pour vous offrir une parenthèse de sérénité totale."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Detects when section is roughly in the upper-middle of screen
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections with IDs
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const services = servicesList?.length ? servicesList : [
      { title: "Massage Relaxant", price: "20.000 FCFA", duration: "60 min", desc: "Un massage doux pour détendre tout le corps et évacuer le stress de la journée.", image: "/massage-relaxant.png" },
      { title: "Massage Tonifiant", price: "30.000 FCFA", duration: "1h", desc: "Un massage plus appuyé pour redonner de l'énergie et détendre les muscles en profondeur.", image: "/massage-tonifiant.png" },
      { title: "Massage Spécial Méli Empire", price: "40.000 FCFA", duration: "1h 30m", desc: "Notre meilleur massage, qui mélange des mouvements relaxants et tonifiants pour un résultat complet.", image: "/massage-special.png" },
      { title: "Massage pour Personnes Âgées", price: "25.000 FCFA", duration: "1h", desc: "Un massage très doux et adapté aux besoins des seniors pour soulager les douleurs.", image: "/massage-senior.png" },
      { title: "Pédicure", price: "10.000 FCFA", duration: "1h 30m", desc: "Un soin complet pour nettoyer, soigner et embellir vos pieds.", image: "/pedicure.png" },
      { title: "Manucure", price: "5.000 FCFA", duration: "30 min", desc: "Un soin pour nettoyer vos mains et prendre soin de vos ongles.", image: "/manucure.png" },
      { title: "Sauna", price: "15.000 FCFA", duration: "45 min", desc: "Le sauna est une bonne séance qui permet de dégraisser facilement.", image: "/hero-3.png" },
      { title: "Épilation", price: "À partir de 7.000 FCFA", duration: "-", desc: "Pour enlever les poils et avoir une peau bien lisse.", image: "/hero-2.png" },
      { title: "Piercing", price: "À partir de 5.000 FCFA", duration: "15m et +", desc: "Pose de piercing propre et soignée, avec un respect total de l'hygiène.", image: "/hero-1.png" },
    ];

    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Promo Banner */}
      {siteSettings?.promo_banner_active === "true" && siteSettings?.promo_banner_text && (
        <div className="bg-[#a87f53] text-white py-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-center relative z-[61] shadow-md animate-pulse">
          <div className="container mx-auto px-4">
            {siteSettings.promo_banner_text}
          </div>
        </div>
      )}

      {/* Top Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-center border-b border-white/10 relative z-[60]">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 sm:gap-4">
          <MapPin className="w-3 h-3" />
          <span>Intervention partout à Abidjan & Bassam (Marcory, Cocody, Yopougon...)</span>
          <span className="hidden sm:inline opacity-50">|</span>
          <span className="hidden sm:inline">Disponible 7j/7</span>
        </div>
      </div>
      
      {/* Navbar */}
      <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md shadow-md' : 'bg-background/80 backdrop-blur-md'}`}>
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center shrink-0">
               <Image 
                   src="/logo.svg" 
                   alt="Logo Méli Empire SPA"
                   width={80}
                   height={80}
                   className="object-contain relative z-10 w-full h-full drop-shadow-sm group-hover:drop-shadow-md transition-all"
                   priority
                 />
            </div>
            <span className="font-heading font-bold text-base sm:text-xl tracking-tight text-primary uppercase group-hover:text-primary/80 transition-colors">Méli Empire</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
            <a href="#home" className="relative group py-1 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-md transition-all">
              <span className={`transition-colors ${activeSection === "" || activeSection === "home" ? "text-primary font-bold" : "group-hover:text-primary"}`}>Accueil</span>
              <span className={`absolute bottom-0 left-2 right-2 h-0.5 bg-primary transition-all duration-300 ${activeSection === "" || activeSection === "home" ? "w-[calc(100%-1rem)]" : "w-0 group-hover:w-[calc(100%-1rem)]"}`}></span>
            </a>
            <a href="#story" className="relative group py-1 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-md transition-all">
              <span className={`transition-colors ${activeSection === "story" ? "text-primary font-bold" : "group-hover:text-primary"}`}>À Propos</span>
              <span className={`absolute bottom-0 left-2 right-2 h-0.5 bg-primary transition-all duration-300 ${activeSection === "story" ? "w-[calc(100%-1rem)]" : "w-0 group-hover:w-[calc(100%-1rem)]"}`}></span>
            </a>
            <a href="#services" className="relative group py-1 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-md transition-all">
              <span className={`transition-colors ${activeSection === "services" ? "text-primary font-bold" : "group-hover:text-primary"}`}>Services</span>
              <span className={`absolute bottom-0 left-2 right-2 h-0.5 bg-primary transition-all duration-300 ${activeSection === "services" ? "w-[calc(100%-1rem)]" : "w-0 group-hover:w-[calc(100%-1rem)]"}`}></span>
            </a>
            <a href="#about" className="relative group py-1 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-md transition-all">
              <span className={`transition-colors ${activeSection === "about" ? "text-primary font-bold" : "group-hover:text-primary"}`}>Concept</span>
              <span className={`absolute bottom-0 left-2 right-2 h-0.5 bg-primary transition-all duration-300 ${activeSection === "about" ? "w-[calc(100%-1rem)]" : "w-0 group-hover:w-[calc(100%-1rem)]"}`}></span>
            </a>
            <a href="#comments" className="relative group py-1 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-md transition-all">
              <span className={`transition-colors ${activeSection === "comments" ? "text-primary font-bold" : "group-hover:text-primary"}`}>Livre d'Or</span>
              <span className={`absolute bottom-0 left-2 right-2 h-0.5 bg-primary transition-all duration-300 ${activeSection === "comments" ? "w-[calc(100%-1rem)]" : "w-0 group-hover:w-[calc(100%-1rem)]"}`}></span>
            </a>
            <a href="#contact" className="relative group py-1 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-md transition-all">
              <span className={`transition-colors ${activeSection === "contact" ? "text-primary font-bold" : "group-hover:text-primary"}`}>Contact</span>
              <span className={`absolute bottom-0 left-2 right-2 h-0.5 bg-primary transition-all duration-300 ${activeSection === "contact" ? "w-[calc(100%-1rem)]" : "w-0 group-hover:w-[calc(100%-1rem)]"}`}></span>
            </a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
             <Button 
               variant="ghost" 
               className="hidden lg:flex rounded-md px-4 font-bold text-xs tracking-widest uppercase hover:bg-primary/5 transition-all text-[#a87f53] hover:text-[#a87f53]"
               onClick={() => setIsLookupOpen(true)}
             >
               Suivre mon soin
             </Button>
             <Button 
               variant="ghost" 
               className="hidden sm:flex rounded-md px-4 font-bold text-xs tracking-widest uppercase hover:bg-primary/5 transition-all"
               onClick={() => setIsLoginOpen(true)}
             >
               Se connecter
             </Button>
             <Button size="lg" className="rounded-md px-4 sm:px-8 text-xs sm:text-sm font-bold tracking-wider uppercase hover:shadow-lg hover:-translate-y-0.5 transition-all focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none ring-offset-background">
               <a href={whatsappUrl}>Réserver</a>
             </Button>
             <MobileNav onLoginClick={() => setIsLoginOpen(true)} onLookupClick={() => setIsLookupOpen(true)} />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[currentSlide].image}
                  alt={`Méli Empire SPA Hero - ${slides[currentSlide].title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-primary/60 transition-colors duration-1000" /> {/* Darker Solid Overlay for better text readability */}
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[350px] py-12 sm:py-20">
              
              {/* Left Column: Animated Text & CTAs */}
              <div className="max-w-2xl flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentSlide}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-6 sm:space-y-8"
                  >
                    <div className="inline-block px-3 sm:px-4 py-1.5 bg-primary text-primary-foreground text-xs sm:text-sm font-bold tracking-[0.2em] uppercase shadow-md">
                      {slides[currentSlide].badge}
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-7xl font-heading font-extrabold text-white leading-[1.1] drop-shadow-lg">
                      {slides[currentSlide].title} <br/><span className="block italic font-light drop-shadow-md">{slides[currentSlide].subtitle}</span>
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-white max-w-xl leading-relaxed font-medium drop-shadow-md">
                      {slides[currentSlide].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Fixed CTA Buttons */}
                <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 1, delay: 0.5 }}
                   className="flex flex-col sm:flex-row gap-4 pt-8 sm:pt-10"
                >
                  <Button size="xl" className="w-full sm:w-auto h-14 sm:h-16 px-6 sm:px-10 rounded-md text-sm sm:text-lg font-bold uppercase tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                    <a href="#contact">Prendre Rendez-vous</a>
                  </Button>
                  <div className="w-full sm:w-auto inline-flex h-14 sm:h-16 px-6 sm:px-10 items-center justify-center rounded-md bg-white/10 text-white border-white/50 border hover:bg-white hover:text-primary text-sm sm:text-lg font-bold uppercase tracking-wide transition-all cursor-pointer backdrop-blur-sm shadow-xl">
                    <a href="#services">Nos Soins</a>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Glass Card (Minimalist approach without cutout image) */}
              <motion.div 
                 initial={{ opacity: 0, x: 30 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 1, delay: 0.8 }}
                 className="hidden lg:flex justify-end items-center relative"
              >
                 <div className="relative w-full max-w-md mt-10">
                   {/* Glassmorphism Information Card */}
                   <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl overflow-hidden group">
                     {/* Glossy Reflection */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                     
                     <div className="space-y-6 relative z-10">
                       <div className="flex items-center gap-4 border-b border-white/20 pb-4">
                         <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                           <Clock className="w-6 h-6 text-white" />
                         </div>
                         <div>
                           <p className="text-white/80 text-sm uppercase tracking-widest font-bold">Disponibilité</p>
                           <p className="text-white font-medium text-lg min-w-max">7j/7 • 09:00 - 20:00</p>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-4 border-b border-white/20 pb-4">
                         <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                           <ShieldCheck className="w-6 h-6 text-white" />
                         </div>
                         <div>
                           <p className="text-white/80 text-sm uppercase tracking-widest font-bold">Matériel Inclus</p>
                           <p className="text-white font-medium text-lg min-w-max">Table chauffante & Linge</p>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-4 pt-2">
                         <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                           <MapPin className="w-6 h-6 text-white" />
                         </div>
                         <div>
                           <p className="text-white/80 text-sm uppercase tracking-widest font-bold">Déplacement</p>
                           <p className="text-white font-medium text-lg min-w-max">À votre domicile / Hôtel</p>
                         </div>
                       </div>
                     </div>
                   </div>
                   
                   {/* Background Glow */}
                   <div className="absolute -inset-4 bg-primary/30 blur-3xl -z-10 rounded-full opacity-60" />
                 </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* À Propos Section - The Story */}
        <section id="story" className="py-20 md:py-32 bg-secondary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-xs sm:text-sm font-bold tracking-[0.4em] uppercase text-primary">L&apos;Héritage</h2>
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight" style={{ fontFamily: "Cinzel, serif" }}>
                    {conceptTitle}
                  </h2>
                  <div className="w-24 h-1 bg-[#C5A059] mb-8" />
                </div>
                
                <div className="space-y-6 text-lg text-foreground/80 leading-relaxed font-light">
                  <p>
                    {conceptText}
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-secondary/20 overflow-hidden shadow-md">
                        <Image src={`/hero-${(i%3)+1}.png`} alt="Client" width={48} height={48} className="object-cover h-full" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest text-primary">
                    +500 Clients Comblés
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative"
              >
                <div className="relative aspect-[3/2] rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-primary/10">
                  <Image 
                    src="/spa-hero.png" 
                    alt="L'expérience Méli Empire" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                  
                  {/* Floating Badge */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-primary/10 z-20 max-w-[200px]"
                  >
                    <Star className="w-8 h-8 text-secondary mb-2" fill="currentColor" />
                    <p className="font-heading font-bold text-primary text-lg">Qualité Palace</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Standards Certifiés</p>
                  </motion.div>
                </div>
                
                {/* Decorative element */}
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        <section id="services" className="py-20 md:py-32 relative overflow-hidden bg-background">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-1/4 h-full bg-secondary/5 skew-x-12 -translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6 }}
               className="text-center space-y-4 mb-12 sm:mb-16"
            >
              <h2 className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-primary">Nos Rituels de Soin</h2>
              <p className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground">Soins Professionnels d'Excellence</p>
              <div className="w-16 sm:w-24 h-1 bg-primary mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.filter(s => s.isActive).map((service, i) => (
                <Card key={i} className="rounded-xl border-0 ring-1 ring-border/20 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden bg-card">
                  <div className="relative h-48 overflow-hidden">
                    <Image 
                      src={service.image} 
                      alt={service.title} 
                      fill 
                      className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <CardTitle className="text-lg font-bold uppercase tracking-wide min-h-[3.5rem] flex items-center">{service.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                      {service.duration && service.duration !== "-" && (
                        <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{service.duration}</span>
                        </div>
                      )}
                      {service.price && service.price !== "-" && (
                        <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20">
                          <Tag className="w-3.5 h-3.5" />
                          <span>{service.price}</span>
                        </div>
                      )}
                    </div>
                    <CardDescription className="text-sm leading-relaxed text-foreground/80">
                      {service.description || service.desc}
                    </CardDescription>
                    <div className="flex justify-center items-center pt-4 border-t border-border/50">
                      <Button 
                        variant="link" 
                        className="p-0 font-bold uppercase text-xs tracking-widest text-[#25D366] w-full"
                        onClick={() => {
                          setBookingFormData(prev => ({ ...prev, service: service.title }));
                          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Réserver ce soin
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Bio Products Highlight Section */}
        <section className="py-16 bg-secondary/10 relative overflow-hidden border-y border-primary/5">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-1/2 right-0 w-1/3 h-1/2 bg-primary/5 -skew-y-12 translate-x-1/4 pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Droplets className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">Huile de Menthe</h4>
                  <p className="text-xs text-muted-foreground italic">Fraîcheur et relaxation intense</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">Huile Cocktail</h4>
                  <p className="text-xs text-muted-foreground italic">Amande, coco, pomme</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-foreground">Huile de Rose</h4>
                  <p className="text-xs text-muted-foreground italic">Douceur et apaisement</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Us Section - Bento Grid Concept */}
        <section id="about" className="py-16 md:py-24 bg-background overflow-hidden relative">
          <div className="container mx-auto px-4 relative z-10 max-w-6xl">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left space-y-4 mb-12 sm:mb-16"
            >
              <h2 className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-primary">Le Concept</h2>
              <p className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-foreground leading-tight">
                Pourquoi choisir <br className="hidden md:block"/><span className="text-primary italic">Méli Empire ?</span>
              </p>
            </motion.div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:grid-rows-[300px_300px_auto]">
              
              {/* Tile 1: L'Expérience Intégrale (Large, Image Background) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute inset-0 z-0">
                  <Image src="/hero-1.png" fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="Matériel de Spa" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/40 to-transparent z-10" />
                <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end z-20">
                  <ShieldCheck className="w-12 h-12 text-secondary mb-4 drop-shadow-md" />
                  <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide mb-3 text-white">L&apos;Expérience Intégrale</h3>
                  <p className="text-white/90 leading-relaxed text-base sm:text-lg max-w-md">
                    Vous ne fournissez que l&apos;espace. Nous apportons la table ergonomique, le linge luxueux, les huiles chaudes bio et l&apos;ambiance musicale pour transformer votre intérieur.
                  </p>
                </div>
              </motion.div>

              {/* Tile 2: Prolongez la Détente (Text Card/Solid background) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-primary rounded-3xl p-8 sm:p-10 text-primary-foreground flex flex-col justify-center shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 group"
              >
                <Clock className="w-10 h-10 text-secondary mb-6 group-hover:rotate-12 transition-transform duration-500" />
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wide mb-3">Zéro Transports</h3>
                <p className="text-primary-foreground/80 leading-relaxed text-sm sm:text-base">
                  Le summum du luxe ? Garder les yeux mi-clos après le soin, sans avoir à reprendre le volant ou affronter la ville. Prolongez la détente chez vous indéfiniment.
                </p>
              </motion.div>

              {/* Tile 3: Detailed Image / Vibe */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative rounded-3xl overflow-hidden shadow-xl group"
              >
                 <div className="absolute inset-0 z-0">
                  <Image src="/hero-3.png" fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt="Ambiance Spa" />
                 </div>
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
              </motion.div>

              {/* Tile 4: Flexibilité & Discrétion (Wide bottom) */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm hover:bg-slate-100 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wide mb-3 text-primary">Flexibilité Totale</h3>
                  <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                    À domicile, en suite d&apos;hôtel ou au bureau. Nos équipes s&apos;adaptent à votre emploi du temps 7j/7, avec une discrétion absolue et un strict respect de votre intimité.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Coverage Zones Section */}
        <section className="py-12 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Nos Zones d'Intervention en Côte d'Ivoire</h3>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
              {['Abidjan (Toutes communes)', 'Marcory', 'Cocody', 'Yopougon', 'Plateau', 'Treichville', 'Bingerville', 'Grand-Bassam'].map((zone, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-white border border-primary/20 text-foreground px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-primary hover:text-white transition-colors cursor-default"
                >
                  {zone}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-32 bg-background relative overflow-hidden">
          <div className="absolute top-0 left-1/2 w-full h-full bg-secondary/5 -skew-x-12 -translate-x-1/2 pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-primary">Preuves Sociales</h2>
              <p className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground">Ce que disent nos clients</p>
              <div className="w-16 sm:w-24 h-1 bg-primary mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Sophie L.", text: "Une expérience incroyable. Avoir le luxe d'un vrai spa qui s'installe dans mon salon après une longue semaine, ça n'a pas de prix. Le praticien était très professionnel." },
                { name: "Marc T.", text: "J'utilise ce service de récupération musculaire après mes entraînements. Le fait de pouvoir m'endormir directement chez moi post-massage change la donne." },
                { name: "Élodie P.", text: "Hygiène parfaite, discrétion absolue et un matériel haut de gamme. Méli Empire a su créer une vraie bulle hors du temps. Je recommande les yeux fermés." },
              ].map((review, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="bg-card p-8 rounded-2xl border border-border/30 shadow-lg shadow-primary/5 relative hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
                  <div className="flex gap-1 mb-4 text-[#F59E0B]">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="italic text-muted-foreground mb-6 leading-relaxed">"{review.text}"</p>
                  <p className="font-bold text-sm tracking-widest uppercase text-primary">- {review.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comments Section */}
        <CommentsSection />

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-secondary/5 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-1/3 h-full bg-primary/5 skew-x-12 translate-x-1/2 pointer-events-none" />
          <div className="container mx-auto px-4 max-w-3xl relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 space-y-4"
            >
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Questions Fréquentes</h2>
              <p className="text-3xl md:text-5xl font-heading font-bold">Tout ce qu'il faut savoir</p>
              <div className="w-16 h-1 bg-primary mx-auto" />
            </motion.div>
            
            <div className="space-y-4">
              {((faqItems?.filter(f => f.isActive).length ? faqItems.filter(f => f.isActive) : null) || [
                {
                  question: "Comment se passe une séance à domicile ?",
                  answer: "C'est très simple : nous arrivons 10 à 15 minutes avant l'heure du rendez-vous pour installer tout le matériel (table de massage chauffante, linge de palace, musique et huiles). Vous n'avez qu'à préparer un espace suffisant pour la table. À la fin, nous remballons tout discrètement."
                },
                {
                  question: "Dois-je fournir des serviettes ?",
                  answer: "Absolument pas. Méli Empire apporte tout le nécessaire : linge de bain en coton premium, serviettes jetables, et même des chaussons pour votre confort total."
                },
                {
                  question: "Quelles sont vos zones de déplacement ?",
                  answer: "Nous nous déplaçons en Côte d'Ivoire, partout à Abidjan, ainsi que dans les communes de Marcory, Cocody, Yopougon, Bassam, etc."
                },
                {
                  question: "Quels sont les moyens de paiement acceptés ?",
                  answer: "Nous acceptons les paiements via Wave, Orange Money, Moov Money et MTN Money."
                },
                {
                  question: "Puis-je offrir un soin en cadeau ?",
                  answer: "Oui ! Nous proposons des bons cadeaux digitaux élégants. Contactez-nous via WhatsApp pour personnaliser votre cadeau et nous l'enverrons directement au destinataire."
                }
              ]).map((faq, i) => (
                <FaqItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-card rounded-2xl p-6 md:p-12 shadow-2xl ring-1 ring-border/50 relative overflow-hidden">
                <div className="space-y-6 sm:space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary uppercase tracking-tight">Réservez votre Cocon</h2>
                    <p className="text-muted-foreground text-base sm:text-lg italic">Prêt(e) pour la détente absolue chez vous ? Remplissez ce formulaire et l&apos;équipe organisera votre séance via WhatsApp.</p>
                  </div>
                  
                  <div className="space-y-4 text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <span>{contactPhone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <span>Disponible via WhatsApp 24/7</span>
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-8 hidden sm:block">
                     {/* Placeholder if we want to add an image or badge here instead of the button */}
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="uppercase font-bold tracking-widest text-xs">Nom Complet *</Label>
                    <Input 
                      id="name" 
                      placeholder="Votre nom..." 
                      className="rounded-md border focus-visible:ring-primary h-14 shadow-sm bg-background"
                      value={bookingFormData.name}
                      onChange={(e) => setBookingFormData({...bookingFormData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="uppercase font-bold tracking-widest text-xs">Téléphone *</Label>
                    <Input 
                      id="phone" 
                      placeholder="Votre numéro..." 
                      className="rounded-md border focus-visible:ring-primary h-14 shadow-sm bg-background"
                      value={bookingFormData.phone}
                      onChange={(e) => setBookingFormData({...bookingFormData, phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="service" className="uppercase font-bold tracking-widest text-xs">Soin Choisi</Label>
                    <Select value={bookingFormData.service} onValueChange={(value) => setBookingFormData({...bookingFormData, service: value ?? ""})}>
                      <SelectTrigger className="w-full h-14 rounded-md border shadow-sm bg-background">
                        <SelectValue placeholder="Sélectionnez un soin" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service, i) => (
                          <SelectItem key={i} value={service.title} className="hover:bg-primary/5 focus:bg-primary/5 cursor-pointer py-3">
                            <span className="font-medium text-foreground">{service.title}</span>
                          </SelectItem>
                        ))}
                        <SelectItem value="Autre / Sur-mesure">Autre / Sur-mesure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="uppercase font-bold tracking-widest text-xs">Date souhaitée</Label>
                      <Input 
                        id="date" 
                        type="date"
                        className="rounded-md border focus-visible:ring-primary h-14 shadow-sm bg-background"
                        value={bookingFormData.date}
                        onChange={(e) => setBookingFormData({...bookingFormData, date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="uppercase font-bold tracking-widest text-xs">Heure</Label>
                      <Input 
                        id="time" 
                        type="time" 
                        className="rounded-md border focus-visible:ring-primary h-14 shadow-sm bg-background"
                        value={bookingFormData.time}
                        onChange={(e) => setBookingFormData({...bookingFormData, time: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="uppercase font-bold tracking-widest text-xs">Précisions utiles</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Ex: Le code porte est 1234, merci de m'appeler en arrivant..." 
                      className="rounded-md border focus-visible:ring-primary min-h-[100px] shadow-sm bg-background"
                      value={bookingFormData.message}
                      onChange={(e) => setBookingFormData({...bookingFormData, message: e.target.value})}
                    />
                  </div>
                  
                  <Button type="submit" size="xl" className="w-full h-14 rounded-lg bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-sm tracking-widest uppercase gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all mt-4">
                    <MessageCircle className="w-5 h-5 shrink-0" />
                    Réserver sur WhatsApp
                  </Button>
                  
                  <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground mt-4 animate-pulse font-bold">
                    ⚡ Réponse ultra-rapide via WhatsApp
                  </p>

                  <p className="text-[10px] text-muted-foreground uppercase leading-relaxed text-center">
                    * Vous serez redirigé vers WhatsApp avec un message pré-rempli. 
                    Aucune donnée n&apos;est stockée de notre côté.
                  </p>
                </form>
             </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="pt-20 pb-10 bg-[#0f1629] text-white overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Col 1: Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Image src="/logo.svg" alt="Footer Logo" width={50} height={50} className="brightness-200" />
                <span className="font-heading font-bold text-xl uppercase tracking-widest text-white">Méli Empire</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed max-w-xs italic">
                L'excellence du bien-être transportée directement chez vous. Une expérience de palace, l'intimité de votre foyer.
              </p>
              <div className="flex gap-4 pt-2">
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#C5A059] hover:border-[#C5A059] transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#C5A059] hover:border-[#C5A059] transition-all">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-6">
              <h4 className="text-[#C5A059] font-bold uppercase tracking-widest text-xs">Navigation</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="text-white/90 hover:text-[#C5A059] transition-colors flex items-center gap-2">Accueil</a></li>
                <li><a href="#story" className="text-white/90 hover:text-[#C5A059] transition-colors flex items-center gap-2">À Propos</a></li>
                <li><a href="#services" className="text-white/90 hover:text-[#C5A059] transition-colors flex items-center gap-2">Nos Soins</a></li>
                <li><a href="#faq" className="text-white/90 hover:text-[#C5A059] transition-colors flex items-center gap-2">FAQ</a></li>
                <li><Link href="/dossier" className="text-white/50 hover:text-[#C5A059] transition-colors flex items-center gap-2 text-[10px] mt-4 pt-4 border-t border-white/5">Dossier Projet</Link></li>
              </ul>
            </div>

            {/* Col 3: Informations */}
            <div className="space-y-6">
              <h4 className="text-[#C5A059] font-bold uppercase tracking-widest text-xs">Informations Pratiques</h4>
              <ul className="space-y-4 text-sm font-medium">
                {siteSettings?.opening_hours && (
                  <li className="text-white/80 flex flex-col gap-1">
                    <span className="text-[#C5A059] text-xs uppercase tracking-widest">Horaires</span>
                    <span>{siteSettings.opening_hours}</span>
                  </li>
                )}
                {siteSettings?.booking_notice && (
                  <li className="text-white/80 flex flex-col gap-1">
                    <span className="text-[#C5A059] text-xs uppercase tracking-widest">Réservation</span>
                    <span>{siteSettings.booking_notice}</span>
                  </li>
                )}
                {!siteSettings?.opening_hours && !siteSettings?.booking_notice && (
                  <>
                    <li className="text-white/80">Massages Relaxant & Tonifiant</li>
                    <li className="text-white/80">Soins Spécial Méli Empire</li>
                    <li className="text-white/80">Pédicure & Manucure</li>
                    <li className="text-white/80">Sauna, Épilation & Piercing</li>
                  </>
                )}
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div className="space-y-6">
              <h4 className="text-[#C5A059] font-bold uppercase tracking-widest text-xs">Nous contacter</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-[#C5A059] shrink-0" />
                  <div className="text-sm">
                    <p className="text-white font-bold">Téléphone / WhatsApp</p>
                    <p className="text-white/90">{contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#C5A059] shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <div className="text-sm">
                    <p className="text-white font-bold">Email</p>
                    <p className="text-white/90">{contactEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[#C5A059] shrink-0" />
                  <div className="text-sm">
                    <p className="text-white font-bold">Zones couvertes</p>
                    <p className="text-white/90">Côte d'Ivoire (Abidjan, Marcory, Cocody...)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60 uppercase tracking-[0.2em]">
            <p>{siteSettings?.footer_copyright || `© ${new Date().getFullYear()} Méli Empire SPA. Design & Code by Luxury Creative.`}</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <Link href="/admin" className="hover:text-[#C5A059] transition-colors text-white/40 hover:text-white">Administration</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal Integration */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />

      {/* Receipt Modal Integration */}
      <ReceiptModal
        isOpen={!!activeReservation}
        onClose={() => setActiveReservation(null)}
        reservation={activeReservation}
        servicesList={services}
        siteSettings={siteSettings}
      />

      {/* Lookup Modal Integration */}
      <LookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onSuccess={(reservation) => {
          setIsLookupOpen(false);
          setActiveReservation(reservation);
        }}
      />

      {/* Floating WhatsApp Button */}
      <motion.a
        href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent("Bonjour Méli Empire ! Je souhaite avoir des informations sur vos soins.")}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:bg-[#128C7E] transition-colors"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary"></span>
        </span>
      </motion.a>
    </div>
  );
}
function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-white/50 dark:bg-card/30 transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-primary/5 transition-colors"
      >
        <span className="font-bold text-sm tracking-wide uppercase text-foreground/90">{question}</span>
        <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground border-t border-border/10 pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
