"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquareQuote, Send, Loader2, CheckCircle2 } from "lucide-react";

type Comment = {
  id: number;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
};

export default function CommentsSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [formData, setFormData] = useState({ name: "", text: "", rating: 5 });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/comments");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", text: "", rating: 5 });
        // Don't update comments list immediately because it needs moderation
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="comments" className="py-20 md:py-32 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 skew-x-12 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-primary">Livre d&apos;Or</h2>
          <p className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground">Vos Avis & Messages</p>
          <div className="w-16 sm:w-24 h-1 bg-primary mx-auto" />
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Découvrez les retours de nos clients ou laissez-nous un message pour partager votre expérience Méli Empire.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Comments List (Left Side) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-bold font-heading uppercase tracking-wide flex items-center gap-2 mb-6">
              <MessageSquareQuote className="w-6 h-6 text-primary" />
              Derniers Commentaires
            </h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                </div>
              ) : comments.length > 0 ? (
                <AnimatePresence>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card p-6 rounded-2xl border border-border/40 shadow-sm hover:shadow-md transition-shadow relative"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-base sm:text-lg text-foreground">{comment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex gap-1 text-[#F59E0B]">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${star <= comment.rating ? "fill-current" : "text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        "{comment.text}"
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <div className="text-center py-10 bg-muted/20 rounded-2xl border border-dashed">
                  <p className="text-muted-foreground italic">Soyez le premier à laisser un message !</p>
                </div>
              )}
            </div>
          </div>

          {/* Leave a Comment Form (Right Side) */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-primary/5 border border-primary/10 rounded-3xl p-8 sticky top-24"
            >
              <h3 className="text-xl font-bold font-heading uppercase tracking-wide mb-6">Laissez un message</h3>
              
              {submitStatus === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-10 space-y-4"
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                  <p className="font-bold text-lg">Merci pour votre message !</p>
                  <p className="text-sm text-muted-foreground">Il sera affiché publiquement après validation par notre équipe.</p>
                  <Button variant="outline" onClick={() => setSubmitStatus("idle")}>Envoyer un autre message</Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="visitor-name" className="uppercase font-bold tracking-widest text-xs">Votre Nom</Label>
                    <Input
                      id="visitor-name"
                      placeholder="Comment vous appelez-vous ?"
                      className="bg-background/80 backdrop-blur-sm border-white/20 focus-visible:ring-primary"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="uppercase font-bold tracking-widest text-xs">Note</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              star <= (hoveredStar || formData.rating)
                                ? "fill-[#F59E0B] text-[#F59E0B]"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visitor-message" className="uppercase font-bold tracking-widest text-xs">Votre Message</Label>
                    <Textarea
                      id="visitor-message"
                      placeholder="Partagez votre expérience avec nous..."
                      className="bg-background/80 backdrop-blur-sm border-white/20 focus-visible:ring-primary min-h-[120px]"
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      required
                    />
                  </div>

                  {submitStatus === "error" && (
                    <p className="text-red-500 text-xs text-center font-medium">Une erreur est survenue. Veuillez réessayer.</p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isSubmitting ? "Envoi..." : "Publier"}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Small inline style for custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(var(--primary), 0.2);
          border-radius: 20px;
        }
      `}} />
    </section>
  );
}
