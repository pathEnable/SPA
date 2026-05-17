import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const phone = searchParams.get("phone");

    if (!code) {
      return NextResponse.json({ error: "Le numéro de réservation est obligatoire" }, { status: 400 });
    }

    // Extraire l'ID numérique du code (ex: #ME-REV-0002 ou ME-REV-0002 -> 2)
    const numericPart = code.replace(/[^0-9]/g, "");
    if (!numericPart) {
      return NextResponse.json({ error: "Numéro de réservation invalide" }, { status: 400 });
    }
    const reservationId = parseInt(numericPart, 10);

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
    }

    // Si le téléphone est fourni, on valide pour protéger la vie privée
    if (phone) {
      const cleanInputPhone = phone.replace(/[^0-9]/g, "");
      const cleanDbPhone = reservation.phone.replace(/[^0-9]/g, "");
      
      // On compare les 8 derniers chiffres au moins (pour gérer les indicatifs +225)
      const inputSuffix = cleanInputPhone.slice(-8);
      const dbSuffix = cleanDbPhone.slice(-8);

      if (inputSuffix !== dbSuffix) {
        return NextResponse.json({ error: "Le numéro de téléphone ne correspond pas à cette réservation" }, { status: 403 });
      }
    } else {
      // Pour des raisons de confidentialité, si le téléphone n'est pas fourni,
      // on demande de le renseigner pour valider la recherche.
      return NextResponse.json({ error: "Veuillez fournir votre numéro de téléphone pour valider le suivi" }, { status: 400 });
    }

    return NextResponse.json(reservation, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la recherche de la réservation :", error);
    return NextResponse.json({ error: "Une erreur est survenue lors de la recherche" }, { status: 500 });
  }
}
