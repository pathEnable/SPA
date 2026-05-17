import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    // Liste les fichiers dans le dossier 'meli-empire'
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'meli-empire/', // Dossier spécifié lors de l'upload
      max_results: 100
    });

    const imageUrls = result.resources.map((resource: any) => resource.secure_url);

    return NextResponse.json(imageUrls);
  } catch (error) {
    console.error("Erreur lors de la récupération des images Cloudinary:", error);
    // En cas d'erreur (ex: API non configurée), on renvoie une liste vide
    return NextResponse.json([]);
  }
}
