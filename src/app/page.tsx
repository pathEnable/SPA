"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";
import LoginModal from "@/components/LoginModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Phone, MapPin, Clock, Star, ShieldCheck, Quote, ChevronDown, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const whatsappUrl = "https://wa.me/2290141585780?text=Bonjour%20Méli%20Empire,%20je%20souhaite%20réserver%20un%20soin."; 

  const slides = [
    {
      image: "/hero-1.png",
      badge: "Votre Spa Privé à Domicile",
      title: "L'excellence du Spa,",
      subtitle: "sans bouger de chez vous.",
      description: "Oubliez les déplacements et le stress de la ville. Méli Empire déplace l'ambiance, le matériel et le savoir-faire d'un institut prestigieux directement dans votre salon."
    },
    {
      image: "/hero-2.png",
      badge: "Beauté & Éclat",
      title: "Révélez votre éclat",
      subtitle: "avec nos soins sur-mesure.",
      description: "Des rituels du visage adaptés à vos besoins. Produits sublimes et mains expertes pour une peau lumineuse, purifiée et profondément repulpée."
    },
    {
      image: "/hero-3.png",
      badge: "Sérénité Absolue",
      title: "Une parenthèse de sérénité",
      subtitle: "directement à votre porte.",
      description: "Pierres chaudes, huiles essentielles et bougies parfumées : nous recréons une atmosphère envoûtante pour vous permettre de lâcher prise totalement."
    }
  ];

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
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300">
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
            <a href="#" className="relative group py-1 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-md transition-all">
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
            <a href="#contact" className="relative group py-1 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-md transition-all">
              <span className={`transition-colors ${activeSection === "contact" ? "text-primary font-bold" : "group-hover:text-primary"}`}>Contact</span>
              <span className={`absolute bottom-0 left-2 right-2 h-0.5 bg-primary transition-all duration-300 ${activeSection === "contact" ? "w-[calc(100%-1rem)]" : "w-0 group-hover:w-[calc(100%-1rem)]"}`}></span>
            </a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
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
             <MobileNav onLoginClick={() => setIsLoginOpen(true)} />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
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
                  <p className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-foreground leading-[1.1]">
                    L&apos;Essence de <br/><span className="text-primary italic">Méli Empire</span>
                  </p>
                </div>
                
                <div className="space-y-6 text-lg text-foreground/80 leading-relaxed font-light">
                  <p>
                    Plus qu&apos;un simple service de soin, <span className="font-bold text-primary italic">Méli Empire</span> est né d&apos;une vision audacieuse : transcender les murs des instituts traditionnels pour apporter le luxe absolu là où vous êtes le plus serein — <span className="underline decoration-primary/30 underline-offset-8">chez vous</span>.
                  </p>
                  <p>
                    Chaque rituel est une symphonie sensorielle orchestrée avec une précision d&apos;orfèvre. Nous ne déplaçons pas seulement du matériel ; nous transportons une âme, une atmosphère et un savoir-faire d&apos;excellence qui font de chaque séance un moment hors du temps.
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

        {/* Services Section */}
        <section id="services" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6 }}
               className="text-center space-y-4 mb-12 sm:mb-16"
            >
              <h2 className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-primary">Nos Rituels de Soin</h2>
              <p className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground">Une Expérience Sensorielle</p>
              <div className="w-16 sm:w-24 h-1 bg-primary mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="rounded-xl border-0 ring-1 ring-border/20 shadow-xl shadow-primary/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors duration-500" />
                    <div className="flex items-center justify-center h-full bg-secondary/30">
                       <Star className="w-12 h-12 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <CardTitle className="text-2xl font-bold uppercase tracking-wide">Le Relaxant Impérial</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-foreground/80">
                    Notre soin signature à domicile. Un massage suédois profond enveloppant pour libérer vos tensions nerveuses et restaurer votre énergie vitale.
                  </CardDescription>
                  <div className="flex justify-between items-center pt-4 border-t border-border/50">
                    <span className="font-bold text-primary">60 / 90 min</span>
                    <Button variant="link" className="p-0 font-bold uppercase text-xs tracking-widest text-[#25D366]"><a href={whatsappUrl}>Réserver</a></Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-0 ring-1 ring-border/20 shadow-xl shadow-primary/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden bg-secondary/10">
                <CardHeader className="p-0">
                   <div className="relative h-48 sm:h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors duration-500" />
                    <div className="flex items-center justify-center h-full bg-secondary/30">
                       <Star className="w-12 h-12 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <CardTitle className="text-2xl font-bold uppercase tracking-wide">L&apos;Éveil des Sens</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-foreground/80">
                    Plongez dans votre espace embaumé. L&apos;utilisation d&apos;huiles essentielles chaudes et rares pour revitaliser le corps en douceur dans votre cocon.
                  </CardDescription>
                  <div className="flex justify-between items-center pt-4 border-t border-border/50">
                    <span className="font-bold text-primary">60 min</span>
                    <Button variant="link" className="p-0 font-bold uppercase text-xs tracking-widest text-[#25D366]"><a href={whatsappUrl}>Réserver</a></Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl border-0 ring-1 ring-border/20 shadow-xl shadow-primary/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden">
                <CardHeader className="p-0">
                   <div className="relative h-48 sm:h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors duration-500" />
                    <div className="flex items-center justify-center h-full bg-secondary/30">
                       <Star className="w-12 h-12 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <CardTitle className="text-2xl font-bold uppercase tracking-wide">Récupération Profonde</CardTitle>
                  <CardDescription className="text-base leading-relaxed text-foreground/80">
                    L&apos;idéal post-effort. Un travail musculaire appuyé pratiqué confortablement sur notre table pro pour soulager vos courbatures depuis chez vous.
                  </CardDescription>
                  <div className="flex justify-between items-center pt-4 border-t border-border/50">
                    <span className="font-bold text-primary">90 min</span>
                    <Button variant="link" className="p-0 font-bold uppercase text-xs tracking-widest text-[#25D366]"><a href={whatsappUrl}>Réserver</a></Button>
                  </div>
                </CardContent>
              </Card>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
              
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
                className="md:col-span-2 bg-secondary/10 border border-secondary/20 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 shadow-xl hover:bg-secondary/20 transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
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


        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-secondary/10">
          <div className="container mx-auto px-4">
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

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-secondary/5">
          <div className="container mx-auto px-4 max-w-3xl">
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
              <FaqItem 
                question="Comment se passe une séance à domicile ?" 
                answer="C'est très simple : nous arrivons 10 à 15 minutes avant l'heure du rendez-vous pour installer tout le matériel (table de massage chauffante, linge de palace, musique et huiles). Vous n'avez qu'à préparer un espace suffisant pour la table. À la fin, nous remballons tout discrètement."
              />
              <FaqItem 
                question="Dois-je fournir des serviettes ?" 
                answer="Absolument pas. Méli Empire apporte tout le nécessaire : linge de bain en coton premium, serviettes jetables, et même des chaussons pour votre confort total."
              />
              <FaqItem 
                question="Quelles sont vos zones de déplacement ?" 
                answer="Nous nous déplaçons actuellement dans tout Cotonou, Calavi et les zones hôtelières environnantes. Pour des zones plus éloignées, des frais de transport minimes peuvent s'appliquer."
              />
              <FaqItem 
                question="Quels sont les moyens de paiement acceptés ?" 
                answer="Nous acceptons les paiements en espèces à la fin du soin, ainsi que les transferts Mobile Money (Moov Money, MTN Mobile Money) pour plus de simplicité."
              />
              <FaqItem 
                question="Puis-je offrir un soin en cadeau ?" 
                answer="Oui ! Nous proposons des bons cadeaux digitaux élégants. Contactez-nous via WhatsApp pour personnaliser votre cadeau et nous l'enverrons directement au destinataire."
              />
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
                      <span>+229 01 41 58 57 80</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <span>Disponible via WhatsApp 24/7</span>
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-8">
                     <Button size="xl" className="w-full h-14 sm:h-16 rounded-lg bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-sm sm:text-lg gap-2 sm:gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all whitespace-normal leading-tight">
                        <a href={whatsappUrl} className="flex items-center justify-center gap-2 sm:gap-3 w-full h-full">
                          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                          <span className="text-center">Chat WhatsApp Direct</span>
                        </a>
                     </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="uppercase font-bold tracking-widest text-xs">Nom Complet</Label>
                    <Input id="name" placeholder="Votre nom..." className="rounded-md border focus-visible:ring-primary h-14 shadow-sm bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="uppercase font-bold tracking-widest text-xs">Téléphone</Label>
                    <Input id="phone" placeholder="Votre numéro..." className="rounded-md border focus-visible:ring-primary h-14 shadow-sm bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="uppercase font-bold tracking-widest text-xs">Soin souhaité / Message</Label>
                    <Textarea id="message" placeholder="Ex: Massage Relaxant 90min ce samedi à 14h..." className="rounded-md border focus-visible:ring-primary min-h-[120px] shadow-sm bg-background" />
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase leading-relaxed">
                    * En cliquant sur le bouton ci-dessus, vous serez redirigé vers WhatsApp pour finaliser votre réservation. 
                    Aucune donnée n&apos;est stockée inutilement.
                  </p>
                </div>
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
              <p className="text-white/60 text-sm leading-relaxed max-w-xs italic">
                L'excellence du bien-être transportée directement chez vous. Une expérience de palace, l'intimité de votre foyer.
              </p>
              <div className="flex gap-4 pt-2">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-6">
              <h4 className="text-primary font-bold uppercase tracking-widest text-xs">Navigation</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="text-white/70 hover:text-primary transition-colors flex items-center gap-2">Accueil</a></li>
                <li><a href="#story" className="text-white/70 hover:text-primary transition-colors flex items-center gap-2">À Propos</a></li>
                <li><a href="#services" className="text-white/70 hover:text-primary transition-colors flex items-center gap-2">Nos Soins</a></li>
                <li><a href="#faq" className="text-white/70 hover:text-primary transition-colors flex items-center gap-2">FAQ</a></li>
              </ul>
            </div>

            {/* Col 3: Services */}
            <div className="space-y-6">
              <h4 className="text-primary font-bold uppercase tracking-widest text-xs">Nos Rituels</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li className="text-white/70">Le Relaxant Impérial</li>
                <li className="text-white/70">L&apos;Éveil des Sens</li>
                <li className="text-white/70">Récupération Profonde</li>
                <li className="text-white/70">Soins Signature Visage</li>
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div className="space-y-6">
              <h4 className="text-primary font-bold uppercase tracking-widest text-xs">Nous contacter</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <div className="text-sm">
                    <p className="text-white font-bold">Téléphone / WhatsApp</p>
                    <p className="text-white/60">+229 01 41 58 57 80</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <div className="text-sm">
                    <p className="text-white font-bold">Zones couvertes</p>
                    <p className="text-white/60">Cotonou & Calavi (Bénin)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-primary">
                  <ExternalLink className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-bold border-b border-primary/30 py-0.5">Réserver sur WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/30 uppercase tracking-[0.2em]">
            <p>© {new Date().getFullYear()} Méli Empire SPA. Design & Code by Luxury Creative.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal Integration */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
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
