import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding Méli Empire data...");

  // 1. Hero Slides
  const slides = [
    {
      image: "/hero-1.png",
      badge: "Spa à Domicile • Abidjan",
      title: "L'excellence du Spa,",
      subtitle: "partout à Abidjan.",
      description: "Méli Empire déplace l'ambiance et le savoir-faire d'un institut prestigieux directement chez vous, de Marcory à Cocody en passant par Bassam.",
      order: 0,
      isActive: true
    },
    {
      image: "/hero-2.png",
      badge: "Beauté & Éclat • Côte d'Ivoire",
      title: "Révélez votre éclat",
      subtitle: "sans sortir de chez vous.",
      description: "Profitez de nos soins professionnels (Massage, Pédicure, Manucure) dans le confort et l'intimité de votre foyer à Abidjan.",
      order: 1,
      isActive: true
    },
    {
      image: "/hero-3.png",
      badge: "Bien-être Absolu • 7j/7",
      title: "Votre cocon privé,",
      subtitle: "où que vous soyez.",
      description: "Nous intervenons dans toutes les communes d'Abidjan et Bassam pour vous offrir une parenthèse de sérénité totale.",
      order: 2,
      isActive: true
    }
  ];

  for (const slide of slides) {
    await prisma.heroSlide.upsert({
      where: { id: slides.indexOf(slide) + 1 }, // Simple ID mapping for upsert if not unique by image
      update: slide,
      create: slide,
    });
  }

  // 2. Services
  const services = [
    { title: "Massage Relaxant", price: "20.000 FCFA", duration: "60 min", description: "Un massage doux pour détendre tout le corps et évacuer le stress de la journée.", image: "/massage-relaxant.png", order: 0, isActive: true },
    { title: "Massage Tonifiant", price: "30.000 FCFA", duration: "1h", description: "Un massage plus appuyé pour redonner de l'énergie et détendre les muscles en profondeur.", image: "/massage-tonifiant.png", order: 1, isActive: true },
    { title: "Massage Spécial Méli Empire", price: "40.000 FCFA", duration: "1h 30m", description: "Notre meilleur massage, qui mélange des mouvements relaxants et tonifiants pour un résultat complet.", image: "/massage-special.png", order: 2, isActive: true },
    { title: "Massage pour Personnes Âgées", price: "25.000 FCFA", duration: "1h", description: "Un massage très doux et adapté aux besoins des seniors pour soulager les douleurs.", image: "/massage-senior.png", order: 3, isActive: true },
    { title: "Pédicure", price: "10.000 FCFA", duration: "1h 30m", description: "Un soin complet pour nettoyer, soigner et embellir vos pieds.", image: "/pedicure.png", order: 4, isActive: true },
    { title: "Manucure", price: "5.000 FCFA", duration: "30 min", description: "Un soin pour nettoyer vos mains et prendre soin de vos ongles.", image: "/manucure.png", order: 5, isActive: true },
    { title: "Sauna", price: "15.000 FCFA", duration: "45 min", description: "Une séance de chaleur pour nettoyer la peau et se détendre.", image: "/hero-3.png", order: 6, isActive: true },
    { title: "Épilation", price: "À partir de 7.000 FCFA", duration: "-", description: "Pour enlever les poils et avoir une peau bien lisse.", image: "/hero-2.png", order: 7, isActive: true },
    { title: "Piercing", price: "À partir de 5.000 FCFA", duration: "15m et +", description: "Pose de piercing propre et soignée, avec un respect total de l'hygiène.", image: "/hero-1.png", order: 8, isActive: true },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: services.indexOf(service) + 1 },
      update: service,
      create: service,
    });
  }

  // 3. FAQ Items
  const faqs = [
    { question: "Comment prendre rendez-vous ?", answer: "C'est très simple ! Vous pouvez cliquer sur le bouton 'Réserver' pour nous envoyer un message direct sur WhatsApp, ou nous appeler directement. Nous conviendrons ensemble de l'heure et du lieu.", order: 0, isActive: true },
    { question: "Où vous déplacez-vous ?", answer: "Nous intervenons partout à Abidjan (Marcory, Cocody, Riviera, Plateau, Yopougon, Koumassi...) ainsi qu'à Grand-Bassam.", order: 1, isActive: true },
    { question: "Apportez-vous le matériel ?", answer: "Oui, nous apportons tout le nécessaire : table de massage professionnelle, serviettes propres, huiles essentielles et même une petite enceinte pour la musique d'ambiance.", order: 2, isActive: true },
    { question: "Quels sont vos horaires ?", answer: "Méli Empire est à votre service 7 jours sur 7, de 8h à 22h, pour s'adapter à votre emploi du temps.", order: 3, isActive: true }
  ];

  for (const faq of faqs) {
    await prisma.faqItem.upsert({
      where: { id: faqs.indexOf(faq) + 1 },
      update: faq,
      create: faq,
    });
  }

  // 4. Site Settings
  const settings = [
    { key: "contact_phone", value: "+225 05 75 95 75 87" },
    { key: "contact_email", value: "contact@meli-empire.com" },
    { key: "concept_title", value: "L'Excellence du Spa à Domicile" },
    { key: "concept_text", value: "Méli Empire redéfinit le bien-être avec une approche exclusive du spa à domicile. Nous apportons chez vous tout le raffinement et l'expertise des plus grands spas de palace." },
    { key: "social_instagram", value: "https://instagram.com/meli_empire" },
    { key: "social_whatsapp", value: "+225 05 75 95 75 87" }
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
